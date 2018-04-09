'use strict';

const TempValue = require('./TempValue');

function ServerVirus ({ id, name, color, x = 0, y = 0, width = 16, height = 16, speed = 50, onEvent }) {
  console.log("client.getId() " + id);

    let timer=4000;
    let counter = 0;

    function getId () {
        return id;
    }

    function getName () {
        return name;
    }

    function setSpeed (newSpeed) {
        speed = newSpeed;
    }

    function getSpeed () {
        return speed;
    }

    function update (delta, planetSystem) {
      counter+=delta;

      if(counter > timer){
        counter = 0;
        timer = Math.floor(Math.random()*6000 + 4000);
        //console.log("update function");
        selectTarget(planetSystem);
      }
    }


    function selectTarget (planetSystem) {
      let planetsArray = planetSystem.getPlanets();
      let owned = [];
      let targets = [];
      for (var i = 0; i < planetsArray.length; i++) {

        if (planetsArray[i].getControlledBy() === id){
          owned.push(planetsArray[i]);
        }
        else {
          targets.push(planetsArray[i]);
        }
      }

      console.log("owned " + owned.length + " targets " +  targets.length);
        if(owned.length > 0 && targets.length > 0){

          let targetID = Math.floor(Math.random()*targets.length);
          let map = new Map();
          map.set("target", targets[targetID]);

          let num = Math.floor(Math.random()*2.9 + 1)


          for (var i = 0; i < num; i++) {
            let planet = owned[Math.floor(Math.random()*owned.length)]
            map.set(planet.getId(), planet);
          }

          if(!isStupidTarget(map)){
            planetSystem.attack(map);
          }
          // if((owned[ownedID].getCellCount()*0.7) > targets[targetID].getCellCount() ){
          //   let map = new Map();
          //   map.set("target", targets[targetID]);
          //   map.set(map.size, owned[ownedID]);
          // }

        }
    }

    // function isStupidTarget() {
    //   var sum=0;
    //   for (var p in selectedPlanets){
    //     sum+=p.lives;
    //   };
    //   if(sum<target.lives) return true;
    //   return false;
    // }

    function isStupidTarget (map) {

      let target = map.get("target");
      let sum = 0;
      let targetSum = 0;

      for (const planet of map.values()) {

        if(planet.getId() === target.getId()){
          targetSum += target.getCellCount();
        }
        else {
          sum += planet.getCellCount();
        }
      }
      return (sum < targetSum);
    }

    function getColor() {
      return color;
    }

    return Object.freeze({
        getId,
        getName,
        setSpeed,
        getSpeed,
        getColor,
        update
    });
}

module.exports = { create: ServerVirus };
