var Data = require( './lib/data' );
var BlogRender = require( './lib/blogRender' );

Data.fetch( function( data ){
    BlogRender.render( data );
});