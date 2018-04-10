'use strict';

const Planet = require('../lib/Planet');

function ServerMap ({ num }) {
  const map = new Map();
  let counter =0;
  let array = getMapArray(num);
  for (let i=0; i<array.length; i++){
    const planet = Planet.create({
        id:counter,
        cellCount: array[i].cellCount,
        controlledBy: 'neutral',
        x: array[i].x,
        y: array[i].y
    });
    map.set(counter, planet);
    counter++;
  }
  return map;
}

function getMapArray (id) {

  switch (id) {
    case 1 :
      return [
        //player positions
        { 'x': 60 ,'y': 340, 'cellCount' :8 },
        { 'x': 1140 ,'y': 340, 'cellCount' :8 },
        { 'x': 600 ,'y': 80, 'cellCount' :8 },
        { 'x': 600 ,'y': 600, 'cellCount' :8 },

        //neutrals
        { 'x': 60 ,'y': 60 ,'cellCount' :8 },
        { 'x': 60 ,'y': 620,'cellCount' :8 },
        { 'x': 240 ,'y': 480,'cellCount' :8 },
        { 'x': 240 ,'y': 200,'cellCount' :8 },
        { 'x': 340 ,'y': 340,'cellCount' :8 },
        { 'x': 1140 ,'y': 60 ,'cellCount' :8 },
        { 'x': 1140 ,'y': 620,'cellCount' :8 },
        { 'x': 960 ,'y': 480,'cellCount' :8 },
        { 'x': 960 ,'y': 200,'cellCount' :8 },
        { 'x': 860 ,'y': 340,'cellCount' :8 }
      ]
      break;
    case 2 :
      return [
        //player positions
        { 'x': 100 ,'y': 340, 'cellCount' :8 },
        { 'x': 1100 ,'y': 340, 'cellCount' :8 },
        { 'x': 600 ,'y': 100, 'cellCount' :8 },
        { 'x': 600 ,'y': 620, 'cellCount' :8 },
        //neutrals
        { 'x': 225 ,'y': 255 ,'cellCount' :8 },
        { 'x': 385 ,'y': 145,'cellCount' :8 },
        { 'x': 975 ,'y': 255,'cellCount' :8 },
        { 'x': 815 ,'y': 145,'cellCount' :8 },
        { 'x': 225 ,'y': 455 ,'cellCount' :8 },
        { 'x': 385 ,'y': 535,'cellCount' :8 },
        { 'x': 975 ,'y': 455,'cellCount' :8 },
        { 'x': 815 ,'y': 535,'cellCount' :8 }
      ]
    case 3 :
      return [
        //player positions
        { 'x': 55 ,'y': 60, 'cellCount' :8 },
        { 'x': 1105 ,'y': 575,'cellCount' :8 },
        { 'x': 1120 ,'y': 110, 'cellCount' :8 },
        { 'x': 70 ,'y': 610, 'cellCount' :8 },
        //neutrals
        { 'x': 180 ,'y': 160 ,'cellCount' :8 },
        { 'x': 520 ,'y': 275,'cellCount' :8 },
        { 'x': 225 ,'y': 520,'cellCount' :8 },
        { 'x': 850 ,'y': 615,'cellCount' :8 },
        { 'x': 630 ,'y': 425 ,'cellCount' :8 },
        { 'x': 765 ,'y': 110, 'cellCount' :8 },
        { 'x': 975 ,'y': 350,'cellCount' :8 },
        { 'x': 170 ,'y': 334, 'cellCount' :8 },
        { 'x': 500 ,'y': 590,'cellCount' :8 },
        { 'x': 500 ,'y': 730,'cellCount' :8 }
      ]
    case 4 :
      return [
        //player positions
        { 'x': 600 ,'y': 140, 'cellCount' :8 },
        { 'x': 600 ,'y': 540,'cellCount' :8 },
        { 'x': 400 ,'y': 340, 'cellCount' :8 },
        { 'x': 800 ,'y': 340, 'cellCount' :8 },
        //neutrals
        { 'x': 600 ,'y': 340 ,'cellCount' :8 },
        { 'x': 140 ,'y': 80,'cellCount' :8 },
        { 'x': 1060 ,'y': 80,'cellCount' :8 },
        { 'x': 140 ,'y': 600,'cellCount' :8 },
        { 'x': 1060 ,'y': 600 ,'cellCount' :8 },
        { 'x': 140 ,'y': 340,'cellCount' :8 },
        { 'x': 1060 ,'y': 340 ,'cellCount' :8 }
      ]
      break;
    default:
    return [
      //player positions
      { 'x': 60 ,'y': 340, 'cellCount' :8 },
      { 'x': 1140 ,'y': 340, 'cellCount' :8 },
      { 'x': 600 ,'y': 80, 'cellCount' :8 },
      { 'x': 600 ,'y': 600, 'cellCount' :8 },

      //neutrals
      { 'x': 60 ,'y': 60 ,'cellCount' :8 },
      { 'x': 60 ,'y': 620,'cellCount' :8 },
      { 'x': 240 ,'y': 480,'cellCount' :8 },
      { 'x': 240 ,'y': 200,'cellCount' :8 },
      { 'x': 340 ,'y': 340,'cellCount' :8 },
      { 'x': 1140 ,'y': 60 ,'cellCount' :8 },
      { 'x': 1140 ,'y': 620,'cellCount' :8 },
      { 'x': 960 ,'y': 480,'cellCount' :8 },
      { 'x': 960 ,'y': 200,'cellCount' :8 },
      { 'x': 860 ,'y': 340,'cellCount' :8 }
    ]
  }
}




module.exports = { create: ServerMap };
