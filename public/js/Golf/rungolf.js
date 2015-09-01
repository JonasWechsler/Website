
/*Running*/
var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
canvas.width = 450;
canvas.height = 900;

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.round((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
    y: Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
  };
}


document.addEventListener('keydown', function(e) {
  var char = String.fromCharCode(e.keyCode);
  switch (char) {
    case 'Q':
      fixeds[0].up = true;
      break;
    case 'E':
      fixeds[1].up = true;
      break;
  }
}, false);


document.addEventListener('keyup', function(e) {
  var char = String.fromCharCode(e.keyCode);
  switch (char) {
    case 'Q':
      fixeds[0].up = false;
      break;
    case 'E':
      fixeds[1].up = false;
      break;
  }
}, false);

setInterval(function() {
  stepPhysics();
  drawPhysics(ctx);
}, 10);