"use client";

import Accordion from "@/components/Accordion";
import { useRouter } from "next/navigation";

export default function DogWalkingPage() {
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const params = new URLSearchParams(formData).toString();
        router.push(`/cuidadores?${params}`)
    }

    return (
        <>
            <main>
                {/* 1. SECCIÓN HERO (Con el buscador y SIN botones repetidos) */}
                <section className="bg-[#f7f8ff] px-8 py-20">
                    <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">

                        {/* Lado izquierdo - Texto y Buscador */}
                        <div className="flex flex-col gap-6">
                            <span className="w-fit rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700">
                                ✓ Confianza en cada paso
                            </span>

                            <h1 className="text-5xl font-bold leading-tight text-purple-700">
                                Paseos Personalizados para tu mascota
                            </h1>

                            <p className="text-lg leading-7 text-gray-600">
                                Paseos individuales o grupales adaptados al ritmo de tu mascota. Nuestros paseadores expertos garantizan seguridad y diversión en cada salida.
                            </p>

                            {/* El Widget Buscador que interactúa con el Back */}
                            <div className="mt-2 rounded-2xl bg-[#FAF6F0] p-6 shadow-xl border border-[#EADBCE]">
                                <h3 className="text-lg font-bold text-teal-700 mb-4">Encuentra al paseador ideal</h3>

                                <form onSubmit={handleSearch} className="flex flex-col gap-4">

                                    {/* Grid con duración y fecha */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                        {/* Hora del paseo */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">¿A qué hora quieres el paseo?</label>
                                            <input
                                                type="time"
                                                name="start_time"
                                                className="rounded-lg border border-gray-300 p-3 text-sm text-gray-700 focus:border-purple-500 focus:outline-none bg-gray-50" />
                                        </div>

                                        {/* Selector de Tiempo/Duración */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">¿Cuánto tiempo?</label>
                                            <select
                                                name="duration_hours"
                                                className="rounded-lg border border-gray-300 p-3 text-sm text-gray-700 focus:border-purple-500 focus:outline-none bg-gray-50">
                                                <option value="0.5">Paseo de 30 minutos</option>
                                                <option value="1">Paseo de 1 hora</option>
                                            </select>
                                        </div>

                                        {/* Selector de Fecha */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">¿Qué día?</label>
                                            <input
                                                type="date"
                                                name="start_date"
                                                className="rounded-lg border border-gray-300 p-3 text-sm text-gray-700 focus:border-purple-500 focus:outline-none bg-gray-50" />
                                        </div>
                                    </div>

                                    {/* Campo Ciudad */}
                                    <div className="flex flex-col gap-1 w-1/2 mx-auto">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide text-center">¿En qué ciudad?</label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="Ej: Madrid"
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-700 focus:border-purple-500 focus:outline-none bg-gray-50 text-center"
                                        />
                                    </div>

                                    <input type="hidden" name="service_type" value="paseo" />

                                    <button
                                        type="submit"
                                        className="w-full rounded-lg bg-purple-700 py-4 text-center font-bold text-white transition-colors hover:bg-purple-800 shadow-md shadow-purple-200 mt-2">
                                        Buscar Cuidador
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Lado derecho - Imagen */}
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1560743173-567a3b5658b1?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Perros corriendo"
                                className="h-[460px] w-full rounded-[28px] object-cover shadow-lg" />

                            <div className="absolute bottom-[-16px] right-[-16px] rounded-xl bg-white p-4 shadow-xl border border-gray-50">
                                <p className="text-2xl font-bold text-purple-700">500+</p>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Paseos Realizados</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. NUEVA SECCIÓN INTERMEDIA: BENEFICIOS */}
                <section className="bg-white px-8 py-16">
                    <div className="mx-auto max-w-6xl text-center">
                        <h2 className="text-3xl font-bold text-purple-700 mb-12">¿Por qué elegirnos?</h2>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

                            {/* Tarjeta 1 */}
                            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#FAF6F0] border border-[#EADBCE]">
                                <div className="text-4xl mb-4">🛡️</div>
                                <h3 className="text-xl font-bold text-purple-700 mb-2">Paseadores Verificados</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Validamos la identidad y antecedentes de cada cuidador para garantizar la máxima seguridad.
                                </p>
                            </div>

                            {/* Tarjeta 2 */}
                            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#FAF6F0] border border-[#EADBCE]">
                                <div className="text-4xl mb-4">📍</div>
                                <h3 className="text-xl font-bold text-purple-700 mb-2">Seguimiento por GPS</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Mira la ruta de tu perrito en tiempo real directamente desde tu perfil de usuario.
                                </p>
                            </div>

                            {/* Tarjeta 3 */}
                            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#FAF6F0] border border-[#EADBCE]">
                                <div className="text-4xl mb-4">📞</div>
                                <h3 className="text-xl font-bold text-purple-700 mb-2">Soporte Continuo</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Nuestro equipo está disponible para ayudarte en cualquier momento antes, durante o después del paseo.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. SECCIÓN DE FAQ */}
                <section className="bg-[#f7f8ff] px-8 py-16 border-t border-gray-100">
                    <div className="mx-auto max-w-3xl ">

                        <Accordion
                            faqs={[
                                {
                                    pregunta: "¿Cuál es la duración de los paseos?",
                                    respuesta: "Ofrecemos paseos de 30 minutos y 1 hora, adaptados a la energía y necesidades de tu perro."
                                },
                                {
                                    pregunta: "¿Cuál es el precio de los paseos?",
                                    respuesta: "Los precios varían según la duración: 30 min (a partir de €8) y 1 hora (a partir de €12). También ofrecemos paquetes mensuales con descuento."
                                },
                                {
                                    pregunta: "¿Qué incluye el servicio?",
                                    respuesta: "Incluye paseo seguro, fotos de tu mascota durante el paseo, reporte de actividad y atención personalizada."
                                },
                                {
                                    pregunta: "¿Cómo reservo un paseo?",
                                    respuesta: "Puedes reservar directamente desde nuestra app seleccionando la fecha, hora y duración deseada. El paseador confirmará tu solicitud."
                                }
                            ]}
                        />
                    </div>
                </section>
            </main>
        </>
    );
}