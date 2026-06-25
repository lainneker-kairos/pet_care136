"use client";

import React, { useState } from "react";

export default function PerfilDueno() {
  // --- ESTADO DE LAS MASCOTAS ---
  const [mascotas, setMascotas] = useState([
    {
      id: 1,
      nombre: "Cooper",
      tipo: "perro",
      raza: "Golden Retriever",
      edad: "3 años",
      foto: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&q=80",
      notas: "Muy amigable, le encanta correr tras la pelota y toma medicina para la alergia en las mañanas."
    },
    {
      id: 2,
      nombre: "Luna",
      tipo: "gato",
      raza: "Siamés",
      edad: "2 años",
      foto: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80",
      notas: "Asustadiza con desconocidos. Prefiere lugares altos y comida húmeda."
    }
  ]);

  // --- ESTADOS DEL FORMULARIO DE MASCOTAS ---
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("perro");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [notas, setNotas] = useState("");
  const [foto, setFoto] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  // --- ACCIONES DEL CRUD DE MASCOTAS ---
  const handleGuardar = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return alert("El nombre es obligatorio");

    const fotoFinal = foto.trim() || (tipo === "perro" 
      ? "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80" 
      : "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&q=80");

    if (editandoId !== null) {
      setMascotas(mascotas.map(m => m.id === editandoId ? {
        ...m, nombre, tipo, raza, edad, notas
      } : m));
      setEditandoId(null);
    } else {
      const nuevaMascota = {
        id: Date.now(),
        nombre,
        tipo,
        raza,
        edad,
        foto: fotoFinal,
        notas
      };
      setMascotas([...mascotas, nuevaMascota]);
    }
    limpiarFormulario();
  };

  const handleIniciarEditar = (mascota) => {
    setEditandoId(mascota.id);
    setNombre(mascota.nombre);
    setTipo(mascota.tipo);
    setRaza(mascota.raza);
    setEdad(mascota.edad);
    setNotas(mascota.notas);
  };

  const handleEliminar = (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
      setMascotas(mascotas.filter(m => m.id !== id));
      if (editandoId === id) limpiarFormulario();
    }
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombre("");
    setTipo("perro");
    setRaza("");
    setEdad("");
    setNotas("");
    setFoto("");
  };

  return (
    <div className="min-h-screen bg-[#F0F7F7] font-sans antialiased text-[#2D3748] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Encabezado Principal */}
        <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#EADBCE] shadow-sm">
          <h1 className="text-2xl font-extrabold text-[#1A202C]">Perfil de Dueño</h1>
          <p className="text-sm text-gray-500">Administra tus datos de contacto personales y los perfiles de tus mascotas vinculadas.</p>
        </div>

        {/* Distribución Responsive en dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA: Información del Dueño (Ocupa 4 de 12) */}
          <div className="lg:col-span-4 bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-6 shadow-sm space-y-6 sticky top-6">
            <div className="text-center space-y-3">
              {/* Foto de Perfil del Dueño */}
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-[#6338CC] shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80" 
                  alt="Foto del Dueño" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1A202C]">María Alejandra P.</h2>
                <p className="text-xs text-gray-500 font-medium">📍 Miembro desde junio, 2026</p>
              </div>
              <span className="inline-block bg-[#7FE3D8]/40 text-[#004D44] text-[11px] font-bold px-3 py-1 rounded-full border border-[#7FE3D8]">
                Cliente Verificado 🐾
              </span>
            </div>

            {/* Datos de Contacto */}
            <div className="border-t border-[#EADBCE]/60 pt-4 space-y-3 text-xs font-medium">
              <h3 className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Información de contacto</h3>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">📧 <span className="text-gray-900">maria.perez@email.com</span></p>
                <p className="flex items-center gap-2">📱 <span className="text-gray-900">+34 612 345 678</span></p>
                <p className="flex items-center gap-2">🏠 <span className="text-gray-900">Madrid, España</span></p>
              </div>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#EFE9E2]/60 border border-[#EADBCE]/50 rounded-xl p-3 text-center">
                <span className="block text-lg font-black text-[#6338CC]">{mascotas.length}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">Mascotas</span>
              </div>
              <div className="bg-[#EFE9E2]/60 border border-[#EADBCE]/50 rounded-xl p-3 text-center">
                <span className="block text-lg font-black text-[#6338CC]">12</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">Reservas</span>
              </div>
            </div>

            {/* Botón para editar perfil de Dueño si fuera necesario a futuro */}
            <button className="w-full bg-white hover:bg-[#EFE9E2] text-gray-700 font-bold text-xs py-2.5 rounded-xl border border-[#EADBCE] transition shadow-sm">
              ⚙️ Configurar Cuenta
            </button>
          </div>

          {/* COLUMNA DERECHA: Gestión de Mascotas (Ocupa 8 de 12) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Sección: Lista de Mascotas */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#1A202C] flex items-center gap-2">
                🐾 Mis Mascotas Vinculadas <span className="text-xs bg-[#7FE3D8] text-[#004D44] px-2.5 py-0.5 rounded-full font-bold">{mascotas.length}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mascotas.map((mascota) => (
                  <div 
                    key={mascota.id} 
                    className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-4 flex flex-col justify-between shadow-sm relative overflow-hidden hover:shadow-md transition"
                  >
                    <div className="space-y-3">
                      <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden border border-[#EADBCE]">
                        <img 
                          src={mascota.foto} 
                          alt={mascota.nombre} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-[#1A202C]">{mascota.nombre}</h3>
                          <span className="bg-[#7FE3D8]/40 text-[#004D44] text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-[#7FE3D8]">
                            {mascota.tipo === "perro" ? "🐶 Perro" : "🐱 Gato"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">{mascota.raza} • {mascota.edad}</p>
                      </div>

                      <p className="text-xs text-gray-600 italic bg-[#EFE9E2]/60 p-2.5 rounded-lg border border-[#EADBCE]/30 line-clamp-2">
                        "{mascota.notas}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#EADBCE]/60">
                      <button 
                        onClick={() => handleIniciarEditar(mascota)}
                        className="bg-white hover:bg-[#EFE9E2] text-gray-700 font-bold text-xs py-2 px-3 rounded-xl border border-[#EADBCE] transition"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => handleEliminar(mascota.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-2 px-3 rounded-xl border border-red-200 transition"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {mascotas.length === 0 && (
                <div className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-12 text-center text-gray-400">
                  <p className="text-3xl mb-2">🐕</p>
                  <p className="text-sm font-medium">No hay ninguna mascota registrada en este perfil.</p>
                </div>
              )}
            </div>

            {/* Sección: Formulario Dinámico de Registro/Edición */}
            <div className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-6 shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-bold text-[#1A202C]">
                  {editandoId !== null ? "📝 Modificar Datos de Mascota" : "➕ Registrar Nueva Mascota"}
                </h2>
                <p className="text-xs text-gray-500">Asocia un nuevo integrante peludo a tu cuenta de dueño.</p>
              </div>

              <form onSubmit={handleGuardar} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nombre de la Mascota *</label>
                  <input 
                    type="text" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Max, Toby, Bella" 
                    className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC] font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Tipo de Mascota</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="tipo" 
                        value="perro"
                        checked={tipo === "perro"}
                        onChange={() => setTipo("perro")}
                        className="accent-[#6338CC]" 
                      />
                      🐶 Perro
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="tipo" 
                        value="gato"
                        checked={tipo === "gato"}
                        onChange={() => setTipo("gato")}
                        className="accent-[#6338CC]" 
                      />
                      🐱 Gato
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Raza</label>
                    <input 
                      type="text" 
                      value={raza}
                      onChange={(e) => setRaza(e.target.value)}
                      placeholder="Ej. Mestizo, Shiba Inu" 
                      className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC] font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Edad</label>
                    <input 
                      type="text" 
                      value={edad}
                      onChange={(e) => setEdad(e.target.value)}
                      placeholder="Ej. 1 año, 5 meses" 
                      className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC] font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Instrucciones Especiales de Cuidado</label>
                  <textarea 
                    rows="3"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Describe sus hábitos alimenticios, alergias, comportamiento con otros animales..."
                    className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm focus:outline-none focus:border-[#6338CC] font-medium resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  {editandoId !== null && (
                    <button 
                      type="button"
                      onClick={limpiarFormulario}
                      className="w-1/3 bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs py-3 px-4 rounded-xl border border-[#EADBCE] transition"
                    >
                      Cancelar
                    </button>
                  )}
                  <button 
                    type="submit"
                    className={`bg-[#6338CC] hover:bg-[#522cb3] text-white font-bold text-xs py-3 px-4 rounded-xl transition shadow-sm ${editandoId !== null ? "w-2/3" : "w-full"}`}
                  >
                    {editandoId !== null ? "💾 Guardar Cambios" : "➕ Registrar Mascota"}
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}