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
    let inputs = [];
    let lastInputSeq = 0;
    let canvas = null;
    const localPlayerIdVariable = "dsjfoj";
    const timer = Timer.create({ interval: options.timerFrequency });
    let mapitem = null;
    let mapChanges = new Map();

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

    // function update(delta) {
    //
    //   //planetSystem.virusMovement(delta);
    //   processInputs(delta);
    //
    // }
    function getPlayerById (playerId) {
        return players.get(playerId);
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
        //console.log("input received game" + input.inputs);
        console.log("input pushed");
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

      ///blah set virus control of next avaible planet
      //console.log(planets);
      for(const planet of planets.values()){
        console.log("virus.name" + virus.getName());
        if(planet.getControlledBy() ==='neutral'){
          planet.setVirus(virus.getId());
          break;
        }
      }
      //let planet = planets.get(1);
      // console.log("virus.name" + virus.getName());
      // planet.setVirus(virus.getId());
    }

     function addPlanet (planet) {
    //     // player.setEventHandler((eventData) => {
    //     //     playerEventHandler.onEvent(eventData, player);
    //     // });
    //     //
    //     // player.setSpeed(options.playerSpeed);
        console.log("game.addPlanets");
        console.log(planet);
        console.log(planet.getId());
      //  console.log(planet.g);
    //     console.log(planet.getSelectedBy());
    //   //  for(var i=0;i<5;i++){
        planets.set(planet.getId(), planet);
        planetSystem.addPlanet(planet);
    //
    //     //planetSystem.addPlanet(planet)
    //   //  }
    //     // bulletSystem.addPlayer(player);
    //     // planetSystem.addPlayer(player);
    //     // collisionSystem.addPlayer(player);
     }

    function addPlanets (planet) {
      const planetMap = Planet.create(
        {
          id: 0,
          cellCount: 50,
          controlledBy: 'neutral',
        //  selectedBy: 'nobody',
          x: 60,
          y: 245
        });

    addPlanet(planetMap);

    const planetMap1 = Planet.create(
        {
          id:1,
          cellCount: 50,
          controlledBy: 'neutral',
        //  selectedBy: 'nobody',
          x: 90,
          y: 60
        }
      );

    addPlanet(planetMap1);

    const planetMap2 = Planet.create(
      {
        id:2,
        cellCount: 50,
        controlledBy: 'neutral',
        //selectedBy: '',
        x: 260,
        y: 245
      }
    );

    addPlanet(planetMap2);

    const planetMap3 = Planet.create(
      {
        id:3,
        cellCount: 50,
        controlledBy: 'neutral',
        //selectedBy: 'nobody',
        x: 90,
        y: 305
      }
    );

    addPlanet(planetMap3);
    const planetMap4 = Planet.create(
      {
        id:4,
        cellCount: 50,
        controlledBy: 'neutral',
      //  selectedBy: 'nobody',
        x: 350,
        y: 350
      }
    );

     addPlanet(planetMap4);
    }





    function addPlayer (player) {
        player.setEventHandler((eventData) => {
            playerEventHandler.onEvent(eventData, player);
        });

        player.setSpeed(options.playerSpeed);

        players.set(player.getId(), player);
        bulletSystem.addPlayer(player);
        //planetSystem.addPlayer(player);
        collisionSystem.addPlayer(player);
    }

    function removePlayer (playerId) {
        const player = players.get(playerId);

        bulletSystem.removePlayer(player);
        collisionSystem.removePlayer(player);
        players.delete(playerId);
    }

    function start (can) {
        canvas = can;
        simulationLoop.start();
        timer.start();

        eventsFired = [];

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
            events: eventsFired.filter((event) => {
                if (typeof event.getFiredBy === 'function') {
                    return event.getFiredBy() !== player;
                }

                return event;
            }).map((event) => event.toJSON())
        };
    }

      function getStateForPlanetSystem (id) {

        return {
            serverTime: getTime(),
            localClientId:id,
            planets: Array.from(planets.values()).map(planet => planet.toJSON())
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
      console.log('attack');
      console.log("attack method" + map.size);
      //mapitem=map;
      //  mapChanges.set(mapChanges.size, mapitem);
      mapChanges = map;

      planetSystem.attack(map);

    }
    function getPlanets() {
      return planetSystem.getPlanets();
      console.log("abstract game getPlanets size : " + planetSystem.getPlanets().size);

    }

  function getMapChanges() {
    return mapChanges;

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
    //  console.log("processInput");
    //  console.log(inputs.length);
      for (let j = 0; j < inputs.length; j++) {
        //console.log("processInput sskjfdljlkfdjslkfjklsajflkj");

          // Don't process ones we already have simulated locally
      //    console.log(lastInputSeq);
        // console.log(inputs[j].seq);
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
        if (eventData.name === 'hit') {
            bulletSystem.onHitEvent(eventData);
        } else {
            const dispatchedBy = getPlayerById(eventData.firedBy);

            playerEventHandler.onNetworkEvent(eventData, dispatchedBy);
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
        removePlayer,
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
        start,
        stop
    });
}

module.exports = { create: AbstractGame };
