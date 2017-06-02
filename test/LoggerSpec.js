const rewire = require('rewire');
const sinon = require('sinon');
const expect = require('chai').expect;
const logger = rewire('../src/Logger');

// Eingabedaten
const td = [
    {a: {counter: 0}, b: {sites: {length: 0}}},
    {a: {counter: 1}, b: {sites: {length: 0}}},
    {a: {counter: 376}, b: {sites: {length: 376}}},
    {a: {counter: 155}, b: {sites: {length: 376}}},
    {a: {counter: 0}, b: {sites: {length: -1}}},
    {a: {counter: -1}, b: {sites: {length: 0}}}
];

const out = logger.__get__('process.stdout.write');
const writeSpy = sinon.spy(out);

logger.__set__('process.stdout.write', writeSpy);

// Teststart
describe('LoggerSpec', function () {
    describe('#logger()', function () {
        beforeEach(function() {
            writeSpy.reset();
        });
        td.forEach(function(item) {
            it(`logger console loggt den Verlauf richtig für Parameter a: ${item.a.counter} und b: ${item.b.sites.length}`, function() {
                logger(item.a, item.b);
                expect(writeSpy.firstCall.args[0]).to.be.a('string');
                expect(writeSpy.firstCall.args[0].
                includes((100 * item.a.counter/item.b.sites.length).
                toFixed(1))).to.be.true;
            });
        });
    });
});

