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

      function attack (bulletPlanet, planetCellCount){


      //  for (const planet of map.values()) {
          bulletPlanet.setSelectedBy(null);
      //    console.log("planet.getControlledBy() " + planet.getControlledBy());
          if(bulletPlanet.getControlledBy()===controlledBy){

            if(bulletPlanet.getId() !== id){
      //            console.log("join");
      //            console.log("planet.getCellCountDivide() " +planet.getCellCount());
      //            console.log("cellCount " + cellCount );

                cellCount += planetCellCount;
      //          console.log("cellCount join " + cellCount );
            }
          }
          else {
      //          console.log("cell count " + cellCount);
      //        console.log("planet.getCellCountDivide() " +planet.getCellCount());
            cellCount += -planetCellCount;
            // console.log("fight");
            // console.log("cellCount attack " + cellCount );

            if(cellCount<0){
      //          console.log("planet.getControlledBy() " + planet.getControlledBy());
              cellCount = Math.floor(Math.abs(cellCount));
              controlledBy = bulletPlanet.getControlledBy();
              color = bulletPlanet.getColor()
      //          console.log("cellCount change over " + cellCount );

      //            console.log("controlledBy " + controlledBy);
            }
          }
        //}

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

    function getX () {
        return x;
    }

    function getY () {
        return y;
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
    //  console.log("select");
      selectedBy = playerCode;
    }

    function getColor () {
      return color;
    }

    function setNeutral () {
      controlledBy= 'neutral';
      color = "#FFFFFF";
    }
    function setVirus(virus) {
      controlledBy= virus.getId();
      color = virus.getColor();
    }

    function getRenderingRadius () {

      return (radius + cellCount*0.2 + 5)

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
        getRenderingRadius,
        getSelectedBy,
        getPosition,
        getRadius,
        setNeutral,
        getControlledBy,
        setVirus,
        getX,
        getY,
        getCellCountDivide,
        getId,
        toJSON
    });
}

module.exports = { create: Planet };
