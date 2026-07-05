"use client";
import { useEffect } from "react";
// CHICOS, DEBEN INSTALAR SOCKET.IO-CLIENT en el front
// npm install socket.io-client
import { io } from "socket.io-client";
import { getUserProfile } from "@/Services/api";

export default function SocketClient() {
  useEffect(() => {
    const token = localStorage.getItem("TOKENJWT");
    if (!token) return;

    let socket;

    // Obtenemos el perfil para saber nuestro propio user_id
    const initializeSocket = async () => {
      try {
        const profileData = await getUserProfile();
        
        if (profileData && profileData.user && profileData.user.id) {
        // ojo! cambiar esto por la URL de producción cuando despleguemos
            socket = io("http://localhost:5000", {
                transports: ["websocket", "polling"]
            });

            socket.on("connect", () => {
                console.log("Conectado a WebSocket de PetCare");
                socket.emit("join_notifications", { user_id: profileData.user.id });
            });

            socket.on("new_notification", (notif) => {
                console.log("🔔 Nueva notificación recibida:", notif);
                

                alert(`🐾 ${notif.title}\n\n${notif.message}`);
            });
        }
      } catch (error) {
        console.error("Error al configurar webSockets:", error);
      }
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return null; // Este componente no renderiza interfaz, solo escucha eventos.
}