let fs = require('fs');
let path = require('path');
let mqtt = require('mqtt');
let config = require('./config.json');
let devices = require('./devices.json');

let client = mqtt.connect(config.client);

client.on('connect', () => {

    Object.keys(devices).forEach(id => {

        let topic = config.topic + '/' + id;

        client.subscribe(topic);
        console.log('mqtt: subscribe ' + topic);

    });

});

client.on('message', (topic, message) => {

    try {

        let id = topic.split('/')[1];
        let data = JSON.parse(message.toString());

        console.log(topic);
        console.log(data);

        let file = path.join(__dirname, 'devices.json');
        let json = fs.readFileSync(file);
        let devices = JSON.parse(json);
        let device = devices[id];

        if (!device || !Array.isArray(device)) {

            devices[id] = [];
            device = devices[id];

        }

        if (
            (
                (
                    device[0] &&
                    device[0].last_seen !== data.last_seen
                ) || !device[0]
            ) &&
            device.unshift(data) > config.length
        ) device.pop();

        json = JSON.stringify(devices, null, 4);
        fs.writeFileSync(file, json);

    } catch (error) {

        console.error(topic);
        console.error(message);
        console.error(error);

    }

});