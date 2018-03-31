'use strict';

module.exports = {
    simulationTimestep: 1000 / 66,
    timerFrequency: 1000 / 250,
    world: {
        width: 1200,
        height: 680
    },
    playerSpeed: 120,
    playerPositions: [
        { x: 20, y: 20 },
        { x: 500, y: 200 },
        { x: 500, y: 100 },
        { x: 200, y: 100 }
    ],
    playerSize: {
        width: 16,
        height: 16
    }
};
