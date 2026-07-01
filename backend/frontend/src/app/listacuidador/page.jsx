"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CuidadorCard from "@/components/CuidadorCard";
import RouteMap from "@/components/RouteMap";
import { getPetsitters } from "@/Services/api";

export default function ListaCuidadores() {
    const searchParams = useSearchParams();

    const serviceType = searchParams.get("service_type");
    const startDate = searchParams.get("start_date");
    const durationHours = searchParams.get("duration_hours");
    const city = searchParams.get("city");

    const [listaCuidadores, setListaCuidadores] = useState([]);
    const [cuidadorSeleccionado, setCuidadorSeleccionado] = useState(null);
    const [userAddress, setUserAddress] = useState("");
    const [inputAddress, setInputAddress] = useState("");

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
            if (data.length > 0) setCuidadorSeleccionado(data[0]);
        };
        fetchCuidadores();
    }, []);

    const handleBuscarRuta = () => {
        if (inputAddress.trim()) {
            setUserAddress(inputAddress.trim());
        }
    };

    const destinationAddress = cuidadorSeleccionado
        ? `${cuidadorSeleccionado.neighborhood || ""} ${cuidadorSeleccionado.city || city || ""}`
        : city || "Madrid, España";

    return (
        <div className="min-h-screen bg-[#F0F7F7] font-sans antialiased text-[#2D3748]">

            {/* Barra superior */}
            <div className="bg-[#FAF6F0] border-b border-[#EADBCE] py-4 px-10 sticky top-0 z-10 shadow-sm flex items-center justify-between">
                <h1 className="text-xl font-bold text-purple-700">
                    🐾 Cuidadores disponibles en <span className="text-teal-700">{city || "tu zona"}</span>
                </h1>
                <span className="text-xs bg-[#7FE3D8] text-[#004D44] font-bold px-3 py-1.5 rounded-full">
                    {listaCuidadores.length} cuidadores encontrados
                </span>
            </div>

            {/* Contenedor principal */}
            <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* COLUMNA DE TARJETAS */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
                    {listaCuidadores.length > 0 ? (
                        listaCuidadores.map((cuidador) => (
                            <div
                                key={cuidador.id}
                                onClick={() => setCuidadorSeleccionado(cuidador)}
                                className={`cursor-pointer rounded-2xl border-2 transition ${
                                    cuidadorSeleccionado?.id === cuidador.id
                                        ? "border-purple-500 shadow-md"
                                        : "border-transparent"
                                }`}
                            >
                                <CuidadorCard cuidador={cuidador} />
                            </div>
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
                    <div className="sticky top-24 w-full bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] shadow-sm overflow-hidden p-4 space-y-3">

                        <div>
                            <h2 className="text-sm font-bold text-gray-700">📍 ¿A qué distancia estás?</h2>
                            {cuidadorSeleccionado && (
                                <p className="text-xs text-purple-600 font-medium mt-0.5">
                                    Cuidador seleccionado: {cuidadorSeleccionado.name}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Escribe tu dirección..."
                                value={inputAddress}
                                onChange={(e) => setInputAddress(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleBuscarRuta()}
                                className="flex-1 text-xs border border-[#EADBCE] rounded-xl px-3 py-2 focus:outline-none focus:border-purple-400 bg-white"
                            />
                            <button
                                onClick={handleBuscarRuta}
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                            >
                                Buscar
                            </button>
                        </div>

                        <div className="rounded-xl overflow-hidden" style={{ height: "400px" }}>
                            {userAddress ? (
                                <RouteMap
                                    userAddress={userAddress}
                                    destination={destinationAddress}
                                />
                            ) : (
                                <div className="w-full h-full bg-[#EFE9E2] flex flex-col items-center justify-center gap-2">
                                    <p className="text-3xl">🗺️</p>
                                    <p className="text-xs text-gray-500 text-center px-4">
                                        Ingresa tu dirección para ver la ruta hasta el cuidador
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}