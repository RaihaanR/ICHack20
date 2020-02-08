let mqtt = require('mqtt');
let client = mqtt.connect('mqtt://209.97.190.210');

// buffer data for an oid {expiry: 1000, size: 100, [{x0, y0, x1, y1, ts}, ...]}
// buffer - map of oid => {expiry: 1000, size: 100, [{x0, y0, x1, y1, ts}, ...]}

let buffer = new Map()
client.on('connect', function () {
    client.subscribe('/merakimv/Q2FV-363D-9Z7Z/raw_detections')
})

function getTimedData(responseJSONList, oid) {
    let timedData = [] // {x0, y0, x1, y1, ts}
    for (let x = 0; x < responseJSONList.length; ++x) {
        let response = responseJSONList[x]
        let ts = response.ts
        for (let y = 0; y < response.objects.length; ++y) {
            let object = response.objects[y]
            if (object.oid === oid) {
                let datapoint = {x0: object.x0, y0: object.y0, x1: object.x1, y1: object.y1, ts}
                timedData.push(datapoint)
            }
        }
    }

    return timedData
}

client.on('message', function (topic, message) {
    let jsonObject = JSON.parse(message.toString())
    let objects = jsonObject.objects
    let currentTime = new Date().getTime()
    objects.forEach(object=> {
        let coordinate = {x0: object.x0, y0: object.y0, x1: object.x1, y1: object.y1, ts: jsonObject.ts}
        if (!buffer.has(object.oid)) {
            buffer.set(object.oid, {expiry: currentTime+1000, size: 1, coordinates: [coordinate]})
        } else {
            let data = buffer.get(object.oid)
            if (data.size === 10) {
                data.coordinates.pop()
            }
            data.coordinates.push(coordinate)
            ++data.size
        }



        buffer.forEach(((value, key) => {
            console.log(key)
            let diff = value.coordinates[0].y0 - value.coordinates[0].y1
            console.log(diff)
        }))

        console.log("==========================================================================================")
    })

    // let timedData = getTimedData(buffer, 1)
    // console.log(timedData.length)

})
