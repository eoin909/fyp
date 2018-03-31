'use strict';

function network () {
    const playerClients = new Map();
    const clientPlayers = new Map();

    const planetSystemClients = new Map();
    const clientPlanetSystem = new Map();

    function addClientPlayer (client, player) {
        playerClients.set(player, client);
        clientPlayers.set(client, player);
    }

    function addClientPlanetSystem(client, planetSystem) {
      planetSystemClients.set(planetSystem, client);
      clientPlanetSystem.set(client, planetSystem)

    }
    function removeClientPlayer (client) {
        const player = clientPlayers.get(client);

        clientPlayers.delete(client);
        playerClients.delete(player);
    }

    function sendUpdates (getStateForPlanetSystem) {
      console.log("sendUpdates " + clientPlanetSystem.size);
        for (const client of clientPlanetSystem.keys()) {
          //  const client = planetSystemClients.get(planetSys);
//console.log(JSON.stringify(getStateForPlayer(player)));
            client.emit('onServerUpdate', getStateForPlanetSystem(client.getId()));
        }
    }

    function receiveClientInput (client, input, inputTime, inputSeq) {
        console.log("received data")
        console.log(input);
        const planetSystem = clientPlanetSystem.get(client);

        planetSystem.pushInput({
            inputs: input,
            time: inputTime,
            seq: inputSeq
        });
    }

    return {
        getPlayerByClient (client) {
            return clientPlayers.get(client);
        },
        getClientByPlayer (player) {
            return playerClients.get(player);
        },
        getPlanetSystemByClient (client) {
            return clientPlanetSystem.get(client);
        },
        getClientByPlanetSystem (player) {
            return planetSystemClients.get(player);
        },
        addClientPlayer,
        addClientPlanetSystem,
        removeClientPlayer,
        sendUpdates,
        receiveClientInput
    };
}

module.exports = network;
