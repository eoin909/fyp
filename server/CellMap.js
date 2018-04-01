'use strict';

const Planet = require('../lib/Planet');

function ServerMap ({ num }) {
  console.log("map selection " + num);
  const map = new Map();
  let counter =0;
  let array = getMapArray(0);
  for (let i=0; i<array.length; i++){

    const planet = Planet.create(
      {
        id:counter,
        cellCount: array[i].cellCount,
        controlledBy: 'neutral',
        x: array[i].x,
        y: array[i].y
      }
    );
    map.set(counter, planet);
    counter++;
  }

  return map;

}

function getMapArray (id) {

  switch (id) {
    case 0 :
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
    default:

  }

}




module.exports = { create: ServerMap };
