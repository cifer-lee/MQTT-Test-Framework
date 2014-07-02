var mqtt = require('mqtt');
var crypto = require('crypto');

// 实际上，没有错误发生时(err为null或undefined)，mqtt_conn 和回调函数中的client是同一个对象(剖析源代码)
var mqtt_conn = mqtt.createConnection(1883, 'localhost', function(err, client) {
    if(err) throw err;

    client.on('error', function(err) {
        console.log(err);
    });

    /* npm上的mqtt库所生成的clientId都有一个mqttjs_前缀，因此没有充分利用到23字节，这里我生成的clientId利用了所有的23字节
     进一步降低了重复的可能性
     */
    var clientId = crypto.pseudoRandomBytes(23).toString('hex');
    console.log(clientId);
    client.connect({
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        keepalive: 60,
        clientId: clientId,
        clean: true,
        username: 'yeelink',
        password: 'yeelink'
    });

    client.on('connack', function(packet) {
        console.log(packet.returnCode);
        if(packet.returnCode != 0) {
            throw 'Connect error';
        }
    });
});

