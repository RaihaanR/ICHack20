const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;
const accountSid = 'AC4a97a2dddc045ee98eb9e0f9fda08005';
const authToken = '22655eaf3b6368233f1896e883c1447b';
const client = require('twilio')(accountSid, authToken);


let address = "36 Star Road \n" +
              "W14 9XF \n"
app.use(cors());

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
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


function addOrSetToSettings(key, value, res) {
    var json = fs.readFileSync('settings.json', 'utf8');
    let settings = JSON.parse(json);
    settings[key] = value;
    fs.writeFileSync('settings.json', JSON.stringify(settings), null);
    res.send(settings)
}
