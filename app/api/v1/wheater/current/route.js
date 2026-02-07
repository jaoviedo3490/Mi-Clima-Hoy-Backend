import { NextResponse } from "next/server";
import Engine from "@/app/Engine/Engine";

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

        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=a21411e5a88c4a5291a173440243010&q=${`${latitude},${longitude}`}&aqi=yes`
        );

        if (!response.ok) {
            throw new Error(`Error en API: ${response.status}`);
        }

        const data = await response.json();
        
        var param = {};
        var responseData = {};
        var Metrics = ["Temperatura", "Radiacion UV", "Velocidad-Viento", "Precipitacion", "Quality-Air"];
        var QualityAirMetrics = ["PM10", "PM2_5", "DioAzufre", "Ozono", "DioNitrogeno", "MonoCarbono"];
        var PronosticsMetrics = ["Visibilidad", "Humedad", "Nubosidad"];
        
        responseData["QualityMetrics"] = {};
        responseData["PronosticsMetrics"] = {};
        
        QualityAirMetrics.forEach(element => {
            responseData["QualityMetrics"][element] = Engine(param, element, data);
        });
        
        Metrics.forEach(element => {
            responseData[element] = Engine(param, element, data);
        });
        
        PronosticsMetrics.forEach(element => {
            responseData["PronosticsMetrics"][element] = Engine(param, element, data);
        });
        
        responseData["last_update"] = { data: data.current.last_updated };
        responseData["pronostic"] = { text: data.current.condition["text"] };
        responseData["is_day"] = { data: data.current.is_day };

        return NextResponse.json(
            { error: false, response: responseData },
            { 
                status: 200,
                headers: corsHeaders() 
            }
        );
        
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

// Función helper para headers CORS
function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
}