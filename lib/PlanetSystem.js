'use strict';

const BulletEvent = require('./events/BulletEvent');

function PlanetSystem ({ }) {
    const players = new Map();
    const planets = new Map();
    let bulletArray = [];
    let inputs = [];
    let counter =0;
    let lastInputSeq=0;
    let teams = null;
    let gameMode = null;
    let viruses = null;

    function attack (map) {

      if(map.has("target")){
        let planetTarget = map.get("target");
        map.delete("target");

        for (let planet of map.values()) {
            if(planet.getId() !== planetTarget.getId()){

              let id = planet.getControlledBy();
              const bulletColor =  planet.getColor();
              let virusTarget = viruses.get(planetTarget.getControlledBy());
              let virusPlanet = viruses.get(planet.getControlledBy());
              let bullet = BulletEvent.create(
                {id, planet, planetTarget, bulletColor, virusTarget, virusPlanet})
              bulletArray.push(bullet);
            }
        }
      }
    }


    function pushInput (input) {
      inputs.push(input);
    }

    function processInputs(delta) {
      if (inputs.length === 0) {
          return;
      }

      for ( let j = 0; j < inputs.length; j++) {

            let input = inputs[j].inputs.toString();
            let c = input.length;

            let index=0;
            while ( index < (c-5) ){

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
                attack(actionMap);
                }
            }
    inputs=[];
  }
  function updateSystems (delta) {

      processInputs(delta);

      for (const planet of planets.values()){
        planet.update(delta, viruses);
     }

     for (let i=0; i<bulletArray.length; i++){
       bulletArray[i].update(delta);
       if(bulletArray[i].isDead()){
          let bulletPlanetTarget = bulletArray[i].getTarget();
          if(gameMode !== 'Teams'){
             bulletPlanetTarget.attack(
                                       bulletArray[i].getId(),
                                       bulletArray[i].getCellCount(),
                                       bulletArray[i].getBulletColor(),
                                       bulletArray[i].getTargetVirusStrength(),
                                       bulletArray[i].getVirusPlanetStrength()
                                     );
          } else {
              if( teams[0].has( bulletArray[i].getId() ) &&
              teams[0].has( bulletPlanetTarget.getControlledBy() ) ||
              teams[1].has( bulletArray[i].getId() ) &&
              teams[1].has( bulletPlanetTarget.getControlledBy() ) ){

                bulletPlanetTarget.attack(
                                              bulletPlanetTarget.getControlledBy(),
                                              bulletArray[i].getCellCount(),
                                              bulletArray[i].getBulletColor(),
                                              bulletArray[i].getTargetVirusStrength(),
                                              bulletArray[i].getVirusPlanetStrength()
                                            );

              } else {
                bulletPlanetTarget.attack(
                                          bulletArray[i].getId(),
                                          bulletArray[i].getCellCount(),
                                          bulletArray[i].getBulletColor(),
                                          bulletArray[i].getTargetVirusStrength(),
                                          bulletArray[i].getVirusPlanetStrength()
                                        );
              }
          }
         bulletArray.splice(i, 1);
       };
    }
  }

    function update (delta) {
        updateSystems(delta);
    }

    function isGameOver() {
      let controllers = new Map();
      for (const planet of planets.values()) {
        if(planet.getControlledBy() !== 'neutral'){
          controllers.set(planet.getControlledBy(), planet);
        }
      }
      return (controllers);
    }

    function addPlanet (planet) {
        planets.set(planet.getId(), planet);
    }

    function removePlanet (planet) {
        planets.delete(planet.getId());
    }

    function addPlayer (player) {
        players.set(player.getId(), player);
    }

    function removePlayer (player) {
        players.delete(player.getId());
    }

    function getPlanets () {
        return Array.from(planets.values());
    }

    function getBulletArray () {
      return bulletArray;
    }

    function setTeams(value){
      teams = value
    }

    function setGameMode(game) {
      gameMode = game;
    }

    function clear () {
        for (const planet of planets.values()) {
            if (planet.isDead()) {
                removePlanet(planet);
            }
        }
    }

    function addViruses(value) {
      viruses = value;
    }

    function getGameMode() {
      return gameMode;
    }

    function getTeams() {
      return teams;
    }

    function getInputcounter() {
      return counter;
    }
    function resetCounter() {
      counter=0;
    }

    return Object.freeze({
        update,
        pushInput,
        getTeams,
        getGameMode,
        setTeams,
        addViruses,
        setGameMode,
        attack,
        isGameOver,
        resetCounter,
        getInputcounter,
        clear,
        getPlanets,
        addPlanet,
        removePlanet,
        getBulletArray,
        addPlayer,
        removePlayer
    });
}

module.exports = { create: PlanetSystem };
