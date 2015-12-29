function World(){

}

World.Perlin = function() {
    var heights = {
        '-1': canvas.height / 2,
        '0': canvas.height / 2,
        '1': canvas.height / 2
    };

    var x = 0;
    var max_x = -1;
    var min_x = 1;

    var perlin_resolution = 15;
    var left_perlin_subgraph = [];
    var right_perlin_subgraph = [];
    var perlin_smoothness = .9965; //0<smooth<1

    var seed = new Date().getTime();

    var random = function() {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    var generate_perlin_at = function(x) {
        var active_subgraphs = [];
        var last_y = 0;
        if (x < min_x) {
            min_x = x;
            last_y = heights[x + 1];
            active_subgraphs = left_perlin_subgraph;
        } else if (x > max_x) {
            max_x = x;
            last_y = heights[x - 1];
            active_subgraphs = right_perlin_subgraph;
        } else {
            return heights[x];
        }

        var new_point = false;

        for (var idx = 1; idx < perlin_resolution; idx++) {
            var frequency = Math.pow(2, idx),
                wavelength = Math.floor(200 / frequency);

            if (x % wavelength == 0) {
                var persistance = 1 / 2,
                    amplitude = Math.pow(persistance, idx) * canvas.height;
                active_subgraphs[idx] = amplitude * random();
                new_point = true;
            }
        }

        var y = 0;
        if (new_point) {
            active_subgraphs.forEach(function(val) {
                if (val)
                    y += val;
            });
            y = last_y * perlin_smoothness + y * (1 - perlin_smoothness);
        } else {
            y = last_y;
        }

        heights[x] = y;
        return y;
    }



    this.getHeightAt = function(x) {
        return generate_perlin_at(x);
    }
}

World.Plant = function() {
    var iterations = 5,
        diam = Math.random() * 1 + 1,
        len = (Math.random() * (screen.height / (iterations + 1)) + screen.height / (iterations + 1)) / 2,
        diam_coef = Math.random() * .5 + .5,
        len_coef = Math.random() * .7 + .3,
        branches = Math.random() * 2 + 3,
        twig_chance = Math.random() * .5 + .5,
        max_angle = Math.random() * Math.PI / 2;

    this.setIterations = function(p) {
        iterations = p;
        return this;
    }

    this.setDiameter = function(p) {
        diam = p;
        return this;
    }

    this.setLength = function(p) {
        len = p;
        return this;
    }

    this.setDiameterCoefficient = function(p) {
        diam_coef = p;
        return this;
    }

    this.setLengthCoefficient = function(p) {
        len_coef = p;
        return this;
    }

    this.setBranches = function(p) {
        branches = p;
        return this;
    }

    this.setTwigChance = function(p) {
        twig_chance = p;
        return this;
    }

    this.setMaxAngle = function(p) {
        max_angle = p;
        return this;
    }

    this.generate = function(x0, y0, ctx) {
        var bases_x = [x0],
            bases_y = [y0],
            angles = [3 * Math.PI / 2];

        var len_initial = len;
        var diam_initial = diam;

        for (var i = 0; i < iterations; i++) {
            ctx.lineWidth = diam_initial;

            var new_bases_x = [],
                new_bases_y = [],
                new_angles = [];

            for (var a = 0; a < bases_x.length; a++) {
                for (var b = 0; b < branches; b++) {
                    if (Math.random() > twig_chance) {
                        continue;
                    }

                    var angle = (b / branches) * max_angle + Math.random() - .5,
                        angle_adjusted0 = angles[a] + angle + Math.random() - .5,
                        angle_adjusted1 = angles[a] - angle + Math.random() - .5;
                    ctx.beginPath();
                    ctx.moveTo(bases_x[a], bases_y[a]);
                    ctx.lineTo(bases_x[a] + Math.cos(angle_adjusted0) * len_initial, bases_y[a] + Math.sin(angle_adjusted0) * len_initial);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(bases_x[a], bases_y[a]);
                    ctx.lineTo(bases_x[a] + Math.cos(angle_adjusted1) * len_initial, bases_y[a] + Math.sin(angle_adjusted1) * len_initial);
                    ctx.stroke();
                    new_bases_x.push(bases_x[a] + Math.cos(angle_adjusted0) * len_initial);
                    new_bases_y.push(bases_y[a] + Math.sin(angle_adjusted0) * len_initial);
                    new_angles.push(angle_adjusted0);
                    new_bases_x.push(bases_x[a] + Math.cos(angle_adjusted1) * len_initial);
                    new_bases_y.push(bases_y[a] + Math.sin(angle_adjusted1) * len_initial);
                    new_angles.push(angle_adjusted1);
                }
            }
            bases_x = new_bases_x;
            bases_y = new_bases_y;
            angles = new_angles;

            diam_initial *= diam_coef;
            len_initial *= len_coef;
        }


    }
}

var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
canvas.width = screen.width + 400;
canvas.height = screen.height;

var world = new World.Perlin();
var plants = new World.Plant();
plants.setLength(25).setIterations(3);

var maxx = 0;
function frame() {
    var maxxy = world.getHeightAt(maxx);
    // shift everything to the left:
    var imageData = ctx.getImageData(1, 0, canvas.width-1, canvas.height);
    ctx.putImageData(imageData, 0, 0);
    // now clear the right-most pixels:
    ctx.clearRect(canvas.width-1, 0, 1, canvas.height);
    ctx.fillRect(canvas.width - 1, canvas.height - maxxy, 1, maxxy);

    if (Math.random() > .995) {
        new World.Plant().setLength(30).setIterations(3).generate(canvas.width - 100, canvas.height - world.getHeightAt(maxx - 100), ctx);
    }
    maxx++;
}

for(;maxx<canvas.width;maxx++){
    var maxxy = world.getHeightAt(maxx);
    ctx.fillRect(maxx, canvas.height - maxxy, 1, maxxy);
    if (Math.random() > .995) {
        new World.Plant().setLength(30).setIterations(3).generate(maxx, canvas.height - maxxy, ctx);
    }
}

setInterval(frame,100);