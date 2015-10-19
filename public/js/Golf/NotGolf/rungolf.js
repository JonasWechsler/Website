
/*Running*/
var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
canvas.width = 450;
canvas.height = 900;
canvas.width = screen.width;
canvas.height = screen.height;

var world = new World(canvas.height);
var plants = new Plant();
plants.setLength(25).setIterations(3);

document.addEventListener('keydown', function(e) {
  var char = String.fromCharCode(e.keyCode);
  switch (char) {
    case 'A':
      setAcceleration(function(x,y){return new Vector(-.03,.02)});
      break;
    case 'D':
      setAcceleration(function(x,y){return new Vector(.03,.02)});
      break;
  }
}, false);

function draw(){
	stepPhysics();
	drawPhysics(ctx);
	window.requestAnimationFrame(draw);
}

document.addEventListener('keyup', function(e) {
  var char = String.fromCharCode(e.keyCode);
  switch (char) {
    case 'A':
      setAcceleration(function(x,y){return new Vector(0,.02)});
      break;
    case 'D':
      setAcceleration(function(x,y){return new Vector(0,.02)});
      break;
  }
}, false);

setInterval(function() {
  stepPhysics();
}, 10);

function draw() {
  drawPhysics(ctx);
  window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);


