"use client"; // <--- REGLA DE NEXT.JS: Fundamental para usar useState y subida de archivos

import { useState } from "react";

export default function EditarPerfil() {
  // 1. Estados del formulario bien definidos
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    profile_pic: "" // Aquí se guardará la URL final de Cloudinary
  });
  
  const [loading, setLoading] = useState(false);

  // 2. Función de control para el envío del formulario de texto
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos listos para enviar al backend de Flask:", formData);
    // Aquí puedes añadir tu llamada fetch hacia Flask para guardar en la base de datos
  };

  // 3. Función que sube la imagen a Cloudinary en tiempo real
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "petcare_preset"); // Tu preset en modo Unsigned

    try {
      setLoading(true); // Activamos el estado de carga usando tu variable 'loading'

      // Enviamos la petición usando tu cloud name real
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/ufpvylnw/image/upload",
        { method: "POST", body: data }
      );
      
      const fileData = await res.json(); // Consolidamos la variable como 'fileData'
      
      if (res.ok) {
        // ✅ Guardamos la URL devuelta en tu estado 'formData'
        console.log("¡Foto subida con éxito! URL:", fileData.secure_url);
        
        setFormData({
          ...formData,
          profile_pic: fileData.secure_url
        });
        
      } else {
        // ❌ Error controlado si Cloudinary rechaza la petición
        alert("Error de Cloudinary: " + fileData.error.message);
      }
    } catch (error) {
      console.error("Error de red al conectar con Cloudinary:", error);
    } finally {
      setLoading(false); // Desactivamos el estado de carga
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Editar Perfil (Owner / Petsitter)</h1>

      {/* Input para la foto */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileChange} 
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {loading && <p className="text-sm text-blue-500 mt-1">Subiendo imagen...</p>}
        
        {/* Vista previa de la foto si ya se subió con éxito */}
        {formData.profile_pic && (
          <img 
            src={formData.profile_pic} 
            alt="Vista previa" 
            className="mt-2 w-24 h-24 rounded-full object-cover border"
          />
        )}
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
        Guardar Cambios
      </button>
    </form>
  );
}