var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var sitesprocessor = rewire('../SitesProcessor');
var Promise = require('bluebird');

chai.use(chaiAsPromised);
chai.should();

//Eingabedaten
var sites = {
    sites: [{body: 'body1'}, {body: 'body2'}, {body: 'body3'}],
};

//requester und cheeriWri modifiziert
var reqModded = {
    requester: sinon.stub().returns(Promise.resolve([{body: 'body1'}, {body: 'body2'}, {body: 'body3'}])),
    cheeriWri: sinon.stub()
};

//Promise.map, Promise.each modifiziert
var promModded = {
    map: reqModded.requester,
    each: () => console.log("Promise.each test")//sinon.stub().returns(Promise.resolve([{body: 'body1'}, {body: 'body2'}, {body: 'body3'}]))
}
sitesprocessor.__set__(reqModded);
sitesprocessor.__set__("Promise", promModded);

//Teststart
describe('SitesProcessorSpec', function () {
    describe('#sitesprocessor()', function (done) {
        it('promise wurde fulfillt', function () {
            return sitesprocessor(sites).should.be.fulfilled;
        });
        it('Endausgabe von Promise stimmt', function () {
            return sitesprocessor(sites).then((result) => {
                expect(result).to.eql([ { body: 'body1' }, { body: 'body2' }, { body: 'body3' } ]);
            })
        });
        it('Promise.map(...) gecallt mit richtigen parametern und returnwert', function () {
            return sitesprocessor(sites).then((result) => {
                expect(promModded.map.called).to.be.true;
                expect(promModded.map.firstCall.args[0]).to.be.a("array");
                expect(promModded.map.firstCall.args[1]).to.be.a("function");
                expect(promModded.map.firstCall.args[2]).to.eql({concurrency: 10});
                //console .log(promModded.map.firstCall);
                //expect(result).to.eql([ { body: 'body1' }, { body: 'body2' }, { body: 'body3' } ]);
                //TO DO -> returnwert von map testen
            })
        });
        //.each(...) wird wahrscheinlich nicht ersetzt
        it('Promise.each(...) gecallt mit richtigen parametern und returnwert', function (done) {
            return sitesprocessor(sites).then((result) => {
                expect(promModded.each.called).to.be.true;
                //console.log(promModded.each.callCount);
                // TO DO
            })
        });
        it('cheeriWri(...) gecallt mit richtigen parametern', function () {
            return sitesprocessor(sites).then((result) => {
                expect(reqModded.cheeriWri.called).to.be.true;
                expect(reqModded.cheeriWri.firstCall.args[0]).to.eql({ body: 'body1' });
                expect(reqModded.cheeriWri.firstCall.args[1]).to.be.a("undefined");
                expect(reqModded.cheeriWri.secondCall.args[0]).to.eql({ body: 'body2' });
                expect(reqModded.cheeriWri.secondCall.args[1]).to.be.a("undefined");
                expect(reqModded.cheeriWri.thirdCall.args[0]).to.eql({ body: 'body3' });
                expect(reqModded.cheeriWri.thirdCall.args[1]).to.be.a("undefined");
            })
        });
        it('requester(...) gecallt mit richtigen parametern', function () {
            return sitesprocessor(sites).then((result) => {
                expect(reqModded.requester.called).to.be.true;
                expect(reqModded.requester.firstCall.args[0]).to.be.a("array");
                expect(reqModded.requester.firstCall.args[1]).to.be.a("function");
                expect(reqModded.requester.firstCall.args[2]).to.eql({concurrency: 10});
            })
        });
    });
})
