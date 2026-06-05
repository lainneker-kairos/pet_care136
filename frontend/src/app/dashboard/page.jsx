export default function DashboardPage() {
    return (
        <main>
            <section className="bg-[#f7f8ff] px-8 py-20">
                <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1537151625747-768eb6cf92b2"
                            alt="Perro recibiendo cuidados"
                            className="h-[420px] w-full rounded-[28px] object-cover"
                        />

                        <div className="absolute bottom-[-24px] right-[-24px] w-44 rounded-xl bg-purple-700 p-6 text-white shadow-xl">
                            <p className="text-lg font-bold leading-tight">
                                Seguridad 100% garantizada en cada reserva.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-8 text-4xl font-bold leading-tight text-purple-700">
                            ¿Por qué confiar en PetCare?
                        </h2>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-200">
                                    ✓
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Cuidadores Verificados</h3>
                                    <p className="text-sm text-gray-600">
                                        Realizamos entrevistas personales y revisión de antecedentes.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-200">
                                    24
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Soporte 24/7</h3>
                                    <p className="text-sm text-gray-600">
                                        Nuestro equipo está disponible ante cualquier emergencia.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-200">
                                    +
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Seguro Veterinario</h3>
                                    <p className="text-sm text-gray-600">
                                        Todas las reservas incluyen cobertura médica básica.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2>Lo que dicen los Pet Parents</h2>
            </section>
            <section className="bg-[#f7f8ff] px-8 py-20">
                <div className="mx-auto max-w-6xl rounded-[28px] bg-purple-700 px-8 py-16 text-center text-white">
                    <h2 className="mb-4 text-4xl font-bold">
                        ¿Listo para darle lo mejor a tu mascota?
                    </h2>

                    <p className="mx-auto mb-10 max-w-2xl text-sm leading-6 text-purple-100">
                        Únete a miles de familias que ya confían en PawsCare para el cuidado
                        de sus mejores amigos.
                    </p>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <a href="#" className="rounded-lg bg-white px-12 py-4 font-bold text-purple-700"> Empezar Ahora</a>

                        <a href="#" className="rounded-lg bg-purple-900 px-12 py-4 font-bold text-white">Ver Precios</a>
                    </div>
                </div>
            </section>

            <footer className="bg-[#eaf1ff] px-8 pt-16 pb-8">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-4">
                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-purple-700">
                            PetCare
                        </h2>
                        <p className="max-w-xs text-sm leading-6 text-gray-600">
                            Brindando cuidado profesional para cada mascota, todos los días.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900">
                            Compañía
                        </h3>

                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>
                                <a href="#">About Us</a>
                            </li>
                            <li>
                                <a href="#">Contact Support</a>
                            </li>
                            <li>
                                <a href="#">Become a Caregiver</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900">
                            Legal
                        </h3>

                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>
                                <a href="#">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#">Terms of Service</a>
                            </li>
                            <li>
                                <a href="#">Trust & Safety</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900">
                            Síguenos
                        </h3>

                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-purple-700"
                            >
                                f
                            </a>

                            <a
                                href="#"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-purple-700"
                            >
                                in
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-12 max-w-6xl border-t border-purple-100 pt-6 text-center">
                    <p className="text-sm text-gray-500">
                        © 2024 PawsCare. Professional Warmth for Every Pet.
                    </p>
                </div>
            </footer>
        </main >
    );
}