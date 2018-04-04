'use strict';

const uuid = require('node-uuid');

function BulletEvent ({id, planet, planetTarget, bulletColor}) {
  // console.log("x1 " + x1);
  // console.log("y1 " + y1);
  // console.log("x2 " + x2);
  // console.log("y2 " + y2);
  //   console.log("BulletEvent color " + bulletColor);
    const cellCount = planet.getCellCountDivide();
    const speed = 100;

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
    // const { x1, y1 } = firedBy.getPosition();
    // const { x2, y2 } = target.getPosition();
    const angle = calAngle( x1 , y1, x2 , y2);
    const distance = calDistance( x1 , y1, x2 , y2);
    let travelledDistance = 0;
    let dead = false;

    function reset () {
        done = false;
        isDispatched = false;
    }

    function update (delta) {
        // if (bullet.isDead() && !done) {
        //     done = true;
        //
        //     if (typeof onDone === 'function') {
        //         onDone();
        //     }
        // } else if (!done) {
        //     bullet.update(delta);
        // }
        if (!dead) {
            if (travelledDistance >= distance) {
                dead = true;
            } else {
                travelledDistance += speed * (delta / 1000);
                // console.log("angle " + angle);
                // console.log("speed * Math.cos(angle) * (delta / 1000) " + speed * Math.cos(angle) * (delta / 1000));
                // console.log("speed * Math.sin(angle) * (delta / 1000) " + speed * Math.sin(angle) * (delta / 1000));

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

    function getName () {
        return name;
    }

    function isDone () {
        return done;
    }

    // function toJSON () {
    //     return {
    //         id,
    //         firedBy: firedBy.getColor(),
    //         data: {
    //             bullet: bullet.toJSON()
    //         }
    //     };
    // }

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
      // console.log("x1 " + x1);
      // console.log("y1 " + y1);
      // console.log("x2 " + x2);
      // console.log("y2 " + y2);
      // console.log("Math.atan2( (y2 - y1), (x2 - x1) ) " + Math.atan2( (y2 - y1), (x2 - x1) ));
      return ( Math.atan2( (posY2 - posY1), (posX2 - posX1) ) );
    }

    function calDistance (posX1, posY1, posX2, posY2) {
      return Math.sqrt( ( (posX1-posX2) * (posX1-posX2) ) + ( (posY1-posY2) * (posY1-posY2) ) );
    }

    function toJSON () {
      //console.log("bulletColor " + bulletColor);
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
