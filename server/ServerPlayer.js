'use strict';

const uuid = require('node-uuid');
const Virus = require('../lib/Virus');

function ServerPlayer ({ name, x = 0, y = 0, width = 16, height = 16, speed = 50 }) {
    return Virus.create({
        id: uuid.v4(),
        name,
        x,
        y,
        width,
        height,
        speed
    });
}

module.exports = { create: ServerPlayer };
