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

function Room ({ owner, game }) {
    const id = uuid.v4();
    const clients = new Set();

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
            client.emit(event, data);
          }
        }
    }

    function receiveClientInput (...args) {
        game.getNetwork().receiveClientInput(...args);
    }

    function join (client) {
        clients.add(client);

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
        let map = CellMap.create({num:0});
        game.addPlanets(map);

        for (const client of clients) {
          let color =  it.next().value;
          client.setColor(color);
          const virus = Virus.create({
              id: client.getId(),
              name: client.getName(),
              color,
              virusID: 1
          });

            game.addVirus(virus);
            game.getNetwork().addClientPlanetSystem(client, game.getPlanetSystem());

            //game.getNetwork().addClientPlanet(client, virus);
        }

        let color =  it.next().value;
        //client.setColor(color);
          let serverVirus = getAIClient(color);

          //game.addPlanets(map);
          game.addServerVirus(serverVirus);

        for (const client of clients) {
            //const virus = game.getNetwork().getVirusByClient(client);
            //console.log("print out client id " + client.getId());
            if(!client.isAI()){
              client.emit('onReadyClient', { room: room.toJSON() });
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
          client.setWinner();
          winner = client.getName();
          winnerRank = findUserRank(winner);
        }
      }

      let winnerScore = 0;
      for (const client of clients.values()) {
        if(client.getId() !== id && !client.isAI()){
            //client.setWinner();
            //console.log(client.getName());
        let rank = findUserRank(client.getName());

        winnerScore += Math.floor(Math.sqrt(rank)*db.length*10);

        let score = -Math.floor(Math.sqrt(winnerRank)*db.length);
            // var user = new User({
            //     username: client.getName(),
            //     highscore: score
            // });
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
      console.log("cal over with");
      endGame();
      ///update leaderBoard
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
        return {
            id,
            isGameStarted: game.isStarted(),
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

    function findUserRank (name) {

      for (var i = 0; i < db.length; i++) {
        if(db[i].username === name){
          return (i+1);
        }
      }
      return -1;
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
