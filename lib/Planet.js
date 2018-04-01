'use strict';



function Planet ({ id, cellCount, controlledBy, color='#FFFFFF', selectedBy = null, x, y}) {

    let radius = 15;

    function update (delta) {
      if( controlledBy !== null && controlledBy !== 'neutral'){
      cellCount += delta*0.001;
      }
    }

    function getId () {
        return id;
    }

    function attack (map){


      for (const planet of map.values()) {
        planet.setSelectedBy(null);
        console.log("planet.getControlledBy() " + planet.getControlledBy());
        if(planet.getControlledBy()===controlledBy){

          if(planet.getId() !== id){
              console.log("join");
              console.log("planet.getCellCountDivide() " +planet.getCellCount());
              console.log("cellCount " + cellCount );

              cellCount += planet.getCellCountDivide();
              console.log("cellCount join " + cellCount );
          }
        }
        else {
          console.log("cell count " + cellCount);
          console.log("planet.getCellCountDivide() " +planet.getCellCount());
          cellCount += -planet.getCellCountDivide();
          console.log("fight");
          console.log("cellCount attack " + cellCount );

          if(cellCount<0){
            console.log("planet.getControlledBy() " + planet.getControlledBy());
            cellCount = Math.floor(Math.abs(cellCount));
            controlledBy = planet.getControlledBy();
            color = planet.getColor()
            console.log("cellCount change over " + cellCount );

            console.log("controlledBy " + controlledBy);
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
