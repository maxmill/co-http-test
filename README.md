# co-http-test #

[![Build Status](https://travis-ci.org/maxmill/co-http-test.svg?style=flat-square)](https://travis-ci.org/maxmill/co-http-test)
[![npm](https://img.shields.io/npm/v/co-http-test.svg?style=flat-square)]()
[![npm](https://img.shields.io/npm/dt/co-http-test.svg)]()




```
npm i --save co-http-test
var httpTest = require('co-http-test');

httpTest(description, request)
// description   : string
// request       : co/koa/generator compatible request.js call
```

for slightly more verbose output format description:

    var str = 'test group description | test1 desc, test2 desc, etc'

```
httpTest('HTTP DELETE',testApi.endPoint.put('posts/1'))

httpTest('enforce response body | and status', testApi.endPoint.get('posts/1'),
    200,
    {
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    }
);

// request arrays are executed in parallel


httpTest('parallel HTTP test detailed description | details for POST, PUT details, PATCH details', [
    testApi.endPoint.post('posts/'),
    testApi.endPoint.put('posts/1', {
        title: 'test put'
    }),
    testApi.endPoint.patch('posts/1', {
        title: 'test patch'
    })
]);

httpTest('parallel HTTP enforce statuses | POST, PUT, PATCH', [
    testApi.endPoint.post('posts/'),
    testApi.endPoint.put('posts/1', {
        title: 'test put'
    }),
    testApi.endPoint.patch('posts/1', {
        title: 'test patch'
    })
], [201, 200, 200]);


```

### credits ###
- https://github.com/maxmill/rain-util-http
- https://github.com/request/request
- https://github.com/substack/tape
