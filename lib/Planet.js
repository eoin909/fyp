'use strict';



function Planet ({ id, cellCount, controlledBy, selectedBy = null, x, y}) {


    function update (delta) {
      console.log("updatefunction");
    }

    function getId () {
        return id;
    }

    // function getRadius() {
    //
    //   return radius;
    //
    // }
    function attack (map){

      console.log("size " + map.size);
      for (const planet of map.values()) {
        planet.setSelectedBy(null);
        if(planet.getControlledBy===controlledBy){
          console.log("join");
          cellCount += planet.getCellCountDivide();
        }
        else {
          console.log(cellCount);

          cellCount += -planet.getCellCountDivide();
          console.log("fight");

          if(cellCount<0){
            cellCount = Math.floor(Math.abs(cellCount));
            controlledBy = planet.controlledBy;
          }
        }
      }

      selectedBy = null;
    }

    function getControlledBy () {
        return controlledBy;
    }

    function getPosition () {
        return {
            x,
            y
        };
    }
function getCellCountDivide() {
  cellCount = Math.floor(cellCount/2);
  return cellCount;
}
    function getRadius() {
      return 20;

    }
    function toJSON () {
        return {
            id,
            x,
            y,
            controlledBy
        };
    }

    function getCellCount() {
      return cellCount;
    }
function setSelectedBy(playerCode) {
  console.log("select");
  selectedBy = playerCode;

}
function getSelectedBy() {
  return selectedBy;
//return "fuck you";
}
    return Object.freeze({
        update,
        attack,
        getCellCount,
        setSelectedBy,
        getSelectedBy,
        getPosition,
        getRadius,
        getControlledBy,
        getCellCountDivide,
        getId,
        toJSON
    });
}

module.exports = { create: Planet };
