var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");

canvas.width = screen.width;
canvas.height = screen.height;

var t = 0;

function Point(x, y) {
  this.x = x;
  this.y = y;
}

var getColorAt = function(x, y) {
  var r = Math.round(Math.sin(x / 10) * Math.sin(x / 10) * 255);
  var g = Math.round(Math.sin(y / 10) * Math.sin(y / 10) * 255);

  //return "rgb(" + r  + "," + g + "," + 100 + ")";
  return '#' + Math.floor((x * y * 15485863 % 1000 + 100) / 1100 * 16777215).toString(16);
}

var getHeightAt = function(x, y) {
  return (Math.abs(Math.sin(t / 100 + x * y * 15485863 % 1000 / 1000) * 4 + 2));
  //return Math.abs(Math.sin(x / 4 + t/100) * Math.cos(y/5 + t/180)* Math.cos(y/4 + t/180) * 3);
  //return 1;
}

var drawTile = function(color, x, y, height) {
  var left = new Point(x, y + tile_height / 2),
    right = new Point(x + tile_width, y + tile_height / 2),
    top = new Point(x + tile_width / 2, y),
    bottom = new Point(x + tile_width / 2, y + tile_height);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(top.x, top.y - height);
  ctx.lineTo(right.x, right.y - height);
  ctx.lineTo(right.x, right.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.lineTo(left.x, left.y);
  ctx.lineTo(left.x, left.y - height);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

var drawBoard = function(cameraX,cameraY){
  for (i = 0; i < 2 * canvas.height / tile_height + 10; i++) {
    var offset_x;
    if (i % 2 == 1)
      offset_x = tile_width / 2;
    else
      offset_x = 0;

    for (j = 0; j < 2 * canvas.width / tile_width; j++) {
      var ax = j + Math.floor(cameraX),
        ay = i + Math.floor(cameraY) * 2,
        x = (j * tile_width) + offset_x - tile_width - (cameraX % 1) * tile_width,
        y = i * tile_height / 2 - tile_height - (cameraY % 1) * tile_height,
        h = getHeightAt(ax, ay) * tile_height / 2;
      drawTile(getColorAt(ax, ay),x,y,h,ax,ay);
    }
  }
}

var tile_width = 40;
var tile_height = 25;

var mouseX = 0;
var mouseY = 0;

canvas.addEventListener('mousemove', function(evt) {
  var rect = canvas.getBoundingClientRect();
  mouseX = evt.clientX - rect.left,
    mouseY = evt.clientY - rect.top
}, false);

setInterval(function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var mx = mouseX / 10,
    my = mouseY / 10;
  drawBoard(mx,my);
  
  ctx.fillText(mx + "," + my, 0, canvas.height - 10);

  t++;
}, 10);