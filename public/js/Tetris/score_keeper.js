function ScoreKeeper(){
	this.lines_cleared = 0,
	this.level = 1,
	this.score = 0,
	this.combo = 0;
	
	this.levelSelector = "";
	this.comboSelector = "";
	this.lineSelector = "";
	this.scoreSelector = "";

	this.clear = function(lines){
		this.lines_cleared+=lines;
		switch(lines){
			case 0:this.combo=0;break;
			case 1:this.score+=40*(this.level);this.combo++;break;
			case 2:this.score+=100*(this.level);this.combo++;break;
			case 3:this.score+=300*(this.level+1);this.combo++;break;
			case 4:this.score+=1200*(this.level+1);this.combo++;break;
			default:throw new Exception("Not 0<=lines<5");break;
		}
		this.score+=50*(this.combo)*this.level;
		console.log("x" + this.combo + " " + this.score + "pts lvl " + this.level);
		$(this.levelSelector).text(this.level);
		$(this.lineSelector).text(this.lines_cleared);
		$(this.scoreSelector).text(this.score + "pts");
		if(this.combo)
			$(this.comboSelector).text(this.combo + "x");
		else
			$(this.comboSelector).text("");	
	}

	this.reset = function(){
		this.lines_cleared=0;
		this.level = 1;
		this.score = 0;
		this.combo = 0;
	}
}
