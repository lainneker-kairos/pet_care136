"use client";

import React, { useState, useEffect } from "react";

import { getUserProfile, updateOwnerProfile, getMyPets, createPet, updatePet, deletePet} from "@/Services/api";

export default function PerfilDueno() {
  // ---  ESTADOS PARA DATOS REALES ---
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);

    // ---ESTADOS DEL FORMULARIO DE MASCOTAS ---
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("perro"); 
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [notas, setNotas] = useState("");
  const [tamano, setTamano] = useState("");
  const [etiquetas, setEtiquetas] = useState("");
  const [comportamiento, setComportamiento] = useState("");
  const [alergias, setAlergias] = useState("");
  const [medicacion, setMedicacion] = useState("");
  const [foto, setFoto] = useState("");

    //  edición (METODO PATCH DESDE EL BACKEND)
  const [editandoId, setEditandoId] = useState(null);

  const fetchDatos = async () => {
      try {
        setCargando(true);

        const profileData = await getUserProfile();
        setPerfilUsuario(profileData);
        
        const petsData = await getMyPets();
        setMascotas(petsData);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      } finally {
        setCargando(false);
      }
    };

  useEffect(() => {    
    fetchDatos();
  }, []);

  // --- ACCIONES DEL CRUD DE MASCOTAS ---
   const handleGuardarMascota = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return alert("El nombre es obligatorio");

    const petData = {
      name: nombre,
      species: tipo,
      breed: raza,
      age: parseInt(edad) || null, 
      size: tamano,
      tags: etiquetas,
      behavior: comportamiento,
      allergies: alergias,
      medications: medicacion,
      special_notes: notas,
      photo: foto
    };

    if (editandoId !== null) {
      try{
        await updatePet(editandoId,petData);
        limpiarFormulario();
        setEditandoId(null)
        await fetchDatos();
        alert("Mascota actualizada correctamente")
      } catch (error){
        console.error("Error al actualizar la mascota:",error);
      }
    } else {
      // CREAR NUEVA MASCOTA (Conectado al backend)
      try {
        const petData = {
          name: nombre,
          species: tipo,
          breed: raza,
          age: parseInt(edad) || null, 
          special_notes: notas
        };
        
        const nuevaMascota = await createPet(petData);
        setMascotas([...mascotas, nuevaMascota.pet]);
        alert("Mascota registrada con éxito");
        limpiarFormulario();
      } catch (error) {
        alert("Error al registrar mascota");
        console.error(error);
      }
    }
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
      try{
        await deletePet(id);
        await fetchDatos();
      }catch (error){
        console.error("Error al eliminar la mascota:",error);
      }
    }
  };

  const handleIniciarEditar = (mascota) => {
    setEditandoId(mascota.id);
    setNombre(mascota.name); 
    setTipo(mascota.species);
    setRaza(mascota.breed || "");
    setEdad(mascota.age ? mascota.age.toString() : "");
    setNotas(mascota.special_notes || "");
    setTamano(mascota.size || "");
    setEtiquetas(mascota.tags || "");
    setComportamiento(mascota.behavior || "");
    setAlergias(mascota.allergies || "");
    setMedicacion(mascota.medications || "");
    setFoto(mascota.photo || "");
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombre("");
    setTipo("perro");
    setRaza("");
    setEdad("");
    setNotas("");
    setTamano("");
    setEtiquetas("");
    setComportamiento("");
    setAlergias("");
    setMedicacion("");
    setFoto("");
  };

  // Pantalla de carga mientras trae datos
  if (cargando) return <div className="min-h-screen flex items-center justify-center">Cargando perfil...</div>;

  // Si no hay perfil, probablemente el token expiró o no está logueado
  if (!perfilUsuario || !perfilUsuario.owner_profile) {
    return <div className="text-center p-10">No se pudo cargar el perfil del dueño. Inicia sesión.</div>;
  }

  const owner = perfilUsuario.owner_profile;

  return (
    <div className="min-h-screen bg-[#F0F7F7] font-sans antialiased text-[#2D3748] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Encabezado Principal */}
        <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#EADBCE] shadow-sm">
          <h1 className="text-2xl font-extrabold text-[#1A202C]">Perfil de Dueño</h1>
          <p className="text-sm text-gray-500">Administra tus datos de contacto personales y los perfiles de tus mascotas vinculadas.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA: Información del Dueño REAL */}
          <div className="lg:col-span-4 bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-6 shadow-sm space-y-6 sticky top-6">
            <div className="text-center space-y-3">
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-[#6338CC] shadow-sm">
                <img 
                  src={owner.profile_pic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"} 
                  alt={owner.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1A202C]">{owner.name}</h2>
                <p className="text-xs text-gray-500 font-medium">📍 Miembro desde {new Date(owner.created_at).getFullYear()}</p>
              </div>
            </div>

            <div className="border-t border-[#EADBCE]/60 pt-4 space-y-3 text-xs font-medium">
              <h3 className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Información de contacto</h3>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">📧 <span className="text-gray-900">{perfilUsuario.user.email}</span></p>
                <p className="flex items-center gap-2">📱 <span className="text-gray-900">{owner.phone || "No registrado"}</span></p>
                <p className="flex items-center gap-2">🏠 <span className="text-gray-900">{owner.city || "No registrado"}</span></p>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Gestión de Mascotas REAL */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Lista de Mascotas Obtenidas de la BD */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#1A202C] flex items-center gap-2">
                🐾 Mis Mascotas Vinculadas <span className="text-xs bg-[#7FE3D8] text-[#004D44] px-2.5 py-0.5 rounded-full font-bold">{mascotas.length}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mascotas.map((mascota) => (
                  <div key={mascota.id} className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-4 flex flex-col justify-between shadow-sm relative overflow-hidden hover:shadow-md transition">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-[#1A202C]">{mascota.name}</h3>
                          <span className="bg-[#7FE3D8]/40 text-[#004D44] text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-[#7FE3D8]">
                            {mascota.species}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">{mascota.breed || 'Sin raza'} • {mascota.age ? `${mascota.age} años` : 'Edad no especificada'}</p>
                      </div>

                      <p className="text-xs text-gray-600 italic bg-[#EFE9E2]/60 p-2.5 rounded-lg border border-[#EADBCE]/30 line-clamp-2">
                        "{mascota.special_notes || 'Sin notas especiales'}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#EADBCE]/60">
                      <button onClick={() => handleIniciarEditar(mascota)} className="bg-white hover:bg-[#EFE9E2] text-gray-700 font-bold text-xs py-2 px-3 rounded-xl border border-[#EADBCE] transition">
                        ✏️ Editar
                      </button>
                      <button onClick={() => handleEliminar(mascota.id)} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-2 px-3 rounded-xl border border-red-200 transition">
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario Dinámico de Registro */}
            <div className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-6 shadow-sm space-y-4">
              <div>
                <h2 className="text-lg font-bold text-[#1A202C]">
                  {editandoId !== null ? "📝 Modificar Datos de Mascota" : "➕ Registrar Nueva Mascota"}
                </h2>
              </div>

              <form onSubmit={handleGuardarMascota} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nombre de la Mascota *</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Tipo de Mascota</label>
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]">
                       <option value="perro">🐶 Perro</option>
                       <option value="gato">🐱 Gato</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Tamaño</label>
                    <select value={tamano} onChange={(e) => setTamano(e.target.value)} className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]">
                       <option value="">Seleccionar...</option>
                       <option value="pequeño">Pequeño (0-10kg)</option>
                       <option value="mediano">Mediano (10-25kg)</option>
                       <option value="grande">Grande (+25kg)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Raza</label>
                    <input type="text" value={raza} onChange={(e) => setRaza(e.target.value)} className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Edad (Años)</label>
                    <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Etiquetas (Ej. tranquilo, activo)</label>
                  <input type="text" value={etiquetas} onChange={(e) => setEtiquetas(e.target.value)} className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Foto URL (opcional)</label>
                  <input type="text" value={foto} onChange={(e) => setFoto(e.target.value)} placeholder="https://..." className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Comportamiento</label>
                    <textarea rows="2" value={comportamiento} onChange={(e) => setComportamiento(e.target.value)} className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm focus:outline-none focus:border-[#6338CC] resize-none"></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Alergias</label>
                    <textarea rows="2" value={alergias} onChange={(e) => setAlergias(e.target.value)} className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm focus:outline-none focus:border-[#6338CC] resize-none"></textarea>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Medicación</label>
                    <textarea rows="2" value={medicacion} onChange={(e) => setMedicacion(e.target.value)} className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm focus:outline-none focus:border-[#6338CC] resize-none"></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Notas especiales</label>
                    <textarea rows="2" value={notas} onChange={(e) => setNotas(e.target.value)} className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm focus:outline-none focus:border-[#6338CC] resize-none"></textarea>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {editandoId !== null && (
                    <button type="button" onClick={limpiarFormulario} className="w-1/3 bg-white text-gray-700 py-3 rounded-xl border border-[#EADBCE]">Cancelar</button>
                  )}
                  <button type="submit" className={`bg-[#6338CC] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm ${editandoId !== null ? "w-2/3" : "w-full"}`}>
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