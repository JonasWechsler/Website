function tetris(x,y,w,h){
	function point(x,y){
		this.x = x;
		this.y = y;
	}
	var draw_x;
	var draw_y;
	var width;
	var height;
	const rows = 20;
	const cols = 10;
	const hidden_rows = 4;
	var board = [];//[r,c]
	var active = [];
	for(var r=0;r<rows+hidden_rows;r++){
		board[r] = [];
		var a = cols;
		while(a--)board[r][a]=0;
	}
	this.init = function(x,y,w,h){
		draw_x = x;
		draw_y = y;
		width = w;
		height = h;
	}
	this.generate_block = function(){
		var block = Math.ceil(Math.random()*9);
		var c = Math.ceil(cols/2);
		switch(block){
			case 1://I 
				active[0] = new Point(0,c);
				active[1]= new Point(1,c);
				active[2]= new Point(2,c);
				active[3]= new Point(3,c);
				break;
			case 2://s
				active[0]= new Point(1,c-1);
				active[1]= new Point(2,c-1);
				active[2]= new Point(2,c);
				active[3]= new Point(3,c);
				break;
			case 3://z
				active[0]= new Point(1,c);
				active[1]= new Point(2,c);
				active[2]= new Point(2,c-1);
				active[3]= new Point(3,c-1);
				break;
			case 4://O
				active[0]= new Point(3,c-1);
				active[1]= new Point(3,c);
				active[2]= new Point(4,c-1);
				active[3]= new Point(4,c);
				break;
			case 5://r
				active[0]= new Point(2,c-1);
				active[1]= new Point(2,c);
				active[2]= new Point(3,c-1);
				active[3]= new Point(4,c-1);
				break;
			case 6://lnot
				active[0]= new Point(2,c);
				active[1]= new Point(2,c-1);
				active[2]= new Point(3,c);
				active[3]= new Point(4,c);
				break;
			case 7://T
				active[0]= new Point(3,c);
				active[1]= new Point(4,c-1);
				active[2]= new Point(4,c);
				active[3]= new Point(4,c+1);
				break;
		}
	}
	this.shift(dir) = function(){
		console.log(dir);
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
		}
		/**0**
		 *      *3*1*
		 *           **2**/
		for(var i=0;i<active.length;i++){
			var t = active[i];
			if(board[t.y+dy][t.x+dx] == 1)
				return false;
		}
		for(var i=0;i<active.length;i++){
			active[i].y+=dy;
			active[i].x+=dx;
		}
		return true;
	}
	this.drop = function(){
		while(shift('down'));
	}
	this.draw = function(ctx){
		const block_height = height/rows;
		const block_width = width/cols;
		for(var r=0;r<rows;r++){
			for(var c=0;c<cols;c++){
				var x = draw_x + block_width*c;
				var y = draw_y + block_height*r;
				if(board[r][c])
					ctx.fillStyle="red";
				else
					ctx.fillStyle="blue";
				ctx.fillRect(x,y,block_width,block_height);
			}
		}
	}
	this.to_string = function(){
		return board;
	}
	this.init(x,y,w,h);
}

var t = new tetris(0,0,100,100);
var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
t.generate_block();
t.draw(ctx);
console.log(t);
