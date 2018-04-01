'use strict';

function bullet ({ x, y, color, cellCount}) {

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

    function getCellCount () {
      return cellCount;
    }

    function getColor () {
      return color;

    }

    function toJSON () {
        return {
            x,
            y,
            color
        };
    }

    return Object.freeze({
        setXPostion,
        setYPostion,
        getPosition,
        getCellCount,
        getColor,
        toJSON
    });
}

module.exports = { create: bullet };
