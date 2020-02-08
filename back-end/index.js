const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());



function hasFallen(timestampedData) {

}


app.get('/', (req, res) => res.send('Hello World!'))

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
    const objectSnapshot = '[{ "ts":1539055297728,\n' +
        '     "objects":[\n' +
        '          {\n' +
        '               "frame":328,\n' +
        '               "oid":13,\n' +
        '               "x0":0.809,\n' +
        '               "x1":0.696,\n' +
        '               "y0":0.696,\n' +
        '               "y1":0.356,\n' +
        '               "type": "person"\n' +
        '          }\n' +
        '     ]' +
        '}]';
    const obj = JSON.parse(objectSnapshot);
    let fallen = true
    res.send(fallen)
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


function addOrSetToSettings(key, value, res) {
    fs.readFileSync('settings.json', function (err, contents) {
        let settings = JSON.parse(contents);
        settings[key] = value;
        fs.writeFileSync('settings.json', JSON.stringify(settings), function (err) {
            if (err) throw err;
            console.log('Saved!');
            res.send(settings)
        });
    });

}
