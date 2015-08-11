/**/
var colors = ['#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#2196F3'];

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};


var functions = [];

/**/
var canvas = document.getElementById('graph');
canvas.width = 300;
canvas.height = 300;
var ctx = canvas.getContext('2d');
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
var equations = [];
var fnames = [];

var reset = true;
var x_offset = 0,
    y_offset = 0;
var zoom = 1;
var oldx, oldy;

document.onmousedown = function(e) {
    canvas.onmousemove = function(e) {
        if (!oldx) oldx = e.x;
        if (!oldy) oldy = e.y;
        var dx = (e.x - oldx) * zoom;
        var dy = (e.y - oldy) * zoom;
        dx /= 20;
        dy /= 20;
        x_offset += dx;
        y_offset += dy;
        oldx = e.x;
        oldy = e.y;
        graph();
    }
}
document.onmouseup = function(e) {
    oldx = null;
    oldy = null;
    canvas.onmousemove = null;
}
document.onkeypress = function(e) {
    if (e.charCode == 43) {
        zoom /= 2;
        graph();
    }
    if (e.charCode == 45) {
        zoom *= 2;
        graph();
    }
}

function bindLast() {
    $('.textarea > input').focus(function() {
        $('.textarea').addClass('h2');
    }).focusout(function() {
        $('.textarea').removeClass('h2');
    }).keydown(function(e) {
        if (e.keyCode == 40 || e.keyCode == 13) {
            $(this).next('input, select').focus();
        } else if (e.keyCode == 38) {
            $(this).prev('input, select').focus();
        } else if (e.keyCode == 8 && $(this).val().isEmpty()) {
            e.preventDefault();
            $(this).prev('input, select').focus();
            $(this).remove();
        }
    });

    $('.textarea > input:last-child').focus(function() {
        $('input').unbind();
        $('.textarea').append('<input>');
        bindLast();
    });
    $('input').on("change keyup paste focus click focusout", function() {
        check_DOM();
    });
}

function check_DOM() {
    functions = [];
    $('.textarea > input').each(function(idx) {
        if ($(this).is(":focus") || $(this).val().isEmpty()) {
            $(this).css('background-image', 'linear-gradient(to right, white 50%,' + colors[idx % colors.length] + ' 50%)');
            $(this).css('background-position', '0% 0%');
            $(this).css('color', 'black');
        } else {
            $(this).css('background-image', 'linear-gradient(to right, white 50%,' + colors[idx % colors.length] + ' 50%)');
            $(this).css('background-position', '-100% 0%');
            $(this).css('color', 'white');
            functions.push($(this).val());
        }
    });
    check();
}

function parseLine(line) {
    var equation = line.substring(line.indexOf('=') + 1);
    var funct = line.substring(0, line.indexOf('('));
    var input = line.substring(line.indexOf('(') + 1, line.indexOf(')'));
    if (funct.length > 1) throw funct + "(" + input + ") : Function name should be one character.";
    if (input.length > 1) throw funct + "(" + input + ") : Please have one single character input.";
    if (equation.indexOf(funct + "(x)") != -1) throw funct + "(x): Please do not have recursive functions";

    while (equation.indexOf('\'') != -1) {
        clear();
        var eqfix = equation;
        var idx = eqfix.indexOf('\'');
        var fname = eqfix.charAt(idx - 1);
        var p = 0;
        for (var i = idx, p = 0; eqfix.charAt(i) == '\''; i++)
            p++;
        var closeidx = 0;
        var one = false;
        for (var i = idx, c = 0;; i++) { //Find the closing brace
            if (eqfix.charAt(i) === '(') {
                c++;
                one = true;
            }
            if (eqfix.charAt(i) === ')')
                c--;
            closeidx = i;
            if (i >= eqfix.length)
                break;
            if (c === 0 && one)
                break;
            if (i > 100)
                break;
        }
        equation = eqfix.substring(0, idx - 1) + "slope(" + fname + "," + eqfix.substring(idx + p + 1, closeidx) + "," + p + ")" + eqfix.substring(closeidx + 1);
    }
    var lined = "function " + funct + "(x){return " + equation + "};";
    equations.push(lined);
    fnames.push(funct);
    return {
        response: true,
        format: lined,
        message: ""
    };
}

var eps = 2.2 * Math.pow(10, -16);

function slope(F, x, p) {
    if (!p) p = 1;
    var h = Math.pow(eps, 1 / (p * p + 1)) * x;
    var xph = x + h;
    var dx = xph - x;
    if (p > 1)
        return (slope(F, xph, p - 1) - slope(F, x, p - 1)) / dx;
    else
        return (F(xph) - F(x)) / dx;
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
    min = -10 * zoom;
    max = 10 * zoom;
    var xmin = -10 * zoom - x_offset;
    var xmax = 10 * zoom - x_offset;
    try {
        for (var x = xmin; x < xmax; x += (xmax - xmin) / WIDTH) {
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
        /*Draw the horizontal axis*/
        if (0 < max && min < 0) {
            ctx.beginPath();
            var zero = HEIGHT - HEIGHT * (0 - min) / (max - min);
            ctx.moveTo(0, zero);
            ctx.lineTo(WIDTH, zero);
            ctx.strokeStyle = "grey";
            ctx.stroke();
        }
        /*Draw the vertical axis*/
        if (0 < xmax && xmin < 0) {
            ctx.beginPath();
            var zero = WIDTH * (0 - xmin) / (xmax - xmin);
            ctx.moveTo(zero, 0);
            ctx.lineTo(zero, HEIGHT);
            ctx.strokeStyle = "grey";
            ctx.stroke();
        }

        /*Finally draw the function*/
        for (var i = 0; i < cache[0].y.length; i++) {
            ctx.beginPath();
            ctx.moveTo(cache[0].x, HEIGHT - cache[0].y[i]);
            for (var j = 0; j < cache.length; j++) {
                var x0 = WIDTH * (cache[j].x - xmin) / (xmax - xmin);
                var y0 = HEIGHT * (cache[j].y[i] - min) / (max - min);
                if (isFinite(y0))
                    if (y0 < 0)
                        ctx.lineTo(x0, HEIGHT)
                    else if (y0 > HEIGHT)
                    ctx.lineTo(x0, -1);
                else
                    ctx.lineTo(x0, HEIGHT - y0);
            }
            ctx.strokeStyle = colors[i % colors.length];
            ctx.stroke();
        }
    } catch (e) {
        console.log(e);
        clear();
        log(e);
    }
}

function parseLines() {
    equations = [];
    fnames = [];
    clear();
    for (var n = 0; n < functions.length; n++) {
        var line = parseLine(functions[n]);
        log(JSON.stringify(line));
    }
}

function check() {
    try {
        reset = true;
        parseLines();
        graph();
        error("");
    } catch (err) {
        console.error(err);
        error(err);
    }
}

function error(line) {
    $('.err').text(line);
}

function clear() {
    $('.log').text('');
}

function log(a) {
    $('.log').append("<p>" + a + "</p>");
}
//check();

var startgraph = ["f(x) = x*x", "g(x) = f'(x)"];

bindLast();

for (var i = 0; i < startgraph.length; i++) {
    $($(".textarea").children()[i]).val(startgraph[i]);
}

check_DOM();