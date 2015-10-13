disableResize();

$(document).mousemove(function(event){
    var percentX = 100*event.pageX/screen.width + "%";
    var percentY = 100*event.pageY/screen.height + "%";
    $(".cube>.side").css("background-position",percentX+" "+percentY);
});
