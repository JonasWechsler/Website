function gaussian() {
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
    this.generate = function() {
        return generatePerlin(1, f);
    }
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

var waterHeight = .6;

var color = function(a, b, h) {

    if (a == 0 && b == 0)
        return water;

    if (h) {
        if (h < waterHeight)
            return water;
        if (h < .65)
            return sand;
        if (h > .9)
            return ice;
    }

    if (b < .3)
        return tundra;
    if (a > .5)
        return hotsand;
    else
    if (a > .35)
        if (b > .5)
            if (b < .55)
                return forest;
            else
                return darkforest;
    else
        return sand;
    else
    if (b > .5)
        return swamp;
    else
        return wetsand;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}


var map0;
var map1;
var map2;

var getHeightAt = function(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);

    if (terrain[x] && terrain[x][y])
        return terrain[x][y];
    else
        return 0;
}

var getColorAt = function(x, y, height) {
    x = Math.floor(x);
    y = Math.floor(y);

    var val0, val1, sum;
    if (map0[x] && map0[x][y])
        val0 = map0[x][y];
    else
        val0 = 0;
    if (map1[x] && map1[x][y])
        val1 = map1[x][y];
    else
        val1 = 0;

    sum = val0 + val1;

    if (sum > 1) {
        val0 /= sum;
        val1 /= sum;
    }

    return color(val0, val1, height);
}

var drawTile = function(color, x, y, height, ctx) {
    if (height == 0)
        return;
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
    //isoctx.fillStyle = "black";
    //isoctx.fillText(height,x,y-height);
}

var drawBoard = function(ctx) {
    ctx.fillStyle = water;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var midX = 2 * canvas.height / tile_height,
        midY = canvas.width / tile_width,
        midH = Math.max(getHeightAt(midX, midY) - waterHeight, 0) * 30 * tile_height / 2;

    for (i = 0; i < 2 * ctx.canvas.height / tile_height + 10; i++) {
        var offset_x;
        if (i % 2 == 1)
            offset_x = tile_width / 2;
        else
            offset_x = 0;

        for (j = 0; j < 2 * ctx.canvas.width / tile_width; j++) {
            var x = (j * tile_width) + offset_x - tile_width * 2,
                y = i * tile_height / 2 - tile_height,
                h = Math.max(getHeightAt(j, i) - waterHeight, 0) * 30 * tile_height / 2,
                c = getColorAt(j, i, getHeightAt(j, i));
            drawTile(c, x, y + midH + tile_height, h, context);
        }
    }
}

var width = 128;
var height = 128;

var tile_width = 20;
var tile_height = 12;

var persistence = 1 / 2;
var iterations = 5;
var frequency = 5;
var distanceCoef = .5;

var canvas = document.getElementById("draw");
var context = canvas.getContext("2d");

canvas.width = tile_width * (width - 4);
canvas.height = tile_height * height / 2;

canvas.style.transform = "initial";
canvas.style.left = "0px";
canvas.style.top = "0px";
document.body.style.backgroundColor = water;
/**/

var terrain = [];

var warning = document.createElement("div");
warning.innerHTML = "Warning: Large maps can take a long time to generate";
warning.style.color = "red";
warning.style.display = "none";
addElement(warning);

addRange("width", 2,9,1, function(r){
    if(r > 7)
        warning.style.display = "block";
    else
        warning.style.display = "none";
    return Math.pow(2,r)+" tiles";
});

addRange("tile width", 1,40,1,function(r){
    return r+" px";
});
addRange("tile height", 1,40,1,function(r){
    return r+" px";
});

addRange("persistence", .25,.99,.01,function(r){
    return (r + "000").substring(0,4);
});
addRange("iterations", 1,6,1);
addRange("frequency", 1,10,1);
addRange("coefficient", .01,.99,.01,function(r){
    return (r + "000").substring(0,4);
});
addRange("water height", .01, .99, .01, function(r){
    return (r + "000").substring(0,4);
});

var button = document.createElement("button");
button.innerHTML = "Regenerate";
button.onclick = usergen;
addElement(button);

setRange(0,7);

setRange(1,tile_width);
setRange(2,tile_height);

setRange(3,persistence);
setRange(4,iterations);
setRange(5,frequency);
setRange(6,distanceCoef);

setRange(7,waterHeight);

disableResize();

function usergen(){
    console.log(width, height, tile_width, tile_height, persistence, iterations, frequency, distanceCoef, waterHeight);

    width = Math.pow(2,getRange(0).value);
    height = width;
    tile_width = parseInt(getRange(1).value);
    tile_height = parseInt(getRange(2).value);
     
    persistence = parseFloat(getRange(3).value);  
    iterations = parseInt(getRange(4).value);
    frequency = parseInt(getRange(5).value);
    distanceCoef = parseFloat(getRange(6).value);

    waterHeight = parseFloat(getRange(7).value);

    console.log(width, height, tile_width, tile_height, persistence, iterations, frequency, distanceCoef, waterHeight);
    initialize();
}

function initialize() {
    canvas.width = tile_width * (width - 4);
    canvas.height = tile_height * height / 2;

    var terr = new NormalTerrain(width, persistence, iterations, frequency);
    var bio = new NormalTerrain(width, persistence, iterations, frequency);
    map0 = bio.generate();
    map1 = bio.generate();
    map2 = terr.generate();

    terrain = [];

    for (var x = 1; x < width - 1; x++) {
        terrain[x] = [];
        for (var y = 1; y < width - 1; y++) {
            terrain[x][y] = (-1 * distanceCoef * Math.pow(distance(origin(), {
                x: x,
                y: y
            }) * 2 / width, 2)) + map2[x][y];
        }
    }
    var min = 1;
    var max = 0;
    for (var x = 2; x < width - 2; x++) {
        for (var y = 2; y < width - 2; y++) {
            min = Math.min(min, terrain[x][y]);
            max = Math.max(max, terrain[x][y]);
        }
    }

    max -= min;

    for (var x = 2; x < width - 2; x++) {
        for (var y = 2; y < width - 2; y++) {
            terrain[x][y] -= min;
            terrain[x][y] /= max;
        }
    }
    drawBoard(context);
}

/**/

initialize();

var mouseX = 0;
var mouseY = 0;

var vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

window.addEventListener('resize', function(evt) {
    vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
});

function realign_view(evt) {
    if (!evt) {
        var evt = {};
        evt.clientX = 0;
        evt.clientY = 0;
    }

    var x = (vw - canvas.width) * (evt.clientX / vw);
    var y = (vh - canvas.height) * (evt.clientY / vh);
    if (canvas.width < vw) {
        canvas.style.left = Math.floor((vw - canvas.width) / 2) + "px";
    } else {
        canvas.style.left = x + "px";
    }

    if (canvas.height < vh) {
        canvas.style.top = Math.floor((vh - canvas.height) / 2) + "px";
    } else {
        canvas.style.top = y + "px";
    }
}

document.addEventListener('mousemove', realign_view, false);
realign_view();