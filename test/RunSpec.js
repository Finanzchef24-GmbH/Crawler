const rewire = require('rewire');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const run = rewire('../src/Run');

chai.should();

// writer.pipe und .end wird stillgelegt für Tests
const writerModded = {
    pipe: sinon.stub(),
    end: sinon.stub()
};

run.__set__('writer', writerModded);

// Allgemeine Funktionen modden
const crwModded = {
    on: sinon.stub(),
    queue: sinon.stub()
};

run.__set__('crw', crwModded);

const consoleModded = {
    log: sinon.stub()
};

run.__set__('console', consoleModded);

// Aufrufe innerhalb des Callbacks modden
const catcherModded = sinon.stub();

run.__set__('catcher', catcherModded);

const httpResponseValidatorModded = sinon.stub().returns(true);

run.__set__('httpResponseValidator', httpResponseValidatorModded);

const doneModded = sinon.stub();

const cheeriWriModded = sinon.stub();

run.__set__('cheeriWri', cheeriWriModded);

const hrefSeekerModded = sinon.stub();

run.__set__('hrefSeeker', hrefSeekerModded);

const processExitModded = sinon.stub();

run.__set__('process.exit', processExitModded);

const res = {
    $: sinon.stub(),
    request: {
        uri: {
            href: 'blablabla.com'
        }
    }
};

const crwCb = run.__get__('crwCb');

describe('run', function () {
    describe('#run()', function () {
        beforeEach(function() {
            hrefSeekerModded.reset();
        });
        it('crw.queue() wurde erfolgreich mit richtigen ' +
            'Parameter aufgerufen', function () {
            run();
            expect(crwModded.queue.firstCall.args[0]).to.eql([
                { uri: 'https://www.finanzchef24.de', calledHref: null }
            ]);
            expect(crwModded.queue.called).to.be.true;
        });
        it('crwCb() Callback-Funktion wurde erfolgreich ' +
            'mit richtigen Parametern durchlaufen und mit done() beendet', function () {
            crwCb(false, res, doneModded);
            expect(hrefSeekerModded.firstCall.args[0]).to.be.a('object');
            expect(hrefSeekerModded.firstCall.args[1]).to.be.a('function');
            expect(hrefSeekerModded.firstCall.args[2].has('https://www.finanzchef24.de')).to.be.true;
            expect(hrefSeekerModded.called).to.be.true;
            expect(doneModded.called).to.be.true;
        });
        it('crwCb() Callback-Funktion verlief ' +
            'ohne Erfolg mit Fehleraufruf', function () {
            crwCb(true, res, doneModded);
            expect(catcherModded.called).to.be.true;
        });
        it('cheeriWri() innerhalb der crwCb() Callback-Funktion ' +
            'wurde erfolgreich mit richtigen Parametern aufgerufen', function () {
            crwCb(false, res, doneModded);
            expect(cheeriWriModded.firstCall.args[0]).to.eql('blablabla.com');
            expect(cheeriWriModded.firstCall.args[1]).to.be.a('object');
            expect(cheeriWriModded.firstCall.args[2]).to.be.a('function');
        });
        it('pageLimit < counter', function () {
            run.__set__('pageLimit', 0);
            crwCb(false, res, doneModded);
            expect(processExitModded.called).to.be.true;
        });
        it('hrefSeeker() innerhalb der crwCb() Callback-Funktion ' +
            'wurde nicht erreicht, httpResponseValidator false zurückgab', function () {
            run.__set__('pageLimit', 5000);
            const httpResponseValidatorModdedAlt = sinon.stub().returns(false);

            run.__set__('httpResponseValidator', httpResponseValidatorModdedAlt);
            crwCb(false, res, doneModded);
            expect(hrefSeekerModded.called).to.be.false;
        });
    });
});
