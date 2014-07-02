var mqtt = require('mqtt');
var redis = require('redis');

var server = mqtt.createServer();
/*
var redis_sub_agent = redis.createClient();
var redis_pub_agent = redis.createClient();
*/

server.clients = {};	// 记录连接到此服务器的clients
server.topics = {};	// 记录订阅某一topic的所有clients
server.count = 0;
server.pubcount = 0;

server.on('client', function(client) {
    var self = this;    // this 指向的是server

    client.on('connect', function(packet) {
        client.id = packet.clientId;

        /* 根据Mqtt v3.1 Specification, 客户端标识应是1-23个字符，大于23个字符的话服务器应返回错误2 
         */
        if(packet.clientId.length > 23) {
            client.connack({returnCode: 2});
            client.stream.end();
            return ;
        }
        if(!packet.username || !packet.password) {
            client.connack({returnCode: 5});
            client.stream.end();
            return ;
        }
        if(packet.username != 'yeelink' || packet.password != 'yeelink') {
            client.connack({returnCode: 4});
            client.stream.end();
            return ;
        }

        client.connack({returnCode: 0});

        self.clients[client.id] = client;
    	self.count++;
        
    	if(self.count % 200 == 0) {
		    console.log(self.count + ' clients connected');
	    }
        
    });

    client.on('publish', function(packet) {
        // 将pub消息推送到直接连接到自己的那些客户端
        var clis = self.topics[packet.topic];
        for(var i in clis) {
            self.clients[clis[i]].publish({topic: packet.topic, payload: packet.payload});
        }

        // 将pub消息推送到redis server
        //redis_pub_agent.publish(packet.topic, packet.payload);

        ++self.pubcount;
        if(self.pubcount % 1000) {
            console.log(self.pubcount + ' messages have been forwarded.');
        }
    });

    client.on('subscribe', function(packet) {
        var granted = [];
        client.subscriptions = packet.subscriptions;
        for(var i in packet.subscriptions) {
            var sub = packet.subscriptions[i];
            granted.push(sub.qos);

            // 将客户端加入到对应的topic列表中
            if(!self.topics[sub.topic]) {
                // 如果这个topic并不存在的话，就创建它，并订阅到redis
                self.topics[sub.topic] = [];
                //redis_sub_agent.subscribe(sub.topic);
            }
            self.topics[sub.topic].push(client.id);
        }

        client.suback({granted: granted, messageId: packet.messageId});
    });

    client.on('pinreq', function(packet) {
        client.pingresp();
    });

    client.on('disconnect', function(packet) {
        server.count--;
        for(var k in client.subscriptions) {
            for(var i in self.topics[client.subscriptions[k].topic]) {
                if(self.topics[client.subscriptions[k].topic][i] == client.id) {
                    self.topics[client.subscriptions[k].topic][i] = null;
                }
            }
        }
        client.stream.end();
        //console.log('disconnected ' + server.count);
    });

    client.on('close', function(err) {
        console.log('close');
        delete self.clients[client.id];
    });

    
    client.on('error', function(err) {
        console.log(err);
    });

    process.on('uncaughtException', function() {
    });
}).listen(1883);

/*
redis_sub_agent.on('ready', function() {
    console.log('subscribe agent connects to redis server successfully');
});

redis_sub_agent.on('message', function(channel, message) {
    // 将pub消息推送给每个订阅此消息的客户端
    var clis = server.topics[channel];
    for(var i in clis) {
        server.clients[clis[i]].publish({topic: channel, payload: message});
    }
});

redis_sub_agent.on('error', function(err) {
    console.log(err);
});

redis_pub_agent.on('ready', function() {
    console.log('publish agent connects to redis server successfully');
});

redis_pub_agent.on('error', function(err) {
    console.log(err);
});
*/
