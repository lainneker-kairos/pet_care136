"use client";
import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";

export default function FloatingNotification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNewNotification = (data) => {
      console.log("Nueva notificación recibida:", data);
      setNotifications((prev) => [...prev, data]);
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      {notifications.map((notif, index) => (
        <div key={index} className="bg-white p-4 rounded shadow-lg mb-2">
          <div className="flex items-start gap-4">
            <h4>{notif.title}</h4>
            <p>{notif.message}</p>
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
      ))}
    </div>
  );
}