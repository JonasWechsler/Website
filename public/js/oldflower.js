var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

var WIDTH = canvas.width;
var HEIGHT = canvas.height;
var COLOR = "#D7D988";
COLOR = "#8f09f6";

var particles = [];
const num = 1000;

ctx.fillStyle="white";
ctx.fillRect(0,0,WIDTH,HEIGHT);

var time = 0;

function Part(x0, y0, c0) {
    this.x = x0;
    this.y = y0;
    this.c = c0;
    const RAD = 4;
    var angle = Math.random() * (Math.PI)
    var da = 1;
	var steps = 0;
    this.draw = function (ct) {
		var r = Math.round(Math.abs(Math.sin(steps/100+time/1000))*255);
		var g = Math.round(Math.abs(Math.sin(steps/100+time/1000))*255);
		var b = Math.round(Math.abs(Math.sin(steps/100+time/1000))*255);

		ct.fillStyle = "rgba(" + r + "," + g + ","+ b + "," + (1-(r+g+b)/(3*255)) + ")" ;
		ct.fillRect(this.x - RAD / 2, this.y - RAD / 2, RAD, RAD);

        var speed = Math.random();
        angle += da;

        if (angle < 0 && Math.random() > 0.7) da = 0.01;
        if (angle > (Math.PI) && Math.random() > 0.7) da = -0.01;

        this.y -= Math.sin(angle) * speed;
        this.x -= Math.cos(angle) * speed;
		steps+=Math.random()*2;
    }
}


var interval = setInterval(function () {
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    backdrop = ctx.getImageData(0, 0, 1, 1).data;
    $('body').css('background', 'rgb(' + backdrop[0] + ',' + backdrop[1] + ',' + backdrop[2] + ')');
    for (var i = 0; i < particles.length; i++) {
        particles[i].draw(ctx);
        if (particles[i].y < 0) particles[i] = new Part(WIDTH / 2, HEIGHT - 150, COLOR);
    }
    if (particles.length < num) particles.push(new Part(WIDTH / 2, HEIGHT - 150, COLOR));
	time++;
}, 10);

function startIt() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    particles = [];
}
$("#draw").click(function (e) {
    startIt();
});
