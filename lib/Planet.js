'use strict';



function Planet ({ id, cellCount, controlledBy, color='#FFFFFF', selectedBy = null, x, y}) {

    let radius = 15;

    function update (delta) {
      cellCount += delta*0.001;

    }

    function getId () {
        return id;
    }

    function attack (map){


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
      return radius;

    }
    function toJSON () {
        return {
            id,
            x,
            y,
            controlledBy,
            color: getColor(),
            cellCount
        };
    }

    function getCellCount() {
      return Math.floor(cellCount);
    }

    function setSelectedBy(playerCode) {
      console.log("select");
      selectedBy = playerCode;
    }

    function getColor () {
      return color;
    }

    function setVirus(virus) {
      controlledBy= virus.getId();
      color = virus.getColor();
    }


    function getSelectedBy() {
      return selectedBy;
    }

    function setCellCount (value) {
      cellCount=value;
    }

    function setControlledBy (id) {
      controlledBy=id;
    }

    function setColor (value){
      color = value;
    }
    return Object.freeze({
        update,
        attack,
        setCellCount,
        getColor,
        setColor,
        setControlledBy,
        getCellCount,
        setSelectedBy,
        getSelectedBy,
        getPosition,
        getRadius,
        getControlledBy,
        setVirus,
        getCellCountDivide,
        getId,
        toJSON
    });
}

module.exports = { create: Planet };
