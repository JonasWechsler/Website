    /*One way sphere*/
    var canvas = document.getElementById("draw");
    var context = canvas.getContext("2d");
    
    canvas.width = screen.width;
    canvas.height = screen.height;

	var Edges = new Array();
    var Faces = new Array();
    
    var DEBUG = true;
    var camera = {
        x: 50,
        y: 0,
        z: 0,
        yaw: 0,
        pitch: 0
    };
    var fov = 90;
    var fov_coef = 600;
    var RELW = canvas.width / fov_coef;
    var RELH = canvas.height / fov_coef;

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
        if (camera.pitch > Math.PI - 0.01)
            camera.pitch = Math.PI - 0.01;
        if (camera.pitch < Math.PI * -1 + 0.01)
            camera.pitch = -1 * Math.PI + 0.01;
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

    function FillFace(vertices, color) {
        this.vertices = vertices;
        this.color = color;
        this.tod = function (x, y, z, yaw, pitch) {
            var buffer = new Array();
            for (var i = 0; i < this.vertices.length; i++) {
                var n0x = this.vertices[i].x - x;
                var n0y = this.vertices[i].y - y;
                var n0z = this.vertices[i].z - z;
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
                if (n0z < 0)
                    continue;
                buffer.push({
                    x: (n0x) / (n0z),
                    y: (n0y) / (n0z)
                });
            }
            return buffer;
        }
    }

    function Line(x, y, z, i, j, k) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.i = i;
        this.j = j;
        this.k = k;
        this.tod = function (x, y, z, yaw, pitch) {
            var n0x = this.x - x;
            var n0y = this.y - y;
            var n0z = this.z - z;
            var n1x = this.x + this.i - x;
            var n1y = this.y + this.j - y;
            var n1z = this.z + this.k - z;
            var n0 = rotatePoint({
                x: 0,
                y: 0
            }, {
                x: n0x,
                y: n0z
            }, yaw);
            var n1 = rotatePoint({
                x: 0,
                y: 0
            }, {
                x: n1x,
                y: n1z
            }, yaw);
            n0x = n0.x;
            n0z = n0.y;
            n1x = n1.x;
            n1z = n1.y;
            n0 = rotatePoint({
                x: 0,
                y: 0
            }, {
                x: n0z,
                y: n0y
            }, pitch);
            n1 = rotatePoint({
                x: 0,
                y: 0
            }, {
                x: n1z,
                y: n1y
            }, pitch);
            n0z = n0.x;
            n0y = n0.y;
            n1z = n1.x;
            n1y = n1.y;
            if (n0z < 0 || n1z < 0) return {
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 0
            };
            return {
                x0: (n0x) / (n0z),
                y0: (n0y) / (n0z),
                x1: (n1x) / (n1z),
                y1: (n1y) / (n1z)
            };
        };
    }
    var date = new Date();

    function drawItAll(ctx) {
        if (!ctx)
            return false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#D7D988";
        for (r = 0; r < Faces.length; r++) {
            var nDrop = Faces[r].tod(camera.x, camera.y, camera.z, camera.yaw, camera.pitch);
            ctx.fillStyle = Faces[r].color;
            ctx.beginPath();
            for (var v = 0; v < nDrop.length; v++) {
                var vx = nDrop[v].x * fov_coef + canvas.width / 2;
                var vy = nDrop[v].y * fov_coef + canvas.height / 2;
                ctx.lineTo(vx, vy);
            }
            ctx.fill();
        }
        for (r = 0; r < Edges.length; r++) {
            var nDrop = Edges[r].tod(camera.x, camera.y, camera.z, camera.yaw, camera.pitch);
            ctx.beginPath();
            ctx.moveTo(nDrop.x0 * fov_coef + canvas.width / 2, nDrop.y0 * fov_coef + canvas.height / 2);
            ctx.lineTo(nDrop.x1 * fov_coef + canvas.width / 2, nDrop.y1 * fov_coef + canvas.height / 2);
            ctx.stroke();
        }
        return true;
    }

    function makeBox(x, y, z, i, j, k) {
        Edges.push(new Line(x, y, z, i, 0, 0));
        Edges.push(new Line(x, y, z, 0, j, 0));
        Edges.push(new Line(x + i, y, z, 0, j, 0));
        Edges.push(new Line(x, y + j, z, i, 0, 0));
        Edges.push(new Line(x, y, z, 0, 0, k));
        Edges.push(new Line(x, y + j, z, 0, 0, k));
        Edges.push(new Line(x + i, y, z, 0, 0, k));
        Edges.push(new Line(x + i, y + j, z, 0, 0, k));
        Edges.push(new Line(x, y, z + k, i, 0, 0));
        Edges.push(new Line(x, y, z + k, 0, j, 0));
        Edges.push(new Line(x + i, y, z + k, 0, j, 0));
        Edges.push(new Line(x, y + j, z + k, i, 0, 0));
    }
    var stroke = {
        x: 0,
        y: 0,
        z: 0
    };
    var path = new Array();

    function startStroke(x0, y0, z0) {
        path = new Array();
        stroke = {
            x: x0,
            y: y0,
            z: z0
        };
        path.push(stroke);
    }

    function strokeVector(i, j, k) {
        stroke.x += i;
        stroke.y += j;
        stroke.z += k;
        path.push(stroke);
    }

    function strokeTo(x0, y0, z0) {
        stroke = {
            x: x0,
            y: y0,
            z: z0
        };

        path.push(stroke)
    }

    function closePath() {
        path.push(path[0]);
    }

    function strokePath() {
        var last = path[0];
        for (var i = 1; i < path.length; i++) {
            var current = path[i];
            Edges.push(new Line(last.x, last.y, last.z, current.x - last.x, current.y - last.y, current.z - last.z));
            last = current;
        }
    }

    function fillPath(color) {
        Faces.push(new FillFace(path, color));
    }

    function makeSphere(x, y, z, rad) {
        for (var v = -1 * Math.PI / 2; v < Math.PI / 2; v += .1) {
            var first = new Array(3);
            for (var u = 0; u < Math.PI * 2; u += .1) {
                if (u == 0) {
                    first = [rad * Math.sin(u) * Math.cos(v) + x, rad * Math.cos(u) * Math.cos(v) + y, rad * Math.sin(v) + z];
                    //strokePath();
                    fillPath('#' + (Math.random() * 0xFFFFFF << 0).toString(16));
                    startStroke(first[0], first[1], first[2]);
                } else strokeTo(rad * Math.sin(u) * Math.cos(v) + x, rad * Math.cos(u) * Math.cos(v) + y, rad * Math.sin(v) + z);
            }
            strokeTo(first[0], first[1], first[2]);
        }
    }
    makeSphere(0, 0, 0, 25);
    setInterval(function () {
        drawItAll(context);
        panCameraAround({
            x: 0,
            y: 0,
            z: 0
        }, 3, 0);
    }, 30);
