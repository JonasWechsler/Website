function Decorator(root_selector){
	this.paint_block = function(c,r,class_name,duration,delay){
	  var block = selector + "#r" + r + " > " + "#c" + c;
	  var delay_function = function(){
	    $(block).addClass(class_name);
	    setTimeout(function(){
	      $(block).removeClass(class_name);
	    },duration);
	  };
	  if(delay)
	    setTimeout(delay_function,delay);
	  else
	    delay_function();
	}
}