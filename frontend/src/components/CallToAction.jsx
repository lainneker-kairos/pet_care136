export default function CallToAction() {
    return (
        <section className="bg-[#f7f8ff] px-8 py-20">
            <div className="mx-auto max-w-6xl rounded-[28px] bg-purple-700 px-8 py-16 text-center text-white">
                <h2 className="mb-4 text-4xl font-bold">
                    ¿Listo para darle lo mejor a tu mascota?
                </h2>

                <p className="mx-auto mb-10 max-w-2xl text-sm leading-6 text-purple-100">
                    Únete a cientos de familias que ya confían en PetCare para el cuidado
                    de sus mejores amigos.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <a href="/auth/register" className="rounded-lg bg-white px-12 py-4 font-bold text-purple-700"> Empezar Ahora</a>

                    <a href="#services" className="rounded-lg bg-purple-900 px-12 py-4 font-bold text-white">Ver Precios</a>
                </div>
            </div>
        </section>
    );
}