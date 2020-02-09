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


function pad(n) {
    return n<10 ? '0'+n : n
}

app.get('/fallen', (req, res) => {
    console.log("fallen");
    let date = new Date();
    let data = pad(date.getFullYear()) + pad(date.getMonth() + 1) + pad(date.getDate()) + "T" + pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds());
    console.log(data);
    fs.appendFile('sample.txt',data + ",", function (err) {
        if(err){
            console.log(err)
        }
        res.send("FALLEN");
    })
});


app.get('/fallen/get', (req, res) => {
    fs.readFile("sample.txt", function (err, contents) {
        res.send({data: contents.toString()});
    });
});

app.get('/emergency', (req, res) => {
    client.messages
        .create({
            body: 'There is an emergency at ' + address +
                'Medical assistance is required. ' +
                'Man of age 78 has collapsed. \n',
            from: '+18133286624',
            to: '+447414787312'
        })
        .then(message => console.log(message.sid));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


function addOrSetToSettings(key, value, res) {
    var json = fs.readFileSync('settings.json', 'utf8');
    let settings = JSON.parse(json);
    settings[key] = value;
    fs.writeFileSync('settings.json', JSON.stringify(settings), null);
    res.send(settings)
}
