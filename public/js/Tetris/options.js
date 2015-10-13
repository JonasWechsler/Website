/**
 *addOption(callback,type,label,array)
 */

function Options(selector) {
  var callbacks = [];
  var count = 0;
  $(selector).submit(function(e) {
    var array = $(this).serializeArray();
    for (var i = 0; i < array.length; i++) {
      callbacks[array[i].name](array[i].value);
    }
    e.preventDefault();
  });

  this.addOption = function(callback, label, type, options) {
    var newOption = "";
    newOption += "<div class=\'option " + type + "\'>";
    if (options) {
      newOption += "<div class=\'label " + type + "\'>";
      newOption += label;
      newOption += "</div>";
      options.forEach(function(element, idx) {
        newOption += "<input name=\'" + label + count + "\' type=\'" + type + "\' id=\'" + element + count + idx + "\' value=\'" + element + "\' >";
        newOption += "<label for=\'" + element + count + idx + "\'>" + element + "</label>";
        callbacks[label+count] = callback;
      });
    } else {
      newOption += "<label for=" + label + count + ">" + label + "</label>";
      newOption += "<input type=" + type + " id=" + label + ">";
    }
    newOption += "</div>";
    $(selector).append(newOption);
    $(".submit").remove();
    $(selector).append("<input class = \"submit\" type=\"submit\" value=\"SAVE\" >");
    count++;
  }
}
