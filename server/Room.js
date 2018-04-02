'use strict';

const uuid = require('node-uuid');
const Player = require('./ServerPlayer');
const Virus = require('./ServerVirus');
const debug = require('debug');
const log = debug('game:server/Room');
const CellMap = require('./CellMap.js');
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

    var it = colors.values();
    //colors.set( "", '#FF0000', '#FFFF00', '#0000ff', '#ff00ff', '#33cc33', '#00ffff']);

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
            client.send(message);
        }
    }

    function emit (event, data) {
        for (const client of clients) {
            client.emit(event, data);
        }
    }

  //  function receiveClientInput (client, input, inputTime, inputSeq) {

    function receiveClientInput (...args) {
        game.getNetwork().receiveClientInput(...args);
      //game.receiveInput
      // console.log("data received");
      // game.pushInput({
      //     inputs: input,
      //     time: inputTime,
      //     seq: inputSeq
      // });
      // game.pushInput({
      //     client: client,
      //     inputs: input,
      //     time: inputTime,
      //     seq: inputSeq
      // });

    }

    function join (client) {
        clients.add(client);

        if (!game.isStarted()) {

            const virus = Virus.create({
                id: client.getId(),
                name: client.getName()
            });
            //
            // game.addVirus(virus);
            // game.getNetwork().addClientPlanetSystem(client, game.getPlanetSystem());
            //
            // log('joining game');

          //  client.emit('startGame', game.getStateForPlanet(planet));

            for (const roomClient of clients) {
                if (roomClient !== client) {
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
                if (roomClient !== client) {
                    roomClient.emit('playerLeft', client.getId());
                }
            }

            game.removeVirus(client.getId());
            //game.getNetwork().removeClientPlayer(client);
            game.getNetwork().removeClientPlanetSystem(client);
        }

    }

    function startGame () {

        let map = CellMap.create({num:0});
        game.addPlanets(map);

        for (const client of clients) {
          let color =  it.next().value;
          client.setColor(color);
          const virus = Virus.create({
              id: client.getId(),
              name: client.getName(),
              color
          });

            //game.addPlanets(map);

            game.addVirus(virus)
            game.getNetwork().addClientPlanetSystem(client, game.getPlanetSystem());

            //game.getNetwork().addClientPlanet(client, virus);
        }

        for (const client of clients) {
            //const virus = game.getNetwork().getVirusByClient(client);
            //console.log("print out client id " + client.getId());
            client.emit('startGame', game.getStateForPlanetSystem(client.getId()));
        }

        log('game started');

        game.start();
    }

    function endGame () {
        if (game) {
            game.stop();
        }

        clients.clear();
    }

    function toJSON () {
        return {
            id,
            clients: Array.from(clients).map(client => {
                return {
                    id: client.getId(),
                    name: client.getName(),
                    ready: client.getReady()
                };
            })
        };
    }

    function makeIterator(array) {
        var nextIndex = 0;

        return {
           next: function() {
               return nextIndex < array.length ?
                   {value: array[nextIndex++], done: false} :
                   {done: true};
           }
        };
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
        endGame,
        toJSON
    });
}

module.exports = { create: Room };
