const assert = require('assert');
const rewire = require('rewire');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const cheerio = require('cheerio');
const hrefSeeker = rewire('../src/HrefSeeker');

const urlObj = {
    hostname: 'www.finanzchef24.de',
    path: '/path',
    protocol: 'https'
};
let mockedUrler = sinon.stub().returns(urlObj);

hrefSeeker.__set__('urler.parse', mockedUrler);

const crw = {
    queue: sinon.stub()
};

const visited_pages = new Set();

visited_pages.add('https://www.test.de');
/* .add wird gestubbt, weil urlObj sich bei mehrfachen Aufrufen in hrefSeeker nicht ändert
 bzw. immer /path ist. Somit hätte jede href den gleichen Path*/
visited_pages.add = sinon.stub();

// Teststart
describe('HrefSeekerSpec', function () {
    describe('#HrefSeeker()', function () {
        beforeEach(function() {
            crw.queue.reset();
        });
        it('crw.queue 5 mal aufgerufen mit den richtigen Parametern', function () {
            const testdaten = '<a href="https://www.finanzchef24.de/versicherung">' +
                'Gewerbeversicherung</a>' +
                '<div class="row sub-nav"><div class="col-sm-4"><ul class="sub-nav-item"><li>' +
                '<span class="sub-nav-item-headline">Wichtigste Versicherungen</span></li><li>' +
                '<a href="https://www.finanzchef24.de/versicherung/berufshaftpflichtversicherung">' +
                'Berufshaftpflichtversicherung</a></li><li>' +
                '<a href="https://www.finanzchef24.de/versicherung/betriebshaftpflichtversicherung">' +
                'Betriebshaftpflichtversicherung</a></li><li>' +
                '<a href="https://www.finanzchef24.de/versicherung/gewerberechtsschutz">' +
                'Gewerbliche Rechtsschutzversicherung</a></li><li>' +
                '<a href="https://www.finanzchef24.de/versicherung/inhaltsversicherung">' +
                'Inhaltsversicherung</a>';
            const $ = cheerio.load(testdaten);
            const hostname = 'www.finanzchef24.de';
            const protocol = 'https';

            hrefSeeker(crw, $, visited_pages, hostname, protocol);
            expect(crw.queue.callCount).to.eql(5);
            assert.equal('https://www.finanzchef24.de/versicherung',
                crw.queue.getCall(0).args[0]);
            assert.equal('https://www.finanzchef24.de/versicherung/berufshaftpflichtversicherung',
                crw.queue.getCall(1).args[0]);
            assert.equal('https://www.finanzchef24.de/versicherung/betriebshaftpflichtversicherung',
                crw.queue.getCall(2).args[0]);
            assert.equal('https://www.finanzchef24.de/versicherung/gewerberechtsschutz',
                crw.queue.getCall(3).args[0]);
            assert.equal('https://www.finanzchef24.de/versicherung/inhaltsversicherung',
                crw.queue.getCall(4).args[0]);
        });
        it('crw.queue 0 mal aufgerufen, weil kein href gibt', function () {
            const testdaten =
                '<div class="row sub-nav"><div class="col-sm-4"><ul class="sub-nav-item"><li>' +
                '<span class="sub-nav-item-headline">Wichtigste Versicherungen</span></li><li>' +
                '</li><li>' +
                '</li><li>' +
                '</li><li>';
            const $ = cheerio.load(testdaten);
            const hostname = 'www.finanzchef24.de';
            const protocol = 'https';

            hrefSeeker(crw, $, visited_pages, hostname, protocol);
            expect(crw.queue.callCount).to.eql(0);
        });
        it('crw.queue 4 mal aufgerufen, weil 1 href undefined ist', function () {
            const testdaten = '<a href="https://www.finanzchef24.de/versicherung">' +
                'Gewerbeversicherung</a>' +
                '<div class="row sub-nav"><div class="col-sm-4"><ul class="sub-nav-item"><li>' +
                '<span class="sub-nav-item-headline">Wichtigste Versicherungen</span></li><li>' +
                '<a href="https://www.finanzchef24.de/versicherung/berufshaftpflichtversicherung">' +
                'Berufshaftpflichtversicherung</a></li><li>' +
                '<a href="https://www.finanzchef24.de/versicherung/betriebshaftpflichtversicherung">' +
                'Betriebshaftpflichtversicherung</a></li><li>' +
                '<a>Gewerbliche Rechtsschutzversicherung</a></li><li>' +
                '<a href="https://www.finanzchef24.de/versicherung/inhaltsversicherung">' +
                'Inhaltsversicherung</a>';
            const $ = cheerio.load(testdaten);
            const hostname = 'www.finanzchef24.de';
            const protocol = 'https';

            hrefSeeker(crw, $, visited_pages, hostname, protocol);
            expect(crw.queue.callCount).to.eql(4);
        });
        it('crw.queue mit href ohne #-Teil aufgerufen', function () {
            const testdaten = '<a href="https://www.finanzchef24.de/versicherung#blablabla">Gewerbeversicherung</a>';
            const $ = cheerio.load(testdaten);
            const hostname = 'www.finanzchef24.de';
            const protocol = 'https';

            hrefSeeker(crw, $, visited_pages, hostname, protocol);
            assert.equal('https://www.finanzchef24.de/versicherung', crw.queue.getCall(0).args[0]);
        });
        it('crw.queue 0 mal aufgerufen, weil hostname falsch ist', function () {
            const testdaten = '<a href="https://www.finanzchef24.de/versicherung">Gewerbeversicherung</a>';
            const $ = cheerio.load(testdaten);
            const hostname = 'www.finanzchef24.de';
            const protocol = 'https';

            urlObj.hostname = 'www.nein.de';
            hrefSeeker(crw, $, visited_pages, hostname, protocol);
            expect(crw.queue.callCount).to.eql(0);
        });
        it('crw.queue 0 mal aufgerufen, weil path schon in visited_pages vorhanden ist', function () {
            const testdaten = '<a href="https://www.finanzchef24.de/versicherung">Gewerbeversicherung</a>';
            const $ = cheerio.load(testdaten);
            const hostname = 'www.finanzchef24.de';
            const protocol = 'https';

            urlObj.path = 'https://www.test.de'; // dieser Pfad ist schon in der HashSet drin, s.O.
            hrefSeeker(crw, $, visited_pages, hostname, protocol);
            expect(crw.queue.callCount).to.eql(0);
        });
        it('crw.queue 0 mal aufgerufen, weil protocol falsch ist', function () {
            const testdaten = '<a href="https://www.finanzchef24.de/versicherung">Gewerbeversicherung</a>';
            const $ = cheerio.load(testdaten);
            const hostname = 'www.finanzchef24.de';
            const protocol = 'https';

            urlObj.protocol = 'http';
            hrefSeeker(crw, $, visited_pages, hostname, protocol);
            expect(crw.queue.callCount).to.eql(0);
        });
        afterEach(function() {
            urlObj.hostname = 'www.finanzchef24.de';
            urlObj.path = '/path';
        });
    });
});
