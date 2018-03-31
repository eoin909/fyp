'use strict';

const HitEvent = require('./events/HitEvent');

function PlanetSystem ({ eventSystem }) {
    const players = new Map();
    const planets = new Map();
    let inputs = [];
    let counter =0;
    let lastInputSeq=0;

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
      console.log("attack planetSystem");

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


    function pushInput (input) {
      inputs.push(input);
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
    function processInputs(delta) {
      if (inputs.length === 0) {
          return;
      }
    //  console.log("processInput");
    //  console.log(inputs.length);
      for (let j = 0; j < inputs.length; j++) {
        console.log("processInput sskjfdljlkfdjslkfjklsajflkj");

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
                attack(actionMap);
                }
              }
            }
    inputs=[];
  }
  function updateSystems (delta) {
      // bulletSystem.clear();
      // bulletSystem.update(delta);

      //processInputs(delta);
      //
      for (const planet of planets.values()){
        planet.update(delta);
     }
      //
      // collisionSystem.update(delta);
  }

  function update (delta) {
      // if (typeof updateHandler === 'function') {
      //     updateHandler(delta);
      // }


      updateSystems(delta);

      // clearInputs();
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
    // function update () {
    //     // TODO Optimize
    //     for (const player of players.values()) {
    //         // for (const bullet of bullets.values()) {
    //         //     if (bullet.getFiredBy() !== player) {
    //         //         const width = player.getWidth();
    //         //         const height = player.getHeight();
    //         //
    //         //         const bulletPosition = bullet.getPosition();
    //         //         const { x, y } = player.getPosition();
    //         //         const positionLimits = {
    //         //             xMin: x - (width / 2),
    //         //             xMax: x + (width / 2),
    //         //             yMin: y - (height / 2),
    //         //             yMax: y + (height / 2)
    //         //         };
    //         //
    //         //         if (bulletPosition.x >= positionLimits.xMin
    //         //             && bulletPosition.x <= positionLimits.xMax
    //         //             && bulletPosition.y >= positionLimits.yMin
    //         //             && bulletPosition.y <= positionLimits.yMax) {
    //         //             onHitEvent({
    //         //                 bullet: bullet.getId(),
    //         //                 playerHit: player.getId()
    //         //             });
    //         //         }
    //         //     }
    //         // }
    //     }
    // }

    return Object.freeze({
        update,
        pushInput,
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
