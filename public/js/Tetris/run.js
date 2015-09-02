var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
var main = new TetrisMain(0,0,250,500,"#tetris");
var next_piece = new piece_viewer(0,0,100,100,0,"#next");
var hold_piece = new piece_viewer(0,0,100,100,0,"#hold");
var style_creator = new StyleCreator();

var score_keeper = new ScoreKeeper();
score_keeper.levelSelector = "#level";
score_keeper.comboSelector = "#combo";
score_keeper.lineSelector = "#line";
score_keeper.scoreSelector = "#score";

main.bind(LARROW,"left");
main.bind(RARROW,"right");
main.bind(38,"cw");
main.bind(40,"soft");
main.bind(X,"cw");
main.bind(Z,"ccw");
main.bind(SHIFT,"swap");
main.bind(SPACE,"fast");
main.game_over(function(){
	main.init();
	score_keeper.reset();
});

main.hold(function(p){
	hold_piece.set_piece(p)
});

main.next(function(p){
	next_piece.set_piece(p)
});

main.line_clear_callback(function(a){
	score_keeper.clear(a);
});



document.onkeydown= function (e) {
	e = e || window.event;
	main.queue_key_event(e.which,true);
};
document.onkeyup= function (e) {
	e = e || window.event;
	main.queue_key_event(e.which,false);
};

setInterval(function(){
	main.step();
	main.draw(ctx);
	hold_piece.draw();
	next_piece.draw();
},20);
