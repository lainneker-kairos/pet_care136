"use client";
import { useEffect } from "react";
import { socket } from "@/utils/socket";

export default function SocketClient() {
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      socket.connect();
      socket.emit("join_notifications", { user_id: userId });
    }

    // Limpieza al desmontar
    return () => {
      socket.disconnect();
    };
  }, []);

  return null; // Este componente no renderiza nada visual
}