const chalk = require('yargonaut').chalk();

module.exports = function (counter, lastRunPageCount) {
    if (typeof lastRunPageCount !== 'number' || isNaN(lastRunPageCount)) {
        throw new Error('Es wurde kein Zahl von prevPageCount Datei eingelesen');
    }
    const progress = 100 * counter.siteCount/lastRunPageCount;

    // Anzahl der zu verarbeitenden Seiten ist zur Laufzeit unbekannt und
    // basiert auf den letzten durchlauf, soll deshalb 100 % nicht überschreiten
    if (progress <= 100) {
        process.stdout.write(chalk.green(`Info: ${counter.siteCount}/${lastRunPageCount} (${progress.toFixed(1)}%)\r`));
    }
};


