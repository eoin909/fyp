'use strict';

const Timer = require('../lib/Timer');
const GameNetwork = require('./Network');
const AbstractGame = require('../lib/AbstractGame');

function ServerGame ({ options }) {
    const game = AbstractGame.create({ options });
    const network = GameNetwork();
    const networkLoop = Timer.create({
        interval: options.networkTimestep,
        onUpdate () {
            network.sendUpdates(game.getStateForPlanetSystem);
          //  console.log(game.getStateForPlayer);
            //console.log(JSON.stringify(game.getStateForPlayer));
            //console.log("servergame update network");

          //  game.clearEvents();
        }
    });

    function getNetwork () {
        return network;
    }

    function addPlayer (player) {
        const { x, y } = options.playerPositions[0];

        player.setPosition(x, y);

        game.addPlayer(player);
    }

    function addPlanet (planet) {
        const { x, y } = options.playerPositions[0];

        planet.setPosition(x, y);

        game.planetPlayer(planet);
    }

    function start () {
        networkLoop.start();
        game.startServerGame();
    }

    function startServerGame (room) {
        networkLoop.start();
        game.startServerGame(room);
    }

    function stop () {
        networkLoop.stop();
        game.stop();
    }

    function onUpdate (delta) {
        game.isGameOver(delta);
        game.updateAI(delta);
        game.planetSystemUpdate(delta);
    }

    game.setUpdateHandler(onUpdate);

    return Object.freeze(Object.assign({}, game, {
        addPlayer,
        getNetwork,
        start,
        startServerGame,
        stop
    }));
}

module.exports = { create: ServerGame };
