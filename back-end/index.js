const express = require('express');
const fs = require('fs');
const cors = require('cors');
const request = require('request');
const app = express();
const {http, https} = require('follow-redirects');
const port = 3000;
const accountSid = 'AC4a97a2dddc045ee98eb9e0f9fda08005';
const authToken = '22655eaf3b6368233f1896e883c1447b';
const client = require('twilio')(accountSid, authToken);

let address = "36 Star Road \n" +
    "W14 9XF \n";

app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/set/:param/:value', (req, res) => {
    console.log(req.params);
    const param = req.params.param;
    const value = req.params.value;
    addOrSetToSettings(param, value, res)
});

app.get('/settings', (req, res) => {
    fs.readFile('settings.json', function (err, contents) {
        res.send(JSON.parse(contents));
    });
});

app.get('/getImage/:timestamp', (req, res) => {
    const options = {
        hostname: 'api.meraki.com',
        port: 443,
        path: '/api/v0/networks/L_575897802350005362/cameras/Q2FV-363D-9Z7Z/snapshot',
        method: 'POST',
        headers: {
            'X-Cisco-Meraki-API-Key': '96850833f85705851d736e34914eea6db9360280',
            'Accept': 'application/json',
            'Content-type': 'application/json',
        }
    };
    const req1 = https.request(options, res1 => {
        console.log(`statusCode: ${res1.statusCode}`);

        res1.on('data', d => {
            res.send(JSON.parse(d.toString()))

        })
    });
    req1.write(JSON.stringify({"timestamp": req.params.timestamp}));
    req1.end()
});

app.get('/routine', (req, res) => {
    fs.readFile('routine.json', function (err, contents) {
        res.send(JSON.parse(contents));
    });
});

function pad(n) {
    return n < 10 ? '0' + n : n
}

app.get('/fallen', (req, res) => {
    console.log("fallen");
    let date = new Date();
    let data = pad(date.getFullYear()) + pad(date.getMonth() + 1) + pad(date.getDate()) + "T" + pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds());
    console.log(data);
    fs.appendFile('sample.txt', data + ",", function (err) {
        if (err) {
            console.log(err)
        }
        res.send("FALLEN");
    });
    sendMessage();
});

app.get('/fallen/get', (req, res) => {
    fs.readFile("sample.txt", function (err, contents) {
        res.send({data: contents.toString()});
    });
});

function sendMessage() {
    client.messages
        .create({
            body: 'There is an emergency at ' + address +
                'Medical assistance is required. ' +
                'Man of age 78 has collapsed. \n',
            from: '+18133286624',
            to: '+447414787312'
        });
}

