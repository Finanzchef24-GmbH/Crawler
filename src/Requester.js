var logger = require('./Logger');
var request = require('request');
var Promise = require('bluebird');

module.exports = function(site, counter, sites) {
    return Promise
        .fromCallback(cb => request(site, cb), {multiArgs: true})
        .tap(() => logger(counter, sites));
};
