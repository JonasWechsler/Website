var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
canvas.width = screen.width;
canvas.height = screen.width;

var iterations = 5,
  diam = Math.random()*1+1,
  len = (Math.random()*(screen.height/(iterations+1))+screen.height/(iterations+1))/2,
  diam_coef = Math.random()*.5+.5,
  len_coef = Math.random()*.7+.3,
  branches = Math.random()*2+3,
  twig_chance = Math.random()*.5+.5,
  max_angle = Math.random()*Math.PI/2;

function generate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

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

  for (var i = 0; i<iterations ; i++) {
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

  }

function randomize(){
  iterations = 5,
  diam = Math.random()*1+1,
  len = (Math.random()*(screen.height/(iterations+1))+screen.height/(iterations+1))/2,
  diam_coef = Math.random()*.5+.5,
  len_coef = Math.random()*.7+.3,
  branches = Math.random()*2+3,
  twig_chance = Math.random()*.5+.5,
  max_angle = Math.random()*Math.PI/2;

  setRange(0, iterations);
  setRange(1, diam);
  setRange(2, len);
  setRange(3, diam_coef);
  setRange(4, len_coef);
  setRange(5, branches);
  setRange(6, twig_chance);
  setRange(7, max_angle);
}

function usergen(){
  iterations = parseInt(getRange(0).value);
  diam = parseFloat(getRange(1).value);
  len = parseFloat(getRange(2).value);
  diam_coef = parseFloat(getRange(3).value);
  len_coef = parseFloat(getRange(4).value);
  branches = parseFloat(getRange(5).value);
  twig_chance = parseFloat(getRange(6).value);
  max_angle = parseFloat(getRange(7).value)*Math.PI;
  generate();
}

addRange("Iterations", 1, 6, 1);
addRange("Diameter", 1.01, 1.99, .01);
addRange("Length", 1, screen.height/4, 1);
addRange("Diameter Coefficient", .01, .99, .01);
addRange("Length Coefficient", .01, .99, .01);
addRange("Branches",1,7,1);
addRange("Twig Chance", 0.01,0.99,0.01);
addRange("Max Angle",0.01,.5,.01,function(val){
  return val+" π";
});

var button = document.createElement("button");
button.innerHTML = "Regenerate";
button.onclick = usergen;
addElement(button);

var randomizeButton = document.createElement("button");
randomizeButton.innerHTML = "Randomize";
randomizeButton.onclick = randomize;
addElement(randomizeButton);


randomize();
generate();