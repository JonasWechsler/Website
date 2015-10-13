function StyleCreator(){
	var selector;

	/**
	*
	*/
	this.init = function(){
		selector = 0;
		while($("#" + selector).length){
			selector++;
		}
		$("body").append("<style id=" + selector + "></style>");
		selector = "#" + selector;
		for(var i=0;i<9;i++){
			var style = "background-color:" + this.get_colors(i);
			var ID = this.num_to_letter(i);
			this.style(ID,style);
		}
	}

	/**
	*
	*/
	this.style = function(ID,style){
		var new_style = "." + ID;
		new_style += "{\n";
		new_style += style;
		new_style += "\n}\n";
		$(selector).append(new_style);
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
			case 8:return "A";
		}
	}


	this.get_colors = function(ID){
		if(!ID)return "white";
		var rgb;
		if(ID==8)
			rgb = HSVtoRGB(0,0,.2);
		else
			rgb = HSVtoRGB(1-ID/9,.5,.95);
		
		return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
	}
	/**
	 *
	 */
	this.get_boring_colors = function(ID){
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
	function JSONtoRGB(json){
	  return "rgb(" + json.r + "," + json.g + "," + json.b + ")";
	}
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
	this.init();
}