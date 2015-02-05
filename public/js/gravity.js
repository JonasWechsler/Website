$(document).ready(function(){
  var CENTER_X = 500;
var CENTER_Y = 250;
  var web_length = 70;
doit();
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
    var BIG_G = 6.67384 * update_rate;
    var num = 10;

    var min = Math.min;
    var colors = ["#ABF8FF", "#E76B76", "#1D2439", "#4F3762", "#67F9FF", "#0C0F18"];
    function particle(x, y, z, m, r, i, j, k){
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
        this.d2x = 0;
      this.d2y = 0;
      this.d2z = 0;
        this.color = colors[Math.floor(Math.random()*colors.length)];
        this.draw = function (context) {
            var tx = this.x - average_pos.x + cam_offset.x;
            var ty = this.y - average_pos.y + cam_offset.y;
            var tz = this.z - average_pos.z + cam_offset.z;
          
            if (tz < 0) return;
          
                    this.d2x = (tx - r) / tz + CENTER_X;
            this.d2y = (ty - r) / tz + CENTER_Y;
          
          ctx.beginPath();
          ctx.globalAlpha = 0.5;
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = this.color;
          ctx.arc(this.d2x,this.d2y, (r * 2) / tz, Math.PI * 2, false);
          ctx.fill();
          ctx.closePath();
          
            if (this.d2x < 0) this.i = Math.max(0,this.i);
            if (this.d2x > CENTER_X * 2) this.i = Math.min(0,this.i);
            if (this.d2y < 0) this.j = Math.max(0,this.j);
            if (this.d2y > CENTER_Y * 2) this.j = Math.min(0,this.j);
        }
    }

    function rint(int) {
        return Math.random() * int;
    }



    for (i = 0; i < num; i++) {
        var rand = Math.random();
       var size = (rand < .25)?.4:(rand < .5)?.4:(rand < .75)?.6:.8;

        var randz = 1;
        var randx = (rint(CENTER_X * 2) - CENTER_X) / randz;
        var randy = (rint(CENTER_Y * 2) - CENTER_Y) / randz;

        var rand1 = rint(2) - 1;
        var rand2 = rint(2) - 1;
        var rand3 = 0;

        particles[i] = new particle(randx, randy, randz, size, size * 10, rand1, rand2, rand3);
        console.log(randx, randy, randz, size * 100, size, rand1, rand2, rand3);}


    cal = 0;

    var refresh = setInterval(function () {
      
        ctx.beginPath();
        ctx.globalCompositeOperation = "source-over";
        ctx.rect(0, 0 , CENTER_X*2, CENTER_Y*2);
        ctx.fillStyle = "#151a28";
        ctx.fill();
        ctx.closePath();
      
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

                          if (h < web_length){
                  ctx.beginPath();
                  ctx.globalAlpha = 5/h;
                  ctx.lineWidth = 1;
                    ctx.moveTo(p1.d2x, p1.d2y);
                  ctx.lineTo(p2.d2x, p2.d2y);
                  ctx.strokeStyle = p1.color;
                  ctx.stroke();
                  ctx.closePath();
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

                         particles[n].i = min(particles[n].terminal_velocity, particles[n].i);
                particles[n].j = min(particles[n].terminal_velocity, particles[n].j);
                particles[n].k = min(particles[n].terminal_velocity, particles[n].k);
                        
                if (particles[n].i < -1 * particles[n].terminal_velocity) particles[n].i = -1 * particles[n].terminal_velocity;

                if (particles[n].j < -1 * particles[n].terminal_velocity) particles[n].j = -1 * particles[n].terminal_velocity;

                if (particles[n].k < -1 * particles[n].terminal_velocity) particles[n].k = -1 * particles[n].terminal_velocity;

            }
        }
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
  
  function reset(){
    clearInterval(refresh);
    doit();
  }
}
});