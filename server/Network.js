'use strict';

function network () {
    const planetSystemClients = new Map();
    const clientPlanetSystem = new Map();


    function addClientPlanetSystem(client, planetSystem) {
      planetSystemClients.set(planetSystem, client);
      clientPlanetSystem.set(client, planetSystem)

    }
    function removeClientPlanetSystem (client) {
      const planetSystem = clientPlanetSystem.get(client);

      clientPlanetSystem.delete(client);
      planetSystemClients.delete(planetSystem);
    }

    function sendUpdates (getStateForPlanetSystem) {
        for (const client of clientPlanetSystem.keys()) {
            client.emit('onServerUpdate', getStateForPlanetSystem(client.getId()));
        }
    }

    function receiveClientInput (client, input, inputTime, inputSeq) {
        const planetSystem = clientPlanetSystem.get(client);

        planetSystem.pushInput({
            inputs: input,
            time: inputTime,
            seq: inputSeq
        });
    }

    return {

        getPlanetSystemByClient (client) {
            return clientPlanetSystem.get(client);
        },
        getClientByPlanetSystem (player) {
            return planetSystemClients.get(player);
        },
        addClientPlanetSystem,
        removeClientPlanetSystem,
        sendUpdates,
        receiveClientInput
    };
}

module.exports = network;
