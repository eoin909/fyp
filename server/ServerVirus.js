'use strict';

const uuid = require('node-uuid');
const Virus = require('../lib/Virus');

function ServerPlanet ({  id, name, x = 300, y = 300, width = 16, height = 16, speed = 50 }) {
  console.log("client.getId() " + id);

    return Virus.create({
        id,
        name,
        x,
        y,
        width,
        height,
        speed
    });
}

module.exports = { create: ServerPlanet };
