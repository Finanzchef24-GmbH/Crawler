const rewire = require('rewire');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const httpRespVali = rewire('../src/HttpResponseValidator');

// console.log wird stillgelegt für Tests
const consoleLogModded = {
    log: sinon.stub()
};

httpRespVali.__set__('console', consoleLogModded);

const httpResponse = {
    statusCode: 200,
    request: {
        uri: {
            href: 'https://www.finanzchef24.de/versicherung'
        }
    },
    headers: {
        'content-type': 'text/html'
    }
};

// Eingabedaten
const td = [
    {a: 200, b: 'html/css'},
    {a: 399, b: 'html/css'},
    {a: 400, b: 'html/css'},
    {a: 200, b: 'video/mp4'}
];

describe('HttpResponseValidatorSpec', function () {
    describe('#HttpResponseValidator()', function () {
        it(`HttpResponseValidator wurde mit den Parametern ${td[0].a} und b: ${td[0].b} erfolgreich durchlaufen`, function () {
            const res = httpRespVali(httpResponse);

            expect(res).to.be.true;
        });
        it(`HttpResponseValidator wurde mit den Parametern ${td[1].a} und b: ${td[1].b} ohne Erfolg durchlaufen`, function () {
            httpResponse.statusCode = td[1].a;
            const res = httpRespVali(httpResponse);

            expect(res).to.be.false;
        });
        it(`HttpResponseValidator wurde mit den Parametern ${td[2].a} und b: ${td[2].b} ohne Erfolg durchlaufen`, function () {
            httpResponse.statusCode = td[2].a;
            const res = httpRespVali(httpResponse);

            expect(res).to.be.false;
        });
        it(`HttpResponseValidator wurde mit den Parametern ${td[3].a} und b: ${td[3].b} ohne Erfolg durchlaufen`, function () {
            httpResponse.statusCode = td[3].a;
            httpResponse.headers['content-type'] = td[3].b;
            const res = httpRespVali(httpResponse);

            expect(res).to.be.false;
        });
    });
});
