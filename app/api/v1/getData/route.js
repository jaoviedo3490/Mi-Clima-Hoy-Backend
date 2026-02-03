import { NextResponse } from "next/server";
import Engine from "@/app/Engine/Engine";


export function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const latitude = searchParams.get("lat");
        const longitude = searchParams.get("lon");
        const locate = searchParams.get("locate");
        const customLocation = searchParams.get("custom") === "true";
        return fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10`)
            .then((res) => res.json())
            .then((data) => {

                //const ciudad = data?.address?.city || data?.address?.town || data?.address?.village || `${latitude},${longitude}`;
                return fetch(
                    `https://api.weatherapi.com/v1/current.json?key=a21411e5a88c4a5291a173440243010&q=${(customLocation) ? locate : `${latitude},${longitude}`}&aqi=yes`
                );
            })
            .then((res) => res.json())
            .then((data) => {
                var param = {}
                var response = {}
                var Metrics = ["Temperatura", "Radiacion UV", "Velocidad-Viento", "Precipitacion", "Quality-Air"]
                Metrics.forEach(element => {
                    response[element] = Engine(param, element, data)
                });
                //var resEngine = Engine(param, "Temperatura", data)

                return NextResponse.json({ error: false, response: response })
            })
            .catch((error) => {
                return NextResponse.json({ error: true, Message: String(error) })
            });
    } catch (error) {
        return NextResponse.json({ error: true, Message: String(error) })
    }
}