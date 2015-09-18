var map_canvas = document.createElement("canvas");
var ctx = map_canvas.getContext("2d");

var debug_canvas = document.createElement("canvas");
var debug = debug_canvas.getContext("2d");

map_canvas.width = 128;
map_canvas.height = 128;

var width = map_canvas.width;
var height = map_canvas.height;

debug_canvas.width = width;
debug_canvas.height = height;

function gaussian(){
  return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

/**
 *Persistence, e.g. 1/2, 1/4...
 */
function NormalTerrain(width, persistence, iterations, frequency) {
  if (persistence <= 0 || persistence >= 1) {
    throw new Exception("0<p<1");
  }
  var w = width;
  var p = persistence;
  var iter = iterations;
  var f = frequency;
  var interp = function(f00, f10, f01, f11, x, y) {
    var a00 = f00;
    var a10 = f10 - f00;
    var a01 = f01 - f00;
    var a11 = f11 + f00 - (f10 + f01);
    return a00 + a10 * x + a01 * y + a11 * x * y;
  }
  var generateFunction = function(amplitude, frequency) {
    var map = [];
    for (var i = 0; i < frequency; i++) {
      map[i] = [];
      for (var j = 0; j < frequency; j++) {
        map[i][j] = Math.random() * amplitude;
      }
    }
    return map;
  }

  var generatePerlin = function(amplitude, frequency) {
    var layers = [];
    var max = 0;
    for (var i = 0; i < iter; i++) {
      layers[i] = generateFunction(amplitude, frequency);
      max += amplitude;
      amplitude *= persistence;
      frequency /= persistence;
    }
    var map = [];
    for (var x = 0; x < width; x++) {
      map[x] = [];
      for (var y = 0; y < width; y++) {
        map[x][y] = 0;
        /*Iterate through layers*/
        for (var it = 0; it < iter; it++) {
          /*Iterate through layer*/
          var left = Math.floor((layers[it].length - 1) * x / width);
          var top = Math.floor((layers[it][0].length - 1) * y / width);

          if (!layers[it][left + 1] || !layers[it][left][top + 1]) {
            continue;
          }

          var f00 = layers[it][left][top];
          var f10 = layers[it][left + 1][top];
          var f01 = layers[it][left][top + 1];
          var f11 = layers[it][left + 1][top + 1];

          var square_width = width * 1 / (layers[it].length - 1);

          map[x][y] += interp(f00, f10, f01, f11, (x % square_width) / square_width, (y % square_width) / square_width) / max;
        }
      }
    }
    return map;
  }
  this.generate = function(){
    return generatePerlin(1,f);
  }
}

var distance = function( point1, point2 ) {
  var xs = 0;
  var ys = 0;
  xs = point2.x - point1.x;
  xs = xs * xs;
  ys = point2.y - point1.y;
  ys = ys * ys;
  var res = Math.sqrt( xs + ys );
  return res;
}

var origin = function(){
  return {x:width/2,y:width/2};
}
    
var terr = new NormalTerrain(width, 1 / 2, 5, 5);
var bio = new NormalTerrain(width, 1 / 2, 5, 5);
var map0 = bio.generate();
var map1 = bio.generate();
var map2 = terr.generate();

var seaLevel = Math.random();
var mountainLevel = 1;
var base = 125;

var color = function(a, b, h) {
  var tundra = "#C8DFE8";
  var sand = "#E0C08D";
  var hotsand = "#F5DFA5";
  var wetsand = "#BCB38C";
  var forest = "#48A882";
  var darkforest = "#317259";
  var swamp = "#0C7871";
  var water = "#04AEBA";
  var ice = "#EEEEFF";
  
  var red = "#FF4971";
  var orange = "#EF8A6B";
  var yellow = "#EFED6B";
  var green = "#71FF49";
  var lime = "#5B9B36";
  var blue = "#6B6EEF";
  var purple = "#8E2071";
  
  if(a==0 && b==0)
    return water;
  
  if(h){
    if(h < .6)
      return water;
    if(h < .65)
      return sand;
    if(h > .9)
      return ice;
  }
  
  if(b < .3)
    return tundra;
  if(a > .5)
    return hotsand;
  else
    if(a > .35)
      if(b > .5)
        if(b < .55)
          return forest;
        else
          return darkforest;
      else
        return sand;
    else
      if(b > .5)
        return swamp;
      else 
        return wetsand;
}

var terrain = [];
for (var x = 1; x < width - 1; x++) {
  terrain[x] = [];
  for (var y = 1; y < width - 1; y++) {
    terrain[x][y] = (-.5*Math.pow(distance(origin(),{x:x,y:y})*2/width,2)) + map2[x][y];
      /*(map2[x + 1][y] +
      map2[x][y + 1] +
      map2[x - 1][y] +
      map2[x][y - 1] +
      map2[x][y]) / 5;*/
  }
}
var min = 1;
var max = 0;
for (var x = 2; x < width - 2; x++)
  for (var y = 2; y < width - 2; y++){
    min = Math.min(min,terrain[x][y]);
    max = Math.max(max,terrain[x][y]);
  }


max -= min;

for (var x = 2; x < width - 2; x++)
    for (var y = 2; y < width - 2; y++){
      terrain[x][y]-=min;
      terrain[x][y]/=max;
    }
      
var sigma0 = 0;
var sigma1 = 0;

for (var x = 1; x < width-1; x++) {
  for (var y = 1; y < width-1; y++) {
    var val0 = map0[x][y],
      val1 = map1[x][y],
      sum = val0 + val1;
    
    sigma0 += val0;
    sigma1 += val1;
    
    if (sum > 1) {
      val0 /= sum;
      val1 /= sum;
    }
    ctx.fillStyle = color(val0, val1);
    debug.fillStyle = ctx.fillStyle;
    if (terrain[x][y] < .6) {
      ctx.fillStyle = "#04AEBA";
    }
    if (terrain[x][y] > .9) {
      ctx.fillStyle = "#EEEEFF";
    }
    debug.fillRect(Math.floor(val0*height),Math.floor(val1*width),1,1);
    ctx.fillRect(x, y, 1, 1);
  }
}

var mean0 = sigma0/(width*width);
var mean1 = sigma1/(width*width);

var stddev0 = 0;
var stddev1 = 0;

for (var x = 0; x < width; x++)
  for (var y = 0; y < width; y++){
    var d0 = map0[x][y] - mean0;
    var d1 = map1[x][y] - mean1;
    stddev0+=d0*d0;
    stddev1+=d1*d1;
  }

stddev0 /= width*width;
stddev1 /= width*width;

debug.fillStyle = "black";
debug.fillText(mean0,0,10);
debug.fillText(mean1,0,20);
debug.fillText(stddev0,0,30);
debug.fillText(stddev1,0,40);

/**/

var canvas = document.getElementById("draw");
var isoctx = canvas.getContext("2d");

canvas.width = screen.width;
canvas.height = screen.height;

function Point(x, y) {
  this.x = x;
  this.y = y;
}

var drawTile = function(color, x, y, height) {
  if(height == 0)
    return;
  var left = new Point(x, y + tile_height / 2),
    right = new Point(x + tile_width, y + tile_height / 2),
    top = new Point(x + tile_width / 2, y),
    bottom = new Point(x + tile_width / 2, y + tile_height);
  isoctx.fillStyle = color;
  isoctx.beginPath();
  isoctx.moveTo(top.x, top.y - height);
  isoctx.lineTo(right.x, right.y - height);
  isoctx.lineTo(right.x, right.y);
  isoctx.lineTo(bottom.x, bottom.y);
  isoctx.lineTo(left.x, left.y);
  isoctx.lineTo(left.x, left.y - height);
  isoctx.closePath();
  isoctx.stroke();
  isoctx.fill();
  //isoctx.fillStyle = "black";
  //isoctx.fillText(height,x,y-height);
}

var getHeightAt = function(x,y){
  x = Math.floor(x);
  y = Math.floor(y);
  
  if(terrain[x] && terrain[x][y])
    return terrain[x][y];
  else
    return 0;
}

var getColorAt = function(x,y, height){
  x = Math.floor(x);
  y = Math.floor(y);
  
  var val0, val1, sum;
  if(map0[x] && map0[x][y])
    val0 = map0[x][y];
  else
    val0 = 0;
  if(map1[x] && map1[x][y])
    val1 = map1[x][y];
  else
    val1 = 0;
  
  sum = val0 + val1;
  
  if (sum > 1) {
      val0 /= sum;
      val1 /= sum;
  }
  
  return color(val0,val1, height);
}

var drawBoard = function(cameraX,cameraY){
  var midI = 2 * canvas.height / tile_height,
      midJ = canvas.width / tile_width,
      midX = midJ + Math.floor(cameraX),
      midY = midI + Math.floor(cameraY),
      midH = Math.max(getHeightAt(midX,midY)-.6,0)* 30 * tile_height / 2;
  
  for (i = 0; i < 2 * canvas.height / tile_height + 10; i++) {
    var offset_x;
    if (i % 2 == 1)
      offset_x = tile_width / 2;
    else
      offset_x = 0;

    for (j = 0; j < 2 * canvas.width / tile_width; j++) {
      var ax = j + Math.floor(cameraX),
        ay = i + Math.floor(cameraY) * 2;

      var  x = (j * tile_width) + offset_x - tile_width - (cameraX % 1) * tile_width,
        y = i * tile_height / 2 - tile_height - (cameraY % 1) * tile_height,
        h = Math.max(getHeightAt(ax,ay)-.6,0)* 30 * tile_height / 2;
      drawTile(getColorAt(ax,ay,getHeightAt(ax,ay)),x,y + midH,h);
    }
  }
}

var tile_width = 20;
var tile_height = 12;

var mouseX = 0;
var mouseY = 0;

canvas.addEventListener('mousemove', function(evt) {
  var rect = canvas.getBoundingClientRect();
  mouseX = evt.clientX - rect.left,
    mouseY = evt.clientY - rect.top
}, false);

setInterval(function() {
  isoctx.fillStyle = color(0,0,0);
  isoctx.fillRect(0, 0, canvas.width, canvas.height);

  var mx = (mouseX - canvas.width/8)/16,
    my = (mouseY - canvas.height/2)/100;
  drawBoard(mx,my);
  //isoctx.fillStyle = "black";
  //isoctx.fillText(mx + "," + my, 0, canvas.height - 10);
}, 33);