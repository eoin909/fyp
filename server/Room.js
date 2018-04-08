'use strict';

const uuid = require('node-uuid');
const Player = require('./ServerPlayer');
const Virus = require('./ServerVirus');
const debug = require('debug');
const log = debug('game:server/Room');
const CellMap = require('./CellMap.js');
const AI = require('./ServerAI');
const User = require('./Models/User.js');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/LeaderBoard');

function Room ({ owner, game, gameMode}) {
    const id = uuid.v4();
    const clients = new Set();
    const team1 = new Map();
    const team2 = new Map();

    var colors = new Map();
    colors.set( "red", '#FF0000');
    colors.set( "Aqua",  '#00ffff');
    colors.set( "pink", '#ff00ff');
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
          console.log("client.getTeam() " + client.getTeam());
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
      clients.delete(client);

        if (game.isStarted()) {
          //  const player = game.getNetwork().getPlayerByClient(client);

            for (const roomClient of clients) {
                if (roomClient !== client && !roomClient.isAI) {
                    roomClient.emit('playerLeft', client.getId());
                }
            }

            game.removeVirus(client.getId());
            //game.getNetwork().removeClientPlayer(client);
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

            //game.getNetwork().addClientPlanet(client, virus);
        }

        for (var i=0; i < (4-clients.size); i++){
          let color =  it.next().value;
          let serverVirus = getAIClient(color);
          game.addServerVirus(serverVirus);
        }

        for (const client of clients) {
            //const virus = game.getNetwork().getVirusByClient(client);
            //console.log("print out client id " + client.getId());
            if(!client.isAI()){
              client.emit('onStartClientGame', { room: room.toJSON() });
              client.emit('startGame', game.getStateForPlanetSystem(client.getId()));
            }
        }

        log('game started');

        game.startServerGame(room);
    }

    function endGame () {
        if (game) {
          //  let winnerId = game.getWinner();

            game.stop();
        }

        clients.clear();
    }

    function winner(id) {
      let winnerRank = null;
      let winner = null;
      for (const client of clients.values()) {
        if(client.getId() === id){
          console.log("set winner");
          client.setWinner();
          winner = client.getName();
          winnerRank = findUserRank(winner);
        }
      }

      let winnerScore = 0;
      for (const client of clients.values()) {
        if(client.getId() !== id && !client.isAI()){

        let rank = findUserRank(client.getName());

        winnerScore += Math.floor(Math.sqrt(rank)*db.length*10);

        let score = -Math.floor(Math.sqrt(winnerRank)*db.length);

        User.updateHighScore(
                              new User({
                                username: client.getName(),
                                highscore: score
                              })
                            );
        } else if (client.isAI()) {
            winnerScore += 200;
          }
      }

      winnerScore = Math.floor(winnerScore/Math.sqrt(winnerRank))
      User.updateHighScore(
                            new User({
                              username: winner,
                              highscore: winnerScore
                            })
                          );
      endGame();
    }

    function getName() {
      let namepicked = false;
      let name = null;
      while(!namepicked){
       let x = Math.floor((Math.random() * names.length));
       name = names[x];
       console.log("name Ai " + name);

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

    function toJSON () {
      if (gameMode === 'Teams'){
        console.log(team1);
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
                              //,winner: client.getWinner()
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
                              //,winner: client.getWinner()
                          };
                        })) : []
                      }
                  ]
      };
    }else {

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
                    //,winner: client.getWinner()
                };
            })
        };
      }
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
    let client = AI.create({
        name: getName(),
    });
    client.setColor(color);
    clients.add(client);

    const virus = Virus.create({
        id: client.getId(),
        name: client.getName(),
        color,
        virusID: 0
    });

    return virus;
  }
    join(owner);

    return Object.freeze({
        getId,
        getOwner,
        checkReady,
        getSize,
        isGameStarted,
        send,
        emit,
        receiveClientInput,
        join,
        leave,
        startGame,
        winner,
        endGame,
        toJSON
    });
}

module.exports = { create: Room };
