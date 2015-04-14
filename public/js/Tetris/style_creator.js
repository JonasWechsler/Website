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
		console.log($(selector).length);
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
				color="olive";
				break;
		}
		return color;
	}
	this.init();
}