"use client";

import React, { useState } from "react";

export default function PerfilCuidador() {
  // Datos simulados basados en la imagen (Días de la semana traducidos)
  const availabilityDays = [
    { day: 'D', num: 1, type: 'disabled' },
    { day: 'L', num: 2, type: 'disabled' },
    { day: 'M', num: 3, type: 'available' },
    { day: 'M', num: 4, type: 'available' },
    { day: 'J', num: 5, type: 'available' },
    { day: 'V', num: 6, type: 'available' },
    { day: 'S', num: 7, type: 'available' },
    { day: 'D', num: 8, type: 'booked' },
    { day: 'L', num: 9, type: 'current' },
    { day: 'M', num: 10, type: 'available' },
    { day: 'M', num: 11, type: 'available' },
    { day: 'J', num: 12, type: 'available' },
    { day: 'V', num: 13, type: 'available' },
    { day: 'S', num: 14, type: 'available' },
  ];

  return (
    <div className="min-h-screen bg-[#F0F7F7] font-sans antialiased text-[#2D3748]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA: Información del Cuidador */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tarjeta de Perfil Principal */}
            <div className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE] flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden flex-shrink-0 bg-amber-200">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80" 
                  alt="Elena Rodriguez" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#00A896] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap">
                  ✓ Verificado
                </span>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4 w-full">
                <div>
                  <h1 className="text-3xl font-bold text-[#1A202C]">Elena Rodriguez</h1>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center text-[#00A896] font-medium">
                      ★ 4.9 <span className="text-gray-500 font-normal ml-1">(124 reseñas)</span>
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1">📍 Madrid, España</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#EFE9E2] p-3 rounded-xl text-center">
                  <div>
                    <p className="text-xl font-bold text-[#6338CC]">250+</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Reservas</p>
                  </div>
                  <div className="border-x border-gray-300">
                    <p className="text-xl font-bold text-[#6338CC]">6 años</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Exp.</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#6338CC]">&lt;1 hr</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Respuesta</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Sobre Mí */}
            <div className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE] space-y-4">
              <h2 className="text-xl font-bold text-[#1A202C]">Sobre Mí</h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                ¡Hola! Soy Elena, una amante de los animales de toda la vida con más de 6 años de experiencia profesional en el cuidado de mascotas. Mi viaje comenzó como voluntaria en refugios locales, donde aprendí a manejar diversos temperamentos y necesidades especiales. Trato a cada amigo peludo como si fuera mío, brindando un equilibrio entre juego de alta energía y una atención tranquila y afectuosa.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm">
                Vivo en un apartamento amplio y seguro para mascotas cerca de Prospect Park, ideal para largas caminatas por la tarde. Ya sea una visita rápida al mediodía o un alojamiento de una semana entera, mi objetivo es brindarle a tu mascota "calidez profesional" y a ti una total tranquilidad.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="bg-[#7FE3D8] text-[#004D44] text-xs font-semibold px-3 py-1.5 rounded-full">Certificación RCP</span>
                <span className="bg-[#7FE3D8] text-[#004D44] text-xs font-semibold px-3 py-1.5 rounded-full">Administración de Medicamentos</span>
                <span className="bg-[#7FE3D8] text-[#004D44] text-xs font-semibold px-3 py-1.5 rounded-full">Cuidado de Mascotas Senior</span>
              </div>
            </div>

            {/* Sección: Clientes Felices */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#1A202C]">Clientes Felices</h2>
                <button className="text-sm font-semibold text-[#00A896] hover:underline">Ver las 124</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#EADBCE] flex gap-4 items-start">
                  <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&auto=format&fit=crop&q=80" alt="Perro" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="text-[#7FE3D8] text-xs">★★★★★</div>
                    <p className="text-xs text-gray-700 italic">"¡Elena es increíble con Cooper! Él siempre regresa exhausto y muy feliz..."</p>
                    <p className="text-xs font-bold text-gray-900">— Sarah M.</p>
                  </div>
                </div>

                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#EADBCE] flex gap-4 items-start">
                  <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&auto=format&fit=crop&q=80" alt="Gato" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="text-[#7FE3D8] text-xs">★★★★★</div>
                    <p className="text-xs text-gray-700 italic">"Luna suele odiar a la gente nueva, pero conectó con Elena de inmediato."</p>
                    <p className="text-xs font-bold text-gray-900">— James K.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: Barra Lateral */}
          <div className="space-y-6">
            
            {/* Servicios y Precios */}
            <div className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE] space-y-4">
              <h2 className="text-lg font-bold text-[#1A202C]">Servicios y Precios</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-[#EFE9E2] p-3 rounded-xl">
                  <span className="flex items-center gap-2 text-sm font-medium">🚶 Paseo de Perros</span>
                  <span className="font-bold text-[#6338CC] text-sm">$25<span className="text-xs font-normal text-gray-500">/hr</span></span>
                </div>
                <div className="flex justify-between items-center bg-[#EFE9E2] p-3 rounded-xl">
                  <span className="flex items-center gap-2 text-sm font-medium">🐾 Guardería de Mascotas</span>
                  <span className="font-bold text-[#6338CC] text-sm">$45<span className="text-xs font-normal text-gray-500">/día</span></span>
                </div>
                <div className="flex justify-between items-center bg-[#EFE9E2] p-3 rounded-xl">
                  <span className="flex items-center gap-2 text-sm font-medium">🏠 Alojamiento Completo</span>
                  <span className="font-bold text-[#6338CC] text-sm">$60<span className="text-xs font-normal text-gray-500">/noche</span></span>
                </div>
              </div>

              <button className="w-full bg-[#6338CC] hover:bg-[#522cb3] text-white font-semibold py-3.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md group">
                Solicitar reserva 
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <p className="text-center text-xs text-gray-500 font-medium">Suele responder en menos de 45 minutos</p>
            </div>

            {/* Disponibilidad */}
            <div className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE] space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-md font-bold text-[#1A202C]">Disponibilidad</h2>
                <span className="text-xs font-bold text-gray-600">Noviembre 2024</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, idx) => (
                  <div key={idx} className="text-gray-400 pb-1">{d}</div>
                ))}
                
                {availabilityDays.map((item, idx) => {
                  let bgClass = "text-gray-300";
                  if (item.type === 'available') bgClass = "bg-[#7FE3D8] text-[#004D44] rounded-md";
                  if (item.type === 'booked') bgClass = "bg-[#FADCD9] text-[#C53030] rounded-md";
                  if (item.type === 'current') bgClass = "bg-[#7FE3D8] text-[#004D44] rounded-md border-2 border-[#6338CC] font-bold";

                  return (
                    <div key={idx} className={`py-2 ${bgClass}`}>
                      {item.num}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 text-[10px] font-bold text-gray-500 pt-2 border-t border-gray-200">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-[#7FE3D8] rounded-sm inline-block"></span> Disponible
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-[#FADCD9] rounded-sm inline-block"></span> Reservado
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Pie de Página (Footer) */}
        <footer className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-600">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#6338CC]">PawsCare</h3>
            <p className="text-xs leading-relaxed text-gray-500">
              © 2024 PawsCare. Calidez profesional para cada mascota. Autorizados, asegurados y profundamente comprometidos con el bienestar animal.
            </p>
          </div>
          <div>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:text-[#6338CC]">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-[#6338CC]">Soporte de Contacto</a></li>
              <li><a href="#" className="hover:text-[#6338CC]">Política de Privacidad</a></li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:text-[#6338CC]">Términos de Servicio</a></li>
              <li><a href="#" className="hover:text-[#6338CC]">Conviértete en Cuidador</a></li>
              <li><a href="#" className="hover:text-[#6338CC]">Confianza y Seguridad</a></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-gray-800">Sigue a Nuestra Comunidad</h4>
            <div className="flex gap-3 text-lg">
              <span className="cursor-pointer hover:text-[#6338CC]">👥</span>
              <span className="cursor-pointer hover:text-[#6338CC]">📸</span>
              <span className="cursor-pointer hover:text-[#6338CC]">🕊️</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}