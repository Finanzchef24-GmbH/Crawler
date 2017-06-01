var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var cheeriWri = rewire('../CheeriWri');
var chai = require('chai');
var expect = chai.expect;

// Beim Parameterübergabe -> heißt Dependency Injection
//MOCK & SPY writer.write
var mockedWrite = function (arr) {
    //console.log(arr[0]);
    //console.log(arr[1]);
    //console.log(arr[2]);
};
var writer = {write: mockedWrite};
var writeSpy = sinon.spy(writer, "write");

//SPY cheerio.load
var ch = cheeriWri.__get__("cheerio.load");
var chSpy = sinon.spy(ch);
cheeriWri.__set__('cheerio.load', chSpy);

//Eingabedaten
var testResp = 'https://www.finanzchef24.de';
var testBody = '<meta name="description" content="Finanzchef24 ist Deutschlands großer digitaler Versicherungsmakler für Unternehmer &amp; Selbstständige. Jetzt Tarifvergleich &amp; unabhängige Beratung testen!" />' +
    '<title>Finanzchef24 | Unternehmer? Aber sicher!</title>' + '<meta name="robots" content="follow, index" />' + '<h1>h1 testtext</h1>';

var testData = [
    {
        request: {
            href: testResp
        }
    },
    testBody
];

//Erwartet
var writePara = [ 'https://www.finanzchef24.de',
    'Finanzchef24 | Unternehmer? Aber sicher!',
    'Finanzchef24 ist Deutschlands großer digitaler Versicherungsmakler für Unternehmer & Selbstständige. Jetzt Tarifvergleich & unabhängige Beratung testen!',
    'h1 testtext',
    'follow, index' ];

var cheerioPara = '<meta name="description" content="Finanzchef24 ist Deutschlands großer digitaler Versicherungsmakler für Unternehmer &amp; Selbstständige. Jetzt Tarifvergleich &amp; unabhängige Beratung testen!" /><title>Finanzchef24 | Unternehmer? Aber sicher!</title><meta name="robots" content="follow, index" /><h1>h1 testtext</h1>';

//Teststart
describe('CheeriWriSpec', function () {
    describe('#cheeriWri()', function () {
        beforeEach(function() {
            chSpy.reset();
            writeSpy.reset();
        });
        it('writer.write einmal aufgerufen mit den richtigen Parametern', function () {
            cheeriWri(testData, writer);
            assert.equal(1, writeSpy.callCount);
            expect(writeSpy.firstCall.args[0]).to.be.a("array");
            expect(writeSpy.firstCall.args[0]).to.eql(writePara);
        });
        it('cheerio.load einmal aufgerufen mit den richtigen Parametern', function () {
            cheeriWri(testData, writer);
            assert.equal(1, chSpy.callCount);
            expect(chSpy.firstCall.args[0]).to.be.a("string");
            assert.equal(cheerioPara, chSpy.firstCall.args[0]);
        });
    });
});














/// Hilfestellung für mich
/*var chMock = {
 load: function () {
 console.log("nichts machen");
 }
 }
 cheeriWri.__set__("cheerio", chMock);*/
/*
 function mock_request(site, cb) {
 cb(null, [
 {
 request: {
 href: site
 }
 },
 ''
 ]*/