'use strict';

function Planet ({ id, cellCount, controlledBy, color='#FFFFFF', selectedBy = null, x, y}) {

    let radius = 15;

    function update (delta, viruses) {
      if( controlledBy !== null && controlledBy !== 'neutral'){
        let virus = viruses.get(getControlledBy());
        cellCount += delta*(virus.getAgility())*0.00002;
      }
    }

    function getId () {
        return id;
    }

      function attack (bulletPlanetID, planetCellCount, bulletColor, targetStrength, planetStrength){

        if(bulletPlanetID === controlledBy){

          if(bulletPlanetID !== id){
            cellCount +=  planetCellCount*(planetStrength/targetStrength);
          }
        } else {
          cellCount += -planetCellCount*(planetStrength/targetStrength);
          if(cellCount < 0){
            cellCount = Math.floor(Math.abs(cellCount));
            controlledBy = bulletPlanetID;
            color = bulletColor;
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
      let num = (radius + cellCount*0.2 + 5);
      if(num > 50){
        num = 50;
      }
      return num;

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
