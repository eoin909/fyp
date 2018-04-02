'use strict';

const uuid = require('node-uuid');

function ServerAI ({ name }) {
    const id = uuid.v4();
    let currentRoom = null;
    let ready = true;
    let color = null;
    let ai = true;

    function setCurrentRoom (room) {
        currentRoom = room;
    }

    function getCurrentRoom () {
        return currentRoom;
    }

    function isInRoom () {
        return currentRoom ? true : false;
    }

    function getName () {
        return name;
    }

    function getId () {
        return id;
    }

    function getReady() {
      return ready;
    }

    function setReady(boo) {
      ready=boo;
    }

    function setColor(value) {
      color=value;
    }

    function isAI() {
      return ai;

    }

    function setAI(value) {
      ai=value;
    }

    function getColor() {
      return color;
    }

    function toJSON () {
        return {
            currentRoom: currentRoom ? currentRoom.toJSON() : null,
            id,
            name,
            ready
        };
    }

    return Object.freeze({
        getId,
        getName,
        getCurrentRoom,
        isInRoom,
        setCurrentRoom,
        getReady,
        setReady,
        isAI,
        setAI,
        getColor,
        setColor,
        toJSON
    });
}

module.exports = { create: ServerAI };
