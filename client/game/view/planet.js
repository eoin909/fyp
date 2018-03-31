'use strict';
//white neutral
//const COLOR = '#FFFFFF';

function draw (ctx, planets) {
  //console.log("size of render planets " + planets.length);
    for (const planet of planets) {
        ctx.fillStyle = planet.getColor();
        ctx.strokeStyle= planet.getColor();
//
// //console.log("sljflsajf " + planet.getControlledBy());
//         if (planet.getControlledBy()==="neutral"){
//       //    console.log("neutral");
//           ctx.fillStyle = COLOR;
//           ctx.strokeStyle= COLOR;
//         }

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

        if(cellCount<100){
          ctx.fillText(cellCount, x-6.5,y+4);
        }else{
          ctx.fillText(cellCount, x-10,y+4);
        }

        ctx.fill();


        if (planet.getSelectedBy()!==null){
          ctx.beginPath();
          ctx.strokeStyle= "#FFFF00";
          ctx.arc(x,y, radius+3,0,2*Math.PI);
          ctx.stroke();
        }
    }
}

module.exports = draw;
