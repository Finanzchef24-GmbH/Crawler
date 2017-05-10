//imports
var request = require('request');
var cheerio = require('cheerio');
var sitemapper = require('sitemapper');
var csvWriter = require('csv-write-stream');
var fs = require('fs');

//vars
var sitemap = new sitemapper();
var writer = csvWriter({ headers: ["URL", "TITLE", "DESCRIPTION"]});
writer.pipe(fs.createWriteStream('out.csv'));

//Sitemap parsen
sitemap.fetch('http://www.finanzchef24.de/sitemap.xml').then(function(sites) {
    function forlooper(i) {
        if(i<sites.sites.length) {
            var site = sites.sites[i];
            //Eine Seite holen
            request(site, function (error, response, body) {
                if (error) {
                    console.log('Fehler beim lesen der Seiteninhalte bei der Seite: ', site, " - ", error);
                } else {
                    // Test

                    //Tags Filtern
                    $ = cheerio.load(body);
                    var title = $('title').text();
                    var description = $('meta[name="description"]').attr('content');
                    //CSV Schreiben
                    writer.write([site, title, description]);
                    console.log('Schreiben ' + ((i/sites.sites.length)*100).toFixed(2) + '% fertig... \r');
                    forlooper(i + 1);
                }
            });
        } else {
            console.log('Beendung...');
            writer.end();
        }
    }
    forlooper(0);
});
