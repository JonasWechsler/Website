var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
var update_rate = 10;

var CENTER_X = canvas.width/2;
var CENTER_Y = canvas.height/2;
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var world = new World(WIDTH,HEIGHT);

var refresh = setInterval(function () {
  	world.populate();
  	world.setBounds();
  	world.stepPhysics();
		world.draw(ctx);
}, update_rate);

function reset(){
  clearInterval(refresh);
  doit();
}