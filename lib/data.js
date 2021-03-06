/**
 * Fetch and handle Gist data.
 */

var https = require( 'https' );
var URL = require( 'url' );

/**
 * Load user config.
 * @type {Object} gistConfig
 * @type {Object} gistConfig.username username of Github.
 * @type {Object} gistConfig.gist_filter RegExp String to filter gists as post.
 *
 */
var gistConfig = require( '../gist.json' );
var GitHubApi = require("github");

/**
 * Initialize Github API
 * @type {GitHubApi}
 */

var github = new GitHubApi({
    version: "3.0.0"
});

/**
 * Get gist list.
 * ```
 * [{
        description: 'A test gist for gist-blog',
        updated_at: '2012-12-24T01:57:58Z',
        forks_url: 'https://api.github.com/gists/4364454/forks',
        comments: 0,
        public: true,
        url: 'https://api.github.com/gists/4364454',
        html_url: 'https://gist.github.com/4364454',
        git_pull_url: 'https://gist.github.com/4364454.git',
        commits_url: 'https://api.github.com/gists/4364454/commits',
        comments_url: 'https://api.github.com/gists/4364454/comments',
        user:
        {
            type: 'User',
            starred_url: 'https://api.github.com/users/neekey/starred{/owner}{/repo}',
            followers_url: 'https://api.github.com/users/neekey/followers',
            avatar_url: 'https://secure.gravatar.com/avatar/8896cc725e36350023e7f41f0455b8aa?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png',
            following_url: 'https://api.github.com/users/neekey/following',
            url: 'https://api.github.com/users/neekey',
            repos_url: 'https://api.github.com/users/neekey/repos',
            organizations_url: 'https://api.github.com/users/neekey/orgs',
            gists_url: 'https://api.github.com/users/neekey/gists{/gist_id}',
            gravatar_id: '8896cc725e36350023e7f41f0455b8aa',
            login: 'neekey',
            events_url: 'https://api.github.com/users/neekey/events{/privacy}',
            id: 499870,
            received_events_url: 'https://api.github.com/users/neekey/received_events',
            subscriptions_url: 'https://api.github.com/users/neekey/subscriptions'
        },
        created_at: '2012-12-23T17:05:32Z',
        git_push_url: 'https://gist.github.com/4364454.git',
        id: '4364454',
        files: {
            'gist-blog-test.md': {
                type: 'text/plain',
                filename: 'gist-blog-test.md',
                raw_url: 'https://gist.github.com/raw/4364454/77508d6306c7f2fe923bec94216c126a85243002/gist-blog-test.md',
                size: 164,
                language: 'Markdown'
            }
        }
   }]
 * ```
 */

function fetch( next ){

    var username = gistConfig.username;
    var filter = new RegExp( gistConfig.gist_filter );

    github.gists.getFromUser({ user: username }, function( err, res ) {

        if( err ){
            new Error( err );
        }

        /**
         * The list of gists those be treatd as post.
         * @type {Array}
         */
        var postGists = [];
        res.forEach(function( gist ){

            var filename;
            for( filename in gist.files ){
                if( filename ){
                    gist.raw_url = gist.files[filename][ 'raw_url' ];
                    gist.filename = filename;
                    break;
                }
            }

            if( filter.test( filename ) ){
                postGists.push( gist );
            }
        });


        /**
         * Get gist raw.
         */

        var postGistLen = postGists.length;
        var postGistRawCount = 0;
        postGists.forEach(function( gist ){

            GetGistRaw( gist.raw_url, function( err, raw ){
                if( err ){
                    raw = 'Fetching gist raw error: ' + JSON.stringify( err );
                }

                /**
                 * The raw content of gist
                 * @type {String}
                 */

                gist.raw = raw;

                postGistRawCount++;
                if( postGistRawCount === postGistLen ){
                    next( dataHandle( postGists ) );
                }
            });
        });
    });
}

function dataHandle( gistList ){

    return {
        user: gistList[0].user,
        posts: gistList,
        meta: gistConfig
    };
}

/**
 * Use `https` to fetch gist raw.
 * @param url
 * @param {Function} next callback
 * @param {Object=null} next.err
 * @param {String} next.raw
 */

function GetGistRaw( url, next ){

    var urlObj = URL.parse( url );

    var options = {
        hostname: urlObj.host,
        port: 443,
        path: urlObj.path,
        method: 'GET',
        headers: {
            "host": 'gist.github.com',
            "user-agent": 'NodeJS HTTP Client',
            "content-length": "0"
        }
    };

    var req = https.request(options, function(res) {
        res.setEncoding( 'utf8' );
        var data = '';
        res.on( 'data', function(chunk) {
            data += chunk;
        });
        res.on( 'end', function() {
            if (res.statusCode >= 400 && res.statusCode < 600 || res.statusCode < 10) {
                new Error(data, res.statusCode);
            }
            else {
                next( null, data )
            }
        });
    });

    req.on("error", function(e) {
        next( e );
    });

    req.end();
}

module.exports.fetch = fetch;
