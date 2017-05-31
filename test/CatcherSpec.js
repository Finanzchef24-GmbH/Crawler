var assert = require('assert');
var rewire = require('rewire');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var catcher = rewire('../Catcher');

//Verbose Variante -> gibt Fehler auf die Konsole aus, im Testbereich muss consoleModded.error mit spy ersetzt werden
/*var stub = sinon.stub();
var cl = catcher.__get__("console.error");
var spy = sinon.spy(cl);
catcher.__set__('console.error', spy);*/

var stub = sinon.stub();
var consoleModded = {
    error: sinon.stub(),
}
catcher.__set__("console", consoleModded);

describe('CatcherSpec', function () {
    describe('#catcher()', function (done) {
        beforeEach(function() {
            consoleModded.error.reset();
        });
        it('catcher einmal ausgeführt wenn Promise rejected', function () {
            return stub.rejects('FEHLERTEST')().catch(function(error) {
                catcher(error);
            }).then((result) => {
                expect(consoleModded.error.callCount).to.equal(1);
            })
        });
        it('catcher 0 mal ausgeführt wenn Promise fulfilled', function () {
            return stub.resolves('RESOLVETEST')().catch(function(error) {
                catcher(error);
            }).then((result) => {
                expect(consoleModded.error.callCount).to.equal(0);
            })
        });
    });
})