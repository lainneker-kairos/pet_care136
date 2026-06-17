import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DogWalkingPage() {
    return (
        <>
            <Navbar />
            <main>
                {/* Hero */}
                <section className="bg-[#f7f8ff] px-8 py-20">
                    <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">

                        {/* Lado izquierdo */}
                        <div className="flex flex-col gap-6">
                            <span className="w-fit rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700">
                                ✓ Confianza en cada paso
                            </span>

                            <h1 className="text-5xl font-bold leading-tight text-purple-700">
                                Paseos Personalizados para tu Perro
                            </h1>

                            <p className="text-lg leading-7 text-gray-600">
                                Paseos individuales o grupales adaptados al ritmo de tu mascota. Nuestros paseadores expertos garantizan seguridad y diversión en cada salida.
                            </p>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <a href="#" className="rounded-lg bg-purple-700 px-8 py-4 text-center font-bold text-white hover:bg-purple-800">
                                    Buscar Paseador
                                </a>
                                <a href="#" className="rounded-lg border-2 border-purple-700 px-8 py-4 text-center font-bold text-purple-700 hover:bg-purple-50">
                                    Más Información
                                </a>
                            </div>
                        </div>

                        {/* Lado derecho - Imagen */}
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1558788353-f76d92427f16"
                                alt="Persona paseando perros"
                                className="h-[420px] w-full rounded-[28px] object-cover"
                            />

                            <div className="absolute bottom-[-16px] right-[-16px] rounded-xl bg-white p-4 shadow-xl">
                                <p className="text-2xl font-bold text-purple-700">500+</p>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Paseos Realizados</p>
                            </div>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}