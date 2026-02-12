import { NextResponse } from "next/server";
import EngineAlarm from "../../../../Engine/EngineAlarm";
import { translate } from "@vitalets/google-translate-api"

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const latitude = searchParams.get("lat");
        const longitude = searchParams.get("lon");
        const day = searchParams.get("day");
        const anio = searchParams.get("anio");
        const month = searchParams.get("month");
        var Pais = "";
        var json_alarms = {}


        // Validación básica
        if (!latitude || !longitude || !day || !month || !anio) {
            return NextResponse.json(
                { error: true, Message: "Parametros incompletos" },
                { status: 400, headers: corsHeaders() }
            );
        }
        Pais = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10`,
            {
                headers: {
                    "User-Agent": "clima-app-server/1.0"
                }
            }
        )
        const data = await Pais.json();

        let CountryTransale = await translate("Country-" + data.address.country, { from: "auto", to: "es" });
        CountryTransale = CountryTransale.text.split("-");

        json_alarms = await EngineAlarm(CountryTransale[1], anio, month, day);
        //json_alarms = await EngineAlarm("Austria", anio, month, day);


        return NextResponse.json({ error: false, response: json_alarms }, {
            status: 200,
            headers: corsHeaders()
        });



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