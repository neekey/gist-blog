var Data = require( './lib/data' );
var BlogRender = require( './lib/blogRender' );
var savePost = require( './lib/savePosts').save;

Data.fetch( function( data ){

    // 保存gist到本地文件
    savePost( data.posts, './post_raws' );
    // 渲染页面
    BlogRender.render( data );
});