// app/page.js
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div>
      <h1>Clima API Server</h1>
      <p>Endpoint: /api/v1/wheater/current?lat={lat}&lon={lon}</p>
    </div>
  );
}