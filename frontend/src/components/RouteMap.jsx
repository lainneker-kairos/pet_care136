"use client";
import { useEffect, useRef, useState } from "react";

const BUSINESS_ADDRESS = "Av. Principal 123, Ciudad";

export default function RouteMap({ userAddress }) {
  const mapRef = useRef(null);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userAddress) return;

    const initMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: { lat: 0, lng: 0 },
      });
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      directionsService.route(
        {
          origin: userAddress,
          destination: BUSINESS_ADDRESS,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);
            const leg = result.routes[0].legs[0];
            setInfo({
              distance: leg.distance.text,
              duration: leg.duration.text,
            });
          } else {
            setError("No se pudo calcular la ruta");
          }
        }
      );
    };

    if (window.google) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    }
  }, [userAddress]);

  return (
    <div>
      <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
      {info && (
        <p>📍 Distancia: {info.distance} — ⏱ Tiempo estimado: {info.duration}</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}