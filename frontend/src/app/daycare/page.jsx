import Accordion from "@/components/Accordion";

export default function GuarderiaPage() {
    return (
        <>
            <main>
                {/* 1. SECCIÓN HERO (Guardería y Cuidado Nocturno) */}
                <section className="bg-[#f7f8ff] px-8 py-20">
                    <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">

                        {/* Lado izquierdo - Texto y Buscador */}
                        <div className="flex flex-col gap-6">
                            <span className="w-fit rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700">
                                ✓ Entorno seguro y divertido
                            </span>

                            <h1 className="text-5xl font-bold leading-tight text-purple-700">
                                Cuidado y Guardería para tu mascota
                            </h1>

                            <p className="text-lg leading-7 text-gray-600">
                                El lugar perfecto para que tu mascota socialice, juegue o pase la noche de forma segura. Supervisión experta y amigos peludos garantizados en cada estancia.
                            </p>

                            {/* Widget Buscador sincronizado con el Back (daycare / nightcare) */}
                            <div className="mt-2 rounded-2xl bg-[#FAF6F0] p-6 shadow-xl border border-gray-100">
                                <h3 className="text-lg font-bold text-teal-700 mb-4">Reserva su lugar hoy</h3>
                                
                                <form action="/cuidadores" className="flex flex-col gap-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        
                                        {/* Selector de Tipo de Cuidado (Modifica el service_type dinámicamente) */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">¿Qué servicio necesitas?</label>
                                            <select 
                                                name="service_type" // Hace match directo con service_type en el modelo Booking
                                                className="rounded-lg border border-gray-300 p-3 text-sm text-gray-700 focus:border-purple-500 focus:outline-none bg-gray-50"
                                            >
                                                <option value="daycare">Guardería de día (Por hora)</option>
                                                <option value="nightcare">Cuidado nocturno (Por noche)</option>
                                            </select>
                                        </div>

                                        {/* Selector de Fecha */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">¿Qué día?</label>
                                            <input 
                                                type="date" 
                                                name="start_date"
                                                className="rounded-lg border border-gray-300 p-3 text-sm text-gray-700 focus:border-purple-500 focus:outline-none bg-gray-50"
                                            />
                                        </div>

                                    </div>

                                    <button 
                                        type="submit" 
                                        className="w-full rounded-lg bg-purple-700 py-4 text-center font-bold text-white transition-colors hover:bg-purple-800 shadow-md shadow-purple-200 mt-2"
                                    >
                                        Buscar Cuidador
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Lado derecho - Imagen */}
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1558788353-f76d92427f16"
                                alt="Perro golden"
                                className="h-[460px] w-full rounded-[28px] object-cover shadow-lg"
                            />

                            <div className="absolute bottom-[-16px] right-[-16px] rounded-xl bg-white p-4 shadow-xl border border-gray-50">
                                <p className="text-2xl font-bold text-purple-700">100%</p>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Supervisión Profesional</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. SECCIÓN DE BENEFICIOS (Corregido a color Púrpura) */}
                <section className="bg-white px-8 py-16">
                    <div className="mx-auto max-w-6xl text-center">
                        <h2 className="text-3xl font-bold text-purple-700 mb-12">Beneficios de nuestra Guardería</h2>
                        
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#FAF6F0] border border-gray-100">
                                <div className="text-4xl mb-4">🐾</div>
                                <h3 className="text-xl font-bold text-purple-700 mb-2">Socialización Sana</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Grupos de juego controlados por tamaño y energía para que hagan amigos de forma segura.
                                </p>
                            </div>

                            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#FAF6F0] border border-gray-100">
                                <div className="text-4xl mb-4">🏠</div>
                                <h3 className="text-xl font-bold text-purple-700 mb-2">Espacios Adaptados</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Zonas de juego interiores climatizadas y patios seguros para disfrutar al aire libre.
                                </p>
                            </div>

                            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#FAF6F0] border border-gray-100">
                                <div className="text-4xl mb-4">📷</div>
                                <h3 className="text-xl font-bold text-purple-700 mb-2">Reportes Diarios</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Recibe fotos y actualizaciones de las actividades de tu perro durante todo el día o noche.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. SECCIÓN DE FAQ (Cambiado el título a Preguntas Frecuentes) */}
                <section className="bg-[#f7f8ff] px-8 py-16 border-t border-gray-100">
                    <div className="mx-auto max-w-3xl">
                        
                        <Accordion
                            faqs={[
                                {
                                    pregunta: "¿Qué horarios de entrega y recogida tienen?",
                                    respuesta: "Para guardería de día (daycare) puedes dejarlo desde las 8:00 AM y recogerlo hasta las 7:00 PM. Para estancias nocturnas (nightcare), coordinas la hora de check-in y check-out directamente en la reserva."
                                },
                                {
                                    pregunta: "¿Mi perro necesita vacunas?",
                                    respuesta: "Sí, por seguridad de todos, exigimos cartilla de vacunación al día y tratamiento antiparasitario vigente."
                                },
                                {
                                    pregunta: "¿Debo llevar su comida?",
                                    respuesta: "Recomendamos traer su ración de alimento para evitar cambios bruscos en su dieta, especialmente si se queda a pasar la noche."
                                },
                                {
                                    pregunta: "¿Cómo reservo una jornada?",
                                    respuesta: "Selecciona el día y si prefieres guardería de día o cuidado nocturno. El cuidador confirmará la disponibilidad basándose en su calendario."
                                }
                            ]}
                        />
                    </div>
                </section>
            </main>
        </>
    );
}