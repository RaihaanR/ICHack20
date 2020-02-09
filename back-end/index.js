const express = require('express');
const fs = require('fs');
const cors = require('cors');
const request = require('request');
const app = express();
const port = 3000;

app.use(cors());



function hasFallen(timestampedData) {

}

function getSnapshot(useCurrentTime, timestamp) {
  var ops;

  if (useCurrentTime) {
    ops = {
      uri: 'https:/://api.meraki.com/api/v0/networks/L_575897802350005362/cameras/Q2FV-363D-9Z7Z/snapshot',
      method: 'POST',
      headers: {
        'X-Cisco-Meraki-API-Key': '96850833f85705851d736e34914eea6db9360280',
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }
    }
  } else {
    ops = {
      uri: 'https:/://api.meraki.com/api/v0/networks/L_575897802350005362/cameras/Q2FV-363D-9Z7Z/snapshot',
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

  request(ops, function (err, response) {
      console.log(response);
      return;
  })
}

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/routine/:param/:value', (req, res) => {
    console.log("dsfds")
    console.log(req.params)
    const param = req.params.param;
    const value = req.params.value;
    addOrSetToRoutine(param, value, res)
});


app.get('/routine', (req, res) => {
    fs.readFile('routine.json', function (err, contents) {
        res.send(JSON.parse(contents));
    });
});

app.get('/set/:param/:value', (req, res) => {
    console.log(req.params)
    const param = req.params.param;
    const value = req.params.value;
    addOrSetToSettings(param, value, res)
});


app.get('/settings', (req, res) => {
    fs.readFile('settings.json', function (err, contents) {
        res.send(JSON.parse(contents));
    });
});

app.get('/fallen', (req, res) => {
    res.send()
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


function addOrSetToSettings(key, value, res) {
    var json = fs.readFileSync('settings.json', 'utf8');
    let settings = JSON.parse(json);
    settings[key] = value;
    fs.writeFileSync('settings.json', JSON.stringify(settings), null);
    res.send(settings)
}

function addOrSetToRoutine(key, value, res) {
    var json = fs.readFileSync('routine.json', 'utf8');
    let settings = JSON.parse(json);
    settings[key] = value;
    fs.writeFileSync('routine.json', JSON.stringify(settings), null);
    res.send(settings)
}
