'use strict';
//white neutral
const COLOR = '#FFFF00';

function draw (ctx, planets) {
    let lineToMap = new Map();

    let bar = new Map();
    let colorMap = new Map();



    let total = 0;
    for (const planet of planets) {
        ctx.fillStyle = planet.getColor();
        ctx.strokeStyle= planet.getColor();

        const { x, y } = planet.getPosition();
        const cellCount = planet.getCellCount();
        let radius = planet.getRadius() + cellCount*0.2;

        if(radius > 45)
        radius=45;

        //const cellCount = planet.getCellCount();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x,y, radius*0.5,0,2*Math.PI);
        ctx.fill();


        ctx.beginPath();
        ctx.fillStyle = "#000000";

        if (cellCount < 10){
          ctx.fillText(cellCount, x-3.25, y+4);
        } else if (cellCount < 100){
          ctx.fillText(cellCount, x-6.5, y+4);
        } else {
          ctx.fillText(cellCount, x-10, y+4);
        }
        ctx.fill();

        const control = planet.getControlledBy();

        if (control !== 'neutral'){

          if(bar.has(control)){
            let value = bar.get(control);
            bar.set(control, (value + cellCount));
          } else {
            bar.set(control, cellCount);
            colorMap.set(control, planet.getColor());
          }
          total += cellCount;


        }

        if (planet.getSelectedBy()!==null){
          ctx.beginPath();
          ctx.strokeStyle= COLOR;
          ctx.arc(x,y, radius+3,0,2*Math.PI);
          ctx.stroke();
          //console.log("planet.getSelectedBy() " + planet.getSelectedBy());
          //array[planet.getSelectedBy()] = planet;
          lineToMap.set(planet.getSelectedBy(), planet);
        }
      }
      let posX = 0
      for (const key of bar.keys()) {
        console.log("key " + key);

        console.log("posX " + posX);
        console.log("total " + total);
        ctx.beginPath();
        ctx.moveTo(posX,0);
        console.log("bar.get(key) " +bar.get(key));
        ctx.lineWidth=10;
        posX += (bar.get(key)/total)*1200;
        console.log("posX " + posX);
        console.log("colorMap " + colorMap.get(key));
        ctx.strokeStyle= colorMap.get(key);

        ctx.lineTo(posX,0);
        ctx.stroke();
        ctx.lineWidth =1;

      }
    //  if (array.length>1){
    //    console.log("array length " + lineToMap.size);
      //  console.log(array);
        // for (var i = 1; i < lineToMap.size; i++) {
        //
        //   if( lineToMap.has( (i).toString() ) && lineToMap.has( (i + 1).toString() ) ){
        //     //console.log(lineToMap.get(i));
        //     const {x1 , y1} = lineToMap.get( (i).toString() ).getPosition();
        //     const {x2 , y2} = lineToMap.get( (i+1).toString() ).getPosition();
        //     console.log("inside loop");
        //     console.log('x2 ' + x2  + " y2 " + y2);
        //     console.log('x1 ' + x1  + " y1 " + y1);
        //
        //     ctx.strokeStyle= COLOR;
        //     ctx.beginPath();
        //     ctx.moveTo(x1,y1);
        //     ctx.lineTo(x2,y2);
        //     ctx.stroke();
        //   }
        // }
      //}
}

module.exports = draw;
