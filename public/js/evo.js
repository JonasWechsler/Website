/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}

function World(){
  var max_ID = 1;
  
  var rows = 50;
  var cols = 50;
  var grid = [];
  for(var c=0;c<cols;c++){
    grid[c] = [];
    for(var r=0;r<rows;r++){
      grid[c][r] = new Plant();

      if(Math.random()>(.9)){
        grid[c][r].init();
      }else{
        grid[c][r].zero();
      }
    }
  }
  var assign_new_ID = function(){
    var IDs = [];
    for(var r=0;r<rows;r++){
      for(var c=0;c<cols;c++){
        IDs[grid[c][r].ID] = true;
      }
    }
    var new_ID = 1;
    do{
      new_ID++;
    }while(IDs[new_ID])
    max_ID=Math.max(new_ID,max_ID);
    return new_ID;
  }
  this.step = function(ctx,w,h){
    var dw = w/cols;
    var dh = h/rows;
    dw = Math.ceil(dw);
    dh = Math.ceil(dh);
    for(var c=0;c<cols;c++){
      for(var r=0;r<rows;r++){
        if(grid[c][r])
        	ctx.fillStyle = grid[c][r].rgb();
        else
          ctx.fillStyle = "white";
        ctx.fillRect(dw*c,dh*r,dw,dh);
        ctx.fillStyle = "black";
       /*
        var text = [
          "HP:  " + Math.floor(100*grid[c][r].health)/100 + "/" + grid[c][r].max_health,
          "ID:  " + grid[c][r].ID,
          "DIV: " + 100*grid[c][r].dynamicism,
          "ATK: " + ~~(100*grid[c][r].stats.attack),
          "DMG: " + ~~(100*grid[c][r].stats.damage),
          "HPU: " + ~~(100*grid[c][r].stats.healing),
          
        ];
        for(var dy=10,i=0;dy<dh && i<text.length;dy+=10,i++){
        ctx.fillText(text[i],dw*c,dh*r+dy);
        }
        */
      }
    }
    var newgrid = [];
    
    for(var c=0;c<cols;c++){
      newgrid[c] = [];
      for(var r=0;r<rows;r++){
        newgrid[c][r] = grid[c][r].clone();
      }
    }
    for(var c=0;c<cols;c++){
      for(var r=0;r<rows;r++){
        if(!grid[c][r])
          continue;
        var s=0,n=0,e=0,w=0,
            c0=c-1,c1=c+1,r0=r-1,r1=r+1;
        if(c0<0)c0=cols-1;
        if(c1>=cols)c1=0;
        if(r0<0)r0=rows-1;
        if(r1>=rows)r1=0;
        s = grid[c0][r].compare(grid[c][r],"south",newgrid[c0][r]);
        n = grid[c1][r].compare(grid[c][r],"north",newgrid[c1][r]);
        e = grid[c][r0].compare(grid[c][r],"east",newgrid[c][r0]);
        w = grid[c][r1].compare(grid[c][r],"west",newgrid[c][r1]);
        var max = Math.max(s,n,e,w);
        switch(max){
          case 0:
            break;
          case s:
            newgrid[c][r].init(grid[c0][r]);
              break;
          case n:
            newgrid[c][r].init(grid[c1][r]);
              break;
          case e:
            newgrid[c][r].init(grid[c][r0]);
              break;case w:
            newgrid[c][r].init(grid[c][r1]);
              break;
        }
        newgrid[c][r].step();
      }
    }
    grid = newgrid;
    
  }
  this.reset = function(c,r){
    grid[c][r].zero();
  }
  this.rows = function(){
    return rows;
  }
  this.cols = function(){
    return cols;
  }
  function Plant(){
    this.ID = 0;
    this.dynamicism = 0;//1-1.1
    this.health = 0;
    this.max_health = 0;
    this.stats = {
      fertility:0,
      north:0,
      west:0,
      south:0,
      east:0,
      attack:0,
      defense:0,
      crowding:0,
      healing:0,
      damage:0
    };
    
    this.init = function(parent){
      if(parent==0){
        this.zero();
      }else if(!parent){
        this.random();
      }else{
      	this.set_vals(parent);
      }
    }
    this.zero = function(){
      this.dynamicism = 0;
      this.ID = 0;
      this.max_health = 1;
      this.health = 0;
      for (var stat in this.stats) {
          if (!this.stats.hasOwnProperty(stat)) {
              continue;
          }
        	this.stats[stat] = 0;
      }
    }
    this.clone = function(){
      var cloned = new Plant();
      cloned.dynamicism = this.dynamicism;
      cloned.ID= this.ID;
      cloned.max_health = this.max_health;
      cloned.health = this.health;
      for (var stat in this.stats) {
          if (!this.stats.hasOwnProperty(stat)) {
              continue;
          }
          cloned.stats[stat] = this.stats[stat];
      }
      return cloned;
    }
    this.set_vals = function(specimen){
      this.dynamicism = specimen.dynamicism;
      this.ID = specimen.ID;
      if(Math.random()>specimen.dynamicism){
        //2this.ID=assign_new_ID();
      }
      this.max_health = specimen.max_health;
      if(Math.random()>.5){
      	//this.dynamicism = Math.random()*.001+.999;
      }
      if(Math.random()>.5){
        this.max_health++;
      }else{
        this.max_health--;
      }
      this.health = this.max_health;
      for (var stat in specimen.stats) {
          if (!specimen.stats.hasOwnProperty(stat)) {
              //The current property is not a direct property of p
              continue;
          }
        	if(Math.random()>.5){
            this.stats[stat] = specimen.stats[stat]*specimen.dynamicism;
          }else{
            var divergence = specimen.stats[stat]*specimen.dynamicism - specimen.stats[stat];
            //this.stats[stat] -= divergence;
            this.stats[stat] = this.stats[stat]*(2-specimen.dynamicism);
          }
          this.stats[stat] = Math.min(this.stats[stat],.9);
          this.stats[stat] = Math.max(this.stats[stat],.1);
      }
    }
    this.random = function(){
      this.ID = max_ID;
      max_ID++;
      this.dynamicism = Math.random()*.1+.9;
      this.max_health = Math.floor(Math.random()*50+50);
      this.health = this.max_health;
      for (var stat in this.stats) {
          if (!this.stats.hasOwnProperty(stat)) {
              continue;
          }
          this.stats[stat] = Math.random();
      }
    }
    this.rgb = function(){
      var h = this.ID/max_ID;
      var s = .5;
      var v = .8+.05*this.health/this.max_health;
      if(this.health<=0){
        v = .65;
        s = .4;
      }
      if(!this.ID){
        h = .68;
        s = .2;
      }
      var rgb = HSVtoRGB(h,s,v);
      return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
    }
    /**
    *@return dominance
    */
    this.compare = function(plant,direction,next){ 
      if(this.health<0)
        return 0;
      if(Math.abs(plant.ID-this.ID)<1){
        return 0;
      }
      if(this.stats.defense < plant.stats.attack){
        next.health -= plant.stats.damage;
      }
      if(plant.health < 1 || plant.ID < 1){
        return this.stats[direction]*this.stats.fertility;
      }
      return 0;
    }
    this.step = function(){
      if(this.health>this.max_health)
        this.health = this.max_health;
      
      var total = 0;
      var denom = 0;
      total += this.health/100;
      total += this.max_health/100;
      denom+=2;
      for (var stat in this.stats) {
          if (!this.stats.hasOwnProperty(stat))
              continue;
        	total+= this.stats[stat];
        	denom++;
      }
      var energy_consumption = total/denom;
      this.health -= energy_consumption;
    }
  }
  function Envi(){
    this.fertility = 0;
  }
}
function relMouseCoords(canvas,event){
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
  	return {x:x,y:y};
}
var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

