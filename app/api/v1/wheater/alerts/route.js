import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const latitude = searchParams.get("lat");
        const longitude = searchParams.get("lon");

        // Validación básica
        if (!latitude || !longitude) {
            return NextResponse.json(
                { error: true, Message: "lat y lon son requeridos" },
                { status: 400, headers: corsHeaders() }
            );
        }
        var responseAlerts = {};
        var responseOpenMeteo = {};
        var responseWeatherbit = {};

        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&alerts=true`
        );

        const data = await res.json();
        responseOpenMeteo = data;

        responseAlerts["OpenMeteo"] = responseOpenMeteo;

        return NextResponse.json({ error: false, response: responseAlerts }, {
            status: 200,
            headers: corsHeaders()
        });

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
        console.error("API Error:", error);
        return NextResponse.json(
            {
                error: true,
                Message: error.message || "Error interno del servidor"
            },
            {
                status: 500,
                headers: corsHeaders()
            }
        );
    }
}

// Agrega esta función OPTIONS para CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders()
    });
}


function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
}