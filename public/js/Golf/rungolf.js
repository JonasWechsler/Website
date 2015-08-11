
/*Running*/
var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
canvas.width = 500;
canvas.height = 500;

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.round((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
    y: Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
  };
}

addStatic(new LineSegment(new Vector(100,200),new Vector(200,100)));
addStatic(new LineSegment(new Vector(200,100),new Vector(300,100)));
addStatic(new LineSegment(new Vector(300,100),new Vector(400,200)));
addStatic(new LineSegment(new Vector(400,200),new Vector(400,400)));
addStatic(new LineSegment(new Vector(400,400),new Vector(200,400)));
addStatic(new LineSegment(new Vector(200,400),new Vector(100,300)));
addStatic(new LineSegment(new Vector(100,300),new Vector(100,200)));

/*
addStatic(new LineSegment(new Vector(200,300),new Vector(220,320)));
addStatic(new LineSegment(new Vector(220,320),new Vector(200,340)));
addStatic(new LineSegment(new Vector(200,340),new Vector(180,320)));
addStatic(new LineSegment(new Vector(180,320),new Vector(200,300)));

addStatic(new LineSegment(new Vector(300,200),new Vector(320,220)));
addStatic(new LineSegment(new Vector(320,220),new Vector(300,240)));
addStatic(new LineSegment(new Vector(300,240),new Vector(280,220)));
addStatic(new LineSegment(new Vector(280,220),new Vector(300,200)));

addStatic(new LineSegment(new Vector(300,300),new Vector(320,320)));
addStatic(new LineSegment(new Vector(320,320),new Vector(300,340)));
addStatic(new LineSegment(new Vector(300,340),new Vector(280,320)));
addStatic(new LineSegment(new Vector(280,320),new Vector(300,300)));

addStatic(new LineSegment(new Vector(200,200),new Vector(220,220)));
addStatic(new LineSegment(new Vector(220,220),new Vector(200,240)));
addStatic(new LineSegment(new Vector(200,240),new Vector(180,220)));
addStatic(new LineSegment(new Vector(180,220),new Vector(200,200)));
*/

addDynamic(new DynamicBall(new Vector(100,250), 10, new Vector(0,10)));
addDynamic(new DynamicBall(new Vector(340,340), 10, new Vector(-10,10)));

addFixed(new Spinner(new Vector(250,250)));
addFixed(new Spinner(new Vector(250,200)));
//addFixed(new Spinner(new Vector(250,400)));
//addFixed(new Spinner(new Vector(400,400)));
//addDynamic(new DynamicBall(new Vector(400,400), 10, new Vector(1,1)));
//addDynamic(new DynamicBall(new Vector(360,360), 10, new Vector(10,-10)));

setAcceleration(function(x,y){
  return new Vector(-1*(x-canvas.width/2),-1*(y-canvas.width/2)).divided(100);
  //return new Vector(0,1);
})

setInterval(function() {

  stepPhysics();
  drawPhysics(ctx);
}, 20);