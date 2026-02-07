import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const latitude = searchParams.get("lat");
        const longitude = searchParams.get("lon");

        var responseAlerts = {};
        var responseOpenMeteo = {};
        var responseWeatherbit = {};

        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&alerts=true`
        );

        const data = await res.json();
        responseOpenMeteo = data;

        responseAlerts["OpenMeteo"] = responseOpenMeteo;

        return NextResponse.json({ error: false, response: responseAlerts });

        /*return fetch(
            `https://api.weatherbit.io/v2.0/alerts?lat=${latitude}&lon=${longitude}&key=a4275a39ffcb42a3b46fc23b2bb93de9`
        )
            .then((res) => res.json())
            .then((data) => {
                responseWeatherbit = data;
                responseAlerts['WeatherApiAlert'] = responseWeatherbit;
                if (data.error) {
                    return NextResponse.json({ error: true, response: responseAlerts });
                }
                return NextResponse.json({ error: false, response: responseAlerts });
            })
            .catch((error) => {
                responseWeatherbit = error;
                responseAlerts['WeatherApiAlert'] = responseWeatherbit;
                return NextResponse.json({ error: false, response: responseAlerts });
            });*/

    } catch (error) {
        return NextResponse.json({ error: true, Message: String(error) });
    }
}

