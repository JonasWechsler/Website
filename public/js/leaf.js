function LeafGenerator(d, s, c) {
  var width = d,
    sections = s,
    color = c;

  //virtual canvas
  var vcanvas = document.createElement("canvas");
  vcanvas.width = d;
  vcanvas.height = d;
  var vctx = vcanvas.getContext("2d");

  var rndFloat = function(min, max) {
    return (Math.random() * (max - min) + min).toFixed(1);
  }

  var distance = function(point1, point2) {
    var xs = 0;
    var ys = 0;
    xs = point2.x - point1.x;
    xs = xs * xs;
    ys = point2.y - point1.y;
    ys = ys * ys;
    var res = Math.sqrt(xs + ys);
    return res;
  }

  var origin = function() {
    return {
      x: width / 2,
      y: width / 2
    };
  }

  this.getWidth = function() {
    return width;
  }
  this.getResolution = function() {
    return sections;
  }
  this.getColor = function() {
    return color;
  }

  this.setWidth = function(w) {
    width = w;
  }
  this.setResolution = function(r) {
    sections = r;
  }
  this.setColor = function(c) {
    color = c;
  }

  this.generate = function() {
    vctx.clearRect(0, 0, width, width);

    var colo = color();

    // plot random fractional/float points in the grid
    var points = [];

    for (var i = 0; i < sections; i++) {
      var newPoint = {
        x: rndFloat(0, width - 1),
        y: rndFloat(0, width - 1)
      };
      points[i] = newPoint;
    }

    for (var y = 0; y < width; y++) {
      for (var x = 0; x < width; x++) {
        var closest, closestDist = 9999999;
        for (var i = 0; i < sections; i++) {
          var dist = distance({
            x: x + 0.5,
            y: y + 0.5
          }, points[i]);
          if (dist < closestDist) {
            closest = points[i];
            closestDist = dist;
          }
        }
        if (distance(origin(), closest) < width / 4) {
          vctx.fillStyle = colo;
          vctx.fillRect(x, y, 1, 1);
        }
      }
    }
    return vcanvas;
  }
}

function FlowerGenerator(d, s, l) {
  var width = d,
    sections = s,
    layers = l;

  var nextGaussian = function() {
    return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
  }

  this.getWidth = function() {
    return width;
  }
  this.getResolution = function() {
    return sections;
  }
  this.getColor = function() {
    return color;
  }

  this.setWidth = function(w) {
    width = w;
  }
  this.setResolution = function(r) {
    sections = r;
  }
  this.setColor = function(c) {
    color = c;
  }

  var hue_shift = function(canvas) {
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    var r = Math.floor(nextGaussian() * 50),
      g = Math.floor(nextGaussian() * 50),
      b = Math.floor(nextGaussian() * 50);

    for (var i = 0; i < data.length; i += 4) {
      data[i] += Math.floor(Math.random() * 10 - 5) + r;
      data[i + 1] += Math.floor(Math.random() * 10 - 5) + g;
      data[i + 2] += Math.floor(Math.random() * 10 - 5) + b;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  this.generateRing = function(leaf, radius) {
    var vcanvas = document.createElement("canvas");
    vcanvas.width = width;
    vcanvas.height = width;
    var vctx = vcanvas.getContext("2d");

    var x = width / 2;
    var y = width / 2;
    for (var i = 0; i < sections; i++) {
      hue_shift(leaf);
      vctx.translate(x, y);
      vctx.rotate(Math.PI * 2 * i / sections);
      vctx.drawImage(leaf, -1 * (radius / 2), -1 * (radius / 2), (width / 2), (width / 2));
      vctx.rotate(Math.PI * -2 * i / sections);
      vctx.translate(-x, -y);
      2
    }
    return vcanvas;
  }

  this.generate = function(leaf, h, s, l) {
    var vcanvas = document.createElement("canvas");
    vcanvas.width = width;
    vcanvas.height = width;
    var vctx = vcanvas.getContext("2d");

    for (var a = 0; a < layers; a++) {
      h += 1.61803398875 * 360;
      h %= 360;
      vctx.drawImage(this.generateRing(leaf, (layers - a) * 10), 0, 0);
    }

    return vcanvas;
  }
}

var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");

canvas.width = screen.width;
canvas.height = screen.height;

var f_diam = 200;//flower diameter
var l_len = 80;//leaf length
var sections = 10;
var layers = 3;

var flowers_files = [];

function generate() {
  var h = Math.floor(Math.random() * 360);
  var s = Math.floor(Math.random() * 100);
  var l = Math.floor(Math.random() * 100);
  
  for (var i = 0; i < canvas.width; i++) {
    ctx.fillStyle = "hsl(" + Math.floor(i * 360 / canvas.width) + "," + s + "%," + l + "%)";
    ctx.fillRect(i, 0, 1, 10);
  }

  for (var a = 0; a < screen.width / f_diam - 1; a++) {
    h += 1.61803398875 * 360;
    h %= 360;
    var gen = new LeafGenerator(l_len, l_len, function() {
      h += Math.floor(Math.random() * 10 - 5);
      return "hsl(" + h + ", " + s + "%, " + l + "%)";
    });
    var flower = new FlowerGenerator(f_diam, sections, layers);
    var leaf = gen.generate();
    for (var i = 0; i < screen.height / f_diam - 1; i++) {
      ctx.drawImage(flower.generate(leaf, h, s, l), f_diam/4, f_diam/4 + i * f_diam);
    }
    ctx.translate(f_diam, 0);
  }
}

generate();