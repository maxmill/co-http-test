const test = require('tape-catch');
const coTape = require('co-tape');

const assertResponse = function (response, expectStatus, expectResult) {

    var validStatus = (expectStatus && response.statusCode) ? (expectStatus == response.statusCode) : (response.statusCode < 400);
    var validResponse = (expectResult && response.body) ? (JSON.stringify(expectResult) === JSON.stringify(response.body)) : (response.body !== undefined);
    var success = validStatus && validResponse;
    var out = '';

    if (success === true) {
        out += `PASS (${response.statusCode})\n\t`;
    } else {
        out += `FAIL \n\t`;
        if (!validStatus) {
            out += ` - expected status: ${expectStatus}, got ${response.statusCode}`;
        }
        if (!validResponse) {
            out += ` - expected result: ${JSON.stringify(expectResult)}, got ${JSON.stringify(response.body)}`;
        }
    }
    return {
        success: success,
        message: out
    }
};


const httpTest = (description, req, expectStatus, expectResult)=> {


    test(description, coTape(function* (t) {
            var response = yield req;
            expectStatus = Array.isArray(expectStatus) ? expectStatus : [expectStatus];
            expectResult = Array.isArray(expectResult) ? expectResult : [expectResult];

            var numResults = req.length - expectResult.length;
            if (numResults > -1) {
                expectResult = expectResult.concat(Array.from(new Array(numResults)).map((r)=>r || undefined));
            }
            var numStatuses = req.length - expectStatus.length;
            if (numStatuses > -1) {
                expectStatus = expectStatus.concat(Array.from(new Array(numStatuses)).map((r)=>r || 200));
            }

            var testResult = Array.isArray(response)
                ? response.map((r, i)=> assertResponse(r, expectStatus[i], expectResult[i]))
                : assertResponse(response);

            testResult = Array.isArray(testResult) ? testResult : [testResult];

            description = (description.indexOf('|') > -1) ? description.split('|') : [null, description];

            var _desc = (description[1].indexOf(',') > -1)
                ? description[1].split(',')
                : Array.from(new Array(testResult.length)).map((x, i)=>`${description[1]}`);


            var messages = `${description[1]} ${testResult.map((x, i)=>`[${_desc[i]} - ${x.message}]`).join(',')}`;
            var passed = testResult.filter((x)=>x.success === false).length === 0;

            t[passed === true ? 'pass' : 'fail'](messages);
            t.end();
        }
    ));
};

module.exports = httpTest;