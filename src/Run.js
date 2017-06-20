// yargs Kommandozeile
require('yargonaut')
    .help('ASCII')
    .helpStyle('green')
    .errors('ASCII')
    .errorsStyle('red');

const argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .locale('de')
    .example('$0', 'Speichert das Ergebnis als ausgabe.csv')
    .example('$0 -s https://www.finanzchef24.de', 'Crawlt https://www.finanzchef24.de')
    .example('$0 -p 2000', 'Durchsucht maximal 2000 Knoten (Unterseiten)')
    .example('$0 -f resultat', 'Speichert das Ergebnis als resultat.csv')
    .example('$0 -e .xlsx', 'Speichert das Ergebnis als out.xlsx [.xlsx wird noch nicht unterstützt]')
    .example('$0 -f resultat -e .xlsx', 'Speichert das Ergebnis als resultat.xlsx [.xlsx wird noch nicht unterstützt]')
    .alias('s', 'site')
    .nargs('s', 1)
    .describe('s', 'Ziel-Homepage bestimmen')
    .default('s', 'https://www.finanzchef24.de')
    .alias('p', 'pagelimit')
    .nargs('p', 1)
    .describe('p', 'Pagelimit bestimmen')
    .default('p', 5000)
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
const urler = require('url');

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
    console.log('Info: Prozess wurde abgebrochen, wird nun beendet und ', argv.f + '.csv', ' gelöscht.');
    fs.unlinkSync(argv.file + '.csv');
    process.exit();
});

if (argv.e === '.xlsx') {
    console.log('Info: .xlsx wird zzt. noch nicht unterstützt, stattdessen wurde .csv' +
        ' als Standard Dateiformat verwendet.');
}

let counter = {siteCount: 0};
let pageLimit = parseInt(argv.p, 10);
const visited_pages = new Set();
const url = urler.parse(argv.s);
const protocol = url.protocol;
const hostname = url.hostname;

visited_pages.add(argv.s);

let writer = csvWriter({ headers: ['URL', 'TITLE', 'DESCRIPTION', 'H1 TAG', 'META ROBOTS']});

writer.pipe(fs.createWriteStream(argv.f + '.csv'));

let crw = new Crawler({
    retryTimeout: 1000,
    maxConnections: 10,
    callback: crwCb
});

crw.on('drain', function(){
    writer.end();
    console.log('\rInfo: Fertig. Programm wurde beendet.');
});

function crwCb (error, res, done) {
    if (counter.siteCount > pageLimit) {
        console.log('Error: Grenze der Seitenanzahl von', pageLimit, 'wurde überschritten.');
        process.exit();
    } else if (error) {
        catcher(error);
    } else if (!httpResponseValidator(res)) {
        counter.siteCount += 1;
    } else {
        counter.siteCount += 1;
        const $ = res.$;
        const calledHref = res.request.uri.href;

        cheeriWri(calledHref, writer, $);
        hrefSeeker(crw, $, visited_pages, hostname, protocol);
    }
    done();
}

module.exports = function () {
    crw.queue([ argv.s ]);
};
