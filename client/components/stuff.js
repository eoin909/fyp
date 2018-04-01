const x1 = 300;
const y1 = 300;
const x2 = 600;
const y2 = 600;

function calAngle () {
	return Math.atan2((y2-y1), (x2 - x1));
}

function calDistance () {
  return Math.sqrt( ( (x1-x2) * (x1-x2) ) + ( (y1-y2) * (y1-y2) ) );
}

//x += speed * Math.cos(angle) * (delta / 1000);

console.log(calAngle());
let angle = calAngle();
console.log(calDistance());
let travelledDistance = 0;
let speed = 200;
let x=0;
let y=0;
console.log(Math.cos(calAngle()));

function update(delta){
  travelledDistance += speed * (delta / 1000);
  console.log("speed * Math.cos(angle) * (delta / 1000) " + speed * Math.cos(angle) * (delta / 1000));
  console.log("speed * Math.sin(angle) * (delta / 1000) " + speed * Math.sin(angle) * (delta / 1000));

  x += speed * Math.cos(angle) * (delta / 1000);
  y += speed * Math.sin(angle) * (delta / 1000);

  console.log("x " + x);
  console.log("y " + y);
}
//expected output: 45

//console.log(calcAngleDegrees(10, 10));
//expected output: 45

//console.log(calcAngleDegrees(0, 10));
//expected output: 90
