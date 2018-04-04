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
mongoose.connect('mongodb://localhost:27017/LeaderBoard');
//var Schema = mongoose.Schema;

function start () {
    const config = Object.assign({}, gameConfig, serverConfig);
    const server = http.createServer();

    server.listen(config.port);

    const io = SocketServer(server);
    const lobby = Lobby.create({ config });

    // const userDataSchema = new Schema({
    //   username: {type: String, required: true, index:true},
    //   password: String,
    //   highscore: Number
    //
    // });

    //const UserData = mongoose.model('UserData', userDataSchema);



    log('Listening on port ' + config.port);

    io.sockets.on('connection', function (socket) {

         socket.on('registerPlayer', (data) => {
      //  socket.on('logIn', (data) => {

          var newUser = new User({
              username: data.name,
              password: data.password,
              highscore: 0
          });

          User.createUser(newUser, function(err, user){
            if(err) throw err;

            console.log("success");
          });
          // var data = new UserData(item);
          // data.save();


          console.log("here to fuck");

          socket.emit("there to fuck", {name: 'fuck you'});
        });

      //  socket.on('logInjflksjdf', (data) => {
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


          //console.log("docArray " + User.entireCollection());
          // let array = [];
          User.find()
              .then(function(doc) {
                // array.push(doc);
                for (var i = 0; i < doc.length; i++) {
                  lobby.updateDataBase(doc[i]);
                }
                //lobby.updateDataBase(doc);
                //console.log(array.length);
              });


              // User.find().forEach( function(myDoc) {
              //    lobby.updateDataBase(myDoc);
              //   } );

                // 	const cursor = User.find();
                //   console.log("type " + typeof cursor);
                //   console.log(cursor);
                // 	while(cursor.hasNext()) {
                //   	const doc = cursor.next();
                // 		lobby.updateDataBase(doc);
                //   	// process doc here
                // }

              // var newUser = new User({
              //     username: "david868",
              //     password: "password",
              //     highscore: 200
              // });
              //
              // User.createUser(newUser, function(err, user){
              //   if(err) throw err;
              //
              //   console.log("success");
              // });




        });



       socket.on('register', (data) => {

          //console.log("register");
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
