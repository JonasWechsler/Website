const WIDTH = 500;
const HEIGHT = 500;
var COLOR = "#D7D988";
COLOR = "#8f09f6";

function Part(x0, y0, c0) {
    this.x = x0;
    this.y = y0;
    this.c = c0;
    const RAD = 4;
    var angle = Math.random() * (Math.PI)
    var da = 1;
    this.draw = function (ct) {
        ct.fillStyle = this.c;
        ct.fillRect(this.x - RAD / 2, this.y - RAD / 2, RAD, RAD);
        var speed = Math.random();
        angle += da;

        if (angle < 0 && Math.random() > 0.7) da = 0.01;
        if (angle > (Math.PI) && Math.random() > 0.7) da = -0.01;

        this.y -= Math.sin(angle) * speed;
        this.x -= Math.cos(angle) * speed;
    }
}
var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");

var particles = [];
const num = 1000;


var interval = setInterval(function () {
    ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    backdrop = ctx.getImageData(0, 0, 1, 1).data;
    $('body').css('background', 'rgb(' + backdrop[0] + ',' + backdrop[1] + ',' + backdrop[2] + ')');
    for (var i = 0; i < particles.length; i++) {
        particles[i].draw(ctx);
        if (particles[i].y < 0) particles[i] = new Part(WIDTH / 2, HEIGHT - 150, COLOR);
    }
    if (particles.length < num) particles.push(new Part(WIDTH / 2, HEIGHT - 150, COLOR));
}, 10);

function startIt() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    particles = [];
}
$("#draw").click(function (e) {
    startIt();
});