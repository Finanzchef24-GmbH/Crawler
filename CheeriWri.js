//imports
var request = require('request');
var cheerio = require('cheerio');
var sitemapper = require('sitemapper');
var fs = require('fs');

module.exports = function (content, writer) {
    var response = content[0];
    var body = content[1];
    var $ = cheerio.load(body);

    var href = response.request.href;
    var title = $('title').text();
    var desc = $('meta[name="description"]').attr('content');

    writer.write([
        href, title, desc
    ]);
};
