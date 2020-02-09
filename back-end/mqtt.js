let mqtt = require('mqtt');
let client = mqtt.connect('mqtt://209.97.190.210');
const bufferSize = 15
// buffer data for an oid {expiry: 1000, size: 100, [{x0, y0, x1, y1, ts}, ...]}
// buffer - map of oid => {expiry: 1000, size: 100, [{x0, y0, x1, y1, ts}, ...]}
let meanList = []
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

let i = 1
client.on('message', function (topic, message) {
    let jsonObject = JSON.parse(message.toString())
    let objects = jsonObject.objects
    ++i
    objects.forEach(object=> {
        let coordinate = {x0: object.x0, y0: object.y0, x1: object.x1, y1: object.y1, ts: jsonObject.ts}
        if (!buffer.has(object.oid)) {
            buffer.set(object.oid, {rollingmean: -1, signedsd: -1, size: 1, coordinates: [coordinate]})
        } else {
            let data = buffer.get(object.oid)
            if (data.size === bufferSize) {
                data.coordinates.pop()
                --data.size
            }

            data.coordinates.push(coordinate)
            ++data.size

            if (data.size === bufferSize) {
                let sum = 0
                let sqsum = 0
                data.coordinates.forEach(coordinate => {
                    sum += coordinate.y0 - coordinate.y1
                    sqsum += (coordinate.y0 - coordinate.y1) * (coordinate.y0 - coordinate.y1)
                })

                data.rollingmean = sum / bufferSize
                let sign = data.coordinates[0] - data.coordinates[bufferSize-1]  < 0 ? 1 : -1
                data.signedsd = (sqsum / bufferSize) - (data.rollingmean * data.rollingmean)
                data.signedsd = data.signedsd * sign
                meanList.push(data.rollingmean)
            }

        }

        if (i % bufferSize === 0) {
            if (buffer.get(object.oid).coordinates.length === bufferSize) {
                console.log(object.oid)
                console.log(buffer.get(object.oid).rollingmean, 10000*buffer.get(object.oid).signedsd)
                console.log("==========================================================================================")
            }
        }

    })


})
