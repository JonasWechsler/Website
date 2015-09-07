/*Game time*/

var dynamics = [];
var statics = [];
var fixeds = [];
var triggers = [];
var timestamp = 0;
var currentMaterial = new Material(1,"red",function(){});

var clearAll = function(){
  dynamics = [];
  statics = [];
  fixeds = [];
  triggers = [];
  timestamp = [];
  currentMaterial = new Material(1,"red",function(){});
}

var acceleration = function(x,y){
  return new Vector(0,.05);
};

var friction = function(x,y){
  return .99;
};

var setMaterial = function(material){
  currentMaterial = material;
}

function Material(bounce,debugColor,callback){
  this.bounce = bounce;
  this.debugColor = debugColor;
  this.callback = callback;
}

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
  this.maxSpeed = this.r;
  this.speed = speed;
  this.accelerate = function(v){
    this.speed = this.speed.plus(v);
  }
  this.move = function(){
    if(this.speed.length() > this.maxSpeed){
      this.speed = this.speed.unit().times(this.r);
    }
    this.position = this.position.plus(this.speed);
  
  }
}

function Flapper(position, angleSpeed, upAngle, downAngle){
  if (!position.vector) {
    throw new Exception("Center should be a vector");
  }
  this.type = "spinner";
  this.position = position;
  this.up = false;
  this.moving = false;
  this.upAngle = upAngle;
  this.downAngle = downAngle;
  this.angle = this.downAngle;
  this.angleSpeed = angleSpeed;
  var structure = [2,-11,
    48,20,
    49,24,
    49,28,//tip
    45,32,
    41,32,
    -5,10,
    -11,5,
    -12,-1,
    -9,-7,
    -4,-11,
    2,-11];
  this.segments = [];
  for(var i=2;i<structure.length;i+=2){
    var v0 = new Vector(structure[i-2]+position.x,structure[i-1]+position.y),
    v1 = new Vector(structure[i]+position.x,structure[i+1]+position.y),
    segment = new LineSegment(v0,v1);
    segment.material = this.material;
    this.segments.push(new LineSegment(v0,v1));
  }
  this.getSpeedAt = function(position){
    if(!this.moving)
      return 0;
    var speed = 2*Math.PI*this.position.distanceTo(position)*this.angleSpeed*Math.PI;
    var translated = this.segments[2].v1.minus(this.position);
    var perp = new Vector(translated.y*-1, translated.x).unit().times(speed);

    return perp;
  }
  this.move = function(){
    if(this.angle/this.upAngle < 1 && this.up){
      if(1 - this.angle/this.upAngle < this.angleSpeed/this.upAngle){
        this.angle = this.upAngle;
        this.moving = false;
      }else{
        this.angle += this.angleSpeed;
        this.moving = true;
      }
    }else if(this.angle/this.downAngle > 1 && !this.up){
      if(this.angle/this.downAngle < this.angleSpeed/this.downAngle){
        this.angle = this.downAngle;
        this.moving = false;
      }else{
        this.angle -= this.angleSpeed;
        this.moving = true;
      }
    }else{
        this.moving = false;
    }
    this.segments = [];
    for(var i=2;i<structure.length;i+=2){
      var v0 = new Vector(structure[i-2]+position.x,structure[i-1]+position.y)
      .rotate(this.angle*Math.PI,this.position);
      var v1 = new Vector(structure[i]+position.x,structure[i+1]+position.y)
      .rotate(this.angle*Math.PI,this.position);
      var segment = new LineSegment(v0,v1);
      segment.material = this.material;
      this.segments.push(new LineSegment(v0,v1));
    }
  }
}

function TriggerBall(position, r, effect) {
  if (!position.vector) {
    throw new Exception("Center should be a vector");
  }
  if (!r) {
    throw new Exception("Radius should be number > 0");
  }
  this.type = "Ball";
  this.position = position;
  this.r = r;
  this.effect = effect; 
}

function TriggerLineSegment(v0, v1, effect){
  if (!v0.vector || !v1.vector) {
    throw new Exception("Parameters should be vectors");
  }
  this.type = "LineSegment";
  this.v0 = v0;
  this.v1 = v1;
  this.effect = effect;
}

var addStatic = function(stat){
  stat.material = currentMaterial;
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
  fixed.material = currentMaterial;
  fixeds.push(fixed);
}

var addTrigger = function(trigger){
  if(!trigger.effect)
    throw "Triggers must have effects";
  triggers.push(trigger);
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
  triggers.forEach(function(trigger){
    dynamics.forEach(function(dynamic){
      if(trigger.type === "LineSegment" && VectorMath.intersectSegBall(trigger,dynamic)){
        trigger.effect();
      }
      if(trigger.type === "Ball" && VectorMath.intersectBallBall(trigger,dynamic)){
        trigger.effect();
      }
    });
  });

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
    dynamic.speed = dynamic.speed.unit().times(speed);
    if(dynamic.speed.length() > 1|| stat.material.bounce > 1)
      dynamic.speed = dynamic.speed.times(stat.material.bounce);
    stat.material.callback(dynamic.speed.length()/dynamic.maxSpeed);
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
      var collision = false,
      collided = fixed;
      if(fixed.segments){
        for(var i=0;i<fixed.segments.length;i++){
          var val = fixed.segments[i];
          collision = VectorMath.intersectSegBall(val, dynamic);
          if(collision){
            collided = fixed.segments[i];
            collided.material = fixed.material;
            break;
          }
        }
      }else{
        collision = VectorMath.intersectSegBall(fixed, dynamic);
      }
      if(collision){
        resolveCollision(dynamic,collided);
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

  for(var i=0;i<statics.length;i++){
    var v = statics[i];
    var v0 = v.v0;
    var v1 = v.v1;

    ctx.strokeStyle = v.material.debugColor;
    ctx.fillStyle = v.material.debugColor;

    ctx.beginPath();
    ctx.moveTo(v0.x, v0.y);
    ctx.lineTo(v1.x, v1.y);
    ctx.stroke();
  }

  for(var i=0;i<fixeds.length;i++){
    var fixed = fixeds[i];
    ctx.strokeStyle = fixed.material.debugColor;
    ctx.fillStyle = fixed.material.debugColor;
    if(fixed.segments){
      for(var j=0;j<fixed.segments.length;j++){
        var v = fixed.segments[j],
         v0 = v.v0,
         v1 = v.v1;

        ctx.beginPath();
        ctx.moveTo(v0.x, v0.y);
        ctx.lineTo(v1.x, v1.y);
        ctx.stroke();
      }
    }else{
      var v0 = fixed.v0;
      var v1 = fixed.v1;

      ctx.beginPath();
      ctx.moveTo(v0.x, v0.y);
      ctx.lineTo(v1.x, v1.y);
      ctx.stroke();
    }
  }

  ctx.strokeStyle = "blue";
  ctx.fillStyle = "blue";
  for(var i=0;i<dynamics.length;i++){
    ctx.beginPath();
    ctx.arc(dynamics[i].position.x, dynamics[i].position.y, dynamics[i].r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(dynamics[i].speed.length(),0,10+i*10);
  }
}