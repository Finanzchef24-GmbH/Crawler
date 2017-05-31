var sitemapper = require('sitemapper');
var sitemap = new sitemapper();

module.exports = function(str) {
    return sitemap.fetch(str);
}