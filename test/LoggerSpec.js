var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var expect = require('chai').expect;
var logger = rewire('../Logger');

//Eingabedaten
var td = [
    {a: {counter: 0}, b: {sites: {length: 0}}},
    {a: {counter: 1}, b: {sites: {length: 0}}},
    {a: {counter: 376}, b: {sites: {length: 376}}},
    {a: {counter: 155}, b: {sites: {length: 376}}},
    {a: {counter: 0}, b: {sites: {length: -1}}},
    {a: {counter: -1}, b: {sites: {length: 0}}}
];

var out = logger.__get__("process.stdout.write");
var writeSpy = sinon.spy(out);
logger.__set__("process.stdout.write", writeSpy);

//console.log Variante auskommentiert
/*
var consoleLogModded = {
    log: sinon.stub()
}
logger.__set__("console", consoleLogModded);
*/

//Teststart
describe('LoggerSpec', function () {
    describe('#logger()', function () {
        beforeEach(function() {
            writeSpy.reset();
        });
        td.forEach(function(item) {
            it(`logger console loggt den Verlauf richtig für Parameter a: ${item.a.counter} und b: ${item.b.sites.length}`, function() {
                logger(item.a, item.b);
                expect(writeSpy.firstCall.args[0]).to.be.a("string");
                expect(writeSpy.firstCall.args[0].includes((100 * item.a.counter/item.b.sites.length).toFixed(1))).to.be.true;

            })
        })
    });
});

