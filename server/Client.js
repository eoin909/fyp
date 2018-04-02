'use strict';

const uuid = require('node-uuid');

function Client ({ socket, name }) {
    const id = uuid.v4();
    let currentRoom = null;
    let ready = false;
    let color = null;
    let ai = false;

    function emit (event, data) {
        socket.emit(event, data);
    }

    function on (event, listener) {
        socket.on(event, listener);
    }

    function send (message) {
        socket.send(message);
    }

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
        emit,
        on,
        send,
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

module.exports = { create: Client };
