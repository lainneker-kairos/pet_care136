import Link from "next/link";

export default function CuidadorCard({ cuidador }) {
    return (
        <div className="bg-[#FAF6F0] rounded-2xl shadow-sm border border-[#EADBCE] overflow-hidden flex flex-col justify-between transition-all hover:shadow-md">
            
            {/* Foto del cuidador */}
            <div className="w-full h-48 overflow-hidden">
                <img 
                    src={cuidador.profile_pic || "https://via.placeholder.com/300"} 
                    alt={cuidador.name} 
                    className="w-full h-full object-cover"/>
            </div>

            {/* Contenido */}
            <div className="p-5 space-y-3">
                
                {/* Nombre y ciudad */}
                <div>
                    <h2 className="text-lg font-bold text-[#1A202C]">{cuidador.name}</h2>
                    <p className="text-sm text-gray-500">📍 {cuidador.city}</p>
                </div>

                {/* Rating y bookings */}
                <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-amber-500">⭐ {cuidador.rating || "Nuevo"}</span>
                    <span className="text-gray-500">🔄 {cuidador.booking_count} reservas</span>
                </div>

                {/* Servicios */}
                <div className="flex flex-wrap gap-1.5">
                    {cuidador.offers_walk && (
                        <span className="bg-[#7FE3D8]/40 text-[#004D44] text-[11px] font-medium px-2.5 py-1 rounded-md border border-[#7FE3D8]/60">
                            Paseos
                        </span>
                    )}
                    {cuidador.offers_hotel && (
                        <span className="bg-[#7FE3D8]/40 text-[#004D44] text-[11px] font-medium px-2.5 py-1 rounded-md border border-[#7FE3D8]/60">
                            Hotel
                        </span>
                    )}
                    {cuidador.offers_daycare && (
                        <span className="bg-[#7FE3D8]/40 text-[#004D44] text-[11px] font-medium px-2.5 py-1 rounded-md border border-[#7FE3D8]/60">
                            Guardería
                        </span>
                    )}
                    {cuidador.offers_nightcare && (
                        <span className="bg-[#7FE3D8]/40 text-[#004D44] text-[11px] font-medium px-2.5 py-1 rounded-md border border-[#7FE3D8]/60">
                            Cuidado nocturno
                        </span>
                    )}
                </div>

                {/* Precio */}
                <div className="text-sm text-gray-700">
                    {cuidador.price_per_hour && (
                        <p>Desde <span className="text-lg font-extrabold text-[#6338CC]">{cuidador.price_per_hour}€</span>/hora</p>
                    )}
                    {cuidador.price_per_night && (
                        <p>Desde <span className="text-lg font-extrabold text-[#6338CC]">{cuidador.price_per_night}€</span>/noche</p>
                    )}
                </div>
            </div>

            {/* Botón Ver perfil */}
            <div className="px-5 pb-5">
                <Link 
                    href={`/cuidador/${cuidador.id}`}
                    className="block w-full text-center bg-[#6338CC] hover:bg-[#522cb3] text-white font-bold text-sm py-2.5 rounded-xl transition">
                    Ver perfil
                </Link>
            </div>
        </div>
    );
}