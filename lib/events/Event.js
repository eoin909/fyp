'use strict';

const uuid = require('node-uuid');

function Event ({ x, y, color }) {
  //  id = id || uuid.v4();

    // let isDispatched = false;
    // let done = false;
    //
    // function reset () {
    //     done = false;
    //     isDispatched = false;
    // }
    //
    // function dispatch (event) {
    //     if (!isDispatched) {
    //         done = true;
    //         onDispatch(event);
    //     }
    // }
    //
    // function getId () {
    //     return id;
    // }
    //
    // function getFiredBy () {
    //     return firedBy;
    // }
    //
    // function getName () {
    //     return name;
    // }
    //
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

    // function toJSON () {
    //     return {
    //         id,
    //         name,
    //         firedBy: firedBy.getId(),
    //         color: firedBy.getColor()
    //     };
    // }

    function toJSON () {
        return {
            x,
            y,
            color
        };
    }


    return Object.freeze({
        // getId,
        // getFiredBy,
        // getName,
        // isDone,
        setXPostion,
        setYPostion,
        getPosition,
        toJSON
    });
}

module.exports = { create: Event };
