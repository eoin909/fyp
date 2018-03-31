'use strict';

const Player = require('./ClientPlayer');
const Planet = require('./Planet');

function Network ({ game, socket, pingTimeout }) {
    let previousPing = 0;
    let netPing = 0;
    let netLatency = 0;

    function onPlayerJoined (playerData) {
        const planet = Planet.create({
            id: playerData.id,
            controlledBy: playerData.controlledBy,
            x: playerData.x,
            y: playerData.y,
            cellCount: playerData.cellCount
        });
//{"id":0,"x":60,"y":245,"controlledBy":"neutral","radius":20,"cellCount":50}
        game.addPlanet(planet);
    }

    function onPlayerLeft (playerId) {
        game.removePlayer(playerId);
        console.log('player left with id', playerId);
    }

    function onDisconnect () {
        for (const player of game.getPlayers()) {
            if (player !== game.getLocalPlayer()) {
                game.removePlayer(player.getId());
            }
        }

        game.stop();
    }

    function onStartGame (data) {

        console.log("start game");
        const serverTime = data.serverTime;

        game.setTime(serverTime + netLatency);

        console.log('server time is about ' + game.getServerTime());

        game.clearPlayers();

        console.log(data);
        console.log(JSON.stringify(data));
        for (const playerData of data.planets) {
            onPlayerJoined(playerData);
        }

        // const localPlayer = Player.create({
        //     id: data.ownPlayer.id,
        //     name: data.ownPlayer.name,
        //     x: data.ownPlayer.position.x,
        //     y: data.ownPlayer.position.y
        // });
        //
        // game.addPlayer(localPlayer);
        game.setLocalPlayer(data.localClientId);

      //   const planetMap = Planet.create(
      //     {
      //       id: 0,
      //       cellCount: 50,
      //       controlledBy: 'neutral',
      //     //  selectedBy: 'nobody',
      //       x: 60,
      //       y: 245
      //     });
      //
      //   game.addPlanets(planetMap);
      //
      // const planetMap1 = Planet.create(
      //     {
      //       id:1,
      //       cellCount: 50,
      //       controlledBy: 'neutral',
      //     //  selectedBy: 'nobody',
      //       x: 90,
      //       y: 60
      //     }
      //   );
      //
      // game.addPlanets(planetMap1);
      //
      // const planetMap2 = Planet.create(
      //   {
      //     id:2,
      //     cellCount: 50,
      //     controlledBy: 'neutral',
      //     //selectedBy: '',
      //     x: 260,
      //     y: 245
      //   }
      // );
      //
      // game.addPlanets(planetMap2);
      //
      // const planetMap3 = Planet.create(
      //   {
      //     id:3,
      //     cellCount: 50,
      //     controlledBy: 'neutral',
      //     //selectedBy: 'nobody',
      //     x: 90,
      //     y: 305
      //   }
      // );
      //
      // game.addPlanets(planetMap3);
      // const planetMap4 = Planet.create(
      //   {
      //     id:4,
      //     cellCount: 50,
      //     controlledBy: localPlayer.getId(),
      //   //  selectedBy: 'nobody',
      //     x: 350,
      //     y: 350
      //   }
      // );
      //
      //  game.addPlanets(planetMap4);

      // const planetMap = Planet.create({
      //     id: 0,
      //     cellCount: 1,
      //     controlledBy: 'neutral',
      //     x: 50,
      //     y: 50
      //   }
      //   ,
      //   {
      //     id: 1,
      //     cellCount: 1,
      //     controlledBy: 'neutral',
      //     x: 50,
      //     y: 650
      //   },
      //   {
      //     id: 2,
      //     cellCount: 1,
      //     controlledBy: 'neutral',
      //     x: 650,
      //     y: 50
      //   },
      //   {
      //     id: 3,
      //     cellCount: 1,
      //     controlledBy: 'neutral',
      //     x: 650,
      //     y: 650
      //   },
      //   {
      //     id: 4,
      //     cellCount: 1,
      //     controlledBy: 'neutral',
      //     x: 350,
      //     y: 350
      //   }
      // );
      //
      //   game.addPlanets(planetMap);







        // const planet = Planet.create({
        //     id: 1,
        //     name: playerData.name,
        //     x: playerData.position.x,
        //     y: playerData.position.y
        // });

        //game.addPlanet(planet);

        //game.addPlayer(player);

    }

    function getNetLatency () {
        return netLatency;
    }

    function getNetPing () {
        return netPing;
    }

    function send (data) {
     // console.log("data network.js client")
        socket.send(data);
    }

    /**
     * Ping the server.
     */
    const pingInterval = setInterval(() => {
        previousPing = new Date().getTime();
        socket.emit('clientPing', previousPing);
    }, pingTimeout);

    socket.on('disconnect', () => {
        clearInterval(pingInterval);
    });

    socket.on('serverPing', (data) => {
        netPing = new Date().getTime() - data;
        netLatency = netPing / 2;
    });

    socket.on('playerJoined', onPlayerJoined);
    socket.on('playerLeft', onPlayerLeft);
    socket.on('onLeftRoom', onDisconnect);
    socket.on('onServerUpdate', game.onServerUpdate);

    socket.on('startGame', onStartGame);
    socket.on('error', onDisconnect);

    return Object.freeze({
        getNetLatency,
        getNetPing,
        send
    });
}

module.exports = { create: Network };
