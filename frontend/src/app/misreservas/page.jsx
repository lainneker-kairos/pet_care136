"use client";

import React, { useState } from "react";

export default function MisReservas() {
  // Estado para filtrar por el "estado" de la reserva de tu BD (Pendiente, Confirmada, Completada)
  const [filtroEstado, setFiltroEstado] = useState("todas");

  // Datos simulados basados exactamente en los campos de tu imagen image_10a7b6.png
  const reservas = [
    {
      id: "RES-0042",
      tipo_servicio: "hotel", // Corresponde a Alojamiento Completo
      cuidador_nombre: "Elena Rodriguez",
      cuidador_foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
      mascota_nombre: "Cooper (Perro)",
      fecha_inicio: "2026-06-18",
      fecha_fin: "2026-06-22",
      hora_inicio: "12:00",
      hora_fin: "10:00",
      estado: "confirmada",
      precio_total: 240,
      comentarios: "Por favor, recordar darle la medicación de las mañanas con su comida.",
      fecha_creacion: "2026-06-12"
    },
    {
      id: "RES-0045",
      tipo_servicio: "paseo",
      cuidador_nombre: "Luciana M.",
      cuidador_foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
      mascota_nombre: "Luna (Gato)",
      fecha_inicio: "2026-06-25",
      fecha_fin: "2026-06-25",
      hora_inicio: "16:00",
      hora_fin: "17:00",
      estado: "pendiente",
      precio_total: 25,
      comentarios: "Paseo enérgico por la tarde cerca del parque.",
      fecha_creacion: "2026-06-14"
    },
    {
      id: "RES-0039",
      tipo_servicio: "cuidado_diurno", // Corresponde a Guardería
      cuidador_nombre: "Graciela G.",
      cuidador_foto: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=150&q=80",
      mascota_nombre: "Cooper (Perro)",
      fecha_inicio: "2026-06-05",
      fecha_fin: "2026-06-05",
      hora_inicio: "09:00",
      hora_fin: "19:00",
      estado: "completada",
      precio_total: 45,
      comentarios: "Todo excelente, Cooper regresó muy feliz.",
      fecha_creacion: "2026-06-01"
    }
  ];

  // Filtrado lógico de los datos
  const reservasFiltradas = filtroEstado === "todas" 
    ? reservas 
    : reservas.filter(r => r.estado === filtroEstado);

  // Helper para pintar badges de estado con estilo profesional
  const getBadgeEstado = (estado) => {
    switch (estado) {
      case "pendiente":
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">⏳ Pendiente</span>;
      case "confirmada":
        return <span className="bg-[#7FE3D8]/40 text-[#004D44] text-xs font-bold px-3 py-1 rounded-full border border-[#7FE3D8]">✓ Confirmada</span>;
      case "completada":
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-300">✨ Completada</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">{estado}</span>;
    }
  };

  // Helper para formatear el tipo de servicio estéticamente
  const getIconServicio = (tipo) => {
    if (tipo === "paseo") return "🚶 Paseo de Perros";
    if (tipo === "hotel") return "🏠 Alojamiento Completo";
    if (tipo === "cuidado_diurno") return "🐾 Guardería de Mascotas";
    return "🐕 Servicio Mascota";
  };

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

        {/* Filtros / Pestañas de Navegación */}
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
                      <p className="text-sm font-mono font-bold text-gray-800">{res.id}</p>
                    </div>
                    {getBadgeEstado(res.estado)}
                  </div>

                  {/* Fila Central: Cuidador y Fechas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    
                    {/* Bloque Cuidador */}
                    <div className="flex items-center gap-3">
                      <img 
                        src={res.cuidador_foto} 
                        alt={res.cuidador_nombre} 
                        className="w-12 h-12 rounded-xl object-cover border border-[#EADBCE]"
                      />
                      <div>
                        <span className="text-[10px] uppercase text-gray-400 font-bold block">Cuidador</span>
                        <h3 className="text-sm font-bold text-[#1A202C]">{res.cuidador_nombre}</h3>
                        <p className="text-xs text-[#6338CC] font-medium">{getIconServicio(res.tipo_servicio)}</p>
                      </div>
                    </div>

                    {/* Bloque Tiempos (Fecha y Hora Inicio/Fin) */}
                    <div className="space-y-1 md:col-span-2 bg-[#EFE9E2]/50 p-3 rounded-xl border border-[#EADBCE]/40">
                      <div className="grid grid-cols-2 text-xs">
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 font-bold block">Entrada</span>
                          <p className="font-semibold text-gray-800">📅 {res.fecha_inicio}</p>
                          <p className="text-gray-500 font-medium text-[11px]">🕒 {res.hora_inicio} hrs</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 font-bold block">Salida</span>
                          <p className="font-semibold text-gray-800">📅 {res.fecha_fin}</p>
                          <p className="text-gray-500 font-medium text-[11px]">🕒 {res.hora_fin} hrs</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Mascota y Comentarios Adicionales */}
                  <div className="text-xs space-y-1 pt-1">
                    <p className="text-gray-700">
                      🐾 <span className="font-bold text-gray-900">Mascota protegida:</span> {res.mascota_nombre}
                    </p>
                    {res.comentarios && (
                      <p className="text-gray-600 bg-white/60 p-2.5 rounded-lg border border-[#EADBCE]/40 italic">
                        " {res.comentarios} "
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer de la Tarjeta de Reserva */}
                <div className="bg-[#EFE9E2] px-6 py-4 border-t border-[#EADBCE] flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] uppercase text-gray-400 font-bold block">Monto Total Facturado</span>
                    <p className="text-base font-extrabold text-[#6338CC]">
                      {res.precio_total} € <span className="text-xs font-normal text-gray-500">con IVA incl.</span>
                    </p>
                  </div>

                  {/* Acciones contextuales según el estado */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    {res.estado === "pendiente" && (
                      <button className="w-full sm:w-auto bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold py-2 px-4 rounded-xl transition">
                        Cancelar Solicitud
                      </button>
                    )}
                    {res.estado === "confirmada" && (
                      <button className="w-full sm:w-auto bg-[#6338CC] hover:bg-[#522cb3] text-white text-xs font-bold py-2 px-4 rounded-xl transition">
                        💬 Chat con Cuidador
                      </button>
                    )}
                    {res.estado === "completada" && (
                      <button className="w-full sm:w-auto bg-[#7FE3D8] hover:bg-[#68cfc4] text-[#004D44] text-xs font-bold py-2 px-4 rounded-xl transition">
                        ⭐ Dejar una Reseña
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))
          ) : (
            /* Estado vacío por si no hay reservas con ese filtro */
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