var world = new World();
var mouse_down = false;
var mouse_x = -1;
var mouse_y = -1;
document.addEventListener('mousedown', function(evt) {
  mouse_down = true;
  var coords = relMouseCoords(canvas,evt);
    mouse_x = coords.x;
    mouse_y = coords.y;
});
document.addEventListener('mouseup', function(evt) {
  mouse_down = false;
});
canvas.addEventListener('mousemove', function(evt) {
  if(!mouse_down)
    return;
  var coords = relMouseCoords(canvas,evt);
    mouse_x = coords.x;
    mouse_y = coords.y;
  }, false);

var delay = 10;

function frame(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(mouse_down){
  var r = Math.floor((mouse_y/canvas.height)*world.rows());
  	var c = Math.floor((mouse_x/canvas.width)*world.cols());
  for(var c0=c-5;c0<c+5;c0++){
    for(var r0=r-5;r0<r+5;r0++){
      if(c0>=0 && c0<world.cols() && r0>=0 && r0<world.rows() && Math.sqrt((c0-c)*(c0-c)+(r0-r)*(r0-r))<5)
        world.reset(c0,r0);
    }
  }
  }
  world.step(ctx,canvas.width,canvas.height);
  setTimeout(frame,delay);
}
frame();

addRange("Speed", 1,1000,1, function(r){
  delay = Math.floor(1000/r);
  return r + " fps";
});