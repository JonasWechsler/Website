var canvas = document.getElementById("draw");
var context = canvas.getContext("2d");

canvas.width = screen.width;
canvas.height = screen.height;

/*One way sphere*/
var Particles = new Array();

var DEBUG = true;
var camera = {
    x: -1,
    y: 50,
    z: 300,
    yaw: 0,
    pitch: 0
};
var timeSinceClick = 1500;
var fov = 90;
var fov_coef = 600;

var keys = [];
$(document).keydown(function (e) {
    keys[String.fromCharCode(e.which)] = true;
});
$(document).keyup(function (e) {
    keys[String.fromCharCode(e.which)] = false;
});
var oldx, oldy;
document.onmousedown = function (e) {
    canvas.onmousemove = function (e) {
        if (!e.x) e.x = e.clientX;
        if (!e.y) e.y = e.clientY;
        if (!oldx) oldx = e.x;
        if (!oldy) oldy = e.y;
        var dx = e.x - oldx;
        var dy = e.y - oldy;
        panCameraAround({
            x: 0,
            y: 0,
            z: 0
        }, dx, dy);
        oldx = e.x;
        oldy = e.y;
        timeSinceClick = 0;
    };
};
document.onmouseup = function (e) {
    oldx = null;
    oldy = null;
    canvas.onmousemove = null;
};

function checkKeys() {
    var ret = false;
    const STEP = 1;
    if (keys['W']) {
        camera.z += STEP;
        ret = true;
    }
    if (keys['S']) {
        camera.z -= STEP;
        ret = true;
    }
    if (keys['D']) {
        camera.x += STEP;
        ret = true;
    }
    if (keys['A']) {
        camera.x -= STEP;
        ret = true;
    }
    if (keys['E']) {
        camera.y += STEP;
        ret = true;
    }
    if (keys['Q']) {
        camera.y -= STEP;
        ret = true;
    }
    return ret;
}

function panCameraAround(center, dx, dy) {
    camera.x -= center.x;
    camera.y -= center.y;
    camera.z -= center.z;

    var origin = {
        x: 0,
        y: 0,
        z: 0
    };
    //Rotate the camera about the origin, not much to do since the y axis will always be vertical
    var rotated = rotatePoint(origin, {
        x: camera.x,
        y: camera.z
    }, -1 * dx / (180));

    camera.x = rotated.x;
    camera.z = rotated.y;

    //Rotate camera around a horizontal tangent axis

    var hx = Math.sqrt(camera.x * camera.x + camera.z * camera.z);
    var hy = camera.y;

    rotated = rotatePoint(origin, {
        x: hx,
        y: hy
    }, -1 * dy / (180));

    var ratio = camera.x / camera.z;
    var xi = camera.x;
    var zi = camera.z;
    camera.x = rotated.x * ratio / Math.sqrt(1 + ratio * ratio);
    camera.y = rotated.y;
    camera.z = (camera.x / ratio);
    if (zi < 0) {
        camera.x *= -1;
        camera.z *= -1;
    }

    var degree = angleBetween(origin, camera);
    camera.yaw = degree.yaw;
    camera.pitch = degree.pitch;
    if (camera.pitch > Math.PI - 0.01) camera.pitch = Math.PI - 0.01;
    if (camera.pitch < Math.PI * -1 + 0.01) camera.pitch = -1 * Math.PI + 0.01;
    camera.yaw %= Math.PI * 2;
    camera.pitch %= Math.PI * 2;
    camera.x += center.x;
    camera.y += center.y;
    camera.z += center.z;
}

function panCamera(dx, dy) {

}

function angleBetween(origin, point) {
    var dx = point.x - origin.x;
    var dy = point.y - origin.y;
    var dz = point.z - origin.z;
    var tempYaw = Math.abs(Math.atan(dx / dz));
    if (dx >= 0) {
        if (dz >= 0) {
            tempYaw -= Math.PI;
        } else tempYaw *= -1;
    } else if (dz >= 0) {
        tempYaw = Math.PI - tempYaw;
    }
    var hx = Math.sqrt(dx * dx + dz * dz);
    var hy = dy;
    var tempPitch = Math.abs(Math.atan(hy / hx));
    if (hy <= 0) {
        tempPitch *= -1;
    }
    return {
        yaw: tempYaw,
        pitch: tempPitch
    };
}

