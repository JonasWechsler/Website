/*TODO
 * -Options menu
 * -Fix sliding after contact
 * -Point scoring
 * -Holding down buttons
 * - 
 */

function TetrisMain(x,y,w,h,selector){
	var debug = true;

	var draw_x = x;
	var draw_y = y;
	var width = w;
	var height = h;
	var container = selector;
	var canvas = (selector)?false:true;

	const rows = 24;
	const cols = 10;
	const hidden_rows = 4;

	var frame = 0;
	var new_frame = true;
	var touch_time = 0;

	var board = [];//[r,c]
	var active = [];
	var seven_bag = [];
	var activeID = 0;
	var holdID = 0;
	var rotation = 0;
	var dropping = false;

	var key_bindings = [];
	var event_to_int = []; //for archiving replays
	var key_queue = [];
	var keys = [];

	/*Movement*/
	var slide_speed_mod = 5;//const
	var drop_speed_mod = 15;//const
	var frames_after_touch = 12;//const

	/*Regulations, Limits*/
	var swapped_this_turn = 0;
	var turn_swap_limit = 1;

	var game_over_callback = function(){console.log("Game Over")};
	var held_piece_callback = function(p){console.log(p)};
	var next_piece_callback = function(p){console.log(p)};

	var match_history = [];

	/*Rules*/



	/**/
	function Point(r,c){
		this.r = r;
		this.c = c;
	}

	/**
	 *
	 */
	this.init = function(x,y,w,h,selector){
		if(x && y && w && h){
			draw_x = x;
			draw_y = y;
			width = w;
			height = h;
		}
		if(selector)
			container = selector;

		//console.log(match_history);
		match_history=[];

		for(var row=0;row<rows+hidden_rows;row++){
			//TODO Why is this rows+hidden_rows
			board[row] = [];
			var a = cols;
			while(a--)board[row][a]=0;
		}
		if(selector){
			for(var r=0;r<rows-hidden_rows;r++){
				var string = "<div id=r"+r+">";
				for(var c=0;c<cols;c++){
					string+="<span id=c"+c+"></span>";
				}
				string+="</div>";
				$(container).append(string);
			}
		}

	}
	/**
	 *
	 */
	this.num_to_letter = function(num){
		switch(num){
			case 0:return "B";//Blank
			case 1:return "I";
			case 2:return "S";
			case 3:return "Z";
			case 4:return "O";
			case 5:return "J";
			case 6:return "L";
			case 7:return "T";
		}
	}
	/*******Block Management Methods********/

	/**
	 *
	 */
	this.generate_block = function(block){
		active=[];
		activeID = block;
		rotation = 0;
		var c = Math.ceil(cols/2);
		switch(block){
			case 1://I 
				active[0]= new Point(3,c-2);
				active[1]= new Point(3,c-1);
				active[2]= new Point(3,c);
				active[3]= new Point(3,c+1);
				break;
			case 2://s
				active[0]= new Point(2,c);
				active[1]= new Point(2,c+1);
				active[2]= new Point(3,c);//Rotation center
				active[3]= new Point(3,c-1);
				break;
			case 3://z
				active[0]= new Point(2,c);
				active[1]= new Point(2,c-1);
				active[2]= new Point(3,c);//Rotation center
				active[3]= new Point(3,c+1);
				break;
			case 4://O
				active[0]= new Point(2,c-1);
				active[1]= new Point(2,c);
				active[2]= new Point(3,c-1);
				active[3]= new Point(3,c);
				break;
			case 5://J
				active[0]= new Point(2,c-1);
				active[1]= new Point(3,c-1);
				active[2]= new Point(3,c);//Rotation center
				active[3]= new Point(3,c+1);
				break;
			case 6://L
				active[0]= new Point(2,c+1);
				active[1]= new Point(3,c-1);
				active[2]= new Point(3,c);//Rotation center
				active[3]= new Point(3,c+1);
				break;
			case 7://T
				active[0]= new Point(2,c);
				active[1]= new Point(3,c-1);
				active[2]= new Point(3,c);//Rotation center
				active[3]= new Point(3,c+1);
				break;
		}
		for(var i=0;i<active.length;i++)
			active[i].r+=1;
	}
	/**
	 *
	 */
	this.generate_block_random = function(){
		var block = seven_bag.shift();
		this.generate_block(block);
	}
	/**
	 *
	 */
	this.check_rows = function(){
		var clears=0;
rfor:for(var r=rows-1;r>=0;r--){
		 for(var c=0;c<cols;c++)
			 if(!board[r][c])
				 continue rfor;
		 clears++;
		 for(var r0=r;r0>0;r0--)
			 for(var c=0;c<cols;c++)
				 board[r0][c]=board[r0-1][c];

	 }
	 return clears;
	}
	/**
	 *
	 */
	this.new_turn = function(){
		swapped_this_turn = 0;
		var drop = {pieces:[],ID:activeID,color:"white"};
		//match_history
		for(var i=0;i<active.length;i++){
			board[active[i].r][active[i].c]=activeID;
			drop.pieces.push({r:active[i].r,c:active[i].c});
		}
		match_history.push(drop);
		this.generate_block_random();
		if(!this.shift("none")){
			game_over_callback();
		}
		touch_time = 0;
	}
	/**
	 *
	 */
	this.resolve_contact = function(){
		var contact = frame%drop_speed_mod==0 && !this.shift('down');
		if(contact && !touch_time){
			touch_time = frame;
		}
		if(frame - touch_time > frames_after_touch && touch_time && contact){
			this.new_turn();
		}
		return contact;
	}
	/**********Control Methods***************/
	/**
	 *@dir - cw, ccw
	 */
	this.rotate = function(dir){
		if(!dir)dir="cw";
		dir = dir.toLowerCase();
		rotation++;
		rotation=rotation%4;
		var center_r;
		var center_c;
		switch(activeID){
			case 1://I 
				center_r = (active[1].r+active[2].r)/2;
				center_c = (active[1].c+active[2].c)/2;
				switch(rotation){
					case 0:
						center_r-=.5;
						break;
					case 1:
						center_c-=.5;
						break;
					case 2:
						center_r+=.5;
						break;
					case 3:
						center_c+=.5;
						break;
				}
				break;
			case 2://s
			case 3://z
			case 5://J
			case 6://L
			case 7://T
				center_r=active[2].r;
				center_c=active[2].c;
				break;
			case 4://O
				return;
		}
		var new_active = [];
		var old_active = active;
		for(var i=0;i<active.length;i++){
			var r = (active[i].c-center_c);
			var c = (active[i].r-center_r);
			switch(dir){
				case "cw":c*=-1;break;
				case "ccw":c*=-1;break;
			}
			r+=center_r;
			c+=center_c;
			new_active[i] = new Point(r,c);
		}
		active = new_active;
		if(!this.shift("none")&&!this.shift("left")&&!this.shift("right")&&!this.shift("right")&&!this.shift("up")){
			active=old_active;
			return;
		}
	}
	/**
	 *
	 */
	this.swap = function(){
		if(swapped_this_turn < turn_swap_limit){
			var oldHold = holdID;
			holdID = activeID;
			activeID = oldHold;
			if(!activeID)
				this.generate_block_random();
			else
				this.generate_block(activeID);
			swapped_this_turn++;
		}
		held_piece_callback(holdID);
	}
	/**
	 *
	 */
	this.shift = function(dir){
		var dx = 0;
		var dy = 0;
		switch(dir.toLowerCase()){
			case 'up':
			case 'north':
			case 0:
				dy--;
				break;
			case 'right':
			case 'east':
			case 1:
				dx++;
				break;
			case 'down':
			case 'south':
			case 2:
				dy++;
				break;
			case 'left':
			case 'west':
			case 3:
				dx--;
				break;
			case 'none':
			case 4:
				break;
		}
		/**0**
		 *3*1*
		 **2**/
		for(var i=0;i<active.length;i++){
			var t = active[i];
			if(board[t.r+dy][t.c+dx] || t.r + dy >= rows)return false;
			if(t.c+dx < 0 || t.c+dx >=cols)
				return false;
		}
		for(var i=0;i<active.length;i++){
			active[i].r+=dy;
			active[i].c+=dx;
		}
		return true;
	}
	/**
	 *
	 */
	this.start_drop = function(){
		dropping = true;
	}
	/**
	 *
	 */
	this.stop_drop = function(){
		dropping = false;
	}
	/**
	 *
	 */
	this.drop = function(){
		for(var i=0;i<height && this.shift('down');i++);
		this.new_turn();
	}
	/******Player Interaction Methods*********/
	/**
	 *
	 */
	this.bind = function(key,event){
		key_bindings[key]=event;
	}
	/**
	 *
	 */
	this.queue_key_event = function(key,down){
		key_queue.push({key:key,down:down});
	}
	/**
	 *
	 */
	this.resolve_key_queue = function(){
		while(key_queue.length){
			var event = key_queue.shift();
			if(!keys[event.key]&&event.down)
				this.on_down(event.key);
			else if(keys[event.key]&&!event.down)
				this.on_up(event.key);
			keys[event.key]=event.down;
		}
	}
	/**
	 *
	 */
	this.on_down = function(key){
		var name = key_bindings[key];
		switch(name){case "cw":
			case "ccw":
				this.rotate(name);
				break;
			case "fast":
				this.drop();
				break;
		}
	}
	/**
	 *
	 */
	this.on_up = function(key){

	}

	/**
	 *
	 */
	this.while_pressed = function(){
		var tetra = this;
		var any_pressed = false;
		key_bindings.forEach(function(name,key){
				//var name = key_bindings[key];
				any_pressed=keys[key]||any_pressed;
				if(keys[key]){
				keys[key]++;
				if(keys[key]%slide_speed_mod==0)
				switch(name){
				case "left":
				case "right":
				tetra.shift(name);
				break;
				case "soft":
				tetra.shift("down");
				break;
				case "swap":
				tetra.swap();
				break;
				}
				}
				});
		return any_pressed;
	}
	/***********Communication***************/
	/**
	 *
	 */
	this.game_over = function(callback){
		game_over_callback = callback;
	}
	/**
	 *
	 */
	this.hold = function(callback){
		held_piece_callback = callback;
	}
	/**
	 *
	 */
	this.next = function(callback){
		next_piece_callback = callback;
	}
	/**
	 *
	 */
	this.get_seven_bag = function(){
		return seven_bag;
	}
	/**
	 *
	 */
	this.get_shadow_piece = function(){
		var active_clone = [];
		var len = 4;
		for(var i=0;i<active.length;i++){
			active_clone[i]=new Point(active[i].r,active[i].c);
		}
		for(var i=0;i<height;i++){
			for(var j=0;j<len;j++){
				var t = active_clone[j];
				if(board[t.r+1][t.c] || t.r+1 >= rows)
					return active_clone;
			}
			for(var j=0;j<len;j++){
				active_clone[j].r++;
			}
		}
		return active_clone;
	}
	/*********Running Methods***************/
	/**
	 *
	 */
	this.step = function(){
		if(seven_bag.length < 8){
			var nums = [1,2,3,4,5,6,7];
			for(var ii=0;ii<7;ii++){
				var i = Math.floor(Math.random()*nums.length);
				seven_bag.push(nums[i]);
				nums.splice(i,1);
			}
		}
		if(!activeID){
			this.generate_block_random();
		}
		this.resolve_key_queue();
		new_frame = frame%drop_speed_mod==0||new_frame;
		new_frame = this.while_pressed()||new_frame;//TODO implement new_frame
		new_frame = this.resolve_contact()||new_frame;
		this.check_rows();
		frame++;
	}
	/**
	 *
	 */
	this.get_colors = function(ID){
		var color = "white";
		switch(ID){
			case 1:
				color="cyan";
				break;
			case 2:
				color="green";
				break;
			case 3:
				color="red";
				break;
			case 4:
				color="yellow";
				break;
			case 5:
				color="blue";
				break;
			case 6:
				color="orange";
				break;
			case 7:
				color="purple";
				break;
			case 8:
				color="gray";
				break;
		}
		return color;
	}
	/**
	 *
	 */
	this.draw = function(ctx){
		if(!new_frame)
			return;
		var block_height = height/(rows-hidden_rows);
		var block_width = width/cols;
		for(var r=hidden_rows;r<rows;r++){
			for(var c=0;c<cols;c++){
				var x = draw_x + block_width*c;
				var y = draw_y + block_height*(r-hidden_rows);
				var ID = board[r][c];
				var color = "white";
				var highlight = "white";
				var shadow = this.get_shadow_piece();
				for(var i=0;i<4;i++){
					if(active[i].r==r && active[i].c==c){
						ID=activeID;
						break;
					}
					if(shadow[i].r==r && shadow[i].c==c){
						ID=8;
					}
				}
				if(ID)
					color = this.get_colors(ID);
				else
					if(r < hidden_rows)
						color="gray";
				if(canvas){
					ctx.fillStyle=color;
					ctx.fillRect(x,y,block_width,block_height);
					if(ID!=0){
						ctx.fillStyle="rgba(255,255,255,.1)";
						ctx.fillRect(x+block_width/8,y+block_height/8,block_width*.75,block_height*.75);
					}
				}else{
					$(selector + " #r" + (r-hidden_rows) + " #c" + c).removeClass().addClass(this.num_to_letter(ID)).css("background-color",color);
				}
			}
		}
		new_frame = false;
		if(debug){
			var i = 10;
			var write = function(s){
				ctx.fillText(s,0,i);
				i+=10;
			}
			ctx.fillStyle="black";
			write("draw_x: " + draw_x + ", draw_y: " + draw_y);
			write(", width: " + width + ", height: " + height + "\n");
			write("container: " + container + ", canvas: " + canvas + "\n");
			write("rows: " + rows + ", cols: " + cols + ", hidden: " + hidden_rows + "\n");
			write("frame: " + frame + ", new_frame: " + new_frame + ", touch_time: " + touch_time + "\n");
		}
	}
	this.to_string = function(){
		var print = "";
rfor:for(var r=0;r<rows;r++){
cfor:for(var c=0;c<cols;c++){
		 for(var i=0;i<active.length;i++)
			 if(active[i].r==r && active[i].c==c){
				 print+="%";
				 continue cfor;
			 }
		 if(board[r][c]){
			 print+="#";
		 }else{
			 print+=".";
		 }
	 }
	 print+="\n";
	 }
	 return print;
	}
	this.init(x,y,w,h,selector);
}
var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
var t = new TetrisMain(0,0,250,500/*,"#tetris"*/);t.bind(LARROW,"left");t.bind(RARROW,"right");
t.bind(38,"cw");
t.bind(40,"soft");
t.bind(SHIFT,"swap");
t.bind(SPACE,"fast");
t.game_over(t.init);
document.onkeydown= function (e) {
	e = e || window.event;
	t.queue_key_event(e.which,true);
};
document.onkeyup= function (e) {
	e = e || window.event;
	t.queue_key_event(e.which,false);
};

setInterval(function(){
		t.step();
		t.draw(ctx);
		},20);
