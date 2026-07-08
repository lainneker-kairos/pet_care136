
import React, { useState, useEffect } from "react";
import {
  getUserProfile,
  updateOwnerProfile,
  getMyPets,
  createPet,
  updatePet,
  deletePet
} from "../Services/api";
import Link from "next/link";
import { toast } from "sonner";

export default function PerfilDueno() {
  // --- ESTADOS PARA DATOS REALES ---
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- ESTADOS DE EDICIÓN DEL DUEÑO ---
  const [editandoOwner, setEditandoOwner] = useState(false);
  const [ownerForm, setOwnerForm] = useState({
    name: "",
    phone: "",
    city: "",
    neighborhood: "",
    bio: "",
    max_budget: ""
  });

  const [subiendoFoto, setSubiendoFoto] = useState(false);

  // --- ESTADOS DEL FORMULARIO DE MASCOTAS ---
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

  // Estado para controlar qué mascota estamos editando (null si es creación)
  const [editandoId, setEditandoId] = useState(null);

  // --- NUEVOS ESTADOS Y FUNCIONES PARA CLOUDINARY ---
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    data.append("file", files[0]);

    // ✅ CORREGIDO: Aquí va el nombre de tu preset ("petcare_preset")
    data.append("upload_preset", "petcare_preset");

    setSubiendoFoto(true);
    try {
      const res = await fetch(
        // ✅ CORREGIDO: Aquí va tu cloud name real ("ufpvylnw") en la URL
        "https://api.cloudinary.com/v1_1/ufpvylnw/image/upload",
        { method: "POST", body: data }
      );

      const file = await res.json();

      if (res.ok && file.secure_url) {
        setOwnerForm(prev => ({
          ...prev,
          profile_pic: file.secure_url
        }));
        toast.success("¡Imagen subida a Cloudinary con éxito! Recuerda hacer clic en 'Guardar' para actualizar tu perfil.");
      } else {
        console.error("Error detallado de Cloudinary:", file);
        toast.error(`Error de Cloudinary: ${file.error?.message || 'No autorizado'}`);
      }
    } catch (error) {
      console.error("Error en la petición de red:", error);
      toast.error("Error de conexión al intentar subir la imagen");
    } finally {
      setSubiendoFoto(false);
    }
  };

  // Función para obtener todos los datos frescos del backend
  const fetchDatos = async () => {
    try {
      setCargando(true);
      const profileData = await getUserProfile();
      setPerfilUsuario(profileData);

      if (profileData && profileData.owner_profile) {
        setOwnerForm({
          name: profileData.owner_profile.name || "",
          phone: profileData.owner_profile.phone || "",
          city: profileData.owner_profile.city || "",
          neighborhood: profileData.owner_profile.neighborhood || "",
          bio: profileData.owner_profile.bio || "",
          max_budget: profileData.owner_profile.max_budget || ""
        });
      }

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

  // --- ACCIÓN PARA GUARDAR/ACTUALIZAR DUEÑO ---
  const handleGuardarOwner = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...ownerForm,
        max_budget: ownerForm.max_budget ? parseFloat(ownerForm.max_budget) : null
      };
      await updateOwnerProfile(dataToSend);
      setEditandoOwner(false);
      await fetchDatos();
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar dueño:", error);
      toast.error("Error al actualizar el perfil");
    }
  };

  // --- ACCIONES DEL CRUD DE MASCOTAS ---
  const handleGuardarMascota = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

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

    if (editandoId !== null && editandoId !== "nuevo") {
      try {
        await updatePet(editandoId, petData);
        limpiarFormulario();
        setEditandoId(null)
        await fetchDatos();
        toast.success("Mascota actualizada correctamente")
      } catch (error) {
        console.error("Error al actualizar la mascota:", error);
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
        toast.success("Mascota registrada con éxito");
        limpiarFormulario();
      } catch (error) {
        toast.error("Error al registrar mascota");
        console.error(error);
      }
    }
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
      try {
        await deletePet(id);
        await fetchDatos();
        toast.success("Mascota eliminada");
      } catch (error) {
        console.error("Error al eliminar la mascota:", error);
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

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F7F7]">
        Cargando tu perfil de PetCare...
      </div>
    );
  }

  if (!perfilUsuario || !perfilUsuario.owner_profile) {
    return (
      <div className="text-center p-10 bg-[#F0F7F7] min-h-screen text-gray-700">
        No se pudo cargar el perfil del dueño. Por favor, inicia sesión.
      </div>
    );
  }

  const owner = perfilUsuario.owner_profile;

  return (
    <div className="min-h-screen bg-[#F0F7F7] font-sans antialiased text-[#2D3748] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Encabezado */}
        <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#EADBCE] shadow-sm">
          <h1 className="text-2xl font-extrabold text-purple-700">Mi Perfil de Dueño</h1>
          <p className="text-sm text-gray-500">Administra tus datos y los perfiles de tus mascotas.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-4 bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-6 shadow-sm space-y-6 sticky top-6">
            <div className="text-center space-y-3">
              <div className="w-28 h-28 mx-auto relative group cursor-pointer">
                <label htmlFor="foto-upload" className="w-full h-full block rounded-full overflow-hidden border-2 border-[#6338CC] shadow-sm">
                  <img
                    src={ownerForm.profile_pic || owner.profile_pic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"}
                    alt={owner.name}
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40 rounded-full text-white text-[10px] font-semibold">
                    {subiendoFoto ? "Cargando..." : "Cambiar foto"}
                  </div>
                </label>
                <input id="foto-upload" type="file" accept="image/*" onChange={handleFileChange} disabled={subiendoFoto} className="hidden" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1A202C]">{owner.name}</h2>
                <p className="text-xs text-gray-500 font-medium">📍 Miembro desde {new Date(owner.created_at).getFullYear()}</p>
                {subiendoFoto && <p className="text-[10px] text-purple-600 font-bold mt-1">Subiendo foto...</p>}
              </div>
            </div>

            {!editandoOwner ? (
              <div className="space-y-4">
                <div className="border-t border-[#EADBCE]/60 pt-4 space-y-2 text-xs font-medium">
                  <h3 className="font-bold text-[#6338CC] uppercase tracking-wider text-[10px]">Información de contacto</h3>
                  <div className="space-y-2 text-gray-700">
                    <p>📧 <span className="text-gray-950">{perfilUsuario.user.email}</span></p>
                    <p>📱 <span className="text-gray-950">{owner.phone || "No registrado"}</span></p>
                    <p>🌆 <span className="text-gray-950">{owner.city || "No registrada"}</span></p>
                    <p>🏡 <span className="text-gray-950">{owner.neighborhood || "No registrado"}</span></p>
                    <p>💰 <span className="text-gray-950">{owner.max_budget ? `${owner.max_budget} €` : "No especificado"}</span></p>
                  </div>
                </div>

                {owner.bio && (
                  <div className="border-t border-[#EADBCE]/60 pt-4">
                    <h3 className="font-bold text-[#6338CC] uppercase tracking-wider text-[10px] mb-2">Sobre mí</h3>
                    <p className="text-xs text-gray-600 italic leading-relaxed">"{owner.bio}"</p>
                  </div>
                )}

                <button onClick={() => setEditandoOwner(true)} className="w-full bg-white hover:bg-[#EFE9E2] text-gray-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-[#EADBCE] transition shadow-sm">
                  ✏️ Editar Perfil Personal
                </button>
                <Link href="/misreservas" className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md">
                  📋 Mis Reservas
                </Link>
                <Link
                  href="/perfil-cuidador"
                  className="w-full bg-[#00A896] hover:bg-[#008f80] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md">
                  🐾 Convertirse en Cuidador
                </Link>
              </div>
            ) : (
              <form onSubmit={handleGuardarOwner} className="space-y-4 pt-4 border-t border-[#EADBCE]/60">
                <h3 className="font-bold text-[#6338CC] uppercase tracking-wider text-[10px]">Editar Datos Personales</h3>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Nombre</label>
                  <input type="text" value={ownerForm.name} onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })} required className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#6338CC]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Teléfono</label>
                  <input type="text" value={ownerForm.phone} onChange={(e) => setOwnerForm({ ...ownerForm, phone: e.target.value })} className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#6338CC]" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Ciudad</label>
                    <input type="text" value={ownerForm.city} onChange={(e) => setOwnerForm({ ...ownerForm, city: e.target.value })} className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#6338CC]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Barrio</label>
                    <input type="text" value={ownerForm.neighborhood} onChange={(e) => setOwnerForm({ ...ownerForm, neighborhood: e.target.value })} className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#6338CC]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Presupuesto Máximo (€)</label>
                  <input type="number" value={ownerForm.max_budget} onChange={(e) => setOwnerForm({ ...ownerForm, max_budget: e.target.value })} className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#6338CC]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Biografía corta</label>
                  <textarea rows="3" value={ownerForm.bio} onChange={(e) => setOwnerForm({ ...ownerForm, bio: e.target.value })} className="w-full bg-white border border-[#EADBCE] rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#6338CC] resize-none" />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditandoOwner(false)} className="w-1/2 bg-white text-gray-700 py-2 rounded-xl border border-[#EADBCE] text-xs font-bold">Cancelar</button>
                  <button type="submit" className="w-1/2 bg-[#6338CC] text-white py-2 rounded-xl text-xs font-bold shadow-sm">Guardar</button>
                </div>
              </form>
            )}
          </div>

          {/* COLUMNA DERECHA */}
          <div className="lg:col-span-8 space-y-6">

            {/* Encabezado mascotas */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#1A202C] flex items-center gap-2">
                🐾 Mis Mascotas
                <span className="text-xs bg-[#7FE3D8] text-[#004D44] px-2.5 py-0.5 rounded-full font-bold">{mascotas.length}</span>
              </h2>
              <button
                onClick={() => { limpiarFormulario(); setEditandoId("nuevo"); }}
                className="bg-[#6338CC] hover:bg-[#522cb3] text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
              >
                ➕ Añadir mascota
              </button>
            </div>

            {/* Tarjetas de mascotas */}
            {mascotas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mascotas.map((mascota) => (
                  <div key={mascota.id} className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] shadow-sm overflow-hidden hover:shadow-md transition">

                    {/* Foto de la mascota */}
                    <div className="w-full h-36 overflow-hidden bg-[#EFE9E2]">
                      <img
                        src={mascota.photo || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80"}
                        alt={mascota.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4 space-y-3">
                      {/* Nombre y tipo */}
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-[#1A202C]">{mascota.name}</h3>
                        <span className="bg-[#7FE3D8]/40 text-[#004D44] text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-[#7FE3D8]">
                          {mascota.species === "perro" ? "🐶 Perro" : "🐱 Gato"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{mascota.breed || "Sin raza"} • {mascota.age ? `${mascota.age} años` : "Edad no especificada"} {mascota.size ? `• ${mascota.size}` : ""}</p>

                      {/* Etiquetas */}
                      {mascota.tags && (
                        <div className="flex flex-wrap gap-1">
                          {mascota.tags.split(",").map((tag, i) => (
                            <span key={i} className="bg-purple-100 text-purple-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">{tag.trim()}</span>
                          ))}
                        </div>
                      )}

                      {/* Alertas médicas */}
                      {(mascota.allergies || mascota.medications) && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
                          <p className="text-[10px] font-bold text-amber-700 uppercase">⚠️ Alertas médicas</p>
                          {mascota.allergies && <p className="text-xs text-amber-800">Alergias: {mascota.allergies}</p>}
                          {mascota.medications && <p className="text-xs text-amber-800">Medicación: {mascota.medications}</p>}
                        </div>
                      )}

                      {/* Notas */}
                      {mascota.special_notes && (
                        <p className="text-xs text-gray-600 italic bg-[#EFE9E2]/60 p-2.5 rounded-lg border border-[#EADBCE]/30 line-clamp-2">
                          "{mascota.special_notes}"
                        </p>
                      )}

                      {/* Botones */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EADBCE]/60">
                        <button onClick={() => handleIniciarEditar(mascota)} className="bg-white hover:bg-[#EFE9E2] text-gray-700 font-bold text-xs py-2 px-3 rounded-xl border border-[#EADBCE] transition">✏️ Editar</button>
                        <button onClick={() => handleEliminar(mascota.id)} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-2 px-3 rounded-xl border border-red-200 transition">🗑️ Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-8 text-center">
                <p className="text-4xl">🐕</p>
                <p className="text-sm font-medium text-gray-600 mt-2">Aún no has registrado ninguna mascota.</p>
                <p className="text-xs text-gray-400 mt-1">Haz click en "Añadir mascota" para empezar.</p>
              </div>
            )}

            {/* Formulario — solo aparece cuando editandoId tiene valor */}
            {editandoId !== null && (
              <div className="bg-[#FAF6F0] rounded-2xl border border-[#EADBCE] p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-[#1A202C]">
                  {editandoId === "nuevo" ? "➕ Registrar Nueva Mascota" : "📝 Modificar Datos de Mascota"}
                </h2>

                <form onSubmit={handleGuardarMascota} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nombre *</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Tipo</label>
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
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Edad (años)</label>
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
                      <textarea rows="2" value={comportamiento} onChange={(e) => setComportamiento(e.target.value)} className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm focus:outline-none focus:border-[#6338CC] resize-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Alergias</label>
                      <textarea rows="2" value={alergias} onChange={(e) => setAlergias(e.target.value)} className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm focus:outline-none focus:border-[#6338CC] resize-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Medicación</label>
                      <textarea rows="2" value={medicacion} onChange={(e) => setMedicacion(e.target.value)} className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm focus:outline-none focus:border-[#6338CC] resize-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Notas especiales</label>
                      <textarea rows="2" value={notas} onChange={(e) => setNotas(e.target.value)} className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm focus:outline-none focus:border-[#6338CC] resize-none" />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={limpiarFormulario} className="w-1/3 bg-white text-gray-700 py-3 rounded-xl border border-[#EADBCE] font-bold text-xs">Cancelar</button>
                    <button type="submit" className="w-2/3 bg-[#6338CC] text-white font-bold py-3 px-4 rounded-xl shadow-sm hover:bg-[#522cb3] transition text-xs">
                      {editandoId === "nuevo" ? "➕ Registrar Mascota" : "💾 Guardar Cambios"}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}