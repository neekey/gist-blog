var FS = require( 'fs' );
var Path = require( 'path' );
var Jade = require( 'jade' );
var TEMPLATE_BASE = Path.resolve( __dirname, '../templates' );

module.exports = function( tpl, data ){
    var template = module.exports.compile( tpl );
    return template( data );
};

module.exports.compile = function( tpl ){
    tpl = Path.resolve( TEMPLATE_BASE, tpl );

    var extname = Path.extname( tpl );
    if( extname !== '.jade' ){
        tpl += '.jade';
    }

    var source = FS.readFileSync( tpl ).toString();
    return Jade.compile( source, { filename: tpl } );
};

