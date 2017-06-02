const assert = require('assert');
const rewire = require('rewire');
const sinon = require('sinon');
const cheeriWri = rewire('../src/CheeriWri');
const chai = require('chai');
const expect = chai.expect;

// Beim Parameterübergabe -> heißt Dependency Injection
// MOCK & SPY writer.write
function mockedWrite () {
    // ...
}

const writer = {write: mockedWrite};
const writeSpy = sinon.spy(writer, 'write');

// SPY cheerio.load
const ch = cheeriWri.__get__('cheerio.load');
const chSpy = sinon.spy(ch);

cheeriWri.__set__('cheerio.load', chSpy);

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

// Erwartet
const writePara = ['https://www.finanzchef24.de',
    'Finanzchef24 | Unternehmer? Aber sicher!',
    'Finanzchef24 ist Deutschlands großer digitaler Versicherungsmakler für Unternehmer & Selbstständige. ' +
    'Jetzt Tarifvergleich & unabhängige Beratung testen!',
    'h1 testtext',
    'follow, index'];

const cheerioPara = '<meta name="description" content="Finanzchef24 ist Deutschlands großer ' +
    'digitaler Versicherungsmakler für Unternehmer &amp; Selbstständige. Jetzt Tarifvergleich &amp; ' +
    'unabhängige Beratung testen!" /><title>Finanzchef24 | Unternehmer? Aber sicher!</title>' +
    '<meta name="robots" content="follow, index" /><h1>h1 testtext</h1>';

// Teststart
describe('CheeriWriSpec', function () {
    describe('#cheeriWri()', function () {
        beforeEach(function() {
            chSpy.reset();
            writeSpy.reset();
        });
        it('writer.write einmal aufgerufen mit den richtigen Parametern', function () {
            cheeriWri(testData, writer);
            assert.equal(1, writeSpy.callCount);
            expect(writeSpy.firstCall.args[0]).to.be.a('array');
            expect(writeSpy.firstCall.args[0]).to.eql(writePara);
        });
        it('cheerio.load einmal aufgerufen mit den richtigen Parametern', function () {
            cheeriWri(testData, writer);
            assert.equal(1, chSpy.callCount);
            expect(chSpy.firstCall.args[0]).to.be.a('string');
            assert.equal(cheerioPara, chSpy.firstCall.args[0]);
        });
    });
});
