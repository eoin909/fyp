<!DOCTYPE html>
<html>
<body>

<canvas id="myCanvas" width="1200" height="1200" style="border:1px solid #d3d3d3;">
Your browser does not support the HTML5 canvas tag.</canvas>

<script>


var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

let cellCount = 200;
let centerX = 450;
let centerY = 350;
let bigRadius = 305;
let smallRadius = 20;
let counter=0;

ctx.beginPath();
ctx.arc(centerX, centerY, bigRadius, 0, 2 * Math.PI);
ctx.stroke();

let layerCount = getLayerCount();
console.log("layerCount " + layerCount);

let minus = getMinus(layerCount);
console.log("minus " + minus);

for (let i = 0; i <= layerCount; i++){
  for (var y = 0; y < layerCount; y++) {
    let smallY = centerY + (minus + y)*smallRadius*2;
    let smallX = centerX + (minus + i)*smallRadius*2;
    if(checkInsideCircle(smallX, smallY)){
      if ( counter < cellCount ){
        ctx.beginPath();
        ctx.arc(smallX, smallY, smallRadius, 0, 2 * Math.PI);
        ctx.stroke();
        counter++;
      }
    }
  }
}

function getMinus (count) {
    if ( (count % 2) !== 0){
      return (Math.floor(-count/2)) ;
    }
}
function checkRadius () {
  return (counter < cellCount);
}

function checkInsideCircle ( x1, y1 ) {
	let xConponent = (x1-centerX)*(x1-centerX);
  let yConponent = (y1-centerY)*(y1-centerY);
  let distance = Math.sqrt(xConponent + yConponent) + smallRadius;
  return (distance < bigRadius);
}

function getLayerCount () {
  let num = Math.floor(Math.sqrt(cellCount)+2)
  if ( (num % 2) === 0){
    num++;
  }
	return num;
}

console.log("radius " + checkRadius());
console.log("counter " + counter);
</script>

</body>
</html>
