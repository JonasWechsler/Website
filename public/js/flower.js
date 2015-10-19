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

var f_diam = 200; //flower diameter
var l_len = 80; //leaf length
var sections = 10;
var layers = 3;

var default_f_diam = f_diam;
var default_l_len = l_len;
var default_sections = sections;
var default_layers = layers;
var default_product = default_f_diam * default_l_len * default_sections * default_layers;

var flowers_files = [];

function nonBlockFor(start,end,increment,execute,delay){
  var i=start;
  if(i < end){
    setTimeout(function(){
      execute(i);
      nonBlockFor(i+increment,end,increment,execute,delay);
    },delay);
  }
}

function generate() {
  ctx.save();
    var h = Math.floor(Math.random() * 360);
    var s = Math.floor(Math.random() * 100);
    var l = Math.floor(Math.random() * 100);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    for (var i = 0; i < canvas.width; i++) {
        ctx.fillStyle = "hsl(" + Math.floor(i * 360 / canvas.width) + "," + s + "%," + l + "%)";
        ctx.fillRect(i, 0, 1, 10);
    }
    //for (var a = 0; a < screen.width / f_diam - 1; a++) 
    nonBlockFor(0,canvas.width/f_diam - 1,1,function(a){
        h += 1.61803398875 * 360;
        h %= 360;
        var gen = new LeafGenerator(l_len, l_len, function() {
            h += Math.floor(Math.random() * 10 - 5);
            return "hsl(" + h + ", " + s + "%, " + l + "%)";
        });
        var flower = new FlowerGenerator(f_diam, sections, layers);
        var leaf = gen.generate();
        //for (var i = 0; i < screen.height / f_diam - 1; i++) {
        nonBlockFor(0,canvas.height/f_diam - 1,1,function(i){
            var x = f_diam / 4 + a * f_diam;
            var y = f_diam / 4 + i * f_diam;
            ctx.clearRect(x,y,f_diam,f_diam);
            ctx.drawImage(flower.generate(leaf, h, s, l), x, y);
        },1);
    },1);
    ctx.restore();
}

generate();

function usergen(){
  f_diam = parseInt(getRange(0).value);
  l_len = parseInt(getRange(1).value);
  sections = parseInt(getRange(2).value);
  layers = parseInt(getRange(3).value);

  generate();
}

var warning = document.createElement("div");
warning.innerHTML = "Warning: Large flowers can take a long time to generate";
warning.style.color = "red";
warning.style.display = "none";
addElement(warning);

function warn() {
    warning.style.display = "block";
}

function nowarn() {
    warning.style.display = "none";
}

addRange("Flower Diameter", 20, 300, 1, function(r) {
    if (r * l_len * sections * layers > default_product)
        warn();
    else
        nowarn();
    return r;
});
addRange("Petal Length", 20, 100, 1, function(r) {
    if (f_diam * r * sections * layers > default_product)
        warn();
    else
        nowarn();
    return r;
});
addRange("Number of Petals", 4, 20, 1, function(r) {
    if (f_diam * l_len * r * layers > default_product)
        warn();
    else
        nowarn();
    return r;
});
addRange("Number of Layers", 1, 4, 1, function(r) {
    if (f_diam * l_len * sections * r > default_product)
        warn();
    else
        nowarn();
    return r;
});

setRange(0, f_diam);
setRange(1, l_len);
setRange(2, sections);
setRange(3, layers);

var button = document.createElement("button");
button.innerHTML = "Regenerate";
button.onclick = usergen;
addElement(button);