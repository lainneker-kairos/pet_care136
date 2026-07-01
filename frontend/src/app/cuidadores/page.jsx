"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CuidadorCard from "@/components/CuidadorCard";
import { getPetsitters } from "@/Services/api";

export default function ListaCuidadores() {
    const searchParams = useSearchParams();

    const serviceType = searchParams.get("service_type");
    const startDate = searchParams.get("start_date");
    const durationHours = searchParams.get("duration_hours");
    const city = searchParams.get("city");

    const [listaCuidadores, setListaCuidadores] = useState([]);

    useEffect(() => {
        const fetchCuidadores = async () => {
            const data = await getPetsitters({
                city: city,
                service_type: serviceType,
                start_date: startDate,
                duration_hours: durationHours
            });
            console.log("Datos del backend:", data);
            setListaCuidadores(data);
        }
        fetchCuidadores();
    }, [])

    return (
        <div className="min-h-screen bg-[#F0F7F7] font-sans antialiased text-[#2D3748]">

            {/* Barra superior */}
            <div className="py-6 px-4">
                <div className="max-w-7xl mx-auto bg-[#FAF6F0] border border-[#EADBCE] py-4 px-10 rounded-2xl shadow-sm flex items-center justify-between">
                    <h1 className="text-xl font-bold text-purple-700">
                        🐾 Cuidadores disponibles en <span className="text-teal-700">{city || "tu zona"}</span>
                    </h1>
                    <span className="text-xs bg-[#7FE3D8] text-[#004D44] font-bold px-3 py-1.5 rounded-full">
                        {listaCuidadores.length} cuidadores encontrados
                    </span>
                </div>
            </div>

            {/* Contenedor principal */}
            <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* COLUMNA DE TARJETAS */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {listaCuidadores.length > 0 ? (
                        listaCuidadores.map((cuidador) => (
                            <CuidadorCard key={cuidador.id} cuidador={cuidador} />
                        ))
                    ) : (
                        <div className="col-span-2 bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-12 text-center">
                            <p className="text-3xl mb-2">🐕</p>
                            <p className="text-sm font-medium text-gray-600">No encontramos cuidadores disponibles.</p>
                            <p className="text-xs text-gray-400 mt-1">Intenta cambiar los filtros de búsqueda.</p>
                        </div>
                    )}
                </div>

                {/* COLUMNA DEL MAPA */}
                <div className="hidden lg:block lg:col-span-5">
                    <div className="sticky top-24 w-full h-[600px] bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] shadow-sm overflow-hidden flex flex-col items-center justify-center gap-4">
                        <p className="text-4xl">🗺️</p>
                        <p className="text-sm font-bold text-gray-500">Mapa próximamente</p>
                        <p className="text-xs text-gray-400 text-center px-8">
                            Aquí se integrará Google Maps para ver la ubicación de los cuidadores.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}