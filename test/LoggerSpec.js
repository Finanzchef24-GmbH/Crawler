const rewire = require('rewire');
const sinon = require('sinon');
const expect = require('chai').expect;
const logger = rewire('../src/Logger');

// Eingabedaten
const td = [
    {a: {siteCount: 377}, b: 376},
    {a: {siteCount: 376}, b: 376},
    {a: {siteCount: 155}, b: 376},
    {a: {siteCount: 0}, b: 376},
    {a: {siteCount: 1}, b: null}
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
        it(`logger console loggt den Verlauf richtig für Parameter a: ${td[0].a.siteCount} und b: ${td[0].b}`, function() {
            logger(td[0].a, td[0].b);
            expect(writeSpy.callCount).to.equal(0);
        });
        it(`logger console loggt den Verlauf richtig für Parameter a: ${td[1].a.siteCount} und b: ${td[1].b}`, function() {
            logger(td[1].a, td[1].b);
            expect(writeSpy.firstCall.args[0]).to.be.a('string');
            expect(writeSpy.firstCall.args[0].
            includes((100 * td[1].a.siteCount/td[1].b).
            toFixed(1))).to.be.true;
        });
        it(`logger console loggt den Verlauf richtig für Parameter a: ${td[2].a.siteCount} und b: ${td[2].b}`, function() {
            logger(td[2].a, td[2].b);
            expect(writeSpy.firstCall.args[0]).to.be.a('string');
            expect(writeSpy.firstCall.args[0].
            includes((100 * td[2].a.siteCount/td[2].b).
            toFixed(1))).to.be.true;
        });
        it(`logger console loggt den Verlauf richtig für Parameter a: ${td[3].a.siteCount} und b: ${td[3].b}`, function() {
            logger(td[3].a, td[3].b);
            expect(writeSpy.firstCall.args[0]).to.be.a('string');
            expect(writeSpy.firstCall.args[0].
            includes((100 * td[3].a.siteCount/td[3].b).
            toFixed(1))).to.be.true;
        });
        it(`logger console loggt den Verlauf richtig für Parameter a: ${td[4].a.siteCount} und b: ${td[4].b}`, function() {
            expect(() => logger(td[4].a, td[4].b)).to.throw();
        });

    });
});

