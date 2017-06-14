// yargs Kommandozeile
require('yargonaut')
    .help('ASCII')
    .helpStyle('green')
    .errors('ASCII')
    .errorsStyle('red');

const argv = require('yargs')
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
    .strict()
    .argv;

// Imports
const csvWriter = require('csv-write-stream');
const fs = require('fs');
let catcher = require('./Catcher');
let Crawler = require('crawler');
let httpResponseValidator = require('./HttpResponseValidator');
let cheeriWri = require('./CheeriWri');
let hrefSeeker = require('./HrefSeeker');
const lastRunPageCountStr = require('fs').readFileSync('prevPageCount').toString();
const lastRunPageCount = parseInt(lastRunPageCountStr, 10);
let logger = require('./Logger');

// Beendung für Windows
if (process.platform === 'win32') {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('SIGINT', function () {
        process.emit('SIGINT');
    });
}

// STRG C Beendung
process.on('SIGINT', function () {
    console.log('Prozess wurde abgebrochen und wird nun beendet und ', argv.f + '.csv', ' gelöscht.');
    fs.unlinkSync(argv.file + '.csv');
    process.exit();
});

if (argv.e === '.xlsx') {
    console.log('.xlsx wird zzt. noch nicht unterstützt, stattdessen wurde .csv als Standard verwendet.');
}

let errorFlag = false;
let counter = {siteCount: 0};
let pageLimit = 5000;
const visited_pages = new Set();

visited_pages.add('https://www.finanzchef24.de');

let writer = csvWriter({ headers: ['URL', 'TITLE', 'DESCRIPTION', 'H1 TAG', 'META ROBOTS']});

writer.pipe(fs.createWriteStream(argv.f + '.csv'));

let crw = new Crawler({
    retryTimeout: 1000,
    maxConnections: 10,
    callback: crwCb
});

crw.on('drain', function(){
    writer.end();
    // Wenn es ein Absturz gibt, soll die Datei prevPageCount nicht überschrieben werden
    // andernfalls wird der Anzahl der durchgegangenen hrefs von diesen Lauf eingetragen
    if (!errorFlag) {
        fs.writeFileSync('prevPageCount', counter.siteCount);
    }
    console.log('\rFertig. Programm wurde beendet.');
});

function crwCb (error, res, done) {
    if (counter.siteCount > pageLimit) {
        console.log('Error: Grenze der Seitenanzahl von', pageLimit, 'wurde überschritten.');
        process.exit();
    } else if (error){
        errorFlag = true;
        catcher(error);
    } else if (!httpResponseValidator(res)) {
        counter.siteCount += 1;
        logger(counter, lastRunPageCount);
    } else {
        counter.siteCount += 1;
        logger(counter, lastRunPageCount);
        const $ = res.$;
        const calledHref = res.request.uri.href;

        cheeriWri(calledHref, writer, $);
        hrefSeeker(crw, $, visited_pages);
    }
    done();
}

module.exports = function () {
    // console.log(crw);
    crw.queue([ 'https://www.finanzchef24.de' ]);
};
