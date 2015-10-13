var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

var diam = Math.random()*1+1,
  len = Math.random()*60+20,
  diam_coef = Math.random()*.5+.5,
  len_coef = Math.random()*.7+.3,
  branches = Math.random()*2+3,
  twig_chance = Math.random()*.5+.5,
  max_angle = Math.random()*Math.PI/2;

var bases_x = [canvas.width / 2],
  bases_y = [canvas.height / 2],
  angles = [3*Math.PI/2];

ctx.fillText(diam,0,10);
ctx.fillText(len,0,20);
ctx.fillText(diam_coef,0,30);
ctx.fillText(len_coef,0,40);
ctx.fillText(branches,0,50);
ctx.fillText(twig_chance,0,60);
ctx.fillText(max_angle/Math.PI*180,0,70);

for (var i = 0; i<4 ; i++) {
  ctx.lineWidth = diam;

  var new_bases_x = [],
    new_bases_y = [],
    new_angles = [];

  for (var a = 0; a < bases_x.length; a++) {
    for (var b = 0; b < branches; b++) {
      if(Math.random()>twig_chance){
        continue;
      }
      
      var angle = (b / branches) * max_angle + Math.random() -.5,
        angle_adjusted0 = angles[a] + angle + Math.random()-.5,
        angle_adjusted1 = angles[a] - angle + Math.random()-.5;
      ctx.beginPath();
      ctx.moveTo(bases_x[a], bases_y[a]);
      ctx.lineTo(bases_x[a] + Math.cos(angle_adjusted0) * len, bases_y[a] + Math.sin(angle_adjusted0) * len);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bases_x[a], bases_y[a]);
      ctx.lineTo(bases_x[a] + Math.cos(angle_adjusted1) * len, bases_y[a] + Math.sin(angle_adjusted1) * len);
      ctx.stroke();
      new_bases_x.push(bases_x[a] + Math.cos(angle_adjusted0) * len);
      new_bases_y.push(bases_y[a] + Math.sin(angle_adjusted0) * len);
      new_angles.push(angle_adjusted0);
      new_bases_x.push(bases_x[a] + Math.cos(angle_adjusted1) * len);
      new_bases_y.push(bases_y[a] + Math.sin(angle_adjusted1) * len);
      new_angles.push(angle_adjusted1);
    }
  }
  bases_x = new_bases_x;
  bases_y = new_bases_y;
  angles = new_angles;
  
  diam *= diam_coef;
  len *= len_coef;
}