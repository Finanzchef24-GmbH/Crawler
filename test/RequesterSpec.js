const rewire = require('rewire');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const requester = rewire('../src/Requester');

chai.use(chaiAsPromised);
chai.should();

// Testdaten
const site = 'https://www.finanzchef24.de/versicherung/hausmeister';
const counter = {counter: 0};
const sites = null;

// requester Funktionen gestubbt
const rModded = {
    logger: sinon.stub(),
    // returnwerte hier angegeben, yield für callbacks, resolves für promises, returns der so für synchrone fkts
    request: sinon.stub().yields(null, {body: 'foobar'})
};

requester.__set__(rModded);

// Promise.fromCallback gespiet
const fcb = requester.__get__('Promise.fromCallback');
const fcbSpy = sinon.spy(fcb);

requester.__set__('Promise.fromCallback', fcbSpy);

// Teststart
describe('RequesterSpec', function () {
    describe('#requester()', function () {
        // Spy resets
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
            });
        });
        it('logger(...) einmal mit richtigen Parametern aufgerufen worden', function() {
            return requester(site, counter, sites).then(() => {
                expect(rModded.logger.calledOnce).to.be.true;
                // oder expect(rModded.logger.firstCall.args[0]).to.equal(typeof(counter));
                // -> bei den anderen analog
                expect(rModded.logger.firstCall.args[0]).to.be.a('object');
                expect(rModded.logger.firstCall.args[1]).to.be.a('null');
            });
        });
        it('Promise.fromCallBack(...) einmal mit richtigen Parametern aufgerufen', function() {
            return requester(site, counter, sites).then(() => {
                expect(fcbSpy.calledOnce).to.be.true;
                expect(fcbSpy.firstCall.args[0]).to.be.a('function');
                expect(fcbSpy.firstCall.args[1]).to.be.a('object');
            });
        });
    });
});
