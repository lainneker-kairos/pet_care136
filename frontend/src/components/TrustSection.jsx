import {ShieldCheck, Headphones, Star} from "lucide-react";

export default function TrustSection() {
    return (
        <>
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
                                    <ShieldCheck size={20} />
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
                                    <Headphones sise={20} />
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
                                    <Star size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900"> Sistema de valoraciones</h3>
                                    <p className="text-sm text-gray-600">
                                        Puedes ver las reseñas de otros dueños antes de elegir.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}