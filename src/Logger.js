const chalk = require('yargonaut').chalk();

module.exports = function (counter, sites) {
    process.stdout.write(chalk.green(`${++counter.counter}/${sites.sites.length} (${(100 * counter.counter/sites.sites.length).toFixed(1)}%)\r`));
};

