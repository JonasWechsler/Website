/*Game time*/

var dynamics = [];
var statics = [];
var fixeds = [];
var timestamp = 0;

var acceleration = function(x,y){
  return new Vector(0,.05);
};

var friction = function(x,y){
  return .99;
};

function LineSegment(v0, v1) {
  if (!v0.vector || !v1.vector) {
    throw new Exception("Parameters should be vectors");
  }
  this.v0 = v0;
  this.v1 = v1;
}

var polygon = function(x,y,r,sides){
  var sides = [];
  var last_theta = (1-1/sides)*Math.PI*2,
    last_x0 = Math.cos(last_theta)*r,
    last_y0 = Math.sin(last_theta)*r;
  for(var i=0;i<sides;i++){
    var theta = (i/sides)*Math.PI*2;
    var x0 = Math.cos(theta)*r;
    var y0 = Math.sin(theta)*r;
    sides.push(new LineSegment(new Vector(last_x0,last_y0),new Vector(x0,y0)));
    last_theta = theta;
    last_x0 = x0;
    last_y0 = y0;
  }
  return sides;
}

function Ball(position, r) {
  if (!position.vector) {
    throw new Exception("Center should be a vector");
  }
  if (!r) {
    throw new Exception("Radius should be number > 0");
  }
  this.position = position;
  this.r = r;
}

function DynamicBall(position,r,speed){
  if (!position.vector) {
    throw new Exception("Center should be a vector");
  }
  if (!r) {
    throw new Exception("Radius should be number > 0");
  }
  this.type = "ball";
  this.position = position;
  this.r = r;
  this.speed = speed;
  this.accelerate = function(v){
    this.speed = this.speed.plus(v);
  }
  this.move = function(){
    if(this.speed.length() > this.r){
      this.speed = this.speed.unit().times(this.r);
    }
    this.position = this.position.plus(this.speed);
  
  }
}

function Spinner(position){
  /*extends LineSegment*/
  if (!position.vector) {
    throw new Exception("Center should be a vector");
  }
  this.type = "spinner";
  this.position = position;
  this.v0 = position;
  this.v1 = position.plus(new Vector(50,0));
  
  this.getSpeedAt = function(position){
    if(timestamp%100>=50)
      return 0;

    var speed = 2*Math.PI*this.position.distanceTo(position)*.04*Math.PI;

    var translated = this.v1.minus(this.v0);
    var perp = new Vector(translated.y*-1, translated.x).unit().times(speed);

    return perp;
  }
  this.move = function(){
    if(timestamp%100<50){
    this.v1 = this.v1.rotate(.04*Math.PI,this.v0);
     }
  }
}

var addStatic = function(stat){
  statics.push(stat);
}

var addDynamic = function(dynamic){
  if(!dynamic.move || !dynamic.accelerate || !dynamic.position){
    throw "Dynamics must have move(), accelerate(vector), and position attributes";
  }
  dynamics.push(dynamic);
}

var addFixed = function(fixed){
  if(!fixed.move || !fixed.position || !fixed.getSpeedAt){
    throw "Dynamics must have move(), getSpeedAt(Vector), and position attributes";
  }
  fixeds.push(fixed);
}

var setAcceleration = function(fn){
  acceleration = fn;
}

var stepPhysics = function(){
  /**
  * 1 move all dynamics according to level rules. This includes momentum, friction, and other forces
  * 2 check for dynamic on static collisions
  * 3 move all fixeds according to their specific rules.
  */
  dynamics.forEach(function(dynamic){
    dynamic.move();
    dynamic.accelerate(acceleration(dynamic.position.x,dynamic.position.y));
    dynamic.speed = dynamic.speed.times(friction(dynamic.position.x,dynamic.position.y));
  });

  fixeds.forEach(function(fixed){
    fixed.move();
  });

  var resolveCollision = function(dynamic,stat){
    var v0 = stat.v0;
    var v1 = stat.v1;
    var projectedScalar = VectorMath.project(dynamic.position.minus(v0),v1.minus(v0));
    var projectedVector = v0.plus(v1.minus(v0).unit().times(projectedScalar));
    var projectedSpeed = VectorMath.project(dynamic.speed,v1.minus(v0));

    var overlap = dynamic.r - dynamic.position.distanceTo(projectedVector);
    var overlapVector = projectedVector.minus(dynamic.position).unit().times(overlap);

    var perpendicularComponent = Math.sqrt(dynamic.speed.length()*dynamic.speed.length()-projectedSpeed*projectedSpeed);
    var speed = dynamic.speed.length();

    dynamic.accelerate(projectedVector.minus(dynamic.position).unit().times(-2).times(perpendicularComponent));
    dynamic.speed = dynamic.speed.unit().times(speed).times(.5);
    dynamic.position = dynamic.position.minus(overlapVector);
  }

  dynamics.forEach(function(dynamic){
    var deepest_collision = {overlap:Math.pow(2,32) - 1};
    statics.forEach(function(stat){
      var collision = VectorMath.intersectSegBall(stat, dynamic);
      if(collision){
        resolveCollision(dynamic,stat);
      }
    });
    fixeds.forEach(function(fixed){
      var collision = VectorMath.intersectSegBall(fixed, dynamic);
      if(collision){
        resolveCollision(dynamic,fixed);
        dynamic.speed = dynamic.speed.plus(fixed.getSpeedAt(dynamic.position));
      }
    });
  });
  //TODO Fix "sticky" back collisions
  timestamp++;
}

var drawPhysics = function(ctx){
  ctx.fillStyle = "rgba(255,255,255,.01)";
  ctx.clearRect(0,0,canvas.width,canvas.height);

  statics.concat(fixeds).forEach(function(v){
    var v0 = v.v0;
    var v1 = v.v1;

    ctx.strokeStyle = "blue";
    ctx.fillStyle = "blue";

    ctx.beginPath();
    ctx.moveTo(v0.x, v0.y);
    ctx.lineTo(v1.x, v1.y);
    ctx.stroke();
  });

  fixeds.forEach(function(v){
    var v0 = v.v0;
    var v1 = v.v1;

    ctx.strokeStyle = "blue";
    ctx.fillStyle = "blue";

    ctx.beginPath();
    ctx.moveTo(v0.x, v0.y);
    ctx.lineTo(v1.x, v1.y);
    ctx.stroke();
  });

  ctx.strokeStyle = "blue";
  ctx.fillStyle = "blue";
  for(var i=0;i<dynamics.length;i++){
    ctx.beginPath();
    ctx.arc(dynamics[i].position.x, dynamics[i].position.y, dynamics[i].r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(dynamics[i].speed.length(),0,10+i*10);
  }
}