function rotatePoint(origin, point, dtheta) {
    var s = Math.sin(dtheta);
    var c = Math.cos(dtheta);
    var xn = origin.x + (point.x - origin.x) * c - (point.y - origin.y) * s;
    var yn = origin.y + (point.x - origin.x) * s + (point.y - origin.y) * c;
    return {
        x: xn,
        y: yn
    };
}

function Part(x, y, z, color) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;
    this.tod = function (x, y, z, yaw, pitch) {
        if (!y) {
            y = x.y;
            z = x.z;
            yaw = x.yaw;
            pitch = x.pitch;
            x = x.x;
        }
        if (!y) {
            return -1;
        }
        var n0x = this.x - x;
        var n0y = this.y - y;
        var n0z = this.z - z;
        var n0 = rotatePoint({
            x: 0,
            y: 0
        }, {
            x: n0x,
            y: n0z
        }, yaw);
        n0x = n0.x;
        n0z = n0.y;
        n0 = rotatePoint({
            x: 0,
            y: 0
        }, {
            x: n0z,
            y: n0y
        }, pitch);
        n0z = n0.x;
        n0y = n0.y;
        if (n0z < 0) {
            return {
                x: -1,
                y: -1,
                zdist: -1
            };
        }
        return {
            x: (n0x) / (n0z),
            y: (n0y) / (n0z),
            zdist: n0z,
            color: this.color
        };

    }
}

/***/

function push(x,y,z,color){
    Particles.push(new Part(x,y,z,color));
}

var initialText = "\
function rand(a){\n\
    return (random() * 2 - 1) * a;\n\
}\n\
\n\
function color(){\n\
    var r = random()*255;\n\
    return '#'+floor(random()*16777215).toString(16);\n\
}\n\
\n\
for (var x = 0; x < 160; x += 20) {\n\
    for (var y = 0; y < 160; y += 20) {\n\
        for (var z = 0; z < 160; z += 20) {\n\
            push(rand(x),rand(y),rand(z),color());\n\
        }\n\
    }\n\
}\n\
";

var min_x = 0, max_x = canvas.width, min_y = 0, max_y = canvas.height;
var run = false;

function update(){
    Particles = [];
    min_x = 0, max_x = canvas.width, min_y = 0, max_y = canvas.height;
    run = false;
    var pretext = "";
    Object.getOwnPropertyNames(Math).forEach(function(val){
        pretext += "var " + val + " = Math." + val + ";\n";
    });
    var text = pretext+ getTextarea(0).value;
    eval(text);
}

addElement(document.createElement("textarea"));
var button = document.createElement("button");
button.innerHTML = "Regenerate";
button.onclick = update;
addElement(button);
setTextarea(0,initialText);
update();

function drawItAll(ctx) {
    if (!ctx)
        return false;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    min_x = 0, max_x = 0, min_y = canvas.width, max_y = canvas.height;
    ctx.fillStyle = "#D7D988";
    var zbuffer = new Array();
    for (var p = 0; p < Particles.length; p++) {
        zbuffer.push(Particles[p].tod(camera));
    }
    zbuffer.sort(function (a, b) {
        if (a.zdist > b.zdist) return -1;
        if (a.zdist < b.zdist) return 1;return 0
    });
    ctx.fillStyle = "black";
    for (var z = 0; z < zbuffer.length; z++) {
        ctx.fillStyle = zbuffer[z].color;
        var x = (zbuffer[z].x * fov_coef + canvas.width / 2 + 0.5)|0,
            y = (zbuffer[z].y * fov_coef + canvas.height / 2 + 0.5)|0,
            w = (1000 / zbuffer[z].zdist + 0.5)|0,
            h = (1000 / zbuffer[z].zdist + 0.5)|0;
        min_x = Math.min(x,min_x);
        max_x = Math.max(x,max_x+w);
        min_y = Math.min(y,min_y);
        max_y = Math.max(y,max_y+h);
        
        ctx.fillRect(x,y,w,h);
    }
    return true;
}

function frame() {
    if (checkKeys() || oldy || oldy || !run || timeSinceClick > 2000) {
        var start = new Date().getTime();
        run = drawItAll(context);
        var end = new Date().getTime();
    }
    timeSinceClick += 10;
    if (timeSinceClick > 2000) {
        panCameraAround({
            x: 0,
            y: 0,
            z: 0
        }, 1, 0);
    }
    window.requestAnimationFrame(frame);
}
frame();
