'use strict';

const COLOR = '#00FF00';

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
      //  console.log("id " + planet.getId() + " x: " + x + " y: " + y);

      //  console.log("x: " + x + " y: " + y);
        const radius = 20;

        ctx.beginPath();
      //  ctx.strokeStyle= COLOR;
        ctx.arc(x,y, radius,0,2*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillText("cell: " + planet.getCellCount() , x,y);
        ctx.fill();

//console.log("render state " + planet.getSelectedBy());
        if (planet.getSelectedBy()!==null){
          ctx.beginPath();
          ctx.strokeStyle= '#FFFF00';
          ctx.arc(x,y, radius+3,0,2*Math.PI);
          ctx.stroke();
        }

//        ctx.fillRect(x, y, width, height);
    }
}

module.exports = draw;
