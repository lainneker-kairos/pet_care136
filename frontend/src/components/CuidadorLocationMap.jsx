"use client";
import { useEffect, useRef, useState } from "react";

export default function CuidadorLocationMap({ city, neighborhood, name }) {
  const mapRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    const initMap = () => {
      const address = `${neighborhood ? neighborhood + ", " : ""}${city}, España`;
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const position = results[0].geometry.location;

          const map = new window.google.maps.Map(mapRef.current, {
            zoom: 13,
            center: position,
          });

          new window.google.maps.Marker({
            position,
            map,
            title: name,
          });
        } else {
          console.warn(`No se pudo geocodificar: ${address}`, status);
          setError("No se pudo ubicar la dirección en el mapa");
        }
      });
    };

    if (window.google) {
      initMap();
    } else {
      const existingScript = document.getElementById("google-maps-script");
      if (existingScript) {
        existingScript.addEventListener("load", initMap);
        return;
      }
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = initMap;
      script.onerror = () => setError("No se pudo cargar Google Maps");
      document.body.appendChild(script);
    }
  }, [city, neighborhood, name]);

  return (
    <div>
      <div ref={mapRef} style={{ width: "100%", height: "192px", borderRadius: "0.75rem" }} />
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}