const rewire = require('rewire');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const sitesprocessor = rewire('../src/SitesProcessor');
const Promise = require('bluebird');

chai.use(chaiAsPromised);
chai.should();

// Eingabedaten
const sites = {
    sites: [{body: 'body1'}, {body: 'body2'}, {body: 'body3'}]
};

// requester und cheeriWri modifiziert
const reqModded = {
    requester: sinon.stub().returns(Promise.resolve([{body: 'body1'}, {body: 'body2'}, {body: 'body3'}])),
    cheeriWri: sinon.stub()
};

// Promise.map, Promise.each modifiziert
const promModded = {
    map: reqModded.requester
};

sitesprocessor.__set__(reqModded);
sitesprocessor.__set__('Promise', promModded);

// console.log wird stillgelegt für Tests
const consoleLogModded = {
    log: sinon.stub()
};

sitesprocessor.__set__('console', consoleLogModded);

// Teststart
describe('SitesProcessorSpec', function () {
    describe('#sitesprocessor()', function () {
        it('promise wurde fulfillt', function () {
            return sitesprocessor(sites).should.be.fulfilled;
        });
        it('Endausgabe von Promise stimmt', function () {
            return sitesprocessor(sites).then((result) => {
                expect(result).to.eql([{ body: 'body1' }, { body: 'body2' }, { body: 'body3' }]);
            });
        });
        it('Promise.map(...) gecallt mit richtigen parametern', function () {
            return sitesprocessor(sites).then(() => {
                expect(promModded.map.called).to.be.true;
                expect(promModded.map.firstCall.args[0]).to.be.a('array');
                expect(promModded.map.firstCall.args[1]).to.be.a('function');
                expect(promModded.map.firstCall.args[2]).to.eql({concurrency: 10});
            });
        });
        it('cheeriWri(...) gecallt mit richtigen parametern', function () {
            return sitesprocessor(sites).then(() => {
                expect(reqModded.cheeriWri.called).to.be.true;
                expect(reqModded.cheeriWri.firstCall.args[0]).to.eql({ body: 'body1' });
                expect(reqModded.cheeriWri.firstCall.args[1]).to.be.a('undefined');
                expect(reqModded.cheeriWri.secondCall.args[0]).to.eql({ body: 'body2' });
                expect(reqModded.cheeriWri.secondCall.args[1]).to.be.a('undefined');
                expect(reqModded.cheeriWri.thirdCall.args[0]).to.eql({ body: 'body3' });
                expect(reqModded.cheeriWri.thirdCall.args[1]).to.be.a('undefined');
            });
        });
        it('requester(...) gecallt mit richtigen parametern', function () {
            return sitesprocessor(sites).then(() => {
                expect(reqModded.requester.called).to.be.true;
                expect(reqModded.requester.firstCall.args[0]).to.be.a('array');
                expect(reqModded.requester.firstCall.args[1]).to.be.a('function');
                expect(reqModded.requester.firstCall.args[2]).to.eql({concurrency: 10});
            });
        });
    });
});
