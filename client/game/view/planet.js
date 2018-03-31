'use strict';
//white neutral
const COLOR = '#FFFFFF';

function draw (ctx, planets) {
  //console.log("size of render planets " + planets.length);
    for (const planet of planets) {
        ctx.fillStyle = '#FF0000';
        ctx.strokeStyle= '#FF0000';

//console.log("sljflsajf " + planet.getControlledBy());
        if (planet.getControlledBy()==="neutral"){
      //    console.log("neutral");
          ctx.fillStyle = COLOR;
          ctx.strokeStyle= COLOR;
        }

        const { x, y } = planet.getPosition();
        const radius = planet.getRadius();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x,y, radius*0.5,0,2*Math.PI);
        ctx.fill();


        ctx.beginPath();
        ctx.fillStyle = "#000000";
        let cellCount = planet.getCellCount();

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
