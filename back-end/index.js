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
    console.log("fallen");
    res.send("FALLEN")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


function addOrSetToSettings(key, value, res) {
    var json = fs.readFileSync('settings.json', 'utf8');
    let settings = JSON.parse(json);
    settings[key] = value;
    fs.writeFileSync('settings.json', JSON.stringify(settings), null);
    res.send(settings)
}