app.get('/emergency', (req, res) => {
    sendMessage().then(message => console.log(message.sid));
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function addOrSetToSettings(key, value, res) {
    const json = fs.readFileSync('settings.json', 'utf8');
    let settings = JSON.parse(json);
    settings[key] = value;
    fs.writeFileSync('settings.json', JSON.stringify(settings), null);
    res.send(settings)
}

function addOrSetToRoutine(key, value, res) {
    const json = fs.readFileSync('routine.json', 'utf8');
    let routine = JSON.parse(json);
    routine[key] = value;
    fs.writeFileSync('routine.json', JSON.stringify(routine), null);
    res.send(routine)
}

const secret = 'cisco';
const validator = '585fe1e99505ec0fcd3d7f27a1779137233bfd1c';
const route = '/cmx';

// All CMX JSON data will end up here. Send it to a database or whatever you fancy.
// data format specifications: https://documentation.meraki.com/MR/Monitoring_and_Reporting/CMX_Analytics#Version_2.0
function cmxData(data) {
    console.log('JSON Feed: ' + JSON.stringify(data, null, 2));
}

app.get('/bluetooth', (req, res) => {
    // req.query.q.toString()
    const macAddress = "c0:ee:fb:ab:90:98"
    let jsonString = '{"data": {"apFloors": [], "apMac": "e0:cb:bc:8d:4b:06", "apTags": ["", "recently-added", ""], "observations": [{"clientMac": "c0:ee:fb:ab:90:98", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -77, "seenEpoch": 1581241007, "seenTime": "2020-02-09T09:36:47Z"}, {"clientMac": "c0:28:8d:e1:50:26", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 44.15858091995289, "x": [], "y": []}, "name": "", "rssi": -77, "seenEpoch": 1581241009, "seenTime": "2020-02-09T09:36:49Z"}, {"clientMac": "28:11:a5:ce:2a:57", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "LE-KC Butterball", "rssi": -90, "seenEpoch": 1581240926, "seenTime": "2020-02-09T09:35:26Z"}, {"clientMac": "c0:28:8d:4e:d9:05", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -82, "seenEpoch": 1581241009, "seenTime": "2020-02-09T09:36:49Z"}, {"clientMac": "18:65:90:d2:13:cc", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 42.333045635943606, "x": [], "y": []}, "name": "", "rssi": -79, "seenEpoch": 1581241009, "seenTime": "2020-02-09T09:36:49Z"}, {"clientMac": "8c:85:90:19:1f:53", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -87, "seenEpoch": 1581240973, "seenTime": "2020-02-09T09:36:13Z"}, {"clientMac": "f0:18:98:17:ea:9a", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -79, "seenEpoch": 1581240965, "seenTime": "2020-02-09T09:36:05Z"}, {"clientMac": "cd:09:a6:c9:91:63", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -79, "seenEpoch": 1581240979, "seenTime": "2020-02-09T09:36:19Z"}, {"clientMac": "70:26:05:de:72:4a", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 42.333045635943606, "x": [], "y": []}, "name": "LE_WH-1000XM2", "rssi": -79, "seenEpoch": 1581241000, "seenTime": "2020-02-09T09:36:40Z"}, {"clientMac": "a4:5e:60:ca:1e:60", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -83, "seenEpoch": 1581241009, "seenTime": "2020-02-09T09:36:49Z"}, {"clientMac": "78:4f:43:56:32:45", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -83, "seenEpoch": 1581241006, "seenTime": "2020-02-09T09:36:46Z"}, {"clientMac": "00:09:a7:34:b7:4c", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "Beoplay H9i", "rssi": -80, "seenEpoch": 1581240996, "seenTime": "2020-02-09T09:36:36Z"}, {"clientMac": "4c:32:75:91:31:16", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -79, "seenEpoch": 1581241009, "seenTime": "2020-02-09T09:36:49Z"}, {"clientMac": "cc:d2:81:6b:d4:b8", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -88, "seenEpoch": 1581241006, "seenTime": "2020-02-09T09:36:46Z"}, {"clientMac": "6c:96:cf:dc:b1:16", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -84, "seenEpoch": 1581241004, "seenTime": "2020-02-09T09:36:44Z"}, {"clientMac": "38:f9:d3:7a:8a:45", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 46.361058513570036, "x": [], "y": []}, "name": "", "rssi": -74, "seenEpoch": 1581241009, "seenTime": "2020-02-09T09:36:49Z"}, {"clientMac": "f0:18:98:0c:b0:52", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -81, "seenEpoch": 1581241009, "seenTime": "2020-02-09T09:36:49Z"}, {"clientMac": "c0:28:8d:90:34:9f", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 46.361058513570036, "x": [], "y": []}, "name": "", "rssi": -74, "seenEpoch": 1581241009, "seenTime": "2020-02-09T09:36:49Z"}, {"clientMac": "dc:04:19:cb:f6:65", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -76, "seenEpoch": 1581241006, "seenTime": "2020-02-09T09:36:46Z"}, {"clientMac": "8c:85:90:18:8e:6a", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 21.636375222927207, "x": [], "y": []}, "name": "", "rssi": -67, "seenEpoch": 1581240943, "seenTime": "2020-02-09T09:35:43Z"}, {"clientMac": "f0:18:98:31:21:c6", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 30.547867224009664, "x": [], "y": []}, "name": "", "rssi": -71, "seenEpoch": 1581241009, "seenTime": "2020-02-09T09:36:49Z"}, {"clientMac": "6c:40:08:9c:fa:0f", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -78, "seenEpoch": 1581241009, "seenTime": "2020-02-09T09:36:49Z"}, {"clientMac": "4c:87:5d:07:ea:f3", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "LE-Bose QC35 II", "rssi": -81, "seenEpoch": 1581241000, "seenTime": "2020-02-09T09:36:40Z"}, {"clientMac": "8c:85:90:2b:9a:46", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -77, "seenEpoch": 1581241008, "seenTime": "2020-02-09T09:36:48Z"}, {"clientMac": "c1:02:99:04:b8:e8", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "Tile", "rssi": -85, "seenEpoch": 1581240994, "seenTime": "2020-02-09T09:36:34Z"}, {"clientMac": "c0:28:8d:5b:d2:d8", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 46.361058513570036, "x": [], "y": []}, "name": "", "rssi": -74, "seenEpoch": 1581241009, "seenTime": "2020-02-09T09:36:49Z"}, {"clientMac": "dc:82:d1:e0:df:56", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -85, "seenEpoch": 1581241004, "seenTime": "2020-02-09T09:36:44Z"}, {"clientMac": "fd:10:4e:ae:59:92", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -81, "seenEpoch": 1581240984, "seenTime": "2020-02-09T09:36:24Z"}, {"clientMac": "d1:17:1a:dd:9e:45", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "Amazfit Bip Watch", "rssi": -88, "seenEpoch": 1581240938, "seenTime": "2020-02-09T09:35:38Z"}, {"clientMac": "c4:93:cd:54:f3:31", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -87, "seenEpoch": 1581240969, "seenTime": "2020-02-09T09:36:09Z"}, {"clientMac": "c8:c9:4d:a7:e3:7d", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -84, "seenEpoch": 1581240986, "seenTime": "2020-02-09T09:36:26Z"}, {"clientMac": "c0:28:8d:90:3c:55", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -89, "seenEpoch": 1581241009, "seenTime": "2020-02-09T09:36:49Z"}, {"clientMac": "f4:0f:24:38:42:3b", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 17.18718390256876, "x": [], "y": []}, "name": "", "rssi": -54, "seenEpoch": 1581241009, "seenTime": "2020-02-09T09:36:49Z"}, {"clientMac": "c4:b3:01:93:6c:8f", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -77, "seenEpoch": 1581240961, "seenTime": "2020-02-09T09:36:01Z"}, {"clientMac": "f4:5c:89:ad:d6:c8", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -87, "seenEpoch": 1581241009, "seenTime": "2020-02-09T09:36:49Z"}, {"clientMac": "dc:a9:04:84:8c:9f", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -89, "seenEpoch": 1581240999, "seenTime": "2020-02-09T09:36:39Z"}, {"clientMac": "a4:83:e7:91:bc:98", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -88, "seenEpoch": 1581241004, "seenTime": "2020-02-09T09:36:44Z"}, {"clientMac": "e9:8e:ea:5b:d4:ac", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -84, "seenEpoch": 1581240969, "seenTime": "2020-02-09T09:36:09Z"}, {"clientMac": "fc:c1:38:ff:f2:b1", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -86, "seenEpoch": 1581240973, "seenTime": "2020-02-09T09:36:13Z"}, {"clientMac": "f0:18:98:75:a0:97", "location": {"lat": 51.49862480762561, "lng": -0.17754077911376953, "unc": 49.0, "x": [], "y": []}, "name": "", "rssi": -84, "seenEpoch": 1581241008, "seenTime": "2020-02-09T09:36:48Z"}]}, "secret": "", "type": "BluetoothDevicesSeen", "version": "2.1"}'
    let jsonObject = JSON.parse(jsonString.toString())
    let observations = jsonObject.data.observations
    let clientMacObjects  = []
    observations.forEach(obj => {
        if (obj.clientMac === macAddress) {
            clientMacObjects.push(obj)
        }
    })


    let clientLocation = clientMacObjects[0].location
    let latDiff = clientLocation.lat - 51.300
    let longDiff = clientLocation.lng - -0.177
    if (Math.abs(latDiff) > 0.05 || Math.abs(longDiff) > 0.05) {
        res.send(true)
    } else {
        res.send(false)
    }
});
