var mqtt = require('mqtt');

var opts = {
    username: 'yeelink',
    password: 'yeelink'
}

var clientInfo = {};
clientInfo.count = 0;
clientInfo.msgcount = 0;

function createClient(no) {
    var client = mqtt.createClient(1883, '42.96.248.188', opts);
    client.subscribe('channel' + no);

    client.on('connect', function() {
        clientInfo.count++;
        if(clientInfo.count % 5000 == 0) {
             console.log(clientInfo.count + ' clients connected');
        }
        //console.log('client ' + no + ' connected successfully');
    });

    client.on('message', function(topic, message, packet) {
        //console.log('client ' + no + ' receive message: ');
        //console.log(topic + ': ' + message);
        /*
        clientInfo.msgcount++;
        if(clientInfo.msgcount == clientInfo.count) {
             console.log('all ' + clientInfo.count + ' clients have received the pub messages');
             clientInfo.msgcount = 0;
        } else if(clientInfo.msgcount % 5000 == 0) {
             console.log(clientInfo.msgcount + ' clients have received the pub messages');
        } else if(clientInfo.msgcount % 2500 == 0) {
             console.log(clientInfo.msgcount + ' clients have received the pub messages');
        } else {
        }
        */
    });

    client.on('error', function(err) {
        console.log(err);
    });

    return client;
}

exports.createClient = createClient;
exports.clientInfo = clientInfo;
