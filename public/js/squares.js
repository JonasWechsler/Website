var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");

canvas.width  = screen.width;
canvas.height = screen.height;

var width = canvas.width;
var height = canvas.height;

paint();

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
  	return "rgb(" + Math.floor(r*255) + "," +
      Math.floor(g*255) + "," +
      Math.floor(b*255) + ")";
}

function drawCube(x,y,r,h,l){
  if(!h)h = .5;
  
  var ys = [];
  var xs = [];
  
  var draw_it = function(){
    	ctx.strokeStyle = HSVtoRGB(h,.5,.6);
      ctx.beginPath();
      ctx.moveTo(xs[0], ys[0]);
      for(var i=1;i<5;i++){
        ctx.lineTo(xs[i%4],ys[i%4]);
      }
      ctx.closePath();
    	if(!l)
      	ctx.fill();
    	else
        ctx.stroke();
  }
  
  ys[0] = y,
  ys[1] = y - Math.sin(Math.PI/6)*r,
  ys[2] = ys[1] + r,
  ys[3] = y + r;
  
  xs[0] = x,
  xs[1] = xs[0] + Math.cos(Math.PI/6)*r,
  xs[2] = xs[1],
  xs[3] = xs[0];

  ctx.fillStyle = HSVtoRGB(h,.5,.3);
  draw_it();
  
  xs[1] -= 2*Math.cos(Math.PI/6)*r;
  xs[2] = xs[1];
  
  ctx.fillStyle = HSVtoRGB(h,.5,.6);
  draw_it();
  
  var tx = xs[0];
  xs[0]=xs[1];
  xs[1] = tx;
  
  var ty = ys[0];
  ys[0] = ys[1];
  ys[1] = ty;
  
  xs[2] += Math.cos(Math.PI/6)*r*2;
  ys[2] = ys[0];
  ys[3] = ys[0] - r*.5;
  
  ctx.fillStyle = HSVtoRGB(h,.5,1);
  draw_it();
}

function paint(){
  var r = Math.random()*25+25;
  for(var x=0;x<width/r;x++)
    for(var y=0;y<height/r;y++){
      var x0 = (x+.5*(y%2))*Math.cos(Math.PI/6)*r*2;
      var y0 = y*r*1.5;
      var r0 = Math.random()*r;
      var h = Math.random();
      var l = Math.random()<.2;
      drawCube(x0,y0,r0,h,l);
    }
}