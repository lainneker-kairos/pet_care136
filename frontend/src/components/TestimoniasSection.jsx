export default function TestimonialsSection() {
    return (
        
        <section className="bg-[#FAF6F0] px-8 py-20">
            <div className="mx-auto max-w-6xl">
                <h2 className="mb-12 text-4xl font-bold text-center text-purple-700">
                    Lo que dicen los Pet Parents
                </h2>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EADBCE] flex flex-col gap-4">
                        <div className="flex gap-1 text-amber-400">★★★★★</div>
                        <p className="text-gray-600 text-sm leading-relaxed italic">
                            "El servicio fue increíble. María cuidó a Toby durante mis vacaciones y me enviaba fotos todos los días. ¡Toby estaba feliz!"
                        </p>
                        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#EADBCE]">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">L</div>
                            <div>
                                <p className="font-bold text-sm text-gray-800">Laura García</p>
                                <p className="text-xs text-gray-500">Mamá de Toby</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EADBCE] flex flex-col gap-4">
                        <div className="flex gap-1 text-amber-400">★★★★★</div>
                        <p className="text-gray-600 text-sm leading-relaxed italic">
                            "PetCare me dio la tranquilidad que necesitaba. El sistema de verificación me hace sentir seguro dejando a Luna con extraños."
                        </p>
                        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#EADBCE]">
                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">C</div>
                            <div>
                                <p className="font-bold text-sm text-gray-800">Carlos Ruiz</p>
                                <p className="text-xs text-gray-500">Papá de Luna</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EADBCE] flex flex-col gap-4">
                        <div className="flex gap-1 text-amber-400">★★★★★</div>
                        <p className="text-gray-600 text-sm leading-relaxed italic">
                            "La mejor app que he probado. Muy intuitiva y los paseadores son extremadamente profesionales y puntuales."
                        </p>
                        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#EADBCE]">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold">E</div>
                            <div>
                                <p className="font-bold text-sm text-gray-800">Elena Martínez</p>
                                <p className="text-xs text-gray-500">Mamá de Max</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}