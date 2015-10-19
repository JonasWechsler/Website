var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");

canvas.width = screen.width;
canvas.height = screen.height;

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function World() {
  var points = [];
  
  var x = 0;
  var last_y = canvas.height/2;

  var algorithm = "perlin";
  var algorithms = ["perlin", "urban"];

  var zone_width = 100;

  var perlin_resolution = 15;
  var perlin_subgraphs = [];
  var perlin_smoothness = .995;//0<smooth<1
  
  var generate_perlin = function(){
    var new_point = false;
		for(var idx=1;idx<perlin_resolution;idx++){
      var frequency = Math.pow(2,idx),
          wavelength = Math.floor(zone_width/frequency),
          persistance = 1/2,
          amplitude = Math.pow(persistance,idx)*canvas.height;
        
      if(x%wavelength==0){
        perlin_subgraphs[idx] = amplitude*Math.random();
        new_point=true;
      }
  	}
    if(new_point){
      var y = 0;
      perlin_subgraphs.forEach(function(val){
        if(val)
          y+=val;
      });
      y = last_y*perlin_smoothness + y*(1-perlin_smoothness);
      last_y = y;
      points.push(new Point(x,y));
    }
    return new_point;
  }
  
  var urban_building_height=50;
  var urban_building_length=10;
  
  var generate_urban = function() {
    x++;
    var new_point = false;
    if(Math.random() < 1/urban_building_length){
      points.push(new Point(x,last_y));
      last_y = last_y + (Math.random()*urban_building_height*2-urban_building_height);
      points.push(new Point(x,last_y));
      new_point = true;
    }
    if(last_y > canvas.height)last_y = canvas.height;
    if(last_y < 0) last_y = 0;
    return new_point;
  }
  this.generate = function() {
    x++;
    if (Math.random() < 1 / zone_width) {
      algorithm = algorithms[Math.floor(Math.random() * algorithms.length)];
    }
    if(algorithm === "perlin")
        generate_perlin();
    else if(algorithm ===  "urban")
        generate_urban();
  }
  this.setX = function(newx){
    x=newx;
  }
  this.getX = function(){
    return x;
  }
  this.setPoints = function(newp){
    points = newp;
  }
  this.getPoints = function(){
    return points;
  }
}

var world = new World();
setInterval(function(){
	if(world.getX()>canvas.width){
    world.setX(-1*10);
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    world.setPoints([]);
  }
  world.generate();
  ctx.beginPath();
  var points = world.getPoints();
  ctx.moveTo(points[0].x,points[0].y);
  ctx.fillStyle="black";
  points.forEach(function(val){
      ctx.lineTo(val.x, val.y);
    	ctx.fillRect(val.x, val.y,1,canvas.height);
  });
  ctx.stroke();
},10);