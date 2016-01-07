(function( $, undefined ) {
	//special click handling to make widget work remove after nav changes in 1.4
	var href,
		ele = "";
	$( document ).on( "click", "a", function( e ) {
		href = $( this ).attr( "href" );
		var hash = $.mobile.path.parseUrl( href );
		if( typeof href !== "undefined" && hash !== "" && href !== href.replace( hash,"" ) && hash.search( "/" ) !== -1 ){
			//remove the hash from the link to allow normal loading of the page.
			var newHref = href.replace( hash,"" );
			$( this ).attr( "href", newHref );
		}
		ele = $( this );
	});

})( jQuery );
