/**
 * Render Markdown to HTML
 */
var Marked = require('marked');

/**
 * Render MD to HTML
 * @param {String} raw Markdown source.
 * @return {String} html
 */

module.exports.render = function( raw ){
    Marked.setOptions({
        gfm: true,
        pedantic: false,
        sanitize: false
    });
    return Marked( raw );
};