function World(height) {
    var heights = {
        '-1': height / 2,
        '0': height / 2,
        '1': height / 2
    };

    var x = 0;
    var max_x = -1;
    var min_x = 1;

    var perlin_resolution = 15;
    var left_perlin_subgraph = [];
    var right_perlin_subgraph = [];
    var perlin_smoothness = .9965; //0<smooth<1

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
                    amplitude = Math.pow(persistance, idx) * height;
                active_subgraphs[idx] = amplitude * Math.random();
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