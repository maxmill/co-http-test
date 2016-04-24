const run = require('tape-catch');
const coTape = require('co-tape');
const validateResponse = require('./validate-response');
const describeResult = require('./describe-result');

/** Validates results of one or more http requests. (optional) validate by status(defaults to 200), body, and headers
 *
 * @param description - string, comma-separated for more verbose output
 * @param req - co/koa/generator compatible request.js call
 * @param expectStatus -number
 * @param expectBody - Json
 * @param expectHeaders - Json
 */
const httpTest = (description, req, expectStatus, expectBody, expectHeaders)=> {

    expectStatus = Array.isArray(expectStatus) ? expectStatus : [expectStatus];
    expectBody = Array.isArray(expectBody) ? expectBody : [expectBody];
    expectHeaders = Array.isArray(expectHeaders) ? expectHeaders : [expectHeaders];

    const [numStatuses, numHeaders, numResults] = [
        (req.length - expectStatus.length), (req.length - expectHeaders.length), (req.length - expectBody.length)
    ];

    if (numResults > -1) {
        expectBody = concatWithDefault(expectBody, numResults);
    }
    if (numStatuses > -1) {
        expectStatus = concatWithDefault(expectStatus, numStatuses, 200);
    }
    if (numHeaders > -1) {
        expectHeaders = concatWithDefault(expectHeaders, numHeaders);
    }

    run(description, coTape(function*(test) { // starts test
            const response = yield req;

            // if multiple responses are found, validate them
            let testResult = Array.isArray(response)
                ? response.map((r, i)=> validateResponse(r, expectStatus[i], expectBody[i], expectHeaders[i]))
                : [validateResponse(response, expectStatus[0], expectBody[0], expectHeaders[0])];

            // assert test results array
            const passOrFail = testResult.filter((x)=>x.success === false).length === 0 ? 'pass' : 'fail';

            test[passOrFail](describeResult(description, testResult));

            test.end(); // ends test
        }
    ));
};

const concatWithDefault = (values, size, defaultValue)=> values.concat(Array.from(new Array(size)).map((r)=>r || defaultValue));

module.exports = httpTest;