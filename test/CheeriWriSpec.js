var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var cheeriWri = rewire('../CheeriWri');

// Beim Parameterübergabe -> Dependency Injection
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
    '<title>Finanzchef24 | Unternehmer? Aber sicher!</title>';

var testData = [
    {
        request: {
            href: testResp
        }
    },
    testBody
];

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
            console.log(writeSpy.firstCall.args[0]);
        });
        it('cheerio.load einmal aufgerufen mit den richtigen Parametern', function () {
            cheeriWri(testData, writer);
            assert.equal(1, chSpy.callCount);
            console.log(chSpy.firstCall.args[0]);
        });
    });
});















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