var canvas = document.getElementById('graph');
var ctx = canvas.getContext('2d');
var WIDTH = 300;
var HEIGHT = 300;
var equations = [];
var fnames = [];

var reset = true;
var x_offset = 0,
    y_offset = 0;
var zoom = 1;
var oldx, oldy;
document.onmousedown = function (e) {
    canvas.onmousemove = function (e) {
        if (!oldx) oldx = e.x;
        if (!oldy) oldy = e.y;
        var dx = e.x - oldx;
        var dy = e.y - oldy;
        dx /= 20;
        dy /= 20;
        x_offset += dx;
        y_offset += dy;
        oldx = e.x;
        oldy = e.y;
        graph();
    }
}
document.onmouseup = function (e) {
    oldx = null;
    oldy = null;
    canvas.onmousemove = null;
}

function parseLine(line) {
    var equation = line.substr(line.indexOf('='));
    var funct = line.substr(0, line.indexOf('('));
    var lined = "function " + line.replace('=', '{return ') + ';}';
    equations.push(lined);
    fnames.push(funct);
    return lined;
}

function graph() {
    var functions = "";
    for (var f = 0; f < equations.length; f++) {
        functions += equations[f];
    }
    functions += "return [";
    for (var f = 0; f < fnames.length; f++) {
        functions += fnames[f] + "(x),";
    }
    functions.slice(0, -1);
    functions += "];";
    var grapher = new Function("x", functions);
    var cache = [];
    var min = Number.MAX_VALUE;
    var max = Number.MIN_VALUE;
    min = -10;
    max = 10;
    var xmin = -10 + x_offset;
    var xmax = 10 + x_offset;
    console.log(xmin, xmax);
    try {
        for (var x = xmin; x < xmax; x += .01) {
            var y = grapher(x);
            if (reset && false) {
                for (var yi = 0; yi < y.length; yi++) {
                    if (y[yi] < min || min === undefined) min = y[yi];
                    if (y[yi] > max || max === undefined) max = y[yi];
                }
            }
            cache.push({
                x: x,
                y: y
            });
        }
        reset = false;
        min += y_offset;
        max += y_offset;
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "black";
        for (var i = 0; i < cache[0].y.length; i++) {
            ctx.beginPath();
            ctx.moveTo(WIDTH - cache[0].x, HEIGHT - cache[0].y[i]);
            for (var j = 0; j < cache.length; j++) {
                var x0 = WIDTH * (cache[j].x - xmin) / (xmax - xmin);
                var y0 = HEIGHT * (cache[j].y[i] - min) / (max - min);
                if (isFinite(y0) && y0 < 1000000) ctx.lineTo(WIDTH - x0, HEIGHT - y0);
            }
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    } catch (e) {
        console.log(e);
    }
}

function parseLines(lines) {
    equations = [];
    fnames = [];
    for (var n = 0; n < lines.length; n++) {
        var line = parseLine(lines[n]);
        var funct = lines[n].substr(0, lines[n].indexOf('('));
    }
}
check = function () {
    reset = true;
    var lines = document.getElementById("input").value.split('\n');
    parseLines(lines);
    graph();
}
