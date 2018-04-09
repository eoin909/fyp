'use strict';

const React = require('react');
const Login = require('../components/Login');
const Register = require('../components/Register');
const Settings = require('../components/Settings');
const Help = require('../components/Help');
const Lobby = require('./Lobby');
const debugMode = require('../debug').debugMode;
const SocketClient = require('socket.io-client');
const clientConfig = require('./../client-config');
const gameConfig = require('../../lib/game-config');

class App extends React.Component {
    constructor (props) {
        super(props);

        if (debugMode) {
            this.state = {
                loggedIn: true,
                serverUrl: 'http://localhost:4004',
                name: 'arrr' + Math.random(),
                lobbyError: null,
                gameSettings: Object.assign({}, gameConfig, clientConfig),
                selectedTab: 'settings'
            };
        } else {
            this.state = {
                loggedIn: false,
                serverUrl: null,
                name: null,
                lobbyError: null,
                gameSettings: Object.assign({}, gameConfig, clientConfig),
                selectedTab: 'help'
            };
        }
    }


  componentWillMount () {


    const socket = new SocketClient('http://localhost:4004');

    this.state = {
        socket: socket
    };

      socket.on('connect', () => {


    socket.on("there to fuck", (data) => {
      console.log("fuck you ya nosey bastard");
    });

    socket.on("LogIn", (data) => {
      console.log("LogIn");
      this.setState({
          loggedIn: true,
          serverUrl: data.server,
          name: data.name,
          password: data.password,
          lobbyError: null,
          gameSettings: Object.assign({}, gameConfig, clientConfig)
      });
      socket.close();
    });

    socket.on("failedLogIn", (data) => {
      console.log("failure");
      this.setState({
          loggedIn: false,
          serverUrl: data.server,
          name: data.name,
          password: '',
          lobbyError: null,
          logInFailure:true
      });
    });

    socket.on("failedRegister", (data) => {
      console.log("failure");
      this.setState({
          loggedIn: false,
          serverUrl: '',
          name: '',
          password: '',
          lobbyError: null,
          logInRegister: true
      });
    });

    socket.on("RegisterSucess", (data) => {
      console.log("LogIn");
      this.setState({
          loggedIn: false,
          serverUrl: '',
          name: data.name,
          password: '',
          lobbyError: null,
          gameSettings: Object.assign({}, gameConfig, clientConfig),
          register: false
      });
    });
    });
  }

    onLogin (values) {

      this.state.socket.emit('logIn', {
          name: values.name,
          password:values.password,
          server: values.server
      });

    }

    registerUser (values) {
      this.state.socket.emit('registerPlayer', {
          name: values.name,
          password:values.password,
          email: values.email
      });
    }

    onLobbyError (error) {
        this.setState({
            loggedIn: false,
            lobbyError: error
        });
    }

    onLogout () {
        this.setState({
            serverUrl: null,
            loggedIn: false,
            lobbyError: null
        });
    }

    onSettingsChange (settings) {
        Object.assign(this.state.gameSettings, settings);
    }

    onSelectedTab (tab) {
        return function () {
            this.setState({
                selectedTab: tab
            });
        };
    }

    changePage (){
      console.log("click do");
      this.setState({
          register: !this.state.register
      });
    }

    render () {
        let tab = null;

        if (this.state.selectedTab === 'settings') {
            tab = (
                <Settings
                    settingsChangeHandler={ this.onSettingsChange.bind(this) }
                    defaultSettings={ clientConfig }
                />
            );
        } else {
            tab = (<Help />);
        }

        return (
            <div className="container mt-5 mb-5">
                { this.state.lobbyError ? (
                    <div className="flash flash-error mb-5">
                        { this.state.lobbyError }
                    </div>
                    ) : null
                }

                { this.state.loggedIn && !this.state.lobbyError ? (
                        <Lobby
                            gameSettings={ this.state.gameSettings }
                            serverUrl={ this.state.serverUrl }
                            name={ this.state.name }
                            logoutHandler={ this.onLogout.bind(this) }
                            onLobbyError={ this.onLobbyError.bind(this) }
                        />
                    ) : (

                      this.state.register ? (
                        <Register
                            registerUser={ this.registerUser.bind(this) }
                            changePage= { this.changePage.bind(this) }
                        />
                      ) : (

                        <Login
                            submitHandler={ this.onLogin.bind(this) }
                            changePage= { this.changePage.bind(this) }
                        />

                      )
                    )
                }
                {this.state.loggedIn ? (
                <div className="columns">
                    <div className="single-column">
                        <div className="tabnav mb-0 border-bottom-0">
                            <div className="tabnav-tabs">
                                <a
                                    className={ 'tabnav-tab' + (this.state.selectedTab === 'help' ? ' selected' : '') }
                                    onClick={ this.onSelectedTab('help').bind(this) }
                                >
                                    Help
                                </a>
                            </div>
                        </div>
                        { tab }
                    </div>
                </div>
              ) : (
                null
              )}
            </div>
        );
    }
}

module.exports = App;
