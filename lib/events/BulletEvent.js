'use strict';

const uuid = require('node-uuid');

function BulletEvent ({id, planet, planetTarget, bulletColor, virusTarget, virusPlanet}) {

    const cellCount = planet.getCellCountDivide();
    const speed = virusPlanet.getSpeed()*2;

    const x1 = planet.getX();
    const y1 = planet.getY();

    const x2 = planetTarget.getX();
    const y2 = planetTarget.getY();

    let x=x1;
    let y=y1;
    id = id || uuid.v4();
    const name = 'bulletEvent';
    let isDispatched = false;
    let done = false;

    const angle = calAngle( x1 , y1, x2 , y2);
    const distance = calDistance( x1 , y1, x2 , y2);
    let travelledDistance = 0;
    let dead = false;

    function reset () {
        done = false;
        isDispatched = false;
    }

    function update (delta) {

        if (!dead) {
            if (travelledDistance >= distance) {
                dead = true;
            } else {
                travelledDistance += speed * (delta / 1000);
                x += speed * Math.cos(angle) * (delta / 1000);
                y += speed * Math.sin(angle) * (delta / 1000);
            }
        }
    }

    function dispatch (event) {
        if (!isDispatched) {
            onDispatch(event);
        }
    }

    function getId () {
        return id;
    }

    function getCellCount () {
        return cellCount;
    }

    function getFiredBy () {
        return planet;
    }

    function getTarget () {
        return planetTarget;
    }

    function getVirusPlanetStrength() {
      return virusPlanet.getStrength()
    }

    function getTargetVirusStrength() {
      return virusTarget.getStrength();
    }

    function getVirusPlanetAgility() {
      return virusPlanet.getAgility()
    }

    function getTargetVirusAgility() {
      return virusTarget.getAgility();
    }

    function getName () {
        return name;
    }

    function isDone () {
        return done;
    }

    function setXPostion (value) {
        x = value;
    }

    function setYPostion (value) {
        y = value;
    }

    function getPosition () {
      return {
          x,
          y
      };
    }

    function getBulletColor () {
      return bulletColor;
    }

    function calAngle (posX1, posY1, posX2, posY2) {
      return ( Math.atan2( (posY2 - posY1), (posX2 - posX1) ) );
    }

    function calDistance (posX1, posY1, posX2, posY2) {
      return Math.sqrt( ( (posX1-posX2) * (posX1-posX2) ) + ( (posY1-posY2) * (posY1-posY2) ) );
    }

    function toJSON () {
        return {
            x,
            y,
            bulletColor,
            cellCount
        };
    }

    function isDead () {
        return dead;
    }
    return Object.freeze({
        getId,
        getCellCount,
        getName,
        getTarget,
        isDone,
        update,
        dispatch,
        getFiredBy,
        getVirusPlanetAgility,
        getVirusPlanetStrength,
        getTargetVirusAgility,
        getTargetVirusStrength,
        isDead,
        reset,
        getBulletColor,
        setXPostion,
        setYPostion,
        getPosition,
        toJSON
    });
}

module.exports = { create: BulletEvent };
