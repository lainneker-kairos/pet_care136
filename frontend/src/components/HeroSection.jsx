"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HeroSection() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [serviceType, setServiceType] = useState("paseo");

  const handleBuscar = () => {
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    params.append("service_type", serviceType);
    router.push(`/cuidadores?${params.toString()}`);
  };

  return (
    <section className="bg-[#f7f8ff] px-8 py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">

        {/* Lado izquierdo */}
        <div className="flex flex-col gap-6">
          <span className="w-fit rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700">
            ✓ Cuidadores verificados en tu zona
          </span>
          <div className="mt-2 rounded-2xl bg-[#FAF6F0] p-6 shadow-x1 border border-[#EADBCE]">
          <h1 className="text-5xl font-bold leading-tight text-purple-700">
            El Mejor Cuidado Para Tu Mejor Amigo
          </h1>
          </div>
          <p className="text-lg leading-7 text-gray-600">
            Encuentra paseadores y cuidadores de confianza cerca de ti, listos para tratar a tu mascota como parte de su familia.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/cuidadores" className="rounded-lg bg-purple-700 px-8 py-4 text-center font-bold text-white hover:bg-purple-800 transition">
              Encontrar un cuidador
            </Link>

            <Link href="/perfil-cuidador" className="rounded-lg border-2 border-purple-700 px-8 py-4 text-center font-bold text-purple-700">
              Convertirse en cuidador
            </Link>
          </div>

          {/* Barra de búsqueda */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-md sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-4 py-3">
              <span>📍</span>
              <input
                type="text"
                placeholder="¿Dónde buscas cuidado?"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                className="w-full text-sm outline-none"/>
            </div>
            <select
              className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}>
              <option value="paseo">Paseos</option>
              <option value="guarderia">Guardería</option>
              <option value="hotel">Hotel</option>
              <option value="nightcare">Cuidado nocturno</option>
            </select>
            <button
              onClick={handleBuscar}
              className="rounded-lg bg-teal-600 px-6 py-3 font-bold text-white hover:bg-teal-700 transition">
              🔍 Buscar
            </button>
          </div>
        </div>
        {/* Lado derecho */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1587300003388-59208cc962cb"
            alt="Persona paseando un perro"
            className="h-[420px] w-full rounded-[28px] object-cover"
          />
          <div className="absolute bottom-[-16px] right-[-16px] rounded-xl bg-white p-4 shadow-xl">
            <p className="text-2xl font-bold text-purple-700">100+</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Mascotas felices</p>
          </div>
        </div>
      </div>
    </section>
  );
}