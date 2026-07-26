"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PrivatePage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem("TOKENJWT");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/api/private", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data); 
          setLoading(false);
        } else {
          sessionStorage.removeItem("TOKENJWT");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error validando el token", error);
        sessionStorage.removeItem("TOKENJWT");
        router.push("/login");
      }
    };

    verifyToken();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("TOKENJWT");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <p className="text-white">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#09090b] to-[#0f170d]/90 overflow-hidden font-sans p-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purpple-500/60 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl bg-white/[0.001] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.7)] rounded-3xl p-8 sm:p-10 text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-4">
          Área Privada
        </h1>
        
        {userData && (
          <div className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.08] mb-8 text-left">
            <p className="text-green-400 font-semibold mb-2">{userData.msg}</p>
            <p className="text-gray-300 text-sm">Usuario: <span className="text-white">{userData.user.username}</span></p>
            <p className="text-gray-300 text-sm">Email: <span className="text-white">{userData.user.email}</span></p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
        >
          Cerrar sesión (Logout)
        </button>
      </div>
    </div>
  );
}