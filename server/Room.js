'use strict';

const uuid = require('node-uuid');
const Player = require('./ServerPlayer');
const Virus = require('./ServerVirus');
const debug = require('debug');
const log = debug('game:server/Room');

function Room ({ owner, game }) {
    const id = uuid.v4();
    const clients = new Set();

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
        if (game.isStarted()) {
          //  const player = game.getNetwork().getPlayerByClient(client);

            for (const roomClient of clients) {
                if (roomClient !== client) {
                    roomClient.emit('playerLeft', client.getId());
                }
            }

            game.removePlayer(client.getId());
            //game.getNetwork().removeClientPlayer(client);
            game.getNetwork().removeClientPlanetSystem(client);
        }

        clients.delete(client);
    }

    function startGame () {
        game.addPlanets();

        for (const client of clients) {
          const virus = Virus.create({
              id: client.getId(),
              name: client.getName()
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
