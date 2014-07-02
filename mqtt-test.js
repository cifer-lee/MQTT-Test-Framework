var client = require('./mqtt-client.js');

var count = 0;
var clients = {};
var circlecount = 0;

function createClients(n) {
    for(var i = 0 ; i < n; ++i) {
        clients[count] = client.createClient(count);
        ++count;
    }
}

function isNumeric(testValue) {
    return !isNaN(parseFloat(testValue)) && isFinite(testValue);
}

function isInteger(testValue) {
    return !isNaN(parseInt(testValue)) && isFinite(testValue);
}

var intervalId;

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk) {
    chunk = chunk.replace(/(^[\s]+)/, "");
    chunk = chunk.replace(/[\s]+$/, "");

    if(isInteger(chunk)) {
        createClients(chunk);
        console.log(chunk + ' mqtt clients have started');
    } else if(chunk == 'pub') {
        client.clientInfo.msgcount = 0;
        for(var k in clients) {
            clients[k].publish('channel' + k, 'the ' + k + 'th message');
        }
        console.log('all clients have pub a message');
    } else if(chunk == 'publoop10') {
        circlecount = 0;
        intervalId = setInterval(function() {
            circlecount++;
            client.clientInfo.msgcount = 0;
            for(var k in clients) {
                clients[k].publish('channel' + k, 'the ' + k + 'th message');
            }
            console.log('all clients have pub a message, circle: ' + circlecount);
        }, 10000);
    } else if(chunk == 'publoop20') {
        intervalId = setInterval(function() {
            circlecount++;
            client.clientInfo.msgcount = 0;
            for(var k in clients) {
                clients[k].publish('channel' + k, 'the ' + k + 'th message');
            }
            console.log('all clients have pub a message, circle: ' + circlecount);
        }, 20000);
    } else if(chunk == 'publoop30') {
        intervalId = setInterval(function() {
            circlecount++;
            client.clientInfo.msgcount = 0;
            for(var k in clients) {
                clients[k].publish('channel' + k, 'the ' + k + 'th message');
            }
            console.log('all clients have pub a message, circle: ' + circlecount);
        }, 30000);
    } else if(chunk == 'publoop40') {
        intervalId = setInterval(function() {
            circlecount++;
            client.clientInfo.msgcount = 0;
            for(var k in clients) {
                clients[k].publish('channel' + k, 'the ' + k + 'th message');
            }
            console.log('all clients have pub a message, circle: ' + circlecount);
        }, 40000);
    } else if(chunk == 'publoop50') {
        intervalId = setInterval(function() {
            circlecount++;
            client.clientInfo.msgcount = 0;
            for(var k in clients) {
                clients[k].publish('channel' + k, 'the ' + k + 'th message');
            }
            console.log('all clients have pub a message, circle: ' + circlecount);
        }, 50000);
    } else if(chunk == 'publoop5') {
        intervalId = setInterval(function() {
            client.clientInfo.msgcount = 0;
            for(var k in clients) {
                clients[k].publish('channel' + k, 'the ' + k + 'th message');
            }
            console.log('all clients have pub a message');
        }, 5000);
    } else if(chunk == 'publoop2') {
        intervalId = setInterval(function() {
            client.clientInfo.msgcount = 0;
            for(var k in clients) {
                clients[k].publish('channel' + k, 'the ' + k + 'th message');
            }
            console.log('all clients have pub a message');
        }, 2000);
    } else if(chunk == 'clearinterval') {
        clearInterval(intervalId);
        console.log('timer cleared');
    } else if(chunk == 'q') {
        for(var k in clients) {
            clients[k].end();
        }
        process.exit();
    } else {
    }
});
