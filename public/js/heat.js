var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");

canvas.width = screen.width;
canvas.height = screen.height;

var scale = 15;
var width = canvas.width / scale;
var height = canvas.height / scale;

var grid = new WaveGrid(width, height);


function relMouseCoords(canvas,event){
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
  	return {x:x,y:y};
}

var mouseX = 0;
var mouseY = 0;
var mouseDown = false;

canvas.addEventListener('mousedown', function(e){
  mouseDown = true;
});

canvas.addEventListener('mousemove', function(e){
  var point = relMouseCoords(canvas,e);
  mouseX = Math.floor(point.x/scale);
  mouseY = Math.floor(point.y/scale);
});

canvas.addEventListener('mouseup', function(e){
  mouseDown = false;
});

function frame() {
  if(mouseDown){
    grid.speed(mouseX,mouseY,1000);
  }
  grid.step();
  ctx.clearRect(0,0,canvas.width,canvas.height);
  grid.forEach(function(val, x, y) {
    var h = Math.floor(Math.abs(val.position*10 % 360));
    var s = "90%";
    var l = Math.abs(val.position);
    if(l < -50) l = -50;
    if(l > 50) l = 50;
    l = (100-l) + "%";
    l = "75%";
    ctx.fillStyle = "hsl(" + h + "," + s + "," + l + ")";
    ctx.fillRect(x * scale, y * scale, scale, scale);
  });
  window.requestAnimationFrame(frame);
}
frame();

function WaveGrid(w, h) {
  this.width = w;
  this.height = h;
  var self = this;

  var targetHeight = 0;

  var grid = [];
  var springCoefficient = .00001;
  var mass = 1;

  // spring stuff
  var tension = .025,
    dampening = .025,
    spread = .025;
  
  var hypotenuse = 1/Math.sqrt(2);

  for (var x = 0; x < self.width; x++) {
    grid[x] = [];
    for (var y = 0; y < self.height; y++) {
      grid[x][y] = {};
      grid[x][y].x = 0;
      grid[x][y].dx = 0;
      grid[x][y].ddx = 0;
    }
  }
  var stepSelf = function() {
    for (var x = 0; x < self.width; x++) {
      for (var y = 0; y < self.height; y++) {
        var deltax = targetHeight - grid[x][y].x;
        grid[x][y].ddx = tension * deltax - grid[x][y].dx * dampening
        grid[x][y].dx += grid[x][y].ddx;
        grid[x][y].x += grid[x][y].dx;
      }
    }
  }

  var stepNeighbors = function() {
    var newGrid = [];
    for (var j = 0; j < 4; j++) {
      for (var x = 0; x < self.width; x++) {
        if (!newGrid[x]) newGrid[x] = [];
        for (var y = 0; y < self.height; y++) {
          if (!newGrid[x][y]) newGrid[x][y] = {
            x: grid[x][y].x,
            dx: grid[x][y].dx,
            ddx: grid[x][y].ddx
          };

          var del = delta(x, y);
          newGrid[x][y].x += del;
          newGrid[x][y].dx += del;
        }
      }
    }
    grid = newGrid;
  }

  this.step = function() {
    stepSelf();
    stepNeighbors();
  }

  var adjacent = function(x, y) {
    var points = [{
      x: x - 1,
      y: y,
      c: 1
    }, {
      x: x + 1,
      y: y,
      c: 1
    }, {
      x: x,
      y: y - 1,
      c: 1
    }, {
      x: x,
      y: y + 1,
      c: 1
    }, {
      x: x - 1,
      y: y - 1,
      c: hypotenuse
    }, {
      x: x + 1,
      y: y + 1,
      c: hypotenuse
    }, {
      x: x + 1,
      y: y - 1,
      c: hypotenuse
    }, {
      x: x - 1,
      y: y + 1,
      c: hypotenuse
    }];

    for (var i = 0; i < points.length; i++) {
      var val = points[i];
      if (val.x < 0 || val.x >= self.width ||
        val.y < 0 || val.y >= self.height) {
        points.splice(i, 1);
        i--;
      }
    }
    return points;
  }

  var delta = function(x, y) {
    var forceSum = 0;
    adjacent(x, y).forEach(function(val) {
      var ax = val.x;
      var ay = val.y;
      var del = spread * (grid[ax][ay].x - grid[x][y].x);
      forceSum += del * val.c;
    });
    return forceSum;
  }

  this.position = function(x, y, val) {
    val = Math.round(val);
    if (x >= self.width)
      throw x + " is too large";
    if (x < 0)
      throw x + " is too small";
    if (y >= self.height)
      throw y + " is too large";
    if (y < 0)
      throw y + " is too small";
    
    if (val !== undefined) grid[x][y].x = val;
    
    return grid[x][y].x;
  }

  this.speed = function(x, y, val) {
    val = Math.round(val);
    if (x >= self.width)
      throw x + " is too large";
    if (x < 0)
      throw x + " is too small";
    if (y >= self.height)
      throw y + " is too large";
    if (y < 0)
      throw y + " is too small";
    
    if (val !== undefined) grid[x][y].dx = val;
    return grid[x][y].dx;
  }

  this.acceleration = function(x, y, val) {
    if (val !== undefined) grid[x][y].ddx = val;
    return grid[x][y].ddx;
  }

  this.forEach = function(callback) {

    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        callback({
            position: grid[x][y].x,
            speed: grid[x][y].dx,
            acceleration: grid[x][y].ddx
          },
          x, y);
      }
    }
  }
}

disableResize();