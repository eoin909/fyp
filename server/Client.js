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
        socket.emit(event, data);
    }

    function on (event, listener) {
        socket.on(event, listener);
    }

    function send (message) {
        socket.send(message);
    }

    function setTeam(team) {
      teamId=team;
      console.log("team " + teamId);
    }

    function getTeam() {
      console.log("team get " + teamId);
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
      virus=value;
    }

    function getMap() {
      return map;
    }

    function setMap (value) {
      map = value;
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

    function setWinner() {
      winner = true;
    }

    function getWinner() {
      return winner;
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
        toJSON
    });
}

module.exports = { create: Client };
