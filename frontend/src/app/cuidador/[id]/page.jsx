"use client";
import { use, useState, useEffect } from "react";
import { getPublicProfile } from "@/Services/api";
import Link from "next/link";

export default function PerfilCuidador({ params }) {
    const { id } = use(params);
    const [cuidador, setCuidador] = useState(null);

    useEffect(() => {
        const fetchCuidador = async () => {
            const data = await getPublicProfile(id);
            setCuidador(data);
        }
        fetchCuidador();
    }, [])

    return (
        <div className="min-h-screen bg-[#F0F7F7]">
            {cuidador ? (
                <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">

                    {/* Tarjeta principal */}
                    <div className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] shadow-sm overflow-hidden">

                        {/* Header con foto y datos básicos */}
                        <div className="p-8 flex flex-col sm:flex-row gap-6 items-start">

                            {/* Foto */}
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#EADBCE] flex-shrink-0">
                                <img
                                    src={cuidador.profile.profile_pic ? cuidador.profile.profile_pic : "https://placehold.co/128x128"}
                                    alt={cuidador.profile.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Info básica */}
                            <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-3xl font-bold text-purple-700">{cuidador.profile.name}</h1>
                                    <span className="text-xs bg-[#7FE3D8]/40 text-[#004D44] font-bold px-3 py-1 rounded-full border border-[#7FE3D8]/60">
                                        ✓ Verificado
                                    </span>
                                </div>

                                <p className="text-gray-500 text-sm">📍 {cuidador.profile.city}{cuidador.profile.neighborhood ? `, ${cuidador.profile.neighborhood}` : ""}</p>

                                <div className="flex flex-wrap gap-4 text-sm">
                                    <span className="text-amber-500 font-bold">⭐ {cuidador.profile.rating || "Nuevo"}</span>
                                    <span className="text-gray-500">🔄 {cuidador.profile.booking_count} reservas</span>
                                    <span className="text-gray-500">🏆 {cuidador.profile.experience_years} años de experiencia</span>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed">{cuidador.profile.bio}</p>
                            </div>
                        </div>
                    </div>

                    {/* Servicios y precios */}
                    <div className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] shadow-sm p-6 space-y-4">
                        <h2 className="text-xl font-bold text-purple-700">Servicios y Precios</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {cuidador.profile.offers_walk && (
                                <div className="bg-white rounded-xl border border-[#EADBCE] p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🚶</span>
                                        <span className="font-semibold text-gray-800">Paseos</span>
                                    </div>
                                    <span className="text-purple-700 font-bold">{cuidador.profile.price_per_hour}€/hora</span>
                                </div>
                            )}
                            {cuidador.profile.offers_daycare && (
                                <div className="bg-white rounded-xl border border-[#EADBCE] p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">☀️</span>
                                        <span className="font-semibold text-gray-800">Guardería</span>
                                    </div>
                                    <span className="text-purple-700 font-bold">{cuidador.profile.price_per_hour}€/hora</span>
                                </div>
                            )}
                            {cuidador.profile.offers_hotel && (
                                <div className="bg-white rounded-xl border border-[#EADBCE] p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🏠</span>
                                        <span className="font-semibold text-gray-800">Hotel</span>
                                    </div>
                                    <span className="text-purple-700 font-bold">{cuidador.profile.price_per_night}€/noche</span>
                                </div>
                            )}
                            {cuidador.profile.offers_nightcare && (
                                <div className="bg-white rounded-xl border border-[#EADBCE] p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🌙</span>
                                        <span className="font-semibold text-gray-800">Cuidado nocturno</span>
                                    </div>
                                    <span className="text-purple-700 font-bold">{cuidador.profile.price_per_night}€/noche</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Disponibilidad */}
                    {cuidador.profile.available_days && (
                        <div className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] shadow-sm p-6 space-y-4">
                            <h2 className="text-xl font-bold text-purple-700">Disponibilidad</h2>
                            <p className="text-gray-600 text-sm">{cuidador.profile.available_days}</p>
                        </div>
                    )}

                    {/* Botón reservar */}
                    <div className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] shadow-sm p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="text-gray-500 text-sm">Precio desde</p>
                            <p className="text-3xl font-bold text-purple-700">
                                {cuidador.profile.price_per_hour || cuidador.profile.price_per_night}€
                            </p>
                        </div>
                        <Link
                            href="/misreservas"
                            className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-8 rounded-xl transition text-center">
                            Solicitar reserva
                        </Link>
                    </div>

                </div>
            ) : (
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-gray-500">Cargando perfil...</p>
                </div>
            )}
        </div>
    )
}