'use strict';

const TempValue = require('./TempValue');

function ServerVirus ({ id, name, color, speed = 70 , agility = 70, strength = 70 }) {

    let timer=4000;
    let counter = 0;

    function getId () {
        return id;
    }

    function getName () {
        return name;
    }

    function getSpeed () {
        return speed;
    }

    function getAgility () {
        return agility;
    }

    function getStrength () {
        return strength;
    }

    function update (delta, planetSystem) {
      counter+=delta;

      if(counter > timer){
        counter = 0;
        timer = Math.floor(Math.random()*6000 + 4000);
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

      if(owned.length > 0 && targets.length > 0){

        let targetID = Math.floor(Math.random()*targets.length);
        let map = new Map();
        map.set("target", targets[targetID]);
        let num = Math.floor(Math.random()*5 + 1)

        for (var i = 0; i < num; i++) {
          let planet = owned[Math.floor(Math.random()*owned.length)]
          map.set(planet.getId(), planet);
        }

        if(!isStupidTarget(map)){
          planetSystem.attack(map);
        }
      }
    }

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
        getSpeed,
        getSpeed,
        getStrength,
        getAgility,
        getColor,
        update
    });
}

module.exports = { create: ServerVirus };
