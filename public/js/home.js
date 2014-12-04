$(document).ready(function(){
	var container = $('.container').packery({
	  columnWidth: 250,
	  rowHeight: 250,
	  gutter:10,
	  'stamp':'.stamp'
	});
	var gold = 0.618033988749895;
	var h = Math.random();
	container.find('.item').each( function( i, itemElem ) {
	  h+=gold;
      var rgb = hsv(h % 1, .2, .9);
      var hex = rgbToHex(rgb);
      $(itemElem).css("background-color",hex);
	  console.log(itemElem);
	  // make element draggable with Draggabilly
	  var draggie = new Draggabilly( itemElem );
	  // bind Draggabilly events to Packery
	  container.packery( 'bindDraggabillyEvents', draggie );
	});


	container.on( 'click', '.item', function( event ) {
	  // change size of item via class
	  $( event.target ).closest('.item').toggleClass('big');
	  // trigger layout
	  console.log( $( event.target ).closest('.item').html());
	  container.packery();
	});

});
function hsv(h, s, v) {
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
    case 0:
        r = v, g = t, b = p;
        break;
    case 1:
        r = q, g = v, b = p;
        break;
    case 2:
        r = p, g = v, b = t;
        break;
    case 3:
        r = p, g = q, b = v;
        break;
    case 4:
        r = t, g = p, b = v;
        break;
    case 5:
        r = v, g = p, b = q;
        break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}

function rgbToHex(r, g, b) {
    if (r && g === undefined && b === undefined) {
        g = r.g;
        b = r.b;
        r = r.r;
    }
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}