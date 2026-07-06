"use client";

import React, { useState, useEffect } from "react";
import { getUserProfile, getUserBookings, updateBookingStatus, createReview } from "../../Services/api";
import { toast } from "sonner";

export default function MisReservas() {
  const [activeRole, setActiveRole] = useState("owner"); // "owner" (dueño) o "petsitter" (cuidador)
  const [hasPetsitterProfile, setHasPetsitterProfile] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [comentario, setComentario] = useState("");
  const [rating, setRating] = useState(0);
  const [perfil, setPerfil] = useState(null);

  const [feedback, setFeedback] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const fetchReservas = async (role) => {
    try {
      setCargando(true);
      const profileData = await getUserProfile();
      setPerfil(profileData);

      // Verificamos si tiene perfil de cuidador para mostrarle los botones de cambio de rol
      if (profileData && profileData.petsitter_profile) {
        setHasPetsitterProfile(true);
      }

      if (profileData) {
        if (role === "owner" && profileData.owner_profile) {
          const ownerId = profileData.owner_profile.id;
          const bookingsData = await getUserBookings("owner", ownerId);
          setReservas(bookingsData);
        } else if (role === "petsitter" && profileData.petsitter_profile) {
          const petsitterId = profileData.petsitter_profile.id;
          const bookingsData = await getUserBookings("petsitter", petsitterId);
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

  const reservasFiltradas = reservas.filter((r) => {
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

  const handleEnviarResena = async () => {
    try {
      const reviewData = {
        booking_id: reservaSeleccionada.id,
        reviewer_id: perfil.user.id,
        reviewed_id: reservaSeleccionada.petsitter_id,
        rating: rating,
        comment: comentario,
        review_type: "owner_to_petsitter",
      };
      await createReview(reviewData);
      toast.success("¡Reseña enviada con éxito!")
      setReservaSeleccionada(null);
      setComentario("");
      setRating(0);
    } catch (error) {
      console.error("Error al enviar reseña:", error);
      toast.error("Error al enviar la reseña, inténtalo de nuevo")
    }
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
        
        {feedback && (
          <div className={`p-4 rounded-xl text-sm font-bold ${feedback.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
            {feedback.message}
          </div>
        )}

        {/* --- NUEVO: SELECTOR DE ROL (Dueño/Cuidador) --- */}
        {hasPetsitterProfile && (
          <div className="flex bg-white p-1.5 rounded-xl border border-[#EADBCE] w-full sm:w-fit shadow-sm">
            <button
              onClick={() => setActiveRole("owner")}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeRole === "owner" ? "bg-[#6338CC] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              🐾 Como Dueño
            </button>
            <button
              onClick={() => setActiveRole("petsitter")}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeRole === "petsitter" ? "bg-[#6338CC] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              💼 Como Cuidador
            </button>
          </div>
        )}

        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#FAF6F0] p-6 rounded-2xl border border-[#EADBCE] shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1A202C]">
              {activeRole === "owner" ? "Mis Reservas de Mascotas" : "Solicitudes de Cuidado Recibidas"}
            </h1>
            <p className="text-sm text-gray-500">
              {activeRole === "owner"
                ? "Historial y estado de los cuidados solicitados para tus mascotas."
                : "Gestiona los servicios que los dueños de mascotas te han solicitado."}
            </p>
          </div>
          <span
            className={`text-xs text-white font-bold px-4 py-2 rounded-xl shadow-sm ${
              activeRole === "owner" ? "bg-emerald-600" : "bg-purple-600"
            }`}
          >
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
                  ? "bg-[#6338CC] text-white shadow-sm"
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
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-[#EADBCE]/60 pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                        Código Reserva
                      </span>
                      <p className="text-sm font-mono font-bold text-gray-800">
                        RES-{res.id.toString().padStart(4, "0")}
                      </p>
                    </div>
                    {getBadgeEstado(res.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={res.cuidador_foto || "https://placehold.co/150x150"}
                        alt={res.cuidador_nombre || "Perfil"}
                        className="w-12 h-12 rounded-xl object-cover border border-[#EADBCE]"
                      />
                      <div>
                        <span className="text-[10px] uppercase text-gray-400 font-bold block">
                          {activeRole === "owner" ? "Cuidador Contratado" : "Dueño del Peludo"}
                        </span>
                        <h3 className="text-sm font-bold text-[#1A202C]">
                          {activeRole === "owner" ? res.petsitter_name : res.owner_name}
                        </h3>
                        <p className="text-xs text-[#6338CC] font-medium">
                          {getIconServicio(res.service_type)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 md:col-span-2 bg-[#EFE9E2]/50 p-3 rounded-xl border border-[#EADBCE]/40">
                      <div className="grid grid-cols-2 text-xs">
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 font-bold block">
                            Entrada / Comienzo
                          </span>
                          <p className="font-semibold text-gray-800">📅 {res.start_date}</p>
                          <p className="text-gray-500 font-medium text-[11px]">
                            🕒 {res.start_time || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-gray-400 font-bold block">
                            Salida / Fin
                          </span>
                          <p className="font-semibold text-gray-800">📅 {res.end_date}</p>
                          <p className="text-gray-500 font-medium text-[11px]">
                            🕒 {res.end_time || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 pt-1 border-t border-[#EADBCE]/30">
                    <p className="text-gray-700">
                      🐾 <span className="font-bold text-gray-900">Mascota protegida:</span>{" "}
                      {res.pet_name || "Mascota"}
                    </p>
                    {activeRole === "petsitter" && res.owner_phone && (
                      <p className="text-gray-700">
                        📱 <span className="font-bold text-gray-900">Contacto del Dueño:</span>{" "}
                        {res.owner_phone}
                      </p>
                    )}
                    {res.comments && (
                      <p className="text-gray-600 bg-white/60 p-2.5 rounded-lg border border-[#EADBCE]/40 italic mt-1">
                        "{res.comments}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-[#EFE9E2] px-6 py-4 border-t border-[#EADBCE] flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] uppercase text-gray-400 font-bold block">
                      Monto Total Facturado
                    </span>
                    <p className="text-base font-extrabold text-[#6338CC]">
                      {res.total_price} €{" "}
                      <span className="text-xs font-normal text-gray-500">con IVA incl.</span>
                    </p>
                  </div>

                  {/* Acciones contextuales (Para dueño y cuidador) */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    {/* Botones si es dueño */}
                    {activeRole === "owner" && (res.status === "pending" || res.status === "pendiente") && (
                      <button
                        onClick={() => handleUpdateStatus(res.id, "cancelado")}
                        className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold py-2 px-4 rounded-xl transition"
                      >
                        Cancelar Solicitud
                      </button>
                    )}

                    {/* Botones si es cuidador */}
                    {activeRole === "petsitter" && (res.status === "pending" || res.status === "pendiente") && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(res.id, "rechazado")}
                          className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 px-4 rounded-xl transition"
                        >
                          Rechazar
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(res.id, "aceptado")}
                          className="flex-1 sm:flex-none bg-[#004D44] hover:bg-[#00362f] text-white text-xs font-bold py-2 px-4 rounded-xl transition"
                        >
                          Aceptar Reserva
                        </button>
                      </>
                    )}

                    {(res.status === "confirmada" || res.status === "aceptado" || res.status === "confirmado") && (
                      <>
                         {activeRole === "petsitter" && (
                            <button
                                onClick={() => handleUpdateStatus(res.id, "completado")}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition"
                            >
                                Marcar Completado
                            </button>
                         )}
                         <button className="w-full sm:w-auto bg-[#6338CC] hover:bg-[#522cb3] text-white text-xs font-bold py-2 px-4 rounded-xl transition">
                           💬 Abrir Chat
                         </button>
                      </>
                    )}

                    {activeRole === "owner" && (res.status === "completada" || res.status === "completado") && (
                      <button
                        onClick={() =>
                          setReservaSeleccionada({ id: res.id, petsitter_id: res.petsitter_id })
                        }
                        className="w-full sm:w-auto bg-[#7FE3D8] hover:bg-[#68cfc4] text-[#004D44] text-xs font-bold py-2 px-4 rounded-xl transition"
                      >
                        ⭐ Dejar una Reseña
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-12 text-center space-y-3 shadow-sm">
              <span className="text-4xl">📭</span>
              <h3 className="text-md font-bold text-gray-700">No tienes reservas en este estado</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                {activeRole === "owner"
                  ? "Explora nuestra lista de cuidadores calificados para programar un nuevo servicio para tu mascota."
                  : "Por el momento ningún cliente ha solicitado tus servicios para este filtro."}
              </p>
            </div>
          )}
        </div>
      </div>

      {reservaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#FAF6F0] rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-[#1A202C]">⭐ Dejar una Reseña</h2>
            <p className="text-xs text-gray-500">Reserva #{reservaSeleccionada.id}</p>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((estrella) => (
                <button
                  key={estrella}
                  onClick={() => setRating(estrella)}
                  className={`text-2xl ${
                    rating >= estrella ? "text-amber-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              rows="4"
              placeholder="Escribe tu comentario..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm focus:outline-none focus:border-[#6338CC] resize-none"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setReservaSeleccionada(null)}
                className="w-1/2 bg-white text-gray-700 py-2 rounded-xl border border-[#EADBCE] text-xs font-bold"
              >
                Cancelar
              </button>

              <button
                onClick={handleEnviarResena}
                className="w-1/2 bg-[#6338CC] text-white py-2 rounded-xl text-xs font-bold"
              >
                Enviar Reseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}