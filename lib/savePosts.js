/**
 * 将fetch 到的 gist 保存成markdown
 */

var FS = require( 'fs' );
var Path = require( 'path' );

module.exports.save = function( posts, outputDir ){

    posts.forEach(function( post ){
        var outputRawPath = Path.resolve( outputDir, post.filename );
        var outputInfoPath = Path.resolve( outputDir, post.filename + '.json' );
        var raw = post.raw;
        delete post.raw;
        var postJSONString = JSON.stringify( post );
        post.raw = raw;

        // 保存文件内容
        FS.writeFileSync( outputRawPath, post.raw );

        // 保存文件信息
        FS.writeFileSync( outputInfoPath, postJSONString );
    });
};