'use strict';

const React = require('react');
const Login = require('../components/Login');
const Settings = require('../components/Settings');
const Help = require('../components/Help');
const Lobby = require('./Lobby');
const debugMode = require('../debug').debugMode;

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

    onLogin (values) {
        this.setState({
            loggedIn: true,
            serverUrl: values.server,
            name: values.name,
            password: values.password,
            lobbyError: null,
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
                        <Login
                            submitHandler={ this.onLogin.bind(this) }
                        />
                    )
                }

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
                                <a
                                    className={ 'tabnav-tab' + (this.state.selectedTab === 'settings' ? ' selected' : '') }
                                    onClick={ this.onSelectedTab('settings').bind(this) }
                                >
                                    Settings
                                </a>
                            </div>
                        </div>
                        { tab }
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = App;
