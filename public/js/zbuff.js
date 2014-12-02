/*One way sphere*/
var Particles = new Array();
var WIDTH = 500;
var HEIGHT = 500;
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
var RELW = WIDTH / fov_coef;
var RELH = HEIGHT / fov_coef;
var keys = [];
$(document).keydown(function (e) {
    keys[String.fromCharCode(e.which)] = true;
});
$(document).keyup(function (e) {
    keys[String.fromCharCode(e.which)] = false;
});
var oldx, oldy;
document.onmousedown = function (e) {
    c.onmousemove = function (e) {
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
    c.onmousemove = null;
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

var date = new Date();
for (var x = 0; x < 100; x += 10) {

    for (var y = 0; y < 100; y += 10) {

        for (var z = 0; z < 100; z += 10) {
            var rand1 = Math.random() * 2 - 1;
            var rand2 = Math.random() * 2 - 1;
            var rand3 = Math.random() * 2 - 1;

            Particles.push(new Part(rand1 * x, rand2 * y, rand3 * z, '#' + (Math.random() * 0xFFFFFF << 0).toString(16)));
        }
    }
}

function drawItAll(ctx) {
    if (!ctx) return false;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#D7D988";
    var zbuffer = new Array();
    for (var p = 0; p < Particles.length; p++) {
        zbuffer.push(Particles[p].tod(camera));
    }
    zbuffer.sort(function (a, b) {
        if (a.zdist > b.zdist) return -1;
        if (a.zdist < b.zdist) return 1;
        return 0
    });
    ctx.fillStyle = "black";
    for (var z = 0; z < zbuffer.length; z++) {
        ctx.fillStyle = zbuffer[z].color;
        ctx.fillRect(zbuffer[z].x * fov_coef + WIDTH / 2, zbuffer[z].y * fov_coef + HEIGHT / 2, 1000 / zbuffer[z].zdist, 1000 / zbuffer[z].zdist);
    }
    return true;
}
var c = document.getElementById("draw");
var context = c.getContext("2d");
var run = false;
setInterval(function () {
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
}, 10);