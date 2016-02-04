const $http = require('rain-util-http');

const httpTest = require('../bin');

const testApi = {
    gmaps: new $http('https://maps.googleapis.com/', {'x-hi-there': 'hello'}),
    endPoint: new $http('http://jsonplaceholder.typicode.com/')
};


httpTest('makes one request with basic description', testApi.endPoint.get('posts/1'));

httpTest('makes one request, with comma on the left | extra info', testApi.endPoint.get('posts/1'));

httpTest('makes one request, with multiple commas, on the left | extra info', testApi.endPoint.get('posts/1'));

httpTest('makes one request | with extra commas, on the right', testApi.endPoint.get('posts/1'));

httpTest('makes one request | extra info', testApi.endPoint.get('posts/1'));

httpTest('makes one request | ,,too many commas', testApi.endPoint.get('posts/1'));

httpTest('|too many bars| | ,,too many commas', testApi.endPoint.get('posts/1'));

httpTest('parallel HTTP GET | gmaps , jsonplaceholder',[
    testApi.gmaps.get('maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA')],
    testApi.endPoint.get('posts/1'));

httpTest('parallel HTTP | POST, PUT, PATCH', [
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

httpTest('parallel HTTP enforce uneven statuses | POST, PUT, PATCH', [
    testApi.endPoint.post('posts/'),
    testApi.endPoint.put('posts/1', {
        title: 'test put'
    }),
    testApi.endPoint.patch('posts/1', {
        title: 'test patch'
    })
], [201, 200]);


httpTest('HTTP | DELETE', testApi.endPoint.del('posts/1'));

httpTest('enforce response body | and status', testApi.endPoint.get('posts/1'),
    200,
    {
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    }
);