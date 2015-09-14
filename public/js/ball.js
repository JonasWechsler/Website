var canvas = document.getElementById("draw");
var context = canvas.getContext("2d");

canvas.width=500;
canvas.height=500;

var RAD = 250;
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
var total_verts = 25;
var verts = [];

function set_verts(i){
  for(var v=0;v<total_verts;v++){
    var v0 = v%i;
    if(v>i)v0=0;
    var radians = Math.PI*2*(v0/i);
    verts[v] = {x:0,y:0};
    verts[v].x = (WIDTH/2) + Math.cos(radians)*RAD;
    verts[v].y = (HEIGHT/2) + Math.sin(radians)*RAD;
  }
}

function draw_verts(ctx){
  ctx.strokeStyle = "black";
  for(var v=0;v<total_verts;v++){
    for(var v0=0;v0<total_verts;v0++){
      ctx.beginPath();
      ctx.moveTo(verts[v].x,verts[v].y);
      ctx.lineTo(verts[v0].x,verts[v0].y);
      ctx.stroke();
    }
  }
  //ctx.fillText(current_verts,0,10);
}


var current_verts = 1;
var t = 0;

setInterval(function(){
  if(current_verts > total_verts)current_verts = 2;
  current_verts+=(5.01-1/(Math.abs(Math.sin(current_verts*Math.PI))+.2))*.01;
  // 5-1/(Math.abs(Math.sin(x*Math.PI))+.2)
  set_verts(current_verts);
  context.clearRect ( 0 , 0 , canvas.width, canvas.height );
  draw_verts(context);
  t+=.01;
},10);