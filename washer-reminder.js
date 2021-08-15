var messurments = [];
var isRunning = false;

on({id: "mqtt-client.0.Waschmaschine.tele.SENSOR", change: "any"}, (obj) => {
    var sensorData = JSON.parse(obj.state.val);
    var messurmentsCount = 0;

    if(sensorData && sensorData.ENERGY) {
        messurmentsCount = messurments.push(sensorData.ENERGY.Power)
        if(messurmentsCount > 3) messurments.shift()
    }

    var sum = 0
    var average = 0

    messurments.forEach(m => {
        if(!isNaN(m)) {
            sum += m
            average = sum > 0 ? sum / messurmentsCount : 0
        }
    })

    if(messurmentsCount >=3 && average > 20 && !isRunning) {
        isRunning = true
        pushover({
            title: "⏲ Die Waschmaschine läuft...",
            html:1,
            message: 'Der Waschdurchgang wurde gestartet. Ich gebe Bescheid, wenn er abgeschlossen wurde.'
        })
    }
    
    if(messurmentsCount >=3 && isRunning && average < 10) {
        pushover({
            title: "✅ Waschmaschine ist fertig",
            html:1,
            message: 'Der Waschdurchgang ist beendet und die Wäsche kann nun in den Trockner gegeben werden.',
        })
 
        isRunning = false
    }

    console.log("Letzte Messung: " + messurments[messurments.length-1])
    console.log("Durchschnitt: " + average)

})
