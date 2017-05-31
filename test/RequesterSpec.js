var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var requester = rewire('../Requester');

chai.use(chaiAsPromised);
chai.should();

//Testdaten
var site = 'https://www.finanzchef24.de/versicherung/hausmeister';
var counter = {counter: 0};
var sites = null;

//requester Funktionen gestubbt
var rModded = {
    logger: sinon.stub(),
    request: sinon.stub().yields(null, {body: 'foobar'}), // returnwerte hier angegeben, yield für callbacks, resolves für promises, returns der so für synchrone fkts
};
requester.__set__(rModded);

//Promise.fromCallback gespiet
var fcb = requester.__get__("Promise.fromCallback");
var fcbSpy = sinon.spy(fcb);
requester.__set__('Promise.fromCallback', fcbSpy);

//Teststart
describe('RequesterSpec', function () {
    describe('#requester()', function (done) {
        //Spy resets
        beforeEach(function() {
            rModded.logger.reset();
            fcbSpy.reset();
        });
        it('promise sollte fulfillt sein', function () {
            return requester(site, counter, sites).should.be.fulfilled;
        });
        it('promise soll property body besitzen', function () {
            return requester(site, counter, sites).then((result) => {
                expect(result[0]).to.have.property('body'); // Promise implizit erfüllt
            })
        });
        it('logger(...) einmal mit richtigen Parametern aufgerufen worden', function() {
            return requester(site, counter, sites).then((result) => {
                expect(rModded.logger.calledOnce).to.be.true;
                expect(rModded.logger.firstCall.args[0]).to.be.a("object"); // oder expect(rModded.logger.firstCall.args[0]).to.equal(typeof(counter)); -> bei den anderen analog
                expect(rModded.logger.firstCall.args[1]).to.be.a("null");
            })
        });
        it('Promise.fromCallBack(...) einmal mit richtigen Parametern aufgerufen', function() {
            return requester(site, counter, sites).then((result) => {
                expect(fcbSpy.calledOnce).to.be.true;
                expect(fcbSpy.firstCall.args[0]).to.be.a("function");
                expect(fcbSpy.firstCall.args[1]).to.be.a("object");
            })
        });
    });
});
