"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPublicProfile, getMyPets, getUserProfile, createBooking } from "@/Services/api";

export default function PerfilCuidadorDinamico() {
    const { id } = useParams();
    const router = useRouter();

    const [cuidador, setCuidador] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados del formulario de reserva
    const [formData, setFormData] = useState({
        service_type: "",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        comments: "",
        pet_id: ""
    });
    const [mascotas, setMascotas] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState(null);

    // Cargar datos del cuidador
    useEffect(() => {
        const fetchCuidador = async () => {
            try {
                const data = await getPublicProfile(id);
                setCuidador(data.profile);
            } catch (err) {
                setError(err.message || "Error al cargar cuidador");
            } finally {
                setLoading(false);
            }
        };
        fetchCuidador();
    }, [id]);

    useEffect(() => {
        const fetchMascotas = async () => {
            const token = localStorage.getItem("TOKENJWT"); 
            if (!token) return;
            try {
                const data = await getMyPets();
                setMascotas(data);
            } catch (err) {
                console.error("Error cargando mascotas:", err);
            }
        };
        fetchMascotas();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleReserva = async () => {
        setBookingLoading(true);
        setBookingError(null);
        
        const token = localStorage.getItem("TOKENJWT");

        if (!token) {
            setBookingError("Debes iniciar sesión para hacer una reserva");
            setBookingLoading(false);
            return;
        }

        if (!formData.service_type || !formData.start_date || !formData.end_date || !formData.pet_id) {
            setBookingError("Por favor completa todos los campos obligatorios");
            setBookingLoading(false);
            return;
        }

        try {
            const profileData = await getUserProfile();
            
            const owner_id = profileData.owner_profile?.id;

            if (!owner_id) {
                throw new Error("No se encontró tu perfil de dueño. Asegúrate de tenerlo configurado.");
            }

            if (!cuidador?.id) {
                throw new Error("No se pudo obtener el identificador único del cuidador.");
            }

            await createBooking({
                owner_id: owner_id,
                petsitter_id: cuidador.id, 
                pet_id: parseInt(formData.pet_id),
                service_type: formData.service_type,
                start_date: formData.start_date,
                end_date: formData.end_date,
                start_time: formData.start_time || null,
                end_time: formData.end_time || null,
                comments: formData.comments
            });

            setBookingSuccess(true);
        } catch (err) {
            setBookingError(err.message || "Error al crear la reserva");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#F0F7F7] flex items-center justify-center">
            <p className="text-gray-500 text-sm">Cargando perfil...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#F0F7F7] flex items-center justify-center">
            <p className="text-red-500 text-sm">{error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F0F7F7] font-sans antialiased text-[#2D3748]">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* COLUMNA IZQUIERDA — Perfil */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Tarjeta principal */}
                        <div className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE] flex flex-col md:flex-row gap-6 items-center md:items-start">
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden flex-shrink-0 bg-amber-100">
                                <img
                                    src={cuidador?.profile_pic || "https://placehold.co/400x400"}
                                    alt={cuidador?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-4 w-full">
                                <div>
                                    <h1 className="text-3xl font-bold text-[#1A202C]">{cuidador?.name}</h1>
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-1 text-sm text-gray-600">
                                        <span className="text-amber-500 font-medium">⭐ {cuidador?.rating || "Nuevo"}</span>
                                        <span>|</span>
                                        <span>📍 {cuidador?.city}</span>
                                        {cuidador?.neighborhood && <span>· {cuidador.neighborhood}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 bg-[#EFE9E2] p-3 rounded-xl text-center">
                                    <div>
                                        <p className="text-xl font-bold text-[#6338CC]">{cuidador?.booking_count || 0}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Reservas</p>
                                    </div>
                                    <div className="border-x border-gray-300">
                                        <p className="text-xl font-bold text-[#6338CC]">{cuidador?.experience_years || 0}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Años exp.</p>
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-[#6338CC]">&lt;1hr</p>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Respuesta</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sobre mí */}
                        {cuidador?.bio && (
                            <div className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE]">
                                <h2 className="text-xl font-bold text-[#1A202C] mb-3">Sobre mí</h2>
                                <p className="text-gray-700 leading-relaxed text-sm">{cuidador.bio}</p>
                            </div>
                        )}

                        {/* Servicios */}
                        <div className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE]">
                            <h2 className="text-xl font-bold text-[#1A202C] mb-3">Servicios disponibles</h2>
                            <div className="flex flex-wrap gap-2">
                                {cuidador?.offers_walk && <span className="bg-[#7FE3D8]/40 text-[#004D44] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#7FE3D8]/60">🚶 Paseos</span>}
                                {cuidador?.offers_hotel && <span className="bg-[#7FE3D8]/40 text-[#004D44] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#7FE3D8]/60">🏠 Hotel</span>}
                                {cuidador?.offers_daycare && <span className="bg-[#7FE3D8]/40 text-[#004D44] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#7FE3D8]/60">🐾 Guardería</span>}
                                {cuidador?.offers_nightcare && <span className="bg-[#7FE3D8]/40 text-[#004D44] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#7FE3D8]/60">🌙 Cuidado nocturno</span>}
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA — Formulario de reserva */}
                    <div className="space-y-6">
                        <div className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE] space-y-4">
                            <h2 className="text-lg font-bold text-[#1A202C]">Solicitar reserva</h2>

                            {/* Precios */}
                            <div className="space-y-2">
                                {cuidador?.price_per_hour && (
                                    <div className="flex justify-between bg-[#EFE9E2] p-3 rounded-xl">
                                        <span className="text-sm font-medium">Precio/hora</span>
                                        <span className="font-bold text-[#6338CC]">{cuidador.price_per_hour}€</span>
                                    </div>
                                )}
                                {cuidador?.price_per_night && (
                                    <div className="flex justify-between bg-[#EFE9E2] p-3 rounded-xl">
                                        <span className="text-sm font-medium">Precio/noche</span>
                                        <span className="font-bold text-[#6338CC]">{cuidador.price_per_night}€</span>
                                    </div>
                                )}
                            </div>

                            {bookingSuccess ? (
                                <div className="bg-green-50 border border-green-300 rounded-xl p-4 text-center space-y-2">
                                    <p className="text-2xl">✅</p>
                                    <p className="text-green-700 font-bold text-sm">¡Reserva enviada con éxito!</p>
                                    <p className="text-green-600 text-xs">El cuidador revisará tu solicitud pronto.</p>
                                    <button
                                        onClick={() => router.push("/misreservas")}
                                        className="w-full bg-[#6338CC] text-white text-xs font-bold py-2 rounded-xl mt-2"
                                    >
                                        Ver mis reservas
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Servicio */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 block mb-1">Tipo de servicio *</label>
                                        <select
                                            name="service_type"
                                            value={formData.service_type}
                                            onChange={handleChange}
                                            className="w-full border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                                        >
                                            <option value="">Selecciona un servicio</option>
                                            {cuidador?.offers_walk && <option value="paseo">🚶 Paseo</option>}
                                            {cuidador?.offers_hotel && <option value="hotel">🏠 Hotel</option>}
                                            {cuidador?.offers_daycare && <option value="guarderia">🐾 Guardería</option>}
                                            {cuidador?.offers_nightcare && <option value="nightcare">🌙 Cuidado nocturno</option>}
                                        </select>
                                    </div>

                                    {/* Mascota */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 block mb-1">Mascota *</label>
                                        <select
                                            name="pet_id"
                                            value={formData.pet_id}
                                            onChange={handleChange}
                                            className="w-full border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                                        >
                                            <option value="">Selecciona tu mascota</option>
                                            {mascotas.map(pet => (
                                                <option key={pet.id} value={pet.id}>{pet.name} ({pet.species})</option>
                                            ))}
                                        </select>
                                        {mascotas.length === 0 && (
                                            <p className="text-xs text-amber-600 mt-1">⚠️ No tienes mascotas registradas. <a href="/perfil-owner" className="underline">Agregar mascota</a></p>
                                        )}
                                    </div>

                                    {/* Fechas */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 block mb-1">Fecha inicio *</label>
                                            <input
                                                type="date"
                                                name="start_date"
                                                value={formData.start_date}
                                                onChange={handleChange}
                                                className="w-full border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 block mb-1">Fecha fin *</label>
                                            <input
                                                type="date"
                                                name="end_date"
                                                value={formData.end_date}
                                                onChange={handleChange}
                                                className="w-full border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Horas */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 block mb-1">Hora inicio</label>
                                            <input
                                                type="time"
                                                name="start_time"
                                                value={formData.start_time}
                                                onChange={handleChange}
                                                className="w-full border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-600 block mb-1">Hora fin</label>
                                            <input
                                                type="time"
                                                name="end_time"
                                                value={formData.end_time}
                                                onChange={handleChange}
                                                className="w-full border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Comentarios */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-600 block mb-1">Comentarios</label>
                                        <textarea
                                            name="comments"
                                            value={formData.comments}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Instrucciones especiales, medicación, etc."
                                            className="w-full border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400 resize-none"
                                        />
                                    </div>

                                    {bookingError && (
                                        <p className="text-red-500 text-xs bg-red-50 p-2 rounded-xl">{bookingError}</p>
                                    )}

                                    <button
                                        onClick={handleReserva}
                                        disabled={bookingLoading}
                                        className="w-full bg-[#6338CC] hover:bg-[#522cb3] text-white font-bold py-3 rounded-xl transition text-sm disabled:opacity-60"
                                    >
                                        {bookingLoading ? "Enviando reserva..." : "Solicitar reserva →"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}