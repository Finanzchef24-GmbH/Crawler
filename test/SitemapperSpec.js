var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var sitemapper = rewire('../Sitemapper');

chai.use(chaiAsPromised);
chai.should();

var sModded = {
    fetch: sinon.stub().resolves(["https://www.finanzchef24.de/versicherung/bsp1", "https://www.finanzchef24.de/versicherung/bsp2", "https://www.finanzchef24.de/versicherung/bsp3"]),
};
sitemapper.__set__("sitemap", sModded);

describe('SitemapperSpec', function () {
    describe('#sitemapper()', function (done) {
        it('promise sollte fulfillt sein', function () {
            return sitemapper('http://www.finanzchef24.de/sitemap.xml').should.be.fulfilled;
        });
        it('sitemap.fetch einmal aufgerufen worden', function () {
            return sitemapper('http://www.finanzchef24.de/sitemap.xml').then((result) => {
                expect(sModded.fetch.called).to.be.true;
            })
        });
        it('sitemap.fetch hat richtige args', function () {
            return sitemapper('http://www.finanzchef24.de/sitemap.xml').then((result) => {
                expect(sModded.fetch.firstCall.args[0]).to.equal('http://www.finanzchef24.de/sitemap.xml');
            })
        });
        it('promise hat richtige Returnvalue', function () {
            return sitemapper('http://www.finanzchef24.de/sitemap.xml').then((result) => {
                expect(result).to.eql(["https://www.finanzchef24.de/versicherung/bsp1", "https://www.finanzchef24.de/versicherung/bsp2", "https://www.finanzchef24.de/versicherung/bsp3"]);
            })
        });
    });
})
