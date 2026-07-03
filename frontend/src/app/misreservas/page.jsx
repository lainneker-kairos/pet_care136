"use client";

import React, { useState, useEffect } from "react";
import { getUserProfile, getUserBookings, updateBookingStatus } from "@/Services/api";

export default function MisReservas() {
  const [activeRole, setActiveRole] = useState("owner"); // "owner" (dueño) o "petsitter" (cuidador)
  const [hasPetsitterProfile, setHasPetsitterProfile] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [profile, setProfile] = useState(null);
  
  // Mensajes de feedback (reemplazan alert() y confirm())
  const [feedback, setFeedback] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  const fetchReservas = async (roleToFetch) => {
    try {
      setCargando(true);
      const profileData = await getUserProfile();
      setProfile(profileData);
      
      if (profileData) {
        // Guardamos si el usuario tiene perfil de cuidador activo
        if (profileData.petsitter_profile) {
          setHasPetsitterProfile(true);
        } else {
          setHasPetsitterProfile(false);
          setActiveRole("owner"); // Fuerza rol dueño si no es cuidador
        }
        
        let targetProfileId = null;
        if (roleToFetch === "owner" && profileData.owner_profile) {
          targetProfileId = profileData.owner_profile.id;
        } else if (roleToFetch === "petsitter" && profileData.petsitter_profile) {
          targetProfileId = profileData.petsitter_profile.id;
        }

        if (targetProfileId) {
          const bookingsData = await getUserBookings(roleToFetch, targetProfileId);
          setReservas(bookingsData);
        } else {
          setReservas([]);
        }
      }
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      showFeedback("error", "No se pudieron obtener tus reservas. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchReservas(activeRole);
  }, [activeRole]);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setCargando(true);
      await updateBookingStatus(bookingId, newStatus);
      showFeedback("success", `Reserva actualizada con éxito a estado: ${newStatus}`);
      setConfirmCancelId(null);
      await fetchReservas(activeRole);
    } catch (error) {
      console.error("Error al actualizar la reserva:", error);
      showFeedback("error", "No se pudo actualizar el estado de la reserva.");
    } finally {
      setCargando(false);
    }
  };

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
    if (filtroEstado === "rechazado") {
      return statusLower === "rechazado" || statusLower === "declinada";
    }
    
    return statusLower === filtroEstado;
  });

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
    if (est === "rechazado" || est === "declinada") {
      return (
        <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-300">
          ❌ Rechazada
        </span>
      );
    }
    return (
      <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full capitalize">
        {estado}
      </span>
    );
  };

  const getIconServicio = (tipo) => {
    const t = tipo?.toLowerCase();
    if (t === "paseo") return "🚶 Paseo de Perros";
    if (t === "hotel") return "🏠 Alojamiento Completo";
    if (t === "guarderia" || t === "daycare") return "🐾 Guardería de Mascotas";
    if (t === "nightcare") return "🌙 Cuidado Nocturno";
    return "🐕 Servicio Especial";
  };

  if (cargando && reservas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F7F7]">
        <div className="text-center space-y-2">
          <p className="text-gray-500 text-sm animate-pulse">Cargando tus reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7F7] font-sans antialiased text-[#2D3748] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* BANNER DE NOTIFICACIÓN DE FEEDBACK */}
        {feedback && (
          <div className={`p-4 rounded-xl text-sm font-semibold transition-all shadow-md ${
            feedback.type === "success" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-red-100 text-red-800 border border-red-300"
          }`}>
            {feedback.message}
          </div>
        )}

        {/* MODAL INLINE DE CONFIRMACIÓN DE CANCELACIÓN */}
        {confirmCancelId && (
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-3 animate-pulse">
            <div>
              <p className="font-bold text-amber-900 text-sm">¿Estás seguro de que deseas cancelar esta solicitud?</p>
              <p className="text-xs text-amber-700">Esta acción cambiará el estado a cancelado permanentemente.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setConfirmCancelId(null)} 
                className="flex-1 sm:flex-none bg-white border border-amber-300 hover:bg-amber-100 text-gray-700 text-xs font-bold py-1.5 px-3 rounded-lg"
              >
                No, mantener
              </button>
              <button 
                onClick={() => handleUpdateStatus(confirmCancelId, "cancelado")} 
                className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        )}

        {/* --- PESTAÑAS DE CAMBIO DE ROL DUAL --- */}
        {hasPetsitterProfile && (
          <div className="flex bg-white p-1 rounded-2xl border border-[#EADBCE] shadow-sm">
            <button
              onClick={() => { setActiveRole("owner"); setFiltroEstado("todas"); }}
              className={`flex-1 text-center font-extrabold text-sm py-3.5 px-4 rounded-xl transition duration-200 ${
                activeRole === "owner"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              🙋‍♂️ Soy Dueño (Mis Mascotas)
            </button>
            <button
              onClick={() => { setActiveRole("petsitter"); setFiltroEstado("todas"); }}
              className={`flex-1 text-center font-extrabold text-sm py-3.5 px-4 rounded-xl transition duration-200 ${
                activeRole === "petsitter"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-purple-700 hover:bg-purple-50"
              }`}
            >
              🐾 Soy Cuidador (Mis Clientes)
            </button>
          </div>
        )}

        {/* Encabezado contextual */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#FAF6F0] p-6 rounded-2xl border border-[#EADBCE] shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1A202C]">
              {activeRole === "owner" ? "Mis Reservas de Mascotas" : "Solicitudes de Cuidado Recibidas"}
            </h1>
            <p className="text-sm text-gray-500">
              {activeRole === "owner" 
                ? "Historial y estado de los cuidados solicitados para tus mascotas."
                : "Gestiona los servicios que los dueños de mascotas te han solicitado."
              }
            </p>
          </div>
          <span className={`text-xs text-white font-bold px-4 py-2 rounded-xl shadow-sm ${activeRole === "owner" ? "bg-emerald-600" : "bg-purple-600"}`}>
            Total: {reservas.length} registros
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
                  ? (activeRole === "owner" ? "bg-emerald-600 text-white shadow-sm" : "bg-purple-600 text-white shadow-sm")
                  : "text-gray-600 hover:bg-[#FAF6F0] hover:text-[#1A202C]"
              }`}
            >
              {tab === "todas" ? "Ver Todas" : tab}
            </button>
          ))}
        </div>

        {/* --- LISTA DE RESERVAS --- */}
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

                  {/* Fila Central: Información Cuidador/Dueño */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    
                    {/* Tarjeta de datos de la otra parte */}
                    <div className="flex items-center gap-3">
                      <img 
                        src={activeRole === "owner" 
                          ? (res.petsitter_photo || "https://placehold.co/150x150")
                          : "https://placehold.co/150x150/9333ea/ffffff?text=Cliente"
                        } 
                        alt="Foto de perfil" 
                        className="w-12 h-12 rounded-xl object-cover border border-[#EADBCE]"
                      />
                      <div>
                        <span className="text-[10px] uppercase text-gray-400 font-bold block">
                          {activeRole === "owner" ? "Cuidador Contratado" : "Dueño del Peludo"}
                        </span>
                        <h3 className="text-sm font-bold text-[#1A202C]">
                          {activeRole === "owner" ? res.petsitter_name : res.owner_name}
                        </h3>
                        <p className="text-xs text-[#6338CC] font-medium">{getIconServicio(res.service_type)}</p>
                      </div>
                    </div>

                    {/* Bloque Tiempos (Fecha y Hora Inicio/Fin) */}
                    <div className="space-y-1 md:col-span-2 bg-[#EFE9E2]/50 p-3 rounded-xl border border-[#EADBCE]/40">
                      <div className="grid grid-cols-2 text-xs">
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 font-bold block">Entrada / Comienzo</span>
                          <p className="font-semibold text-gray-800">📅 {res.start_date}</p>
                          <p className="text-gray-500 font-medium text-[11px]">🕒 {res.start_time || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 font-bold block">Salida / Fin</span>
                          <p className="font-semibold text-gray-800">📅 {res.end_date}</p>
                          <p className="text-gray-500 font-medium text-[11px]">🕒 {res.end_time || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Mascota y Comentarios Adicionales */}
                  <div className="text-xs space-y-1 pt-1 border-t border-[#EADBCE]/30">
                    <p className="text-gray-700">
                      🐾 <span className="font-bold text-gray-900">Mascota protegida:</span> {res.pet_name || "Mascota"}
                    </p>
                    {activeRole === "petsitter" && res.owner_phone && (
                      <p className="text-gray-700">
                        📱 <span className="font-bold text-gray-900">Contacto del Dueño:</span> {res.owner_phone}
                      </p>
                    )}
                    {res.comments && (
                      <p className="text-gray-600 bg-white/60 p-2.5 rounded-lg border border-[#EADBCE]/40 italic mt-1">
                        "{res.comments}"
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

                  {/* Acciones contextuales según el rol y el estado */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    {/* VISTA ROL DUEÑO */}
                    {activeRole === "owner" && (
                      <>
                        {(res.status === "pending" || res.status === "pendiente") && (
                          <button
                            onClick={() => setConfirmCancelId(res.id)}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-sm"
                          >
                            Cancelar Solicitud
                          </button>
                        )}
                        {(res.status === "confirmada" || res.status === "aceptado" || res.status === "confirmado") && (
                          <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-sm">
                            💬 Chat con Cuidador
                          </button>
                        )}
                        {(res.status === "completada" || res.status === "completado") && (
                          <button className="w-full sm:w-auto bg-[#7FE3D8] hover:bg-[#68cfc4] text-[#004D44] text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-sm">
                            ⭐ Dejar una Reseña
                          </button>
                        )}
                      </>
                    )}

                    {/* VISTA ROL CUIDADOR (Benito gestiona sus solicitudes) */}
                    {activeRole === "petsitter" && (
                      <>
                        {(res.status === "pending" || res.status === "pendiente") && (
                          <div className="flex gap-2 w-full">
                            <button
                              onClick={() => handleUpdateStatus(res.id, "rechazado")}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-sm"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(res.id, "aceptado")}
                              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-sm"
                            >
                              Accept Request
                            </button>
                          </div>
                        )}
                        {(res.status === "confirmada" || res.status === "aceptado" || res.status === "confirmado") && (
                          <div className="flex gap-2 w-full">
                            <button className="flex-1 bg-white hover:bg-[#FAF6F0] text-gray-700 text-xs font-bold py-2.5 px-4 rounded-xl border border-[#EADBCE] transition shadow-sm">
                              💬 Contactar
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(res.id, "completado")}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-sm"
                            >
                              Complete Service
                            </button>
                          </div>
                        )}
                        {(res.status === "completada" || res.status === "completado") && (
                          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                            ✅ ¡Servicio completado!
                          </span>
                        )}
                        {(res.status === "rechazado" || res.status === "declinada") && (
                          <span className="text-xs text-red-700 font-bold bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
                            Declinaste este cuidado.
                          </span>
                        )}
                      </>
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
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                {activeRole === "owner" 
                  ? "Explora nuestra lista de cuidadores calificados para programar un nuevo servicio para tu mascota."
                  : "Por el momento ningún cliente ha solicitado tus servicios para este filtro."
                }
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}