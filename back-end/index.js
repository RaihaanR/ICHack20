const express = require('express');
const fs = require('fs');
const cors = require('cors');
const request = require('request');
const app = express();
const port = 3000;
const accountSid = 'AC4a97a2dddc045ee98eb9e0f9fda08005';
const authToken = '22655eaf3b6368233f1896e883c1447b';
const client = require('twilio')(accountSid, authToken);

let address = "36 Star Road \n" +
              "W14 9XF \n";
app.use(cors());

function getSnapshot(uri, useCurrentTime, timestamp) {
  var ops;

  if (useCurrentTime) {
    ops = {
      uri: uri,
      method: 'POST',
      headers: {
        'X-Cisco-Meraki-API-Key': '96850833f85705851d736e34914eea6db9360280',
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }
    }
  } else {
    ops = {
      uri: uri,
      method: 'POST',
      json: {
        "timestamp": timestamp
      },
      headers: {
        'X-Cisco-Meraki-API-Key': '96850833f85705851d736e34914eea6db9360280',
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }
    }
  }

  request(ops, function (err, response, body) {
      if (response.statusCode == '308' && response.headers.location) {
        return getSnapshot(response.headers.location, useCurrentTime, timestamp);
      } else {
        console.log(body);
      }
  })
}

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/set/:param/:value', (req, res) => {
    console.log(req.params)
    const param = req.params.param;
    const value = req.params.value;
    addOrSetToSettings(param, value, res)
});

app.get('/rout/:param/:value', (req, res) => {
    console.log(req.params)
    const param = req.params.param;
    const value = req.params.value;
    addOrSetToRoutine(param, value, res)
});

app.get('/settings', (req, res) => {
    fs.readFile('settings.json', function (err, contents) {
        res.send(JSON.parse(contents));
    });
});

app.get('/routine', (req, res) => {
    fs.readFile('routine.json', function (err, contents) {
        res.send(JSON.parse(contents));
    });
});

app.get('/getImage', (req, res) => {
    getSnapshot('https://api.meraki.com/api/v0/networks/L_575897802350005362/cameras/Q2FV-363D-9Z7Z/snapshot', false, '20200208T183000Z');
});

app.get('/fallen', (req, res) => {
    console.log("fallen");
    res.send("FALLEN")
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

function addOrSetToRoutine(key, value, res) {
    var json = fs.readFileSync('routine.json', 'utf8');
    let routine = JSON.parse(json);
    routine[key] = value;
    fs.writeFileSync('routine.json', JSON.stringify(routine), null);
    res.send(routine)
}
