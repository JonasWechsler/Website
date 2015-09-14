$(document).mousemove(function(event){
    var percentX = 100*event.pageX/document.body.clientWidth + "%";
    var percentY = 100*event.pageY/document.body.clientHeight + "%";
    $(".cube>.side").css("background-position",percentX+" "+percentY);
});