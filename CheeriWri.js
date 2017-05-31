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
    var robots = $('meta[name="robots"]').attr('content');
    var h1 = [];

    //Wenn mehr als 1 h1 Tag gibt, je eine h1 Tag neue Zeile mit gleichen Datensätze pro Seite (es gibt bei uns aber nur 1 Tag pro Seite bis jetzt)
    $('h1').each(function(i, elem) {
        h1[i] = $(this).text();
        writer.write([
            href, title, desc, h1[i], robots
        ]);
    });
};
