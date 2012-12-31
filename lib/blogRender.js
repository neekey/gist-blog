/**
 * Render the whole blog.
 */

var Path = require( 'path' );
var Render = require( './render' );
var FS = require( 'fs' );
var MDToHTML = require( './MDToHTML').render;
var ROOT = Path.resolve( __dirname, '../' );

module.exports.render = function( data ){

    // Render Markdown to HTML
    data.posts.forEach(function( post ){
        post.blog_filename = 'posts/' + Path.basename( post.filename, Path.extname( post.filename ) ) + '.html';
        post.html = MDToHTML( post.raw );
    });

    // Render Index
    renderIndex( data );

    // Render Posts
    renderPosts( data );
};

function renderIndex( data ){

    var HTML = Render( 'index', data );
    HTMLToFile( HTML, 'index.html' );
}

function renderPosts( data ){

    var posts = data.posts;
    posts.forEach(function( post ){
        var postData = {
            user: data.user,
            post: post,
            meta: data.meta
        };

        var HTML = Render( 'post', postData );
        HTMLToFile( HTML, 'posts/' + Path.basename( post.filename, Path.extname( post.filename ) ) + '.html' );
    });
}

function HTMLToFile( HTML, filename ){

    FS.writeFileSync( Path.resolve( ROOT, filename ), HTML );
}