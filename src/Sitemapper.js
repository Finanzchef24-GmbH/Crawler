const Sitemapper = require('sitemapper');
let sitemap = new Sitemapper();

module.exports = function(sitemapUrl) {
    return sitemap.fetch(sitemapUrl);
};
