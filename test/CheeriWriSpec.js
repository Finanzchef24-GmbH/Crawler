const assert = require('assert');
const rewire = require('rewire');
const sinon = require('sinon');
const cheeriWri = rewire('../src/CheeriWri');
const chai = require('chai');
const expect = chai.expect;

// Beim Parameterübergabe -> heißt Dependency Injection
// MOCK & SPY writer.write
function mockedWrite () {
}

const writer = {write: mockedWrite};
const writeSpy = sinon.spy(writer, 'write');

// Erwartet
const writePara = ['https://www.finanzchef24.de',
    'Finanzchef24 | Unternehmer? Aber sicher!',
    'Finanzchef24 ist Deutschlands großer digitaler Versicherungsmakler für Unternehmer & Selbstständige. ' +
    'Jetzt Tarifvergleich & unabhängige Beratung testen!',
    'h1 testtext',
    'follow, index'];

const chSubFunc = {
    text: sinon.stub(),
    attr: sinon.stub(),
    each: function () {
        writer.write(writePara);
    }
};

let mockedCheerio = sinon.stub().returns(chSubFunc);

// Eingabedaten
const testResp = 'https://www.finanzchef24.de';
const testBody = '<meta name="description" content="Finanzchef24 ist Deutschlands großer ' +
    'digitaler Versicherungsmakler für Unternehmer &amp; Selbstständige. Jetzt Tarifvergleich &amp; ' +
    'unabhängige Beratung testen!" />' +
    '<title>Finanzchef24 | Unternehmer? Aber sicher!</title>' +
    '<meta name="robots" content="follow, index" />' + '<h1>h1 testtext</h1>';

const testData = [
    {
        request: {
            href: testResp
        }
    },
    testBody
];

// Teststart
describe('CheeriWriSpec', function () {
    describe('#cheeriWri()', function () {
        beforeEach(function() {
            writeSpy.reset();
            mockedCheerio.reset();
            mockedCheerio = sinon.stub().returns(chSubFunc);
        });
        it('writer.write einmal aufgerufen mit den richtigen Parametern', function () {
            cheeriWri(testData, writer, mockedCheerio);
            assert.equal(1, writeSpy.callCount);
            expect(writeSpy.firstCall.args[0]).to.be.a('array');
            expect(writeSpy.firstCall.args[0]).to.eql(writePara);
        });
        it('$ aufgerufen mit den richtigen Parametern', function () {
            cheeriWri(testData, writer, mockedCheerio);
            assert.equal(4, mockedCheerio.callCount);
            expect(mockedCheerio.firstCall.args[0]).to.be.a('string');
            assert.equal('title', mockedCheerio.firstCall.args[0]);
            assert.equal('meta[name="description"]', mockedCheerio.secondCall.args[0]);
            assert.equal('meta[name="robots"]', mockedCheerio.thirdCall.args[0]);
            assert.equal('h1', mockedCheerio.getCall(3).args[0]);
        });
    });
});
