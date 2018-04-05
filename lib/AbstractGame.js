'use strict';

const MainLoop = require('@arjanfrans/mainloop');
const Timer = require('./Timer');
const CollisionSystem = require('./CollisionSystem');
const EventSystem = require('./events/EventSystem');
const BulletSystem = require('./BulletSystem');
const PlanetSystem = require('./PlanetSystem');
const PlayerEventHandler = require('./events/PlayerEventHandler');
const Planet = require('./Planet.js');

function AbstractGame ({ options, updateHandler = null, drawHandler = null }) {
    const players = new Map();
    const planets = new Map();
    let started = false;
    let eventsFired = [];
    let renderBullets = new Map();
    let inputs = [];
    let aiPlayers = [];
    let lastInputSeq = 0;
    let counter = 0;
    let canvas = null;
    const localPlayerIdVariable = "dsjfoj";
    const timer = Timer.create({ interval: options.timerFrequency });
    let mapitem = null;
    let mapChanges = new Map();
    let serverRoom = null;
    const eventSystem = EventSystem.create({
        onDispatch: (event) => {
            eventsFired.push(event);
        }
    });
    const bulletSystem = BulletSystem.create({ eventSystem });
    const planetSystem = PlanetSystem.create({ eventSystem });

    const playerEventHandler = PlayerEventHandler.create({ eventSystem, bulletSystem });
    const collisionSystem = CollisionSystem.create({ world: options.world });

    const simulationLoop = MainLoop.create({
        simulationTimestep: options.simulationTimestep
    });

    function isStarted () {
        return started;
    }

    function getPlayerById (playerId) {
        return players.get(playerId);
    }

    function addRenderBullets( map ) {
      renderBullets = map;
    }

    function getRenderBullets() {
      return renderBullets;
    }

    function getPlayers () {
        return players.values();
    }

    function getTime () {
        return timer.getTime();
    }

    function setTime (value) {
        timer.setTime(value);
    }

    function setUpdateHandler (handler) {
        updateHandler = handler;
    }

    function pushInput (input) {
        inputs.push(input);
    }
    function setDrawHandler (handler) {
        drawHandler = handler;

        if (typeof handler === 'function') {
            simulationLoop.setDraw(handler);
        }
    }
    function setLocalPlayerId(id) {
      let localPlayerIdVariable = id;

    }
    function getLocalPlayerId() {
      return localPlayerIdVariable;

    }

    function addVirus(virus) {
      for(const planet of planets.values()){
        if(planet.getControlledBy() ==='neutral'){
          planet.setVirus(virus);
          break;
        }
      }

    }

    function addServerVirus(virus) {
      console.log("add ai");
      addVirus(virus);
      aiPlayers.push(virus);
    }

    function updateAI(delta) {
      for(let i=0; i<aiPlayers.length; i++){
        aiPlayers[i].update(delta, planetSystem);
      }
    }
     function addPlanet (planet) {
        planets.set(planet.getId(), planet);
        planetSystem.addPlanet(planet);
     }

    function addPlanets (planets) {

      for (const planet of planets.values()) {
        addPlanet(planet);
      }
    }

    function addPlayer (player) {
        player.setEventHandler((eventData) => {
            playerEventHandler.onEvent(eventData, player);
        });

        player.setSpeed(options.playerSpeed);

        players.set(player.getId(), player);
        bulletSystem.addPlayer(player);
        collisionSystem.addPlayer(player);
    }

    function removeVirus (playerId) {

        for(const planet of planets.values()){
          if(planet.getControlledBy() === playerId){
            planet.setNeutral();
          }
        }
    }

    function start (can) {
        canvas = can;
        simulationLoop.start();
        timer.start();

        eventsFired = [];

        started = true;
    }

    function startServerGame (room){
      simulationLoop.start();
      timer.start();
      serverRoom = room;
      eventsFired = [];
      counter = 0;
      started = true;
    }

    function getCanvas() {
      return canvas;

    }
    function stop () {
        simulationLoop.stop();
        timer.stop();

        started = false;
    }

    function clearInputs () {
        for (const player of players.values()) {
            player.clearInputs();
        }
    }

    function updateSystems (delta) {
        bulletSystem.clear();
        bulletSystem.update(delta);

        processInputs(delta);

        eventSystem.update(delta);

        collisionSystem.update(delta);
    }

    function update (delta) {
        if (typeof updateHandler === 'function') {
            updateHandler(delta);
        }


        updateSystems(delta);

        clearInputs();
    }

    function getStateForPlayer (player) {

        console.log("planets.size " + planets.size);

        return {
            serverTime: getTime(),
            ownPlayer: player.toJSON(),
            players: Array.from(players.values()).filter(otherPlayer => {
                return otherPlayer !== player;
            }).map(player => player.toJSON()),
            events: eventsFired.map((event) => event.toJSON())
        };
    }

      function getStateForPlanetSystem (id) {
        return {
            serverTime: getTime(),
            localClientId:id,
            planets: Array.from(planets.values()).map(planet => planet.toJSON()),
            events: planetSystem.getBulletArray().map((bulletEvent) => bulletEvent.toJSON())
        };
    }

    function clearEvents () {
        eventsFired = [];
    }

    function clearPlayers () {
        players.clear();
    }

    function getOptions () {
        return options;
    }

    function getBullets () {
        return bulletSystem.getBullets();
    }

    function attack(map){
      mapChanges = map;
      planetSystem.attack(map);
    }
    function getPlanets() {
      return planetSystem.getPlanets();
    }

    function getMapChanges() {
      return mapChanges;
    }

    function isGameOver(delta) {
      if(started){
        let playersAlive = planetSystem.isGameOver();

        if(playersAlive.size < 2 ){

          let winnerPlayer=null;
          for (const player of playersAlive.values()) {
            winnerPlayer = player.getControlledBy();
          }

          let boo = true;
          let bulletArray = planetSystem.getBulletArray();
          for (var i = 0; i < bulletArray.length; i++) {

            if(bulletArray[i].getId() !== winnerPlayer){
              boo = false;
              break;
            }
          }

          if(boo){
            counter += delta;

            if(counter > 3000){
              serverRoom.winner(winnerPlayer);
              stop();
            }
          }
        }
      }
    }

  function resetMapChanges() {
    mapChanges.clear();

  }
    function onEvent (eventData, dispatchedBy) {
        playerEventHandler.onEvent(eventData, dispatchedBy);
    }

    function getPlanetSystem () {
      return planetSystem;
    }
    function processInputs(delta) {
      if (inputs.length === 0) {
          return;
      }

      for (let j = 0; j < inputs.length; j++) {
        if (inputs[j].seq > lastInputSeq) {
            const input = inputs[j].inputs;
            const c = input.length;

            let index=0;
            while(index<c-5){

                let startPos = input.indexOf("begin", index) + "begin".length;
                let endPos = input.indexOf("end" , startPos)
                index = endPos;
                var chain = input.slice(startPos, endPos);

                let pos =0;
                let boo = true;
                let actionMap = new Map()
                  while (boo) {
                    let begin = chain.indexOf(",", pos) + ",".length;
                    let fin = chain.indexOf(",", begin);
                    pos=fin;
                    let data = chain.slice(begin,fin);

                    let space = data.indexOf("_", 0);
                    let mapKey = data.slice(0, space);
                    let mapItem =parseInt(data.slice(space+1,data.length));

                    actionMap.set(mapKey, planets.get(mapItem));
                    if(pos === chain.length-1){
                        boo=false;
                    }
                  }
                planetSystem.attack(actionMap);
                }
              }
            }
    inputs=[];
  }
    function onNetworkEvent (eventData) {
        if (eventData.name === 'fire') {
            bulletSystem.onHitEvent(eventData);
        } else {

        }
    }

    function getSimulationFps () {
        return Math.round(1000 / options.simulationTimestep);
    }

    function planetSystemUpdate (delta) {
      planetSystem.update(delta);
    }

    function getPlanetById (id) {

      return planets.get(id);

    }

    simulationLoop.setUpdate(update);

    if (typeof drawHandler === 'function') {
        simulationLoop.setDraw(drawHandler);
    }

    return Object.freeze({
        isStarted,
        getPlayers,
        pushInput,
        getOptions,
        addVirus,
        addServerVirus,
        updateAI,
        isGameOver,
        planetSystemUpdate,
        getPlanetById,
        getMapChanges,
        getCanvas,
        resetMapChanges,
        getSimulationFps,
        setTime,
        attack,
        getLocalPlayerId,
        setLocalPlayerId,
        addPlayer,
        addPlanets,
        addPlanet,
        getBullets,
        getPlanets,
        getPlanetSystem,
        getStateForPlanetSystem,
        removeVirus,
        clearEvents,
        update,
        onEvent,
        onNetworkEvent,
        clearPlayers,
        getTime,
        clearInputs,
        getPlayerById,
        setUpdateHandler,
        setDrawHandler,
        getStateForPlayer,
        getRenderBullets,
        addRenderBullets,
        start,
        startServerGame,
        stop
    });
}

module.exports = { create: AbstractGame };
