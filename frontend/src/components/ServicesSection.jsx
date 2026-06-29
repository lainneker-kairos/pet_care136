import { Footprints, Home, Hotel } from "lucide-react";
import Link from "next/link";

export default function ServiceSection() {
    return (
        <>
            <section id="services" className="bg-[#eaf1ff] px-8 py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <h2 className="mb-4 text-4xl font-bold text-purple-700">
                            Nuestros Servicios Premium
                        </h2>

                        <p className="text-gray-600">
                            Soluciones personalizadas para cada etapa de la vida de tu mascota,
                            garantizando seguridad, cuidado y diversión.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <article className="rounded-[28px] bg-white px-8 py-14 text-center shadow-sm">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-700">
                                <Footprints size={28} />
                            </div>

                            <h3 className="mb-4 text-2xl font-bold text-purple-700">
                                Paseos
                            </h3>

                            <p className="mb-6 text-sm leading-6 text-gray-600">
                                Ejercicio diario y socialización bajo la supervisión de expertos
                                apasionados por los animales.
                            </p>

                            <Link href="/DogWalkingPage" className="font-bold text-teal-700">
                                Ver más →
                            </Link>
                        </article>

                        <article className="rounded-[28px] bg-white px-8 py-14 text-center shadow-sm">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-200 text-2xl font-bold text-teal-700">
                                <Home size={28} />
                            </div>

                            <h3 className="mb-4 text-2xl font-bold text-purple-700">
                                Guardería
                            </h3>

                            <p className="mb-6 text-sm leading-6 text-gray-600">
                                Un hogar lejos de casa donde tu mejor amigo recibirá atención
                                constante, cariño y compañía.
                            </p>

                            <Link href="/daycare" className="font-bold text-teal-700">
                                Ver más →
                            </Link>
                        </article>

                        <article className="rounded-[28px] bg-white px-8 py-14 text-center shadow-sm">
                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-2xl font-bold text-pink-600">
                                <Hotel size={28} />
                            </div>

                            <h3 className="mb-4 text-2xl font-bold text-purple-700">
                                Hotel de Mascotas
                            </h3>

                            <p className="mb-6 text-sm leading-6 text-gray-600">
                                Hospedaje cómodo para estancias largas con seguimiento diario y
                                cuidado personalizado.
                            </p>

                            <Link href="/hotel" className="font-bold text-teal-700">
                                Ver más →
                            </Link>
                        </article>
                    </div>
                </div>
            </section>
        </>
    );
}