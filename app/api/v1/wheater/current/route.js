import { NextResponse } from "next/server";
import Engine from "@/app/Engine/Engine";


export function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const latitude = searchParams.get("lat");
        const longitude = searchParams.get("lon");

        return fetch(
            `https://api.weatherapi.com/v1/current.json?key=a21411e5a88c4a5291a173440243010&q=${`${latitude},${longitude}`}&aqi=yes`
        )

            .then((res) => res.json())
            .then((data) => {
                var param = {}
                var response = {}
                var Metrics = ["Temperatura", "Radiacion UV", "Velocidad-Viento", "Precipitacion", "Quality-Air"]
                var QualityAirMetrics = ["PM10", "PM2_5", "DioAzufre", "Ozono", "DioNitrogeno", "MonoCarbono"]
                var PronosticsMetrics = ["Visibilidad","Humedad","Nubosidad"];
                response["QualityMetrics"] = {}
                response["PronosticsMetrics"] = {}
                QualityAirMetrics.forEach(element => {
                    response["QualityMetrics"][element] = Engine(param, element, data)
                })
                Metrics.forEach(element => {
                    response[element] = Engine(param, element, data)
                });
                PronosticsMetrics.forEach(element=>{
                    response["PronosticsMetrics"][element]=Engine(param,element,data)
                });
                response["last_update"] = { data: data.current.last_updated };//current.last_updated
                response["pronostic"] = { text: data.current.condition["text"] }
                response["is_day"] = { data: data.current.is_day }
        

                return NextResponse.json({ error: false, response: response })
            })
            .catch((error) => {
                return NextResponse.json({ error: true, Message: String(error) })
            });
    } catch (error) {
        return NextResponse.json({ error: true, Message: String(error) })
    }
}