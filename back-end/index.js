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
    addOrSetToSettings(param, value, res);
});

app.get('/settings', (req, res) => {
    fs.readFile('settings.json', function (err, contents) {
        res.send(JSON.parse(contents));
    });
});

app.get('/numPeople', (req, res) => {
    const options = {
        uri: 'https://api.meraki.com/api/v0/devices/Q2FV-363D-9Z7Z/camera/analytics/live',
        method: 'GET',
        headers: {
            'X-Cisco-Meraki-API-Key': '96850833f85705851d736e34914eea6db9360280',
            'Accept': 'application/json'
        }
    };

    request(options, (err, resource, body) => {
        const countObj = JSON.parse(body.toString())["zones"]["0"]["person"];
        res.send(countObj.toString());
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
            'Content-type': 'application/json'
        }
    };
    const req1 = https.request(options, res1 => {

        res1.on('data', d => {
            res.send(JSON.parse(d.toString()));
        })
    });
    req1.write(JSON.stringify({"timestamp": req.params.timestamp}));
    req1.end();
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
        header = {"Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic ZGM3ODU4ZmMtNTBkYS00NDVkLTg4OWEtNjg0MWI1NTgyMTFm"}

        payload = {"app_id": "2afa271a-7f42-4fe7-ba5c-a999051d0856",
            "included_segments": ["All"],
            "small_icon": "ic_launcher",
            "large_icon": "https://www.filepicker.io/api/file/24cBwwNQTiRE88fE9TRA",
            "headings": {"en": "Fall Detected"},
            "contents": {"en": "Potential Fall detected. Click for more info"}}

        req = request.post("https://onesignal.com/api/v1/notifications",{
            json: payload,
            headers: header
        }, (error, res, body) => {
            if (error) {
                console.error(error)
                return
            }
            console.log(`statusCode: ${res.statusCode}`)
            console.log(body)
        });
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
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

function addOrSetToSettings(key, value, res) {
    const json = fs.readFileSync('settings.json', 'utf8');
    let settings = JSON.parse(json);
    settings[key] = value;
    fs.writeFileSync('settings.json', JSON.stringify(settings), null);
    res.send(settings);
}

function addOrSetToRoutine(key, value, res) {
    const json = fs.readFileSync('routine.json', 'utf8');
    let routine = JSON.parse(json);
    routine[key] = value;
    fs.writeFileSync('routine.json', JSON.stringify(routine), null);
    res.send(routine);
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
    let jsonString = req.query.q 
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
})
