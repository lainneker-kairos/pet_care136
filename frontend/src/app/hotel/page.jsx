import Accordion from "@/components/Accordion";

export default function HotelPage() {
    return (
        <>
            <main>
                {/* 1. SECCIÓN HERO (Hotel) */}
                <section className="bg-[#f7f8ff] px-8 py-20">
                    <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">

                        {/* Lado izquierdo - Texto y Buscador */}
                        <div className="flex flex-col gap-6">
                            <span className="w-fit rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700">
                                ✓ Tu mascota en las mejores manos
                            </span>

                            <h1 className="text-5xl font-bold leading-tight text-purple-700">
                                Hotel Canino: Estancias Llenas de Amor
                            </h1>

                            <p className="text-lg leading-7 text-gray-600">
                                El alojamiento ideal para cuando tienes que viajar. Tu perro disfrutará de un hogar cálido, paseos diarios y atención las 24 horas del día.
                            </p>

                            {/* Widget Buscador sincronizado con 'offers_hotel' */}
                            <div className="mt-2 rounded-2xl bg-[#FAF6F0] p-6 shadow-xl border border-gray-100">
                                <h3 className="text-lg font-bold text-teal-700 mb-4">Reserva su estancia</h3>
                                
                                <form action="/cuidadores" className="flex flex-col gap-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        
                                        {/* Fecha de Entrada */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">¿Cuándo llega?</label>
                                            <input 
                                                type="date" 
                                                name="start_date"
                                                className="rounded-lg border border-gray-300 p-3 text-sm text-gray-700 focus:border-purple-500 focus:outline-none bg-gray-50"
                                            />
                                        </div>

                                        {/* Fecha de Salida */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">¿Cuándo se va?</label>
                                            <input 
                                                type="date" 
                                                name="end_date"
                                                className="rounded-lg border border-gray-300 p-3 text-sm text-gray-700 focus:border-purple-500 focus:outline-none bg-gray-50"
                                            />
                                        </div>

                                    </div>

                                    {/* Service type para el hotel */}
                                    <input type="hidden" name="service_type" value="hotel" />

                                    <button 
                                        type="submit" 
                                        className="w-full rounded-lg bg-purple-700 py-4 text-center font-bold text-white transition-colors hover:bg-purple-800 shadow-md shadow-purple-200 mt-2"
                                    >
                                        Buscar Hotel
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Lado derecho - Imagen */}
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1601880348117-25c1127a95df?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Perro durmiendo"
                                className="h-[460px] w-full rounded-[28px] object-cover shadow-lg"
                            />

                            <div className="absolute bottom-[-16px] right-[-16px] rounded-xl bg-white p-4 shadow-xl border border-gray-50">
                                <p className="text-2xl font-bold text-purple-700">24/7</p>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Compañía y Cuidado</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. SECCIÓN DE BENEFICIOS */}
                <section className="bg-white px-8 py-16">
                    <div className="mx-auto max-w-6xl text-center">
                        <h2 className="text-3xl font-bold text-purple-700 mb-12">Lo que incluye el Alojamiento</h2>
                        
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#FAF6F0] border border-gray-100">
                                <div className="text-4xl mb-4">🛏️</div>
                                <h3 className="text-xl font-bold text-purple-700 mb-2">Confort Total</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Camas cómodas, ambiente climatizado y todo lo necesario para que se sienta como en casa.
                                </p>
                            </div>

                            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#FAF6F0] border border-gray-100">
                                <div className="text-4xl mb-4">🌳</div>
                                <h3 className="text-xl font-bold text-purple-700 mb-2">Paseos Diarios</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Incluimos al menos 3 paseos al día para que estire las patas y se mantenga activo.
                                </p>
                            </div>

                            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#FAF6F0] border border-gray-100">
                                <div className="text-4xl mb-4">🚨</div>
                                <h3 className="text-xl font-bold text-purple-700 mb-2">Atención Médica</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Protocolos de emergencia y contacto directo con veterinarios las 24 horas del día.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. SECCIÓN DE FAQ */}
                <section className="bg-[#f7f8ff] px-8 py-16 border-t border-gray-100">
                    <div className="mx-auto max-w-3xl">
                       
                        <Accordion
                            faqs={[
                                {
                                    pregunta: "¿Cómo funcionan las tarifas por noche?",
                                    respuesta: "El cobro se realiza por noche (a partir de €25). Si recoges a tu mascota después de la hora de salida, se aplicará una tarifa adicional."
                                },
                                {
                                    pregunta: "¿Qué debo traer para la estancia?",
                                    respuesta: "Es obligatorio traer su comida para evitar problemas digestivos. También recomendamos su cama o juguete favorito."
                                },
                                {
                                    pregunta: "¿Estará mi mascota solo en algún momento?",
                                    respuesta: "No, nuestros cuidadores de hotel garantizan supervisión constante y compañía durante toda la estancia."
                                },
                                {
                                    pregunta: "¿Puedo recibir actualizaciones?",
                                    respuesta: "¡Claro! Enviamos fotos y vídeos diarios para que veas lo bien que se lo está pasando."
                                }
                            ]}
                        />
                    </div>
                </section>
            </main>
        </>
    );
}
