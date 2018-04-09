'use strict';

const SocketServer = require('socket.io');
const Lobby = require('./Lobby');

const serverConfig = require('./server-config');
const gameConfig = require('../lib/game-config');

const http = require('http');
const Client = require('./Client');
const debug = require('debug');
const log = debug('game:server/index');

const User = require('./Models/User.js');
const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/LeaderBoard');
mongoose.connect('mongodb://mongodb3890re:di3dyx@danu7.it.nuigalway.ie:8717/mongodb3890');

function start () {
    const config = Object.assign({}, gameConfig, serverConfig);
    const server = http.createServer();

    server.listen(config.port);

    const io = SocketServer(server);
    const lobby = Lobby.create({ config });

    log('Listening on port ' + config.port);

    io.sockets.on('connection', function (socket) {

         socket.on('registerPlayer', (data) => {

           User.getUserByUsername( data.name, function (err, post) {
             if (err) return next(err);
             if(post === null){

                var newUser = new User({
                    username: data.name,
                    password: data.password,
                    email: data.email,
                    highscore: 0
                });

                User.createUser(newUser, function(err, user){
                  if(err) throw err;
                  if (user){
                    socket.emit("RegisterSucess", {name: data.name});
                  } else {
                    socket.emit("failedRegister", {reason: null});
                  }
                });

              } else {
                  socket.emit("failedRegister", {reason: "dupUsername"});
              }
        });

      });

        socket.on('logIn', (data) => {

          User.getUserByUsername( data.name, function (err, post) {
            if (err) return next(err);
            User.comparePassword(data.password, post.password, function(err, isMatch){
              if(err) throw err;
              if(isMatch){
                socket.emit("LogIn", data);
              } else {
                socket.emit("failedLogIn", data);
              }
            })
          });
        });

       socket.on('register', (data) => {
            const client = Client.create({
                name: data.name,
                socket
           });

            lobby.addClient(client);
        });

        socket.on('error', (err) => {
            log('Client error', err);
        });
    });
}

start();
