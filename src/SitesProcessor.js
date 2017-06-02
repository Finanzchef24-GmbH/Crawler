// imports
let Promise = require('bluebird');
let cheeriWri = require('./CheeriWri');
let requester = require('./Requester');

module.exports = function(sites, writer) {
    let counter = {counter: 0};

    console.log('Es wird geschrieben...');
    console.log('Du kannst mit Strg C abbrechen.');
    return Promise
        .map(sites.sites, function (site) {
            return requester(site, counter, sites);
        }, { concurrency: 10 })
        .each(function (content) {
            cheeriWri(content, writer);
        });
};
