'use strict';

const ServerGame = require('./ServerGame');
const Room = require('./Room');

const debug = require('debug');
const log = debug('game:server/server');
const User = require('./Models/User.js');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/LeaderBoard');

function Lobby ({ config }) {
    const rooms = new Map();
    const clients = new Map();
    const dataBase = new Map();

    function startGame (room) {
        let rankedArray = rankDB();
        room.startGame(room, rankedArray);
    }

    function createGame (client, gameMode) {
        const room = Room.create({
            owner: client,
            game: ServerGame.create({ options: config }),
            gameMode,
            deleteRoom: endGame
        });

        rooms.set(room.getId(), room);
        client.setCurrentRoom(room);

        client.emit('onJoinedRoom', { room: room.toJSON() });

        //startGame(room);

        log('player ' + client.getId() + ' created a room with id ' + room.getId());

        for (const lobbyClient of clients.values()) {
            lobbyClient.emit('roomCreated', { room: room.toJSON() });
        }
    }

    // we are requesting to kill a game in progress.
    function endGame (roomId) {
        const room = rooms.get(roomId);

        if (room) {
            // stop the game updates immediate
            if(room.isGameStarted())
              room.endGame();

            for (const lobbyClient of clients.values()) {
                lobbyClient.emit('roomDeleted', { roomId });
                lobbyClient.send('s.e');
            }

            rooms.delete(roomId);

            log('game removed. there are now ' + rooms.size + ' rooms');
        } else {
            log('that game was not found!');
        }
    }

    function listenToClient (client) {
        client.on('clientPing', (data) => {
            client.emit('serverPing', data);
        });

        client.emit('onConnected', {
            user: client.toJSON(),
            rooms: Array.from(rooms.values()).map(room => {
                return room.toJSON();
            })
        });

        client.on('joinRoom', (data) => {
          rankDB();
            const room = rooms.get(data.roomId);

            // console.log("is game started ", room.isGameStarted());

            if (room && !client.isInRoom() && !room.isGameStarted()) {

            //if (room && !client.isInRoom()) {
                room.join(client);
                client.setCurrentRoom(room);

                room.emit('onJoinedRoom', { room: room.toJSON() });

                log('client joined room');
            }
        });

        client.on('joinTeam', (data) => {
          //rankDB();

            const room = rooms.get(data.roomId);

            // console.log("is game started ", room.isGameStarted());

            // if (room && !client.isInTeam() && !room.isGameStarted()) {
            if (room && !room.isGameStarted()) {

                client.setTeam(data.team);
                room.join(client);
                client.setCurrentRoom(room);

                room.emit('onJoinedRoom', { room: room.toJSON() });

                log('client joined room');
            }
        });

        client.on('displayLeaderBoard', (data) => {
            User.find()
                .then(function(doc) {
                  for (var i = 0; i < doc.length; i++) {
                    updateDataBase(doc[i]);
                  }
                  console.log("here");
                  let dataRecorsArray = rankDB();
                  console.log("size " + dataRecorsArray.length);
                  let recordData =  {
                          columns: ['Rank', 'UserName', 'Highscore'],
                          records: dataRecorsArray.map(record => {
                          return {
                              UserName: record.username,
                              Highscore: record.highscore ,
                              Rank: findUserRank(record.username, dataRecorsArray)
                              //,winner: client.getWinner()
                          };
                      })
                  };

                   client.emit('leaderBoard', recordData );
                }).catch(err => { // if error we will be here
                    console.error('App starting error:', err.stack);
                    process.exit(1);
                });
        });

        client.on('setClientMap', (data) => {
        //  console.log(data.map);

          client.setMap(data.map)
        });

        client.on('setClientVirus', (data) => {
        //  console.log(data.virus);

          client.setVirus(data.virus);
        });

        client.on('readyRoom', (data) => {
            const room = rooms.get(data.roomId);

            if (room && client.isInRoom()) {
              //  room.join(client);
                //client.setCurrentRoom(room);

                client.setReady(true);
                //console.log(JSON.stringify(room.toJSON()));
                room.emit('onReadyClient', { room: room.toJSON() });

                //console.log("size of game " + room.getSize());
                if( room.getSize()>1){
                  //console.log("everyone ready " + room.checkReady());
                  if (room.checkReady()){
                    User.find()
                        .then(function(doc) {
                          for (var i = 0; i < doc.length; i++) {
                            updateDataBase(doc[i]);
                          }
                          startGame(room);
                        });
                  };
                }
                log('client joined room');
            }
        });

        client.on('leaveRoom', (data) => {
            const room = rooms.get(data.roomId);

            if (room) {
                room.leave(client);
                client.setCurrentRoom(null);

                if (room.getSize() === 0) {
                    endGame(room.getId());
                }

                client.emit('onLeftRoom', { room: room.toJSON() });
                room.emit('playerLeftRoom', { room: room.toJSON() });

                if(room.isGameStarted() && room.getNonAISize() === 0){
                  endGame(room.getId());
                  //client.emit('onLeftRoom', { room: room.toJSON() });
                }
            }
        });

        client.on('createRoom', (data) => {
            createGame(client, data.gameMode);
        });

        log('\t socket.io:: player ' + client.getId() + ' connected');

        client.on('message', (message) => {
            const parts = message.split('.');
            //console.log("spliting up data");
            const inputCommands = parts[0].split('-');
            const inputTime = parts[1].replace('-', '.');
            const inputSeq = parts[2];

            const room = client.getCurrentRoom();

/////change this back after fix
            if (room) {

            // if (room && room.isGameStarted()) {
                room.receiveClientInput(client, inputCommands, inputTime, inputSeq);
            } else {
                log('no room to receive input');
            }
        });

        client.on('disconnect', function () {
            log('\t socket.io:: client disconnected ' + client.getId());

            const room = client.getCurrentRoom();

            if (room) {
                if (room.size === 1) {
                    endGame(room.getId());
                }

                client.emit('onLeftRoom', { room: room.toJSON() });

                room.leave(client);
                client.setCurrentRoom(null);
            }

            clients.delete(client.getId());
        });
    }

    function addClient (client) {
        clients.set(client.getId(), client);

        listenToClient(client);
    }

    function removeClient (clientId) {
        clients.delete(clientId);
    }

    function rankDB() {
      var db = [];
      for (const record of dataBase.values()) {
        db.push(record);
      }
      db.sort(function(a, b) {
        return b.highscore -  a.highscore;
      });
      return db;
    }
    function updateDataBase (doc) {
      dataBase.set(doc.username, doc);
    }

    function findUserRank (name,db) {

      for (var i = 0; i < db.length; i++) {
        if(db[i].username === name){
          return (i+1);
        }
      }
      return -1;
    }

    return {
        addClient,
        removeClient,
        updateDataBase,
        rankDB
    };
}

module.exports = { create: Lobby };
