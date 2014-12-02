var CENTER_X = 500;
var CENTER_Y = 250;

function resize(){
	var bodyheight = $(document).innerHeight();
    var bodywidth = $(document).innerWidth();
	console.log(bodywidth,bodyheight);
    $("#draw").height(bodyheight);
    $("#draw").width(bodywidth);
    $("#draw").attr("width",bodywidth);
    $("#draw").attr("height",bodyheight);
    CENTER_X = bodywidth/2;
    CENTER_Y = bodyheight/2;
}

$(window).resize(function() {
	resize();
});
$(document).ready(function(){
resize();
});
function doit() {
    var average_pos = {
        x: 0,
        y: 0,
        z: 0
    }
    var cam_offset = {
        x: 0,
        y: 0,
        z: 1
    }

    var c = document.getElementById("draw");
    var ctx = c.getContext("2d");
    var update_rate = 10;

    var particles = new Array();
    var BIG_G = 6.67384 * update_rate * Math.pow(10, -11);
    var num = 30;

    function particle(x, y, z, m, r, i, j, k) {
        var density = 1;
        this.terminal_velocity = 10;
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.i = i;
        this.j = j;
        this.k = k;
        this.m = m;
        this.draw = function (context) {
            var tx = this.x - average_pos.x + cam_offset.x;
            var ty = this.y - average_pos.y + cam_offset.y;
            var tz = this.z - average_pos.z + cam_offset.z;

            if (tz < 0) return;

            var d2x = (tx - r) / tz + CENTER_X;
            var d2y = (ty - r) / tz + CENTER_Y;

            context.fillRect(d2x, d2y, (r * 2) / tz, (r * 2) / tz);
            if (d2x < 0 || d2x > CENTER_X * 2) {
                this.i = 0;
            }
            if (d2y < 0 || d2y > CENTER_Y * 2) {
                this.j = 0;
            }

        }
    }

    function rint(int) {
        return Math.random() * int;
    }



    for (i = 0; i < num; i++) {
        var size = Math.floor(Math.random() * 100000000000);

        var randz = 1;
        var randx = (rint(CENTER_X * 2) - CENTER_X) / randz;
        var randy = (rint(CENTER_Y * 2) - CENTER_Y) / randz;

        var rand1 = rint(2) - 1;
        var rand2 = rint(2) - 1;
        var rand3 = 0;

        particles[i] = new particle(randx, randy, randz, size, (size / 100000000000) * 10, rand1, rand2, rand3);
    }


    cal = 0;

    var refresh = setInterval(function () {
        for (n = 0; n < num; n++) {
            if (particles[n] == 0) continue;
            for (m = 0; m < num; m++) {
                if (n === m || particles[m] == 0) {
                    continue;
                }
                var p1 = particles[n];
                var p2 = particles[m];
                var dx = p2.x - p1.x;
                var dy = p2.y - p1.y;
                var dz = p2.z - p1.z;

                var h = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (h === 0) {
                    continue;
                }


                var Fg = (BIG_G * p2.m) / (h * h);

                var Fgx = Fg * (dx / h);
                var Fgy = Fg * (dy / h);
                var Fgz = Fg * (dz / h);

                if (h < p1.r + p2.r) {
                    Fgx = 0;
                    Fgy = 0;
                    Fgz = 0;
                }

                particles[n].i += Fgx;
                particles[n].j += Fgy;
                particles[n].k += Fgz;


                if (particles[n].i > particles[n].terminal_velocity) particles[n].i = particles[n].terminal_velocity;

                if (particles[n].j > particles[n].terminal_velocity) particles[n].j = particles[n].terminal_velocity;

                if (particles[n].k > particles[n].terminal_velocity) particles[n].k = particles[n].terminal_velocity;

                if (particles[n].i < -1 * particles[n].terminal_velocity) particles[n].i = -1 * particles[n].terminal_velocity;

                if (particles[n].j < -1 * particles[n].terminal_velocity) particles[n].j = -1 * particles[n].terminal_velocity;

                if (particles[n].k < -1 * particles[n].terminal_velocity) particles[n].k = -1 * particles[n].terminal_velocity;

            }
        }
        ctx.clearRect(0, 0, CENTER_X * 2, CENTER_Y * 2);
        for (i = 0; i < particles.length; i++) {
            particles[i].x += particles[i].i;
            particles[i].y += particles[i].j;
            particles[i].z += particles[i].k;

            average_pos.x += particles[i].x;
            average_pos.y += particles[i].y;
            average_pos.z += particles[i].z;

        }
        average_pos.x /= particles.length;
        average_pos.y /= particles.length;
        average_pos.z /= particles.length;
        for (i = 0; i < particles.length; i++) {
            particles[i].draw(ctx);
        }

        average_pos.x = 0;
        average_pos.y = 0;
        average_pos.z = 0;

        cal++;
    }, update_rate);
}