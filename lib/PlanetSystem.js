'use strict';

const HitEvent = require('./events/HitEvent');

function PlanetSystem ({ eventSystem }) {
    const players = new Map();
    const planets = new Map();
    let counter =0;
    function onHit (planet, player) {
        player.damage();

        // It's possible that the client does not have a bullet anymore.
        // if (bullet) {
        planet.kill();
        // }
    }

    function attack (map) {

    //  console.log(map);
      counter++;
    //  console.log("planetSystem.size " + map.size);


      let planetTarget=null;
      if(map.has("target")){
        planetTarget = map.get("target");
      //  console.log("planet target " + planetTarget);
        map.delete("target");
      }
      else {
        planetTarget = map.get("join");
        map.delete("join");
      }

      planetTarget.attack(map);
    }

    function onHitEvent (eventData) {
        const planet = planets.get(eventData.planet);
        const player = players.get(eventData.playerHit);

        // Hit the player only once
        if (!player.isHit()) {
            eventSystem.dispatch(HitEvent.create({
                id: eventData.id,
                planet,
                duration: 1000,
                playerHit: player,
                onDispatch: () => {
                    onHit(planet, player);
                },
                onDone: () => {
                    player.setHit(false);
                }
            }));
        }
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

    function clear () {
        for (const planet of planets.values()) {
            if (planet.isDead()) {
                removePlanet(planet);
            }
        }
    }

    function getInputcounter() {
      return counter;
    }
    function resetCounter() {
      counter=0;
    }
    function update () {
        // TODO Optimize
        for (const player of players.values()) {
            // for (const bullet of bullets.values()) {
            //     if (bullet.getFiredBy() !== player) {
            //         const width = player.getWidth();
            //         const height = player.getHeight();
            //
            //         const bulletPosition = bullet.getPosition();
            //         const { x, y } = player.getPosition();
            //         const positionLimits = {
            //             xMin: x - (width / 2),
            //             xMax: x + (width / 2),
            //             yMin: y - (height / 2),
            //             yMax: y + (height / 2)
            //         };
            //
            //         if (bulletPosition.x >= positionLimits.xMin
            //             && bulletPosition.x <= positionLimits.xMax
            //             && bulletPosition.y >= positionLimits.yMin
            //             && bulletPosition.y <= positionLimits.yMax) {
            //             onHitEvent({
            //                 bullet: bullet.getId(),
            //                 playerHit: player.getId()
            //             });
            //         }
            //     }
            // }
        }
    }

    return Object.freeze({
        update,
        attack,
        onHitEvent,
        resetCounter,
        getInputcounter,
        clear,
        getPlanets,
        addPlanet,
        removePlanet,
        addPlayer,
        removePlayer
    });
}

module.exports = { create: PlanetSystem };
