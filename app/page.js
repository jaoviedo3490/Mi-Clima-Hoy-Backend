// app/page.js
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(
    JSON.stringify({
      message: "Clima API Server",
      endpoints: {
        current: "/api/v1/wheater/current?lat={lat}&lon={lon}"
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
}