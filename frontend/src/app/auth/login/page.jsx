"use client";
import { useState } from "react";
import { loginUser, resetPassword } from "@/Services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Estados extra para el diseño (mostrar/ocultar contraseñas)
  const [showPassword, setShowPassword] = useState(false);

  // función de validación exacta

  const validateForm = () => {
    const newErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // función de envío de formulario exactarte a JSON
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // lógica de registro real (API call)

      const data = await loginUser({ email: formData.email, password: formData.password });
      console.log("esto nos trae data", data);
      if (!data.user) {
        //esta validacion para mostrar el mensaje de error del backend o uno genérico y detener la ejecución
        toast.error(data.msg || data.error || data.message || "Credenciales inválidas. Verifica tu correo y contraseña.");
        return;
      }


      localStorage.setItem("TOKENJWT", data.token);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userId", data.user.id);

      setFormData({ email: "", password: "" });

      window.location.href = "/";


    } catch (error) {
      console.error("Error en el login:", error);
      toast.error("Ocurrió un error inesperado. Por favor, vuelve a intentarlo.");
      setIsLoading(false);
    }
  };


  // Manejador de cambios exacto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error al empezar a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // RESETEAR CONTRASEÑA
  const handleResetPassword = async () => {
    try {
      await resetPassword({ email: email, new_password: newPassword });
      toast.success("Contraseña reestablecida con éxito!")
      setShowModal(false)
      setEmail("")
      setNewPassword("")

    } catch (error) {
      toast.error(error.message || "Error al restablecer la contraseña")
    }
  }


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-green-600/20 overflow-hidden font-sans">

      {/* Luces de fondo de neón (ambiente detrás del vidrio) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[15%] w-96 h-96 bg-purple-400/50 rounded-full blur-[120px] pointer-events-none" />

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-md p-4">
        {/* Logo flotante */}
        <div className="absolute top-[-30px] left-2 text-white font-semibold text-sm tracking-wider opacity-80 z-30">
          <img
            src="/logo_petcare.svg"
            alt="Logo de PetCare"
            width={150}
            height={150}
            className="w-20 h-20"
          />
        </div>

        {/* Tarjeta Glassmorphism */}
        <div className="w-full bg-white/15 backdrop-blur-2xl border-2 border-white shadow-[0_25px_15px_0_rgba(0,0,0,0.3)] rounded-3xl p-8 sm:p-10 transition-all duration-300">

          {/* Cabecera */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-purple-800 tracking-tight drpop-shadow-lg">
              Iniciar sesión
            </h1>
            <p className="text-gray-700 text-sm mt-2 font-medium">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Campo: Correo electrónico */}
            <div>
              <label className="block text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2">
                Correo electrónico
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="correo@ejemplo.com"
                className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] text-black placeholder-black-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 ${errors.email
                  ? "border border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50"
                  : "border border-white focus:ring-green-500/70 focus:border-green-500/70"
                  }`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Campo: Contraseña */}
            <div>
              <label className="block text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2">
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
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 transition-all duration-200 pr-10 disabled:opacity-50 ${errors.password
                    ? "border border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50"
                    : "border border-white focus:ring-green-500/70 focus:border-green-500/70"
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

            {/* Botón de Entrar */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg active:scale-[0.70] disabled:opacity-75 disabled:cursor-not-allowed mt-6 border border-transparent hover:border-green-900/50 hover:shadow-[0_0_10px_rgba(34,197,94,0.5)]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <img
                    src="/huella.svg"
                    alt="Huella"
                    className="w-5 h-5 opacity-90 transition-transform duration-200 group-hover:scale-110"
                  />
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-600 mt-3">
              ¿Olvidaste tu contraseña?{" "}
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="text-purple-700 font-semibold hover:underline"
              >
                Restablécela aquí
              </button>
            </p>
          </form>

        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-purple-800">Restablecer contraseña</h2>

            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400" />

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400" />

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-1/2 bg-white text-gray-700 py-2 rounded-xl border border-gray-200 text-xs font-bold">
                Cancelar
              </button>
              <button
                onClick={handleResetPassword}
                className="w-1/2 bg-purple-700 text-white py-2 rounded-xl text-xs font-bold">
                Restablecer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}