'use strict';

let ids = 0;

function Bullet ({ id,  firedBy, target, speed = 200 }) {
    id = id || ++ids;

    const { x1, y1 } = firedBy.getPosition();
    const { x2, y2 } = target.getPosition();
    const angle = calAngle();
    const distance = calDistance();

    let travelledDistance = 0;
    let dead = false;

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

    function getId () {
        return id;
    }

    function kill () {
        dead = true;
    }

    function isDead () {
        return dead;
    }

    function getFiredBy () {
        return firedBy;
    }

    function getPosition () {
        return {
            x,
            y
        };
    }

    function calAngle () {
      return Math.atan2((y2-y1), (x2 - x1));
    }

    function calDistance () {
      return Math.sqrt( ( (x1-x2) * (x1-x2) ) + ( (y1-y2) * (y1-y2) ) );
    }
    
    function toJSON () {
        return {
            id,
            x,
            y,
            dead,
            angle,
            speed
        };
    }

    return Object.freeze({
        update,
        getFiredBy,
        kill,
        getPosition,
        getId,
        isDead,
        toJSON
    });
}

module.exports = { create: Bullet };
