function ScoreKeeper(){
	this.lines_cleared,
	this.level,
	this.score,
	this.rules,
	this.combo;
	this.
	this.clear = function(lines){
		if(this.rules==="original"){
			this.lines_cleared+=lines;
			switch(lines){
				case 0:this.combo=0;break;
				case 1:this.score+=40*(this.level+1);this.combo++;break;
				case 2:this.score+=100*(this.level+1);this.combo++;break;
				case 3:this.score+=300*(this.level+1);this.combo++;break;
				case 4:this.score+=1200*(this.level+1);this.combo++;break;
				default:throw new Exception("Not 0<=lines<5");break;
			}
		}
		if(this.rules==="DS"){
			this.lines_cleared+=lines;
			switch(lines){
				case 0:this.combo=0;break;
				case 1:this.score+=40*(this.level+1);this.combo++;break;
				case 2:this.score+=100*(this.level+1);this.combo++;break;
				case 3:this.score+=300*(this.level+1);this.combo++;break;
				case 4:this.score+=1200*(this.level+1);this.combo++;break;
				default:throw new Exception("Not 0<lines<5");break;
			}
		}
		if(this.rules==="DS"){
			this.lines_cleared+=lines;
			switch(lines){
				case 0:this.combo=0;break;
				case 1:this.score+=40*(this.level+1);this.combo++;break;
				case 2:this.score+=100*(this.level+1);this.combo++;break;
				case 3:this.score+=300*(this.level+1);this.combo++;break;
				case 4:this.score+=1200*(this.level+1);this.combo++;break;
				default:throw new Exception("Not 0<lines<5");break;
			}
		}
		
	}
	this.init = function(rules){
		this.rules = rules;
	}
}