const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/set/:param/:value', (req, res) => {
    const param = req.params.param;
    const value = req.params.value;
    addOrSetToSettings(param, value, res)
});


app.get('/settings', (req, res) => {
    fs.readFile('settings.json', function (err, contents) {
        res.send(JSON.parse(contents));
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


function addOrSetToSettings(key, value, res) {
    fs.readFile('settings.json', function (err, contents) {
        let settings = JSON.parse(contents);
        settings[key] = value;settings
        fs.writeFile('settings.json', JSON.stringify(settings), function (err) {
            if (err) throw err;
            console.log('Saved!');
            res.send(settings)
        });
    });

}
