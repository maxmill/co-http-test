'use strict';

const describeTestResult = (description, testResult) => {
    // extract description heading if possible
    description = description.indexOf('|') > -1 ? description.split('|') : [null, description];

    // match individual test results with sub descriptions
    const subDescriptions = description[1].indexOf(',') > -1 ? description[1].split(',') : Array.from(new Array(testResult.length)).map((x, i) => `${ description[1] }`);

    return `${ description[1] } ${ testResult.map((x, i) => `[${ subDescriptions[i] } - ${ x.message }]`).join(',') }`;
};

module.exports = describeTestResult;