'use strict';

const TempValue = require('./TempValue');

function Virus ({ id, name, color, speed, agility, strength }) {

    function getId () {
        return id;
    }

    function getName () {
        return name;
    }

    function getSpeed () {
        return speed;
    }

    function getAgility () {
        return agility;
    }

    function getStrength () {
        return strength;
    }

    function getColor() {
      return color;
    }

    function toJSON () {
        return {
            id,
            name
        };
    }

    return Object.freeze({
        getId,
        getName,
        getColor,
        getSpeed,
        getAgility,
        getStrength,
        toJSON
    });
}

module.exports = { create: Virus };
