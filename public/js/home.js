$(document).ready(function(){
	var container = $('.container').packery({
	  columnWidth: 250,
	  rowHeight: 250,
	  gutter:10
	});

	container.find('.item').each( function( i, itemElem ) {
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
