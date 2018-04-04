<!DOCTYPE html>
<html>
<body>

<canvas id="myCanvas" width="1200" height="1200" style="border:1px solid #d3d3d3;">
Your browser does not support the HTML5 canvas tag.</canvas>

<script>


var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

let cellCount = 200;
let centerX = 450;
let centerY = 350;
let bigRadius = 305;
let smallRadius = 20;
let counter=0;

ctx.beginPath();
ctx.arc(centerX, centerY, bigRadius, 0, 2 * Math.PI);
ctx.stroke();

let layerCount = getLayerCount();
console.log("layerCount " + layerCount);

let minus = getMinus(layerCount);
console.log("minus " + minus);

for (let i = 0; i <= layerCount; i++){
  for (var y = 0; y < layerCount; y++) {
    let smallY = centerY + (minus + y)*smallRadius*2;
    let smallX = centerX + (minus + i)*smallRadius*2;
    if(checkInsideCircle(smallX, smallY)){
      if ( counter < cellCount ){
        ctx.beginPath();
        ctx.arc(smallX, smallY, smallRadius, 0, 2 * Math.PI);
        ctx.stroke();
        counter++;
      }
    }
  }
}

function getMinus (count) {
    if ( (count % 2) !== 0){
      return (Math.floor(-count/2)) ;
    }
}
function checkRadius () {
  return (counter < cellCount);
}

function checkInsideCircle ( x1, y1 ) {
	let xConponent = (x1-centerX)*(x1-centerX);
  let yConponent = (y1-centerY)*(y1-centerY);
  let distance = Math.sqrt(xConponent + yConponent) + smallRadius;
  return (distance < bigRadius);
}

function getLayerCount () {
  let num = Math.floor(Math.sqrt(cellCount)+2)
  if ( (num % 2) === 0){
    num++;
  }
	return num;
}

console.log("radius " + checkRadius());
console.log("counter " + counter);
</script>

</body>
</html>






'use strict';

const React = require('react');
const Login = require('../components/Login');
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

    onLogin (values) {


      const socket = new SocketClient('http://localhost:4004');

      socket.emit('logIn', {
          name: values.name,
          password:values.password
      });
        socket.on('connect', () => {
      socket.on("there to fuck", (data) => {
        console.log("fuck you ya nosey bastard");
      });
    });

        // this.setState({
        //     loggedIn: true,
        //     serverUrl: values.server,
        //     name: values.name,
        //     password: values.password,
        //     lobbyError: null,
        // });
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
