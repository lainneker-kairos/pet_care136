"use client";
import { useEffect, useRef, useState } from "react";

export default function CuidadoresMap({ cuidadores }) {
  const mapRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cuidadores || cuidadores.length === 0) return;

    const initMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 6,
        center: { lat: 40.4168, lng: -3.7038 }, // España, centro por defecto
      });
      const geocoder = new window.google.maps.Geocoder();
      const bounds = new window.google.maps.LatLngBounds();
      let markersAdded = 0;

      cuidadores.forEach((cuidador) => {
        const address = `${cuidador.neighborhood ? cuidador.neighborhood + ", " : ""}${cuidador.city}, España`;

        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK" && results[0]) {
            const position = results[0].geometry.location;

            const marker = new window.google.maps.Marker({
              position,
              map,
              title: cuidador.name,
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div style="font-family: sans-serif;">
                <strong>${cuidador.name}</strong><br/>
                ${cuidador.city}<br/>
                Desde ${cuidador.price_per_hour ?? "-"}€/hora
              </div>`,
            });

            marker.addListener("click", () => infoWindow.open(map, marker));

            bounds.extend(position);
            markersAdded++;

            if (markersAdded === cuidadores.length) {
              map.fitBounds(bounds);
            }
          } else {
            console.warn(`No se pudo geocodificar: ${address}`, status);
          }
        });
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
  }, [cuidadores]);

  return (
    <div>
      <div ref={mapRef} style={{ width: "100%", height: "600px", borderRadius: "1rem" }} />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}