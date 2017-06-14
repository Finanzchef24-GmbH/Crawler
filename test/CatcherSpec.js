const rewire = require('rewire');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const catcher = rewire('../src/Catcher');

const stub = sinon.stub();
const consoleModded = {
    error: sinon.stub()
};

catcher.__set__('console', consoleModded);

const processExitModded = {
    exit: sinon.stub()
};

catcher.__set__('process', processExitModded);

describe('CatcherSpec', function () {
    describe('#catcher()', function () {
        beforeEach(function() {
            consoleModded.error.reset();
        });
        it('catcher einmal ausgeführt wenn Promise rejected', function () {
            return stub.rejects('FEHLERTEST')().catch(function(error) {
                catcher(error);
            }).then(() => {
                expect(consoleModded.error.callCount).to.equal(1);
            });
        });
        it('catcher 0 mal ausgeführt wenn Promise fulfilled', function () {
            return stub.resolves('RESOLVETEST')().catch(function(error) {
                catcher(error);
            }).then(() => {
                expect(consoleModded.error.callCount).to.equal(0);
            });
        });
    });
});
