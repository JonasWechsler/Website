
setAcceleration(function(x,y){
  //return new Vector(-1*(x-canvas.width/2),-1*(y-canvas.width/2)).divided(1000);
  return new Vector(0,.02);
});

var sounds = [];

var playSound = function(sound,vol){
	if(!sounds[sound]){
		sounds[sound] = new Audio('sounds/' + sound);
	}
	sounds[sound].volume = vol;
	sounds[sound].play();
}

var build = function(){
	clearAll();
	var stat = function(x0,y0,x1,y1){
		addStatic(new LineSegment(new Vector(x0,y0), new Vector(x1,y1)));
	}
	var lastStroke = new Vector(0,0);
	var moveTo = function(x,y){
		lastStroke = new Vector(x,y);
	}
	var strokeTo = function(x,y){
		var vec = new Vector(x,y);
		addStatic(new LineSegment(lastStroke,vec));
		lastStroke = vec;
	}
	var rubber = new Material(0,"black",function(vol){
		if(vol<.05)vol*=vol;
		vol = Math.min(vol,1);
		var sounds = ["Percussive Elements-06.wav"],
		i = Math.floor(Math.random()*sounds.length);
		playSound(sounds[i],vol);
	});
	var bouncey = new Material(2,"red",function(vol){
		vol = Math.min(vol,1);
		var sounds = ["Percussive Elements-15.wav"],
		i = Math.floor(Math.random()*sounds.length);
		playSound(sounds[i],vol);
	});
	var wood = new Material(.95, "blue", function(vol){
		vol = Math.min(vol,1);
		var sounds = ["Percussive Elements-04.wav",
		"Percussive Elements-05.wav"],
		i = Math.floor(Math.random()*sounds.length);
		playSound(sounds[i],vol);
	});

	setMaterial(rubber);

	var world = new World(1080);

	moveTo(0,0);
	for(var x=0;x<1280;x++){
	  	strokeTo(x,1080 - world.getHeightAt(x));
	}
	strokeTo(1280-1,0);

	addDynamic(new DynamicBall(new Vector(413,370), 10, new Vector(0,0)));
}

build();
