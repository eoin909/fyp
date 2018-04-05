'use strict';

const React = require('react');
const SocketClient = require('socket.io-client');
const RoomList = require('../components/RoomList');
const Game = require('../components/Game');
const Network = require('../game/Network');
const ClientGame = require('../game/ClientGame');
const Stats = require('../components/Stats');
const debugMode = require('../debug').debugMode;
const Table = require('../components/Table');
const MapSelect = require('../components/MapSelect');
//require('react-bootstrap-table/dist/react-bootstrap-table-all.min.css');

class Lobby extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            // socket: null,
            user: null,
            rooms: [],
            currentRoomId: null,
            gameClient: null,
            leaderBoard:false,
            columns: ["Rank","UserName","highscore"],
            records:[
              {"username":"damian404","highscore":830,"rank":1},
              {"username":"gary123","highscore":455,"rank":2},
              {"username":"david868","highscore":400,"rank":3},
              {"username":"jason","highscore":350,"rank":4},
              {"username":"edel568","highscore":200,"rank":5},
              {"username":"Eoin909","highscore":0,"rank":6},
              {"username":"eoin909","highscore":0,"rank":7},
              {"username":"eoin989","highscore":0,"rank":8}]
        };
    }

    componentWillMount () {
        const socket = new SocketClient(this.props.serverUrl);

        socket.on('connect_error', () => {
            console.log("server error");
            this.props.onLobbyError('Error connecting to server.');
            socket.close();
        });

        socket.on('connect', () => {
          console.log("connect");
            socket.on('onConnected', (data) => {
                const gameClient = ClientGame.create({
                    options: this.props.gameSettings
                });

                const network = Network.create({
                    game: gameClient,
                    pingTimeout: this.props.gameSettings.pingTimeout,
                    socket
                });

                gameClient.setNetwork(network);

                this.setState({
                    user: data.user,
                    socket: socket,
                    rooms: data.rooms,
                    gameClient: gameClient,
                    bgColor: 'red'
                });
            });

            socket.on('leaderBoard', (data) => {
              console.log(JSON.stringify(data));
                this.setState({
                    columns: data.columns,
                    records: data.records,
                    leaderBoard: !this.state.leaderBoard
                });
            });

            socket.on('roomCreated', (data) => {
                this.setState({
                    rooms: this.state.rooms.filter(room => room.id !== data.room.id).concat(data.room)
                });
            });

            socket.on('roomDeleted', (data) => {
                this.setState({
                    rooms: this.state.rooms.filter(room => room.id !== data.roomId)
                });
            });

            socket.on('onJoinedRoom', (data) => {
                this.setState({
                    rooms: this.state.rooms.filter(room => room.id !== data.room.id).concat(data.room),
                    currentRoomId: data.room.id
                });
            });

            socket.on('onReadyClient', (data) => {

                this.setState({
                  rooms: this.state.rooms.filter(room => room.id !== data.room.id).concat(data.room),
                });
            });

            socket.on('onLeftRoom', (data) => {

              this.setState({
                   currentRoomId: null
              });
            });

            socket.on('playerLeftRoom', (data) => {

              this.setState({
                rooms: this.state.rooms.filter(room => room.id !== data.room.id).concat(data.room)
              });
            });

            socket.emit('register', {
                name: this.props.name
            });
        });

        if (debugMode) {
            this.onCreateRoom();
        }
    }

    onLeaderBoard () {
      if (this.state.socket) {
          this.state.socket.emit('displayLeaderBoard', null );
      }
    }
    onJoinRoom (room) {
        if (this.state.socket) {
            this.state.socket.emit('joinRoom', { roomId: room.id });
        }
    }

    onLeaveRoom (roomId) {
        if (this.state.socket) {
            this.state.socket.emit('leaveRoom', { roomId: roomId });
        }
    }

    onReadyRoom (roomId) {
        if (this.state.socket) {
            this.state.socket.emit('readyRoom', { roomId: roomId });
        }
    }

    onCreateRoom () {
    //  console.log("create room");
      console.log(this.state.socket);
        if (this.state.socket) {
          console.log("if loop");
            this.state.socket.emit('createRoom');
        }
    }

    onLogout () {
        if (this.state.socket) {
            if (this.state.currentRoomId) {
                this.onLeaveRoom(this.state.currentRoomId);
            }

            this.state.socket.close();
        }

        this.props.logoutHandler();
    }

    render () {
        return (
            <div>
                <div className="columns">
                    <div className="single-column">
                        <div className="menu">
                            <div className="menu-heading">
                                Logged in: { this.props.name }

                                <button
                                    className="btn btn-sm btn-primary menu-leaderBoard-btn"
                                    onClick={ this.onLogout.bind(this) }
                                >
                                    Logout
                                </button>
                                <button
                                    className="btn btn-sm btn-primary menu-btn"
                                    onClick={ this.onLeaderBoard.bind(this) }
                                >
                                LeaderBoard
                            </button>
                            </div>
                        </div>
                      </div>
                  </div>
                {this.state.leaderBoard ? (
                  <Table/>
                ):(
                <div className="columns">
                    <div className="one-fourth column">
                        <RoomList
                          rooms={ this.state.rooms }
                          onRoomClick={ this.onJoinRoom.bind(this) }
                          onRoomCreateClick={ this.onCreateRoom.bind(this) }
                          onRoomLeaveClick={ this.onLeaveRoom.bind(this) }
                          onReadyClick = { this.onReadyRoom.bind(this) }
                          currentRoomId={ this.state.currentRoomId }
                        />
                    </div>
                    <div className="three-fourths column">
                        { this.state.gameClient && this.state.currentRoomId ? (
                                    <div>
                                          {!this.state.isGameStarted ? (
                                            <div>
                                            <div className="one-half column">
                                              <div className="text-center">
                                                <MapSelect/>
                                              </div>
                                            </div>

                                            <div className="one-half column">
                                              <div className="text-center">
                                                <MapSelect/>
                                              </div>
                                            </div>
                                            </div>

                                      ): (
                                        <div className="text-center">

                                            <Game
                                                width={ this.props.gameSettings.world.width }
                                                height={ this.props.gameSettings.world.height }
                                                gameClient={ this.state.gameClient }
                                            />
                                            </div>
                                          )}

                                    </div>
                                ) : (
                                <div className="blankslate mb-5">
                                </div>
                            )
                        }
                    </div>
                </div>
            )}
            </div>
        );
    }
}

Lobby.propTypes = {
    serverUrl: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    onLobbyError: React.PropTypes.func.isRequired,
    logoutHandler: React.PropTypes.func.isRequired,
    gameSettings: React.PropTypes.object.isRequired,
};

module.exports = Lobby;
