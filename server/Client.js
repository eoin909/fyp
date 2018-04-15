'use strict';

const uuid = require('node-uuid');

function Client ({ socket, name }) {
    const id = uuid.v4();
    let currentRoom = null;
    let ready = false;
    let color = null;
    let ai = false;
    let winner = false;
    //random option as default
    let map = 0;
    let virus = 0;
    let teamId = null;

    function emit (event, data) {
      if(!ai){
        socket.emit(event, data);
      }
    }

    function on (event, listener) {
      if(!ai){
        socket.on(event, listener);
      }
    }

    function send (message) {
      if(!ai){
        socket.send(message);
      }
    }

    function setTeam(team) {
      teamId=team;
    }

    function getTeam() {
      return teamId;
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

    function getVirus() {
      return virus;
    }

    function setVirus (value) {
      virus = value;
    }

    function getMap() {
      return map;
    }

    function setMap (value) {
      map = value;
    }
    function getReady() {
      if(!ai){
        return ready;
      } else {
        return true;
      }
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

    function setWinner() {
      winner = true;
    }

    function getWinner() {
      return winner;
    }

    function reset() {
      currentRoom = null;
      ready = false;
      color = null;
      ai = false;
      winner = false;
      map = 0;
      virus = 0;
      teamId = null;
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
        getTeam,
        setTeam,
        setMap,
        getMap,
        setVirus,
        getVirus,
        send,
        setCurrentRoom,
        getReady,
        setReady,
        isAI,
        setAI,
        getColor,
        setColor,
        setWinner,
        getWinner,
        reset,
        toJSON
    });
}

module.exports = { create: Client };
