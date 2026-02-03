const Engine = require("./Engine");


try {
    fetch(
        `https://api.weatherapi.com/v1/current.json?key=a21411e5a88c4a5291a173440243010&q=4.6,74.1}&aqi=yes`
    )
        .then((res) => res.json())
        .then((data) => {
            var Metrics = ["Temperatura","Radiacion UV","Velocidad-Viento","Precipitacion","Quality-Air"]
            var param = {}
            var response = {}
            Metrics.forEach(element => {
                response[element] = Engine(param, element, data)
            });
             //response = Engine(param, "Temperatura", data)
            //var resEngine = Engine(param, "Temperatura", data)

            //console.log("Error en: " + String(error));
            console.log(JSON.stringify(response))
        })
        .catch((error) => {
            console.log("Error en: " + String(error));
        });
} catch (error) {
    console.log("Error en: " + String(error));
}