'use strict';

var clicked	= false;
const collisionSystem = require('../../../../lib/CollisionSystem1');
const localPlayerId = [];
const planetSelected = new Map();

function Mouse (game1) {

  const game = game1;
  const canvas =  null;
  let counter = 0;
  let inputs = [];
  const planetSelected = new Map();

  function click (event) {
        clicked=true;
        //console.log("x:" + getMousePos(event).x +" y: "+ getMousePos(event).y);
  }

    function unclick (event) {

      if(planetSelected.size>1){
        processInputs(planetSelected);
      }

      for (const planet of planetSelected.values()){
        planet.setSelectedBy(null);
      }
      planetSelected.clear();
      clicked=false;
      counter = 0;
    }

    function moveFunction (event) {
        //onKeyChange(event, false);
        //console.log("move");
        if(clicked){
            //collisionSystem.check();
            // game.getPlanets();
          var planets =  game.getPlanets();
        //  console.log("planets " + planets.length);

          for (const planet of planets) {
            const { x, y } = planet.getPosition();
            // console.log("planet x : " + x + "planet y : " + y);
            // const radius = planet.getRadius();
            const radius = planet.getRadius();
            //console.log("localPlayerId " + localPlayerId.shift());
            const id = localPlayerId.shift();

            let mouse = getMousePos(event)

            if(Math.abs(x-mouse.x)<=radius){
              if(Math.abs(y-(mouse.y))<=radius){


                // console.log("planet x : " + x + "planet y : " + y);
              //  console.log("planet.getControlledBy  " + planet.getControlledBy());
                //console.log("localPlayerId " + localPlayerId.shift());
              //  console.log("localPlayerId " + id);
                if(planet.getControlledBy()===id){
                  // console.log("planet.getControlledBy  " + planet.getControlledBy);
                  // console.log("localPlayerId " + localPlayerId);
              //    console.log("my planet");
                  //planet.setSelectedBy()
                  planetSelected.set(planet.getId(), planet);
                  planetSelected.set("join", planet);
                  planet.setSelectedBy(counter);
                  counter++;
              //    console.log(planetSelected.size);
                //  console.log("join");
                //  planet.setSelectedBy(id);
                }
                else {
                      if(planetSelected.has('target')){
                        planetSelected.delete("join");
                        let fuckyou =  planetSelected.get("target");
                        fuckyou.setSelectedBy(null);
                        counter--;
                      }

                      planetSelected.set("target", planet);
                  //    console.log(planetSelected.size);
                      planet.setSelectedBy(counter);
                      counter++
                  //    console.log("target");
                    }
                // console.log('mouseX = ' + event.clientX);
                // console.log('mouseY = ' + event.clientY);
              //   console.log("_______HIT _________");
              }
            }
            // console.log('mouseX = ' + event.clientX);
            // console.log('mouseY = ' + event.clientY);
          }
        }
    }
    function processInputs(input) {
      let data = '';
        data += "begin,"

        input.forEach(function (item, key, mapObj) {
                data += key + "_" + item.getId() + "," ;
                 })

        data += "end,"

      inputs.push(data);
    }

    function getMousePos(evt){
      let can = game.getCanvas();
      const rect = can.getBoundingClientRect();
      return {
        y: evt.clientY - rect.top,
        x: evt.clientX - rect.left
      }
    }

    function getInputs() {
      let tempInput = inputs;
      inputs = [];
      return tempInput;
    }

    function setLocalPlayer(id) {
      // let localPlayerId[0] = id;
      localPlayerId.push(id);
    //  console.log("set id " + localPlayerId);
    }
    function stopListening () {
      document.addEventListener('mousedown', click, false);
      document.addEventListener('mouseup', unclick, false);
      document.addEventListener('mousemove', moveFunction, false);
    }
    document.addEventListener('mousedown', click, false);
    document.addEventListener('mouseup', unclick, false);
    document.addEventListener('mousemove', moveFunction, false);

    return Object.freeze({
        getInputs,
        stopListening,
        setLocalPlayer
    });
}


module.exports = { create: Mouse };
