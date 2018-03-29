'use strict';

function network () {
    const playerClients = new Map();
    const clientPlayers = new Map();

    function addClientPlayer (client, player) {
        playerClients.set(player, client);
        clientPlayers.set(client, player);
    }

    function removeClientPlayer (client) {
        const player = clientPlayers.get(client);

        clientPlayers.delete(client);
        playerClients.delete(player);
    }

    function sendUpdates (getStateForPlayer) {
        for (const player of clientPlayers.values()) {
            const client = playerClients.get(player);

            client.emit('onServerUpdate', getStateForPlayer(player));
        }
    }

    function receiveClientInput (client, input, inputTime, inputSeq) {
        console.log("received data")
        console.log(input);
        const player = clientPlayers.get(client);
        console.log(player.getId());
        
        player.pushInput({
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
        addClientPlayer,
        removeClientPlayer,
        sendUpdates,
        receiveClientInput
    };
}

module.exports = network;
