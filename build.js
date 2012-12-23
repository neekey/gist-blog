var FS = require( 'fs' );
var GitHubApi = require("github");
var Mustache = require( 'mustache' );

var github = new GitHubApi({
    version: "3.0.0"
});

// Load user config.
var gistConfig = require( './gist.json' );
var username = gistConfig.username;
var filter = new RegExp( gistConfig.gist_filter );

// Get user's gist list.
github.gists.getFromUser({ user: username }, function(err, res) {

    var postGists = [];

    res.forEach(function( gist ){

        var filename;
        for( filename in gist.files ){
            if( filename ){
                break;
            }
        }

        if( filter.test( filename ) ){
            postGists.push( gist );
        }
    });

    // render gist to post.
    var HTML = Mustache.render( FS.readFileSync( './index.mustache').toString(), { gists: postGists } );
    FS.writeFileSync( './index.html', HTML );
});

