var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://209.97.190.210');

client.on('connect', function () {
    client.subscribe('/merakimv/Q2FV-363D-9Z7Z/raw_detections')
})

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
})
