const deepEqual = require('deep-equal');

/** determines whether a response has passed
 *
 * @param response - http response object
 * @param expectStatus - number
 * @param expectBody - string
 * @param expectHeader - object
 * @returns {{  success is true if test passes, message is test output log }}
 */
const validateResponse = (response, expectStatus, expectBody, expectHeader)=> {
    let out = '';
    const validStatus = (expectStatus && response.statusCode)
        ? (expectStatus === response.statusCode)
        : (response.statusCode < 400);

    const validResponse = (expectBody && response.body)
        ? (JSON.stringify(expectBody) === JSON.stringify(response.body))
        : (response.body !== undefined);

    const validHeader = (expectHeader && response.headers)
        ? deepEqual(Object.assign(expectHeader, response.headers), response.headers)
        : true;

    //  create test result object
    const success = validStatus && validResponse && validHeader;

    if (success === true) {
        out += `PASS (${response.statusCode})\n\t`;
    } else {
        out += `FAIL \n\t`;
        if (!validStatus) {
            out += ` - expected status: ${expectStatus},\, got\t ${response.statusCode}`;
        }
        if (!validResponse) {
            out += ` - expected result: ${JSON.stringify(expectBody)},\n got\t ${JSON.stringify(response.body)}`;
        }
        if (!validHeader) {
            out += ` - expected headers: ${JSON.stringify(expectHeader)},\n got\t ${JSON.stringify(response.headers)}`;
        }
    }
    return {
        success: success,
        message: out
    }
};

module.exports = validateResponse;