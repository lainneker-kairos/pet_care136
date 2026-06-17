"use client";

import React from "react";

export default function ListaCuidador() {
  // Array con los 4 cuidadores de las imágenes (adaptado a la paleta de colores previa)
  const cuidadores = [
    {
      id: 1,
      nombre: "María Jesús O.",
      ciudad: "Madrid",
      rating: "5.0",
      reviews: 7,
      starSitter: false,
      indiceRespuesta: "Alto",
      descripcion: '"María Jesús cuidó genial de Dotty! Nos envió muchísimas fotos, fue muy comunicativa y atenta en todo momento..."',
      tags: ["En casa a tiempo completo", "Puede administrar medicación", "Puede ofrecer ejercicio diario"],
      precio: 19,
      politica: "Cancela con hasta 1 día de antelación.",
      fotos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150&q=80",
        "https://up.yimg.com/ib/th/id/OIP.O8s289R3T7k_vkjQolc36wHaE9?pid=Api&rs=1&c=1&qlt=95&w=156&h=104"
      ]
    },
    {
      id: 2,
      nombre: "Luciana M.",
      ciudad: "Madrid",
      rating: "5.0",
      reviews: 26,
      starSitter: true,
      indiceRespuesta: "Alto",
      repetidos: 3,
      descripcion: '"Luciana fue una cuidadora excepcional. Cuidó de mi perrita con muchísimo cariño, atención y paseos constantes..."',
      tags: ["En casa a tiempo completo", "Puede administrar medicación", "Puede ofrecer ejercicio diario"],
      precio: 21,
      politica: "Cancela antes de que comience la reserva.",
      fotos: [
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&q=80",
        "https://tse3.mm.bing.net/th/id/OIP.-rsXwFWlvwt6cuBruo-WeQHaFB?pid=Api&P=0&h=180"
      ]
    },
    {
      id: 3,
      nombre: "Graciela G.",
      ciudad: "Madrid",
      rating: "4.9",
      reviews: 250,
      starSitter: true,
      indiceRespuesta: "Alto",
      repetidos: 71,
      descripcion: '"No puedo estar más satisfecha con los cuidados de Graciela a nuestra perrita Mara. En todo momento nos dio confianza..."',
      tags: ["En casa a tiempo completo", "Puede administrar medicación", "Experiencia con perros mayores"],
      precio: 24,
      politica: "Cancela con hasta 7 días de antelación.",
      fotos: [
        "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=150&q=80",
        "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=150&q=80",
        "https://up.yimg.com/ib/th/id/OIP.4fqSM1d06m6gV-UMjcqvMAHaEh?pid=Api&rs=1&c=1&qlt=95&w=173&h=105"
      ]
    },
    {
      id: 4,
      nombre: "Sofía B.",
      ciudad: "Madrid",
      rating: "5.0",
      reviews: 12,
      starSitter: false,
      experiencia: "10 años de experiencia",
      descripcion: '"Sofía tiene una conexión natural con los animales. Mi mascota se adaptó perfectamente a su entorno desde el primer día."',
      tags: ["En casa a tiempo completo"],
      precio: 18,
      politica: "Cancela con hasta 3 días de antelación.",
      fotos: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=150&q=80",
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=150&q=80"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F7F7] font-sans antialiased text-[#2D3748]">
      {/* Barra superior de contexto o filtros */}
      <div className="bg-[#FAF6F0] border-b border-[#EADBCE] py-4 px-6 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#1A202C]">
          🐱 Cuidadores disponibles en <span className="text-[#6338CC]">Madrid</span>
        </h1>
        <span className="text-xs bg-[#7FE3D8] text-[#004D44] font-bold px-3 py-1.5 rounded-full">
          {cuidadores.length} cuidadores encontrados
        </span>
      </div>

      {/* Contenedor Responsivo Principal */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA DE CUIDADORES (Ocupa 7 de 12 columnas en Desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {cuidadores.map((cuidador) => (
            <div 
              key={cuidador.id} 
              className="bg-[#FAF6F0] rounded-2xl shadow-sm border border-[#EADBCE] overflow-hidden flex flex-col justify-between transition-all hover:shadow-md"
            >
              {/* Contenido Superior de la Tarjeta */}
              <div className="p-6 space-y-4">
                
                {/* Mini Galería de fotos del cuidador/mascotas */}
                {/* Cambiamos a una altura fija más alta y añadimos aspectos cuadrados a cada foto */}
                      <div className="grid grid-cols-3 gap-3 h-44 overflow-hidden rounded-xl">
                          {cuidador.fotos.map((img, idx) => (
                              <div key={idx} className="w-full h-full bg-black/5 rounded-lg overflow-hidden flex items-center justify-center border border-[#EADBCE]">
                                  <img
                                      src={img}
                                      alt={`Mascota ${idx}`}
                                      // Cambiamos a 'object-contain' para que la IMAGEN COMPLETA se acomode al recuadro sin sufrir recortes de rostros
                                      className="w-full h-full object-contain"
                                  />
                              </div>
                          ))}
                      </div>

                {/* Bloque de Información del Nombre */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-[#1A202C]">{cuidador.nombre}</h2>
                    {cuidador.starSitter && (
                      <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        ★ Star Sitter
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 font-medium">📍 {cuidador.ciudad}</p>
                </div>

                {/* Calificaciones e Índices */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-gray-600">
                  <span className="flex items-center text-amber-500 gap-1">
                    ★ {cuidador.rating} <span className="text-gray-400 font-normal">({cuidador.reviews})</span>
                  </span>
                  {cuidador.repetidos && (
                    <span className="flex items-center gap-1 text-gray-700">
                      🔄 {cuidador.repetidos} dueños que repiten
                    </span>
                  )}
                  {cuidador.experiencia && (
                    <span className="flex items-center gap-1 text-gray-700">
                      🏆 {cuidador.experiencia}
                    </span>
                  )}
                  {cuidador.indiceRespuesta && (
                    <span className="flex items-center gap-1">
                      ⏱️ <span className="text-emerald-600 font-bold">{cuidador.indiceRespuesta}</span> índice de respuesta
                    </span>
                  )}
                </div>

                {/* Comentario destacado del cliente */}
                <p className="text-xs text-gray-600 italic bg-[#EFE9E2] p-3 rounded-xl border border-[#EADBCE]/60">
                  {cuidador.descripcion} <span className="text-[#6338CC] font-bold cursor-pointer hover:underline">Ver todo</span>
                </p>

                {/* Etiquetas de habilidades / características */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cuidador.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="bg-[#7FE3D8]/40 text-[#004D44] text-[11px] font-medium px-2.5 py-1 rounded-md border border-[#7FE3D8]/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contenido Inferior de la Tarjeta (Sección de precio y botones) */}
              <div className="bg-[#EFE9E2] border-t border-[#EADBCE] p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-700">
                    De <span className="text-lg font-extrabold text-[#6338CC]">{cuidador.precio} €</span> por noche
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium">{cuidador.politica}</p>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-initial bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs py-2 px-4 rounded-xl border border-[#EADBCE] transition shadow-sm whitespace-nowrap">
                    Perfil completo
                  </button>
                  <button className="flex-1 sm:flex-initial bg-[#6338CC] hover:bg-[#522cb3] text-white font-bold text-xs py-2 px-5 rounded-xl transition shadow-sm whitespace-nowrap">
                    Contactar
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* COLUMNA DEL MAPA DE GOOGLE (Ocupa 5 de 12 columnas en Desktop) */}
        {/* Usamos 'hidden lg:block' para ocultarlo por completo en móviles y 'sticky' para que siga la navegación */}
        <div className="hidden lg:block lg:col-span-5 relative">
          <div className="sticky top-24 w-full h-[calc(100vh-120px)] bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] shadow-sm overflow-hidden flex flex-col">
            
            {/* Cabecera superior interna del mapa simulado */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
              <button className="bg-[#6338CC] text-white text-xs font-bold py-2 px-4 rounded-full shadow-md hover:bg-[#522cb3] transition whitespace-nowrap">
                🔍 Buscar en esta zona
              </button>
            </div>

            {/* Simulación del Canvas del mapa usando una imagen técnica de plano de ciudad limpio */}
            <div className="w-full h-full relative bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80" 
                alt="Mapa de Madrid" 
                className="w-full h-full object-cover opacity-40 filter grayscale"
              />
              
              {/* Pines de ubicación falsos posicionados de manera dispersa */}
              <div className="absolute top-1/4 left-1/3 text-2xl animate-bounce drop-shadow">📍</div>
              <div className="absolute top-1/2 left-1/2 text-2xl animate-bounce drop-shadow">📍</div>
              <div className="absolute top-1/3 right-1/4 text-2xl animate-bounce drop-shadow">📍</div>
              <div className="absolute bottom-1/3 left-1/4 text-2xl animate-bounce drop-shadow">📍</div>
              <div className="absolute bottom-1/4 right-1/3 text-2xl animate-bounce drop-shadow">📍</div>
              
              {/* Pin Azul Representativo del usuario actual o cuidador principal */}
              <div className="absolute top-1/2 left-1/3 text-3xl drop-shadow font-bold text-blue-600">🔵</div>
            </div>

            {/* Controles flotantes del mapa (+ / -) */}
            <div className="absolute bottom-6 right-4 flex flex-col gap-1.5 z-10">
              <button className="w-8 h-8 bg-white border border-[#EADBCE] rounded-lg flex items-center justify-center font-bold text-gray-700 shadow hover:bg-gray-50">+</button>
              <button className="w-8 h-8 bg-white border border-[#EADBCE] rounded-lg flex items-center justify-center font-bold text-gray-700 shadow hover:bg-gray-50">-</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}