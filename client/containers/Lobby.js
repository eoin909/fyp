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
const VirusSelect = require('../components/VirusSelect');
//require('react-bootstrap-table/dist/react-bootstrap-table-all.min.css');

class Lobby extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            user: null,
            rooms: [],
            currentRoomId: null,
            clientId: null,
            gameClient: null,
            leaderBoard:false
        };
    }

    componentWillMount () {
        const socket = new SocketClient(this.props.serverUrl);

        socket.on('connect_error', () => {
            this.props.onLobbyError('Error connecting to server.');
            socket.close();
        });

        socket.on('connect', () => {
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
                this.setState({
                    columns: data.columns,
                    records: data.records,
                    leaderBoard: !this.state.leaderBoard
                });
            });

            socket.on('roomCreated', (data) => {
                this.setState({
                    rooms: this.state.rooms.filter(room => room.id !== data.room.id).concat(data.room),
                    clientId: data.clientId
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
                    currentRoomId: data.room.id,
                    clientId: data.clientId
                });
            });

            socket.on('onReadyClient', (data) => {
                this.setState({
                  rooms: this.state.rooms.filter(room => room.id !== data.room.id).concat(data.room)
                });
            });

            socket.on('onStartClientGame', (data) => {

                this.setState({
                 isGameStarted: true,
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

    onVirusSelect (data) {
      if (this.state.socket) {
          this.state.socket.emit('setClientVirus', {virus: data.virus} );
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

    onJoinTeam (data) {
        if (this.state.socket) {
            this.state.socket.emit('joinTeam', data);
        }
    }

    onMapSelect (data) {
      if (this.state.socket) {
          this.state.socket.emit('setClientMap', {map: data.map} );
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

    onCreateRoom (data) {
        if (this.state.socket) {
            this.state.socket.emit('createRoom', data);
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
                  <Table
                    columns={ this.state.columns }
                    records={ this.state.records }
                  />
                ):(
                <div className="columns">
                    <div className="one-fourth column">
                        <RoomList
                          rooms={ this.state.rooms }
                          onRoomClick={ this.onJoinRoom.bind(this) }
                          onJoinTeam={ this.onJoinTeam.bind(this) }
                          onRoomCreateClick={ this.onCreateRoom.bind(this) }
                          onRoomLeaveClick={ this.onLeaveRoom.bind(this) }
                          onReadyClick = { this.onReadyRoom.bind(this) }
                          currentRoomId={ this.state.currentRoomId }
                          clientId={ this.state.clientId }
                        />
                    </div>
                    <div className="three-fourths column">
                        { this.state.gameClient && this.state.currentRoomId ? (
                                    <div>
                                          {!this.state.isGameStarted ? (
                                            <div>
                                            <div className="one-half column">
                                              <div className="text-center">
                                                <MapSelect
                                                setMap = { this.onMapSelect.bind(this) }
                                                />
                                              </div>
                                            </div>

                                            <div className="one-half column">
                                              <div className="text-center">
                                                <VirusSelect
                                                setVirus={ this.onVirusSelect.bind(this) }
                                                />
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
