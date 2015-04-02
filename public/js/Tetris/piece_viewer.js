function piece_viewer(x0,y0,w0,h0,p,s){
	var x = 0,
		y = 0,
		w = 0,
		h = 0,
		piece = 0,
		selector = 0,
		active = [],
		padding = 1;

	this.init = function(x0,y0,w0,h0,p,s){
		x=x0;
		y=y0;
		w=w0;
		h=h0;
		this.set_piece(p);
		selector = s;
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
	this.set_piece = function(p){
		piece = p;
		switch(p){
			case 0://Blank
				active=[[0]];
				break;
			case 1://I
				active=[
					[0,1,0],
					[0,1,0],
					[0,1,0],
					[0,1,0]
				];
				break;
			case 2://s
				active=[
					[0,2,2],
					[2,2,0]
				];
				break;
			case 3://z
				active=[
					[3,3,0],
					[0,3,3]
				];
				break;
			case 4://O
				active=[
					[4,4],
					[4,4]
				];
				break;
			case 5://J
				active=[
					[0,5],
					[0,5],
					[5,5]
				];
				break;
			case 6://L
				active=[
					[6,0],
					[6,0],
					[6,6]
				];
				break;
			case 7://T
				active=[
					[0,7,0],
					[7,7,7]
				];
				break;
		}
		
	}
	this.draw = function(ctx){
		var side = w0/5;
		var tet_w = active[0].length;
		var tet_h = active.length;
		var left = (w-tet_w*side)/2;
		var top = (h-tet_h*side)/2;	
		if(ctx){
			ctx.clearRect(0,0,w,h);
		}else if(selector){
			$(selector).empty();
		}else{
			throw new Exception("Must have either a div or a canvas");
		}
		for(var r=0;r<active.length;r++){
			for(var c=0;c<active[0].length;c++){
				if(ctx){
					ctx.fillRect(left+c*side,top+r*side,side,side);
				}else if(selector){
					var new_div = $("<div></div>");
					new_div.css("position","absolute");
					new_div.css("left",left+c*side+"px");
					new_div.css("top",top+r*side+"px");
					new_div.attr("class",this.num_to_letter(active[r][c]))
					$(selector).append(new_div);
				}
			}
		}
	}
	this.init(x0,y0,w0,h0,p,s);
}