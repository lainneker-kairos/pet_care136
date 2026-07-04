"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// URL servidor backend. 
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function FloatingNotification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("TOKENJWT");
    if (!token) return;

    let userId = null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      userId = JSON.parse(jsonPayload).sub; 
    } catch (error) {
      console.error("Error al leer el token:", error);
      return;
    }

    if (!userId) return;

    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("🟢 Conectado a WebSockets");
      socket.emit("join_notifications", { user_id: userId });
    });

    socket.on("new_notification", (data) => {
      console.log("Notificación recibida:", data);
      
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 pointer-events-none">
      {notifications.map((notif, index) => (
        <div
          key={`${notif.booking_id}-${index}`}
          // Diseño translúcido elegante
          className="bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-2xl p-4 w-80 transform transition-all duration-500 pointer-events-auto"
        >
          <div className="flex items-start gap-4">
            
            {/* Ícono o foto de la mascota */}
            <div className="w-12 h-12 rounded-full bg-purple-200/50 flex items-center justify-center text-xl shrink-0">
              🐾
            </div>
            
            {/* Contenido de texto */}
            <div className="flex-1">
              <h4 className="text-purple-900 font-extrabold text-sm leading-tight drop-shadow-sm">
                {notif.title || "¡Nueva Reserva!"}
              </h4>
              <p className="text-gray-800 text-xs mt-1.5 font-medium leading-relaxed">
                {notif.message || "Alguien ha solicitado tus servicios."}
              </p>
            </div>

            {/* Botón "X" para cerrar manualmente */}
            <button
              onClick={() => setNotifications((prev) => prev.filter((n) => n !== notif))}
              className="text-gray-500 hover:text-red-500 transition-colors p-1"
              aria-label="Cerrar notificación"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}