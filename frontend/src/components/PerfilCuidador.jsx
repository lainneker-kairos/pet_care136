"use client";

import React, { useState, useEffect } from "react";
import {
  getUserProfile,
  createPetsitterProfile,
  updatePetsitterProfile
} from "../Services/api";
import Link from "next/link";

export default function PerfilCuidador() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false); // Estado para controlar la carga de la imagen

  // --- FORMULARIOS DE REGISTRO / EDICIÓN ---
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    neighborhood: "",
    bio: "",
    experience_years: 0,
    price_per_hour: 10,
    price_per_night: 25,
    offers_walk: false,
    offers_hotel: false,
    offers_daycare: false,
    offers_nightcare: false,
    available_days: "Lunes, Martes, Miércoles, Jueves, Viernes, Sábado",
    accepted_dog_sizes: "Pequeño, Mediano",
    profile_pic: "" // Añadido para almacenar la URL de Cloudinary
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data);
      if (data && data.petsitter_profile) {
        setFormData({
          name: data.petsitter_profile.name || "",
          phone: data.petsitter_profile.phone || "",
          city: data.petsitter_profile.city || "",
          neighborhood: data.petsitter_profile.neighborhood || "",
          bio: data.petsitter_profile.bio || "",
          experience_years: data.petsitter_profile.experience_years || 0,
          price_per_hour: data.petsitter_profile.price_per_hour || 10,
          price_per_night: data.petsitter_profile.price_per_night || 25,
          offers_walk: data.petsitter_profile.offers_walk || false,
          offers_hotel: data.petsitter_profile.offers_hotel || false,
          offers_daycare: data.petsitter_profile.offers_daycare || false,
          offers_nightcare: data.petsitter_profile.offers_nightcare || false,
          available_days: data.petsitter_profile.available_days || "",
          accepted_dog_sizes: data.petsitter_profile.accepted_dog_sizes || "",
          profile_pic: data.petsitter_profile.profile_pic || ""
        });
      }
    } catch (error) {
      console.error("Error al obtener perfil de cuidador:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    setIsMounted(true);
  }, []);

  // --- FUNCIÓN DE CONTROL DE ARCHIVOS PARA CLOUDINARY ---
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "petcare_preset"); // Tu preset Unsigned verificado

    setSubiendoFoto(true);
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/ufpvylnw/image/upload", // Tu Cloud Name verificado
        { method: "POST", body: data }
      );

      const fileData = await res.json();

      if (res.ok && fileData.secure_url) {
        setFormData((prev) => ({
          ...prev,
          profile_pic: fileData.secure_url
        }));
        toast.success("¡Imagen subida con éxito! Recuerda guardar los cambios del perfil.");
      } else {
        console.error("Error en respuesta de Cloudinary:", fileData);
        toast.error(`Error de Cloudinary: ${fileData.error?.message || "No autorizado"}`);
      }
    } catch (error) {
      console.error("Error en la petición de red a Cloudinary:", error);
      toast.error("Error de conexión al intentar subir la imagen");
    } finally {
      setSubiendoFoto(false);
    }
  };

  if (!isMounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F7F7]">
        Cargando tu perfil de Cuidador...
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleRegisterPetsitter = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createPetsitterProfile(formData);
      toast.success("¡Felicidades! Ahora tienes un perfil de cuidador.");
      await fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar perfil de cuidador");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePetsitter = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updatePetsitterProfile(formData);
      setIsEditing(false);
      toast.success("Perfil de cuidador actualizado con éxito");
      await fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar perfil de cuidador");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="text-center p-10 bg-[#F0F7F7] min-h-screen">
        <p className="text-gray-700 font-bold">Por favor, inicia sesión para acceder a esta sección.</p>
      </div>
    );
  }

  // --- CASO 1: EL USUARIO AÚN NO ES CUIDADOR (Habilitar perfil) ---
  if (!profile.petsitter_profile) {
    return (
      <div className="min-h-screen bg-[#F0F7F7] font-sans antialiased text-[#2D3748] py-12 px-4">
        <div className="max-w-2xl mx-auto bg-[#FAF6F0] rounded-3xl p-8 border border-[#EADBCE] shadow-lg space-y-6">

          <div className="text-center space-y-2">
            <span className="text-4xl">🐾</span>
            <h1 className="text-3xl font-extrabold text-purple-700">¡Conviértete en Cuidador!</h1>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Gana dinero haciendo lo que más te apasiona: pasar tiempo con adorables mascotas. Completa tus datos profesionales para empezar.
            </p>
          </div>

          <form onSubmit={handleRegisterPetsitter} className="space-y-4">
            
            {/* Sección Avatar Interactiva para el registro inicial */}
            <div className="flex flex-col items-center space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Foto de Perfil Profesional</label>
              <div className="w-28 h-28 relative group cursor-pointer">
                <label htmlFor="foto-cuidador-register" className="w-full h-full block rounded-full overflow-hidden border-2 border-purple-700 shadow-sm cursor-pointer">
                  <img
                    src={formData.profile_pic || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"}
                    alt="Previsualización"
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40 rounded-full text-white text-[10px] font-semibold">
                    {subiendoFoto ? "Cargando..." : "Subir foto"}
                  </div>
                </label>
                <input
                  id="foto-cuidador-register"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={subiendoFoto}
                  className="hidden"
                />
              </div>
              {subiendoFoto && <p className="text-[10px] text-purple-600 font-bold">Subiendo a Cloudinary...</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nombre Completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || profile.owner_profile?.name || ""}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-[#EADBCE] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6338CC]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Teléfono de contacto</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || profile.owner_profile?.phone || ""}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-[#EADBCE] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6338CC]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Ciudad</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || profile.owner_profile?.city || ""}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-[#EADBCE] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6338CC]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Barrio</label>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood || profile.owner_profile?.neighborhood || ""}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#EADBCE] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6338CC]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Precio paseo por Hora (€)</label>
                <input
                  type="number"
                  name="price_per_hour"
                  value={formData.price_per_hour}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#EADBCE] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6338CC]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Precio hotel por Noche (€)</label>
                <input
                  type="number"
                  name="price_per_night"
                  value={formData.price_per_night}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#EADBCE] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6338CC]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Años de experiencia</label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                className="w-full bg-white border border-[#EADBCE] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6338CC]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Preséntate a la comunidad (Biografía profesional)</label>
              <textarea
                rows="4"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
                className="w-full bg-white border border-[#EADBCE] rounded-xl p-4 text-sm focus:outline-none focus:border-[#6338CC] resize-none"
                placeholder="Cuéntanos sobre tu amor por los animales, habilidades específicas y rutinas de cuidado..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6338CC] hover:bg-[#522cb3] text-white font-bold py-4 rounded-xl transition duration-200 shadow-md"
            >
              🚀 Crear mi perfil de Cuidador
            </button>

          </form>
        </div>
      </div>
    );
  }

  // --- CASO 2: EL USUARIO YA ES CUIDADOR (Visualizar/Editar datos) ---
  const caregiver = profile.petsitter_profile;

  return (
    <div className="min-h-screen bg-[#F0F7F7] font-sans antialiased text-[#2D3748]">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Encabezado Principal */}
        <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#EADBCE] shadow-sm">
          <h1 className="text-2xl font-extrabold text-purple-700">Mi Perfil de Cuidador</h1>
          <p className="text-sm text-gray-500">
            Administra tus datos de contacto personales y profesionales de tu actividad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">

          {/* COLUMNA IZQUIERDA: Información del Cuidador */}
          <div className="lg:col-span-2 space-y-6">

            {/* Tarjeta de Perfil Principal */}
            <div className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE] flex flex-col md:flex-row gap-6 items-center md:items-start">

              {/* Contenedor interactivo del Avatar con soporte Cloudinary */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden flex-shrink-0 bg-amber-200 group cursor-pointer">
                <label htmlFor="foto-cuidador-dashboard" className="w-full h-full block cursor-pointer">
                  <img
                    src={formData.profile_pic || caregiver.profile_pic || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"}
                    alt={caregiver.name}
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40 text-white text-xs font-semibold">
                    {subiendoFoto ? "Cargando..." : "Cambiar foto"}
                  </div>
                </label>
                <input
                  id="foto-cuidador-dashboard"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={subiendoFoto}
                  className="hidden"
                />
                <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#00A896] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap">
                  ✓ Verificado
                </span>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4 w-full">
                <div>
                  <h1 className="text-3xl font-bold text-[#1A202C]">{caregiver.name}</h1>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center text-[#00A896] font-medium">
                      ★ {caregiver.rating || "5.0"} <span className="text-gray-500 font-normal ml-1">({caregiver.booking_count || 0} reservas)</span>
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1">📍 {caregiver.neighborhood ? `${caregiver.neighborhood}, ` : ""}{caregiver.city}</span>
                  </div>
                  {subiendoFoto && <p className="text-xs text-purple-600 font-bold mt-1 text-center md:text-left">Subiendo nueva imagen...</p>}
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#EFE9E2] p-3 rounded-xl text-center">
                  <div>
                    <p className="text-xl font-bold text-[#6338CC]">{caregiver.booking_count || 0}</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Reservas</p>
                  </div>
                  <div className="border-x border-gray-300">
                    <p className="text-xl font-bold text-[#6338CC]">{caregiver.experience_years} {caregiver.experience_years === 1 ? 'Año' : 'Años'}</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Exp.</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#6338CC]">Disponible</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Calendario</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de Edición o Sección Sobre Mí */}
            {!isEditing ? (
              <div className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE] space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#1A202C]">Mi Biografía Profesional</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm font-semibold text-purple-700 hover:underline"
                  >
                    ✏️ Editar Perfil Cuidador
                  </button>
                </div>

                <p className="text-gray-700 leading-relaxed text-sm">
                  {caregiver.bio || "No has agregado una descripción todavía. Haz clic en 'Editar Perfil' para añadir detalles sobre tus cuidados de mascotas."}
                </p>

                <div className="border-t border-[#EADBCE]/50 pt-4 space-y-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase">Habilidades y Preferencias</h3>
                  <div className="flex flex-wrap gap-2">
                    {caregiver.accepted_dog_sizes && (
                      <span className="bg-[#7FE3D8] text-[#004D44] text-xs font-semibold px-3 py-1.5 rounded-full">
                        Tamaños: {caregiver.accepted_dog_sizes}
                      </span>
                    )}
                    {caregiver.certifications && (
                      <span className="bg-[#7FE3D8] text-[#004D44] text-xs font-semibold px-3 py-1.5 rounded-full">
                        {caregiver.certifications}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdatePetsitter} className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE] space-y-4">
                <h2 className="text-xl font-bold text-[#1A202C]">Editar Información de Cuidador</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Nombre Profesional</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Teléfono</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Ciudad</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Barrio</label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Tarifa Paseo / Hora (€)</label>
                    <input
                      type="number"
                      name="price_per_hour"
                      value={formData.price_per_hour}
                      onChange={handleChange}
                      className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Tarifa Hotel / Noche (€)</label>
                    <input
                      type="number"
                      name="price_per_night"
                      value={formData.price_per_night}
                      onChange={handleChange}
                      className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Años de Experiencia</label>
                  <input
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6338CC]"
                  />
                </div>

                <div className="space-y-2 border-t border-[#EADBCE]/50 pt-3">
                  <span className="text-xs font-bold text-gray-500 uppercase block">Servicios Ofrecidos</span>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        name="offers_walk"
                        checked={formData.offers_walk}
                        onChange={handleChange}
                        className="rounded text-[#6338CC] focus:ring-[#6338CC]"
                      />
                      🚶 Ofrecer Paseos
                    </label>

                    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        name="offers_hotel"
                        checked={formData.offers_hotel}
                        onChange={handleChange}
                        className="rounded text-[#6338CC] focus:ring-[#6338CC]"
                      />
                      🏠 Ofrecer Hotel / Alojamiento
                    </label>

                    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        name="offers_daycare"
                        checked={formData.offers_daycare}
                        onChange={handleChange}
                        className="rounded text-[#6338CC] focus:ring-[#6338CC]"
                      />
                      🐾 Ofrecer Guardería Diurna
                    </label>

                    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        name="offers_nightcare"
                        checked={formData.offers_nightcare}
                        onChange={handleChange}
                        className="rounded text-[#6338CC] focus:ring-[#6338CC]"
                      />
                      🌙 Ofrecer Cuidado Nocturno
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Biografía profesional</label>
                  <textarea
                    rows="3"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#EADBCE] rounded-xl p-3 text-sm focus:outline-none focus:border-[#6338CC] resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-1/2 bg-white text-gray-700 py-2 rounded-xl border border-[#EADBCE] text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-[#6338CC] text-white py-2 rounded-xl text-xs font-bold shadow-sm"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            )}

            <div className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE] space-y-4">
              <h2 className="text-lg font-bold text-[#1A202C]">Ubicación del Cuidador</h2>
              <div className="w-full h-48 bg-[#EFE9E2] rounded-xl flex items-center justify-center border border-[#EADBCE]">
                <p className="text-gray-500 text-sm">
                  {caregiver.neighborhood}, {caregiver.city}
                  <br />
                  <span className="text-xs italic">(Aquí irá el mapa de Google Maps)</span>
                </p>
              </div>
            </div>

            <div className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE] space-y-4">
              <h2 className="text-lg font-bold text-[#1A202C]">Disponibilidad en Calendario</h2>
              <p className="text-sm text-gray-600">
                Sincroniza tu calendario para recibir reservas automáticas.
              </p>
              <button className="w-full bg-[#4285F4] text-white font-bold py-3 rounded-xl shadow-md hover:bg-[#357ae8] transition">
                📅 Sincronizar con Google Calendar
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: Servicios, Precios y Disponibilidad */}
          <div className="space-y-6">
            <div className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE] space-y-4">
              <h2 className="text-lg font-bold text-[#1A202C]">Mis Servicios y Tarifas</h2>
              <div className="space-y-3">
                {caregiver.offers_walk && (
                  <div className="flex justify-between items-center bg-[#EFE9E2] p-3 rounded-xl">
                    <span className="flex items-center gap-2 text-sm font-medium">🚶 Paseo de Perros</span>
                    <span className="font-bold text-[#6338CC] text-sm">{caregiver.price_per_hour} €/hr</span>
                  </div>
                )}
                {caregiver.offers_daycare && (
                  <div className="flex justify-between items-center bg-[#EFE9E2] p-3 rounded-xl">
                    <span className="flex items-center gap-2 text-sm font-medium">🐾 Guardería Diurna</span>
                    <span className="font-bold text-[#6338CC] text-sm">{caregiver.price_per_hour} €/día</span>
                  </div>
                )}
                {caregiver.offers_hotel && (
                  <div className="flex justify-between items-center bg-[#EFE9E2] p-3 rounded-xl">
                    <span className="flex items-center gap-2 text-sm font-medium">🏠 Alojamiento Completo</span>
                    <span className="font-bold text-[#6338CC] text-sm">{caregiver.price_per_night} €/noche</span>
                  </div>
                )}
                {caregiver.offers_nightcare && (
                  <div className="flex justify-between items-center bg-[#EFE9E2] p-3 rounded-xl">
                    <span className="flex items-center gap-2 text-sm font-medium">🌙 Cuidado Nocturno</span>
                    <span className="font-bold text-[#6338CC] text-sm">{caregiver.price_per_night} €/noche</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-purple-700 hover:bg-[#522cb3] text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md"
              >
                ⚙️ Configurar Mis Tarifas
              </button>
              <button className="w-full bg-[#6338CC] hover:bg-[#522cb3] text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-md">
               <Link 
               href="/misreservas">
                Ver Mis Reservas
                </Link>
              </button>
            </div>

            <div className="bg-[#FAF6F0] rounded-2xl p-6 shadow-sm border border-[#EADBCE] space-y-4">
              <h2 className="text-md font-bold text-[#1A202C]">Disponibilidad Semanal</h2>
              <div className="text-xs text-gray-700 space-y-1">
                <p>🗓️ <span className="font-bold text-[#6338CC]">Días disponibles:</span></p>
                <p className="bg-[#EFE9E2] p-2.5 rounded-lg border border-[#EADBCE]/40 font-semibold">
                  {caregiver.available_days || "No especificado"}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}