/**
 * Helper to load partials for handlebars
 */
var FS = require( 'fs' );
var Path = require( 'path' );
var DirReader = require( 'dirreader' );

var PARTIALS_PATH = Path.resolve( __dirname, '../templates/partials' );

module.exports = function(){

    var partialHash = {};
    DirReader.readDirSync( Path.resolve( __dirname, '../templates/partials' ), function( err, path, stats, ifDir ){

        if( err ){
            throw new Error( err );
        }
        else {

            if( ifDir ){
                return;
            }
            else {

                var partialName = Path.relative( PARTIALS_PATH, path );
                var name = RemoveExt( partialName );
                console.log( 'PARTIAL NAME: ', name );

                var tplPath = Path.resolve( Path.dirname( path ), Path.basename( path, Path.extname( path ) ) );
                partialHash[ name ] = FS.readFileSync( tplPath + '.mustache' ).toString();
            }
        }
    });

    return partialHash;
};

function RemoveExt( path ){
    var extname = Path.extname( path );
    var extIndex = path.indexOf( extname );
    return path.substring( 0, extIndex );
}