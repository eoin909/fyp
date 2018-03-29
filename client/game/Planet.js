'use strict';

const PlanetLib = require('../../lib/Planet');
//const Player = require('../../lib/Player');

function Planet ({ id, cellCount, controlledBy, x, y }) {
  console.log("plant.js create");
  return PlanetLib.create({
    id,
    cellCount,
    controlledBy,
    x,
    y
  });
}

module.exports = { create: Planet };
