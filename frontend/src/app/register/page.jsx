"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/user/register', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers:{
          "Content-Type":"application/json" 
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Registro exitoso! Serás redirigido al login.");
        router.push("/login");
      } else {
        alert(data.msg || "Ocurrió un error en el registro");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#09090b] to-[#0f170d]/90 overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purpple-500/60 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-4">
        <div className="absolute top-[-30px] left-4 text-white font-semibold text-sm tracking-wider opacity-60">
          Logo
        </div>

        <div className="w-full bg-white/[0.001] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.7)] rounded-3xl p-8 sm:p-10 transition-all duration-300">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Crear cuenta
            </h1>
            <p className="text-gray-400 text-sm mt-2 font-medium">
              Ingresa tus datos para registrarte en PetCare
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Nombre"
                className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 ${
                  errors.username 
                    ? "border border-red-500/50 focus:ring-red-500/30 focus:border-red-500/90" 
                    : "border border-white/[0.08] focus:ring-purple-500/30 focus:border-purple-900/50"
                }`}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Correo electrónico
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="correo@ejemplo.com"
                className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 ${
                  errors.email 
                    ? "border border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50" 
                    : "border border-white/[0.08] focus:ring-purple-500/30 focus:border-purple-900/50"
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200 pr-10 disabled:opacity-50 ${
                    errors.password 
                      ? "border border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50" 
                      : "border border-white/[0.08] focus:ring-purple-500/30 focus:border-purple-900/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-150"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200 pr-10 disabled:opacity-50 ${
                    errors.confirmPassword 
                      ? "border border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50" 
                      : "border border-white/[0.08] focus:ring-purple-500/30 focus:border-purple-900/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-150"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            <button
        type="submit"
        disabled={isLoading}
        className="group w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-white hover:bg-neutral-100 text-black font-semibold rounded-xl transition-all duration-300 shadow-lg active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed mt-6 border border-transparent hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creando cuenta...
          </>
        ) : (
          <>
            <span>Registrarse</span>
            <img 
              src="/huella.svg" 
              alt="Huella" 
              className="w-5 h-5 opacity-90 transition-transform duration-200 group-hover:scale-110" 
            />
          </>
        )}
      </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-400 text-xs">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/login"
                className="text-white hover:underline font-semibold ml-1 transition-all duration-150"
              >
                Iniciar sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}