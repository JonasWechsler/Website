function World(WIDTH,HEIGHT){
    var web_length = WIDTH/4;

    var particles = new Array();
    var BIG_G = 6.67384 * update_rate;
    var num = 20;
  
    var camera, bigBounds, player;

    var playerSpeed = .02;

  	var min = Math.min;
  	var colors = ["#ABF8FF", "#E76B76", "#1D2439", "#4F3762", "#67F9FF", "#0C0F18"];

    /**
    *
    */
    function particle(x, y, m, i, j){
        var density = 1;
        this.terminal_velocity = 7;
        this.x = x;
        this.y = y;
        this.i = i;
        this.j = j;
        this.m = m;//mass
        this.r = Math.sqrt(this.m)*20;//radius
      	this.critical_mass = 2*this.m;
      	this.d2x = 0;
        this.d2y = 0;
        this.color = colors[Math.floor(Math.random()*colors.length)];
      	this.swallow = function (p){
         	this.i=(this.m*this.i+p.m*p.i)/this.m;
          this.j=(this.m*this.j+p.m*p.j)/this.m;
          this.m+=p.m;
          this.r=Math.sqrt(this.m)*20;
        }
        this.drain = function(p,overlap){
          p.r -= overlap;
          this.r += overlap;
          this.m = this.r*this.r;
        }
        this.draw = function (context) {
          var tx = this.x - particles[0].x;
          var ty = this.y - particles[0].y;
          
					this.d2x = (tx) + CENTER_X;
          this.d2y = (ty) + CENTER_Y;
          
          ctx.beginPath();
          ctx.globalAlpha = 0.5;
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = this.color;
          ctx.arc(this.d2x,this.d2y, this.r, Math.PI * 2, false);
          ctx.fill();
          ctx.closePath();
        }
    }

    /**
    *
    */
    function rint(int) {
        return Math.random() * int;
    }
		
    /**
    *
    */
    /**
    *
    */
  	this.newRandParticle = function(x,y){
      var rand = Math.random();
      var size = (rand < .25)?.4:(rand < .5)?.4:(rand < .75)?.6:.8;

      if(!x)x = (rint(CENTER_X * 2) - CENTER_X);
      if(!y)y = (rint(CENTER_Y * 2) - CENTER_Y);

      var rand1 = rint(2) - 1;
      var rand2 = rint(2) - 1;

      particles.push(new particle(x, y, size*size, rand1, rand2));
    }
    /**
    *
    */
  	this.spawnPlayer = function(){
			particles[0] = new particle(0, 0, .6, 0, 0);
      particles[0].terminal_velocity=5;
    }
    /**
    *
    */
    this.setBounds = function(){
      camera={
        left:particles[0].x-WIDTH/2,
        top:particles[0].y+HEIGHT/2,
        right:particles[0].x+WIDTH/2,
        bottom:particles[0].y-HEIGHT/2
      };

      bigBounds={
        left:particles[0].x-WIDTH*1.5,
        top:particles[0].y+HEIGHT*1.5,
        right:particles[0].x+WIDTH*1.5,
        bottom:particles[0].y-HEIGHT*1.5  
      };
    }
    /**
    *
    */
	
    this.inBigBounds = function(x,y){
      return x<bigBounds.right &&
        x>bigBounds.left &&
        y<bigBounds.top &&
        y>bigBounds.bottom;
    }
    /**
    *
    */
    this.inCamBounds = function(x,y){
      return x<camera.right &&
        x>camera.left &&
        y<camera.top &&
        y>camera.bottom;
    }
    /**
    *
    */
    this.populate = function(){
      for(var i=0;i<particles.length;i++){
        if(!this.inBigBounds(particles[i].x,particles[i].y)){
          particles.splice(i,1);
        }
      }  
      for(var i=0;i<num-particles.length;i++){
        var newX = Math.random()*WIDTH+bigBounds.left;
        var newY = Math.random()*HEIGHT+bigBounds.bottom;
        switch(Math.floor(Math.random()*8)){
          case 0: break;
          case 1: newX+=WIDTH; break;
          case 2: newX+=WIDTH*2; break;
          case 3: newY+=HEIGHT; break;
          case 4: newY+=HEIGHT; newX+=WIDTH*2; break;
          case 5: newY+=HEIGHT*2; break;
          case 6: newY+=HEIGHT*2; newX+=WIDTH; break;
          case 7: newY+=HEIGHT*2; newX+=WIDTH*2; break;
          default: console.error("Shouldn't happen");
        }
        this.newRandParticle(newX,newY);
      }
    }
    
    /**
    *
    */
  	this.draw = function(ctx){
      	ctx.beginPath();
        ctx.globalCompositeOperation = "source-over";
        ctx.rect(0, 0 , CENTER_X*2, CENTER_Y*2);
        ctx.fillStyle = "#151a28";
        ctx.fill();
        ctx.closePath();
      	
      	var star_count = 100;
      	for(var s=0;s<star_count;s++){
          
        }
      
        for (var n = 0; n < particles.length; n++) {//Draw particles
            if (particles[n] == 0) continue;
            for (var m = 0; m < particles.length; m++) {
                if (n === m || particles[m] == 0) {
                    continue;
                }
                var p1 = particles[n];
                var p2 = particles[m];
                var dx = p2.x - p1.x;
                var dy = p2.y - p1.y;

                var h = Math.sqrt(dx * dx + dy * dy);

                if (h === 0 || !h) {
                    continue;
                }
							
						  if (h < web_length){
                  ctx.beginPath();
                  ctx.globalAlpha = 5/h;
                  ctx.lineWidth = 3;
                	ctx.moveTo(p1.d2x, p1.d2y);
                  ctx.lineTo(p2.d2x, p2.d2y);
                  ctx.strokeStyle = p1.color;
                  ctx.stroke();
                  ctx.closePath();
              	}
            }
        }
      
        for (i = 0; i < particles.length; i++) {
            particles[i].draw(ctx);
        }
				ctx.fillStyle = "white";
        for (i = 0; i < particles.length; i++) {//Minmap
          if(i==0)ctx.fillRect((particles[i].x-bigBounds.left)/(WIDTH*.0125)-(particles[i].r*.125)/2,(particles[i].y-bigBounds.bottom)/(WIDTH*.0125)-(particles[i].r*.125)/2,particles[i].r*.125,particles[i].r*.125);
          else ctx.fillRect((particles[i].x-bigBounds.left)/(WIDTH*.0125)-(particles[i].r*.125)/2,(particles[i].y-bigBounds.bottom)/(WIDTH*.0125)-(particles[i].r*.125)/2,particles[i].r*.125,particles[i].r*.125);
        }
    }
    
    
    /**
    *
    */
    this.stepPhysics = function(){
      this.player = particles[0];
      console.log(particles[0].i,particles[0].j);
      for (var n = 0; n < particles.length; n++) {
            if (particles[n] == 0) continue;
            for (var m = 0; m < particles.length; m++) {
              	if (n === m || particles[m] == 0 || !particles[n] || !particles[m]) {
                    continue;
                }
                var p1 = particles[n];
                var p2 = particles[m];
              
              	var dx = p2.x - p1.x;
                var dy = p2.y - p1.y;

                var h = Math.sqrt(dx * dx + dy * dy);

                if (h === 0) {
                    continue;
                }
                var Fg = (BIG_G * p2.m) / (h * h);

                var Fgx = Fg * (dx / h);
                var Fgy = Fg * (dy / h);

                if (h < p1.r + p2.r) {
                    Fgx = 0;
                    Fgy = 0;
                  	if(p1.r>=p2.r){
                      p1.swallow(p2);
                      particles.splice(m,1);
                      if(p2.m > p2.critical_mass){
                        //var new_mass = p1.

                      }
                      //p1.swallow(p2,p1.r+p2.r-h);
                      //if(p2.r<0)
                      //	particles.splice(m,1);
                    }
                }

                particles[n].i += Fgx;
                particles[n].j += Fgy;
                
                if (particles[n].i > particles[n].terminal_velocity) particles[n].i = particles[n].terminal_velocity;
                if (particles[n].j > particles[n].terminal_velocity) particles[n].j = particles[n].terminal_velocity;
                if (particles[n].i < -1 * particles[n].terminal_velocity) particles[n].i = -1 * particles[n].terminal_velocity;
                if (particles[n].j < -1 * particles[n].terminal_velocity) particles[n].j = -1 * particles[n].terminal_velocity;

            }
        }
        if(keys[W])particles[0].j-=playerSpeed;
        if(keys[A])particles[0].i-=playerSpeed;
        if(keys[S])particles[0].j+=playerSpeed;
        if(keys[D])particles[0].i+=playerSpeed;
      
        for (i = 0; i < particles.length; i++) {
            particles[i].x += particles[i].i;
            particles[i].y += particles[i].j;
        }
        //particles[0].x;
        //particles[0].y;
    }
    /**
    *
    */
    this.init = function(){
      particles = new Array();
      this.spawnPlayer();
      this.setBounds();
      this.populate();
    }
    
    this.init();
    
  }