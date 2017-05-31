//yargs Kommandozeile
require('yargonaut')
    .help('ASCII')
    .helpStyle('green')
    .errors('ASCII')
    .errorsStyle('red')

var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .locale('de')
    .example('$0', 'Speichert das Ergebnis als out.csv')
    .example('$0 -f resultat', 'Speichert das Ergebnis als resultat.csv')
    .example('$0 -e .xlsx', 'Speichert das Ergebnis als out.xlsx [.xlsx wird noch nicht unterstützt]')
    .example('$0 -f resultat -e .xlsx', 'Speichert das Ergebnis als resultat.xlsx [.xlsx wird noch nicht unterstützt]')
    .alias('f', 'file')
    .nargs('f', 1)
    .describe('f', 'Dateiname bestimmen')
    .default('f', 'ausgabe')
    .alias('e', 'extension')
    .nargs('e', 1)
    .describe('e', 'Dateiendung bestimmen')
    .choices('e', ['.csv', '.xlsx'])
    .default('e', '.csv')
    .help('h')
    .alias('h', 'help')
    .epilog('Copyright 2017 @ Finanzchef24 GmbH')
    .argv;

//Imports
var Promise = require('bluebird');
var cheerio = require('cheerio');
var csvWriter = require('csv-write-stream');
var fs = require('fs');
var sitemapper = require('./Sitemapper');
var sitesProcessor = require('./SitesProcessor');
var catcher = require('./Catcher');

//Beendung für Windows
if (process.platform === "win32") {
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function () {
        process.emit("SIGINT");
    });
}

//STRG C Beendung
process.on("SIGINT", function () {
    console.log("Prozess wurde abgebrochen und wird nun beendet und ", argv.f + '.csv', " gelöscht.");
    fs.unlinkSync(argv.file + '.csv');
    process.exit();
});

var run = function() {
    if(argv.e == '.xlsx') console.log(".xlsx wird zzt. noch nicht unterstützt, stattdessen wurde .csv als Standard verwendet.");

    var writer = csvWriter({ headers: ["URL", "TITLE", "DESCRIPTION", "H1 TAG", "META ROBOTS"]});
    writer.pipe(fs.createWriteStream(argv.f + '.csv'));

    Promise
        .resolve(sitemapper('http://www.finanzchef24.de/sitemap.xml'))
        .then(function(sites) {
            //sites.sites = sites.sites.slice(0, 10); //Erste 10 Seiten nur verarbeiten zum Testen
            return sitesProcessor(sites, writer);
        })
        .finally(() => {writer.end(); console.log("\rFertig. Programm wurde beendet.")})
        .catch(function (error) {
            catcher(error);
        });
}
run();