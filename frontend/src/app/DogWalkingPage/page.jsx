import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";

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
                                Confianza en cada paso
                            </span>

                            <h1 className="text-5xl font-bold leading-tight text-purple-700">
                                Paseos Personalizados
                            </h1>
                            <p>Paseos individuales o grupales adaptados al ritmo de tu mascota</p>
                        </div>
                    </div>
                </section>

                {/* Trust bar */}
                <section>
                    <p>
                        Siéntete segura con cuidadores verificados y atención veterinaria
                        disponible.
                    </p>
                </section>

                {/* Benefits */}
                <section>
                    <h2>Paseos que se adaptan a la energía de tu perro</h2>
                </section>

                {/* Recommended walkers */}
                <section>
                    <h2>Paseadores de perros recomendados en tu zona</h2>
                </section>

                {/* FAQ */}
                <section>
                    <h2>Paseos para perros cerca de ti</h2>
                </section>

                {/* How it works */}
                <section>
                    <h2>Cómo reservar al paseador de perros perfecto</h2>
                </section>
            </main>

            <Footer />
        </>
    );
}