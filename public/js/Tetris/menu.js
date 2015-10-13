/**
*
*/

function Menu(selector, title){
  var submenus = [];
  var container = selector;
  var menu = "</button><span id=\"container\"><h1>" + title + "</h1><br></span>";
  var back = "<button id=\"menu-button\" class=\"back fa fa-arrow-left\">  Back to title screen</button>";
  var active = "";
  this.back = function(){
    $(selector).hide();
    $(container).show();
    $(active).hide();
    $("#menu-button").hide();
  }
  this.addSubmenu = function(selector,label, callback){
    $(selector).hide();
    var id = label+submenus.length;
    submenus.push(selector);
    $(container + "> #container").append("<button id=" + id + ">" + label + "</button>");
    
    //$(container).empty();
    //$(container).append(menu);
    $("#" + id).click(function(){
      $(selector).show();
      $(container).hide();
      $("#menu-button").show();
      active=selector;
      callback();
    });
  }

  $(container).append(menu);
  $(container).parent().append(back);
  $("#menu-button").hide();
  $("#menu-button").click(this.back);
}
