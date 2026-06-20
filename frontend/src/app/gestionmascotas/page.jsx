"use client";

import React, { useState } from "react";

export default function GestionMascotas() {
  // Estado inicial simulado con 2 mascotas
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

  // Estados para controlar el formulario
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("perro");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [notas, setNotas] = useState("");
  const [foto, setFoto] = useState("");
  
  // Estado para saber si estamos editando una mascota existente
  const [editandoId, setEditandoId] = useState(null);

  // Acción: Guardar (Crear o Editar)
  const handleGuardar = (e) => {
    e.preventDefault();
    
    if (!nombre.trim()) return alert("El nombre es obligatorio");

    // URL de foto por defecto si se deja vacía
    const fotoFinal = foto.trim() || (tipo === "perro" 
      ? "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80" 
      : "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&q=80");

    if (editandoId !== null) {
      // MODO EDITAR
      setMascotas(mascotas.map(m => m.id === editandoId ? {
        id: editandoId, nombre, tipo, raza, edad, notas, foto: m.foto // mantiene la foto actual
      } : m));
      setEditandoId(null);
    } else {
      // MODO CREAR
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

    // Limpiar formulario
    limpiarFormulario();
  };

  // Acción: Cargar datos en el formulario para editar
  const handleIniciarEditar = (mascota) => {
    setEditandoId(mascota.id);
    setNombre(mascota.nombre);
    setTipo(mascota.tipo);
    setRaza(mascota.raza);
    setEdad(mascota.edad);
    setNotas(mascota.notas);
  };

  // Acción: Eliminar mascota
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
          <h1 className="text-2xl font-extrabold text-[#1A202C]">Mis Mascotas</h1>
          <p className="text-sm text-gray-500">Gestiona los perfiles de tus compañeros peludos para agilizar tus reservas.</p>
        </div>

        {/* Distribución en dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLUMNA IZQUIERDA: Lista de Mascotas Actuales (Ocupa 7 de 12) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-bold text-[#1A202C] flex items-center gap-2">
              🐾 Perfiles Creados <span className="text-xs bg-[#7FE3D8] text-[#004D44] px-2.5 py-0.5 rounded-full font-bold">{mascotas.length}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mascotas.map((mascota) => (
                <div 
                  key={mascota.id} 
                  className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition"
                >
                  <div className="space-y-3">
                    {/* Contenedor de la foto de la mascota */}
                    <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden border border-[#EADBCE]">
                      <img 
                        src={mascota.foto} 
                        alt={mascota.nombre} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Información Básica */}
                    <div>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-[#1A202C]">{mascota.nombre}</h3>
                        <span className="bg-[#7FE3D8]/40 text-[#004D44] text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-[#7FE3D8]">
                          {mascota.tipo === "perro" ? "🐶 Perro" : "🐱 Gato"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">{mascota.raza} • {mascota.edad}</p>
                    </div>

                    {/* Notas de cuidado */}
                    <p className="text-xs text-gray-600 italic bg-[#EFE9E2]/60 p-2.5 rounded-lg border border-[#EADBCE]/30 line-clamp-3">
                      "{mascota.notas}"
                    </p>
                  </div>

                  {/* Botones de Acción (Editar / Eliminar) */}
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
                <p className="text-sm font-medium">No tienes ninguna mascota registrada todavía.</p>
                <p className="text-xs text-gray-400">Utiliza el formulario de la derecha para añadir la primera.</p>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: Formulario Dinámico (Ocupa 5 de 12) */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-6 shadow-sm sticky top-6 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-[#1A202C]">
                  {editandoId !== null ? "📝 Editar Mascota" : "➕ Añadir Mascota"}
                </h2>
                <p className="text-xs text-gray-500">Completa los datos correspondientes.</p>
              </div>

              <form onSubmit={handleGuardar} className="space-y-4">
                {/* Campo: Nombre */}
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

                {/* Campo: Tipo (Selector de Radio Botón) */}
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

                {/* Fila paralela: Raza y Edad */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Raza</label>
                    <input 
                      type="text" 
                      value={raza}
                      onChange={(e) => setRaza(e.target.value)}
                      placeholder="Ej. Mestizo, Persa" 
                      className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC] font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Edad / Tiempo</label>
                    <input 
                      type="text" 
                      value={edad}
                      onChange={(e) => setEdad(e.target.value)}
                      placeholder="Ej. 10 meses, 4 años" 
                      className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC] font-medium"
                    />
                  </div>
                </div>

                {/* Campo: Notas de Cuidado */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Instrucciones Especiales o Cuidados</label>
                  <textarea 
                    rows="3"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Menciona alergias, miedos, pautas de alimentación o lo que el cuidador deba saber obligatoriamente..."
                    className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm focus:outline-none focus:border-[#6338CC] font-medium resize-none"
                  ></textarea>
                </div>

                {/* Botones del Formulario */}
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
                    {editandoId !== null ? "💾 Actualizar Cambios" : "➕ Registrar Mascota"}
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