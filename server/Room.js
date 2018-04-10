'use strict';

const uuid = require('node-uuid');
const Virus = require('./ServerVirus');
const debug = require('debug');
const log = debug('game:server/Room');
const CellMap = require('./CellMap.js');
const Client = require('./Client');
const User = require('./Models/User.js');
const mongoose = require('mongoose');
//mongoose.connect('mongodb://mongodb3890re:di3dyx@danu7.it.nuigalway.ie:8717/mongodb3890');
 mongoose.connect('mongodb://localhost:27017/LeaderBoard');

function Room ({ owner, game, gameMode, deleteRoom}) {
    const id = uuid.v4();
    const clients = new Set();
    const team1 = new Map();
    const team2 = new Map();

    var colors = new Map();
    colors.set( "red", '#FF0000');
    colors.set( "Aqua",  '#00ffff');
    colors.set( "pink", '#ff00ff');
    colors.set("orange", "#f37a3e");
    colors.set( "green", '#33cc33');
    colors.set( "Tan",  '#00ffff');
    colors.set( "yellow", '#FFFF00');

    let db = null;
    var it = colors.values();

    let names = ["Damian", "Gary", "Jason", "Luke", "Michael", "Conor", "Lisa", "Laura", "Edel", "Jane", ] ;

    function getId () {
        return id;
    }

    function getOwner () {
        return owner;
    }

    function checkReady () {
      let allReady = false;
      for (const client of clients) {
          if(!client.getReady()){
            allReady = false;
            break;
          }
          allReady=true;
      }
      return allReady;
    }
    function getSize () {
        return clients.size;
    }

    function isGameStarted () {
        return game.isStarted();
    }

    function send (message) {
        for (const client of clients) {
            if (!client.isAI()){
              client.send(message);
            }
        }
    }

    function emit (event, data) {
        for (const client of clients) {
          if (!client.isAI()){
            client.emit(event, {clientId:client.getId(), clientReady: client.getReady(), room: data.room});
          }
        }
    }

    function receiveClientInput (...args) {
        game.getNetwork().receiveClientInput(...args);
    }

    function join (client) {
      clients.add(client);
      if (gameMode === 'Teams'){
        if (client.getTeam()=== 'Team 1'){
          team1.set(client.getId(), client);
          if (team2.has(client.getId())) {
            team2.delete(client.getId());
          }
        } else if (client.getTeam()=== 'Team 2'){
          team2.set(client.getId(), client);
          if (team1.has(client.getId())) {
            team1.delete(client.getId());
          }
        }
      }

      if (!game.isStarted()) {

        const virus = Virus.create({
          id: client.getId(),
          name: client.getName(),
          virusID: 1
        });

        for (const roomClient of clients) {
          if (roomClient !== client && !roomClient.isAI) {
            roomClient.emit('playerJoined', virus.toJSON());
          }
        }
      }
    }

    function leave (client) {
      client.setColor(null);
      client.setReady(false);
      clients.delete(client);
        if (game.isStarted()) {
            for (const roomClient of clients) {
                if (roomClient !== client && !roomClient.isAI) {
                    roomClient.emit('playerLeft', client.getId());
                }
            }
            game.removeVirus(client.getId());
            game.getNetwork().removeClientPlanetSystem(client);
        }
    }

    function startGame (room, dbArray) {
      db = dbArray;
      let choice = tallyVotes();
      let map = CellMap.create({num:choice});
      game.addPlanets(map);

      for (const client of clients) {
        let color =  it.next().value;
        client.setColor(color);
        const virus = Virus.create({
          id: client.getId(),
          name: client.getName(),
          color,
          virusID: client.getVirus()
        });

        game.addVirus(virus);
        game.getNetwork().addClientPlanetSystem(client, game.getPlanetSystem());
      }

      while ( clients.size < 4 ){
        let color =  it.next().value;
        let serverVirus = getAIClient(color);
        game.addServerVirus(serverVirus);
      }
      game.startServerGame(room);

      for (const client of clients) {
        if(!client.isAI()){
          client.emit('onStartClientGame', { room: room.toJSON() });
          client.emit('startGame', game.getStateForPlanetSystem(client.getId()));
        }
      }
      log('game started');
    }

    function endGame () {
        if (game) {
            game.stop();
        }

        clients.clear();
        team1.clear();
        team2.clear();
        deleteRoom(id);
    }

    function winner(id) {
      let winnerRank = null;
      let winner = null;
      for (const client of clients.values()) {
        if(client.getId() === id){
          client.setWinner();
          winner = client;
          if(winner.isAI()){
            winnerRank = db.length/2;
          } else {
            winnerRank = findUserRank(winner.getName());
          }
        }
      }

      let winnerScore = 0;
      for (const client of clients.values()) {
        if(client.getId() !== id && !client.isAI()){

        let rank = findUserRank(client.getName());

        winnerScore += Math.floor(Math.sqrt(rank)*db.length*10);

        let score = -Math.floor(Math.sqrt(winnerRank)*db.length);
        if (typeof score === 'number'){
          User.updateHighScore(
                                new User({
                                  username: client.getName(),
                                  highscore: score
                                })
                              );
          }
        } else if (client.isAI()) {
            winnerScore += Math.floor(Math.sqrt((db.length/2))*db.length*10);
          }
      }

      if(!winner.isAI()) {
        winnerScore = Math.floor(winnerScore/Math.sqrt(winnerRank))
        if (typeof winnerScore === 'number'){
          User.updateHighScore(
                                new User({
                                  username: winner.getName(),
                                  highscore: winnerScore
                                })
                              );
        }
      }
      endGame();
    }

    function winnerTeam(team) {
      let winningTeamRank = null;
      let winningTeam = null;
      let losingTeamRank = null;
      let losingTeam = null;

      if ('Team 1' === team){
        winningTeam = team1;
        losingTeam = team2;
      }else {
        winningTeam = team2;
        losingTeam = team1;
      }
      let dataBaseLength = db.length;
      for (const player of winningTeam.values()) {
        if(player.isAI()){
          winningTeamRank += (dataBaseLength*0.5);
        }
        else {
          winningTeamRank += findUserRank(player.getName());
        }
      }
      winningTeamRank = winningTeamRank/(winningTeam.size);

      for (const player of losingTeam.values()) {
        if(player.isAI()){
          losingTeamRank += (dataBaseLength)/2;
        } else {
          losingTeamRank += findUserRank(player.getName());
        }
      }

      losingTeamRank = losingTeamRank/(losingTeam.size);
      let winnerTeamScore = Math.floor((Math.sqrt(losingTeamRank)*dataBaseLength*10)/Math.sqrt(winningTeamRank));
      let losingTeamScore = -Math.floor((Math.sqrt(winningTeamRank)*dataBaseLength)/Math.sqrt(losingTeamRank));

      for (const  player of winningTeam.values()) {
        if(!player.isAI()){
          if(typeof winnerTeamScore === 'number'){
            User.updateHighScore(
                                  new User({
                                    username: player.getName(),
                                    highscore: winnerTeamScore
                                  })
                                );
          }
        }
      }

      for (const player of losingTeam.values()) {
        if(!player.isAI()){
          if(typeof losingTeamScore === 'number'){
            User.updateHighScore(
                                  new User({
                                    username: player.getName(),
                                    highscore: losingTeamScore
                                  })
                                );
          }
        }
      }
      endGame();
    }

    function getName() {
      let namepicked = false;
      let name = null;
      while(!namepicked){
       let x = Math.floor((Math.random() * names.length));
       name = names[x];
      for (const client of clients) {
          if (name === client.getName()) {
              namepicked=false;
              break;
          }
          namepicked = true;
        }
      }
      return name;
    }

    function findUserRank (name) {
      for (var i = 0; i < db.length; i++) {
        if(db[i].username === name){
          return (i+1);
        }
      }
      return -1;
    }

    function tallyVotes() {
      let votes = new Array(7).fill(0);
      for (const client of clients.values()) {
        if(!client.isAI()){
          votes[client.getMap()] +=1;
        }
      }

      let max=0;
      let index=[];
      for (var i = 0; i < votes.length; i++) {
        if (votes[i] > max) {
          index = [];
          index.push(i);
          max = votes[i];
        } else if (votes[i] === max) {
          index.push(i)
        }
      }
    return (index[(Math.floor(Math.random()*index.length))]);
    }

  function getAIClient (color) {
    const client = Client.create({
        name: getName(),
        socket:null
   });

    client.setAI(true);
    client.setColor(color);
    clients.add(client);

    //balance teams
    if (gameMode === 'Teams'){
      if(team1.size < 2){
        team1.set(client.getId(), client);
      } else if (team2.size < 2) {
        team2.set(client.getId(), client);
      }
    }
    const virus = Virus.create({
        id: client.getId(),
        name: client.getName(),
        color,
        virusID: 20
    });
    return virus;
  }

  function getGameMode() {
    return gameMode;
  }

  function getTeams(){
    let array = [];
    array.push(team1);
    array.push(team2)
    return array;
  }

  function getNonAISize() {
    let counter = 0;

    for (const client of clients.values()) {
      if (!client.isAI()) {
        counter++;
      }
    }
    return counter;
  }

  function toJSON () {
    if ( gameMode === 'Teams' ){
      return {
          id,
          isGameStarted: game.isStarted(),
          gameMode,
          teams:[
                  {
                    team:'Team 1',
                    clients: (team1.size > 0 ) ? (Array.from(team1.values()).map(client => {
                        return {
                            id: client.getId(),
                            name: client.getName(),
                            ready: client.getReady(),
                            color: client.getColor()
                        };
                      })) : []
                  },
                  {
                    team:'Team 2',
                    clients:  (team2.size > 0 ) ? (Array.from(team2.values()).map(client => {
                        return {
                            id: client.getId(),
                            name: client.getName(),
                            ready: client.getReady(),
                            color: client.getColor()
                        };
                      })) : []
                    }
                ]
    };
  } else {

      return {
          id,
          isGameStarted: game.isStarted(),
          gameMode,
          clients: Array.from(clients).map(client => {
              return {
                  id: client.getId(),
                  name: client.getName(),
                  ready: client.getReady(),
                  color: client.getColor()
              };
          })
      };
    }
  }

    join(owner);

    return Object.freeze({
        getId,
        getOwner,
        checkReady,
        getGameMode,
        winnerTeam,
        getTeams,
        getSize,
        isGameStarted,
        send,
        emit,
        receiveClientInput,
        join,
        leave,
        startGame,
        winner,
        getNonAISize,
        endGame,
        toJSON
    });
}

module.exports = { create: Room };
