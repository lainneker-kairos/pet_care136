"use client";

import React, { useState, useEffect } from "react";
import { getUserProfile, getUserBookings, updateBookingStatus } from "../../Services/api";

export default function MisReservas() {
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- OBTENER RESERVAS REALES ---
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setCargando(true);
        // 1. Obtenemos el perfil del usuario autenticado de forma limpia
        const profileData = await getUserProfile();
        
        if (profileData && profileData.owner_profile) {
          const ownerId = profileData.owner_profile.id;
          
          // 2. Traemos las reservas de ese dueño
          const bookingsData = await getUserBookings("owner", ownerId);
          setReservas(bookingsData);
          console.log(reservas);
          
        }
      } catch (error) {
        console.error("Error al cargar reservas:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchReservas();
  }, []);

  // Mapear filtros lógicos defendiéndonos de posibles estados en español e inglés
  const reservasFiltradas = reservas.filter(r => {
    if (filtroEstado === "todas") return true;
    
    const statusLower = r.status?.toLowerCase();
    
    if (filtroEstado === "pendiente") {
      return statusLower === "pendiente" || statusLower === "pending";
    }
    if (filtroEstado === "confirmada") {
      return statusLower === "confirmada" || statusLower === "aceptado" || statusLower === "confirmado";
    }
    if (filtroEstado === "completada") {
      return statusLower === "completada" || statusLower === "completado";
    }
    
    return statusLower === filtroEstado;
  });

  // Helper para pintar badges de estado con flexibilidad multilenguaje
  const getBadgeEstado = (estado) => {
    const est = estado?.toLowerCase();
    if (est === "pendiente" || est === "pending") {
      return (
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
          ⏳ Pendiente
        </span>
      );
    }
    if (est === "confirmada" || est === "confirmado" || est === "aceptado") {
      return (
        <span className="bg-[#7FE3D8]/40 text-[#004D44] text-xs font-bold px-3 py-1 rounded-full border border-[#7FE3D8]">
          ✓ Confirmada
        </span>
      );
    }
    if (est === "completada" || est === "completado") {
      return (
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-300">
          ✨ Completada
        </span>
      );
    }
    return (
      <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full capitalize">
        {estado}
      </span>
    );
  };

  // Helper para formatear el tipo de servicio estéticamente
  const getIconServicio = (tipo) => {
    const t = tipo?.toLowerCase();
    if (t === "paseo") return "🚶 Paseo de Perros";
    if (t === "hotel") return "🏠 Alojamiento Completo";
    if (t === "guarderia" || t === "daycare") return "🐾 Guardería de Mascotas";
    if (t === "nightcare") return "🌙 Cuidado Nocturno";
    return "🐕 Servicio Especial";
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F7F7]">
        <p className="text-gray-500 text-sm">Cargando tus reservas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7F7] font-sans antialiased text-[#2D3748] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#FAF6F0] p-6 rounded-2xl border border-[#EADBCE] shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1A202C]">Mis Reservas</h1>
            <p className="text-sm text-gray-500">Historial y estado actual de los cuidados de tus mascotas.</p>
          </div>
          <span className="text-xs bg-[#6338CC] text-white font-bold px-4 py-2 rounded-xl shadow-sm">
            Total: {reservas.length} solicitudes
          </span>
        </div>

        {/* Filtros de Navegación */}
        <div className="flex bg-[#EFE9E2] p-1.5 rounded-xl border border-[#EADBCE] overflow-x-auto gap-1">
          {["todas", "pendiente", "confirmada", "completada"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFiltroEstado(tab)}
              className={`flex-1 text-center font-bold text-xs py-2.5 px-4 rounded-lg transition whitespace-nowrap capitalize ${
                filtroEstado === tab
                  ? "bg-[#6338CC] text-white shadow-sm"
                  : "text-gray-600 hover:bg-[#FAF6F0] hover:text-[#1A202C]"
              }`}
            >
              {tab === "todas" ? "Ver Todas" : tab}
            </button>
          ))}
        </div>

        {/* Lista de Reservas Tarjeta por Tarjeta */}
        <div className="space-y-4">
          {reservasFiltradas.length > 0 ? (
            reservasFiltradas.map((res) => (
              <div 
                key={res.id} 
                className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] shadow-sm overflow-hidden flex flex-col justify-between transition hover:shadow-md"
              >
                {/* Cuerpo de la Reserva */}
                <div className="p-6 space-y-4">
                  {/* Fila superior: ID y Estado */}
                  <div className="flex justify-between items-center border-b border-[#EADBCE]/60 pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Código Reserva</span>
                      <p className="text-sm font-mono font-bold text-gray-800">RES-{res.id.toString().padStart(4, '0')}</p>
                    </div>
                    {getBadgeEstado(res.status)}
                  </div>

                  {/* Fila Central: Cuidador y Fechas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    
                    {/* Bloque Cuidador */}
                    <div className="flex items-center gap-3">
                      <img 
                        src={res.cuidador_foto || "https://placehold.co/150x150"} 
                        alt={res.cuidador_nombre || "Cuidador"} 
                        className="w-12 h-12 rounded-xl object-cover border border-[#EADBCE]"
                      />
                      <div>
                        <span className="text-[10px] uppercase text-gray-400 font-bold block">Reserva ID: #{res.id}</span>
                        <h3 className="text-sm font-bold text-[#1A202C]">{res.petsitter_name || "Profesional"}</h3>
                        <p className="text-xs text-[#6338CC] font-medium">{getIconServicio(res.service_type)}</p>
                      </div>
                    </div>

                    {/* Bloque Tiempos (Fecha y Hora Inicio/Fin) */}
                    <div className="space-y-1 md:col-span-2 bg-[#EFE9E2]/50 p-3 rounded-xl border border-[#EADBCE]/40">
                      <div className="grid grid-cols-2 text-xs">
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 font-bold block">Entrada</span>
                          <p className="font-semibold text-gray-800">📅 {res.start_date}</p>
                          <p className="text-gray-500 font-medium text-[11px]">🕒 {res.start_time || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 font-bold block">Salida</span>
                          <p className="font-semibold text-gray-800">📅 {res.end_date}</p>
                          <p className="text-gray-500 font-medium text-[11px]">🕒 {res.end_time || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Mascota y Comentarios Adicionales */}
                  <div className="text-xs space-y-1 pt-1">
                    <p className="text-gray-700">
                      🐾 <span className="font-bold text-gray-900">Mascota protegida:</span> {res.mascota_nombre || "Mascota"}
                    </p>
                    {res.comments && (
                      <p className="text-gray-600 bg-white/60 p-2.5 rounded-lg border border-[#EADBCE]/40 italic">
                        " {res.comments} "
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer de la Tarjeta de Reserva */}
                <div className="bg-[#EFE9E2] px-6 py-4 border-t border-[#EADBCE] flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] uppercase text-gray-400 font-bold block">Monto Total Facturado</span>
                    <p className="text-base font-extrabold text-[#6338CC]">
                      {res.total_price} € <span className="text-xs font-normal text-gray-500">con IVA incl.</span>
                    </p>
                  </div>

                  {/* Acciones contextuales según el estado */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    {(res.status === "pending" || res.status === "pendiente") && (
                    <button
                        onClick={() => updateBookingStatus(res.id, 'cancelado')}
                        className="w-full sm:w-auto bg-[#6338CC] hover:bg-[#522cb3] text-white text-xs font-bold py-2 px-4 rounded-xl transition">
                        Cancelar Solicitud
                    </button>
                    )}
                    {(res.status === "confirmada" || res.status === "aceptado" || res.status === "confirmado") && (
                      <button className="w-full sm:w-auto bg-[#6338CC] hover:bg-[#522cb3] text-white text-xs font-bold py-2 px-4 rounded-xl transition">
                        💬 Chat con Cuidador
                      </button>
                    )}
                    {(res.status === "completada" || res.status === "completado") && (
                      <button className="w-full sm:w-auto bg-[#7FE3D8] hover:bg-[#68cfc4] text-[#004D44] text-xs font-bold py-2 px-4 rounded-xl transition">
                        ⭐ Dejar una Reseña
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))
          ) : (
            /* Estado vacío */
            <div className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-12 text-center space-y-3 shadow-sm">
              <span className="text-4xl">📭</span>
              <h3 className="text-md font-bold text-gray-700">No tienes reservas en este estado</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">Explora nuestra lista de cuidadores calificados para programar un nuevo servicio.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}