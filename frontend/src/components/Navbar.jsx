"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {

    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("TOKENJWT");
        const userName = localStorage.getItem("userName");

        if (token && userName) {
            setIsLoggedIn(true)
            setUser({ name: userName })

            fetch('http://127.0.0.1:5000/api/profile/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                setUser({
                    name: userName,
                    ownerProfile: data.owner_profile,
                    petsitterProfile: data.petsitter_profile
                });
            })
            .catch(error => console.error('Error al obtener perfil:', error));
        }

    }, []);

    const handleLogout = () => {
        localStorage.removeItem("TOKENJWT");
        localStorage.removeItem("userName");
        setIsLoggedIn(false);
        setUser(null);

        router.push("/auth/login")
    };

return (
        <div className="sticky top-0 z-50 border-b border-purple-100 bg-white/90 backdrop-blur">
            {/* Aumentamos max-w a 7xl para dar más margen lateral y bajamos el py-5 a py-3.5 para estilizar la altura */}
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
                
                {/* LOGO */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo_petcare.svg"
                        alt="Logo de PetCare"
                        width={150} 
                        height={50}
                        className="h-14 w-auto" 
                    />
                </Link>

                {/* MENÚ CENTRAL - Reducido gap-8 a gap-6 para optimizar espacio horizontal */}
                <div className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
                    <Link href="/DogWalkingPage" className="transition-colors hover:text-purple-700">
                        Paseo de Mascotas
                    </Link>
                    <Link href="/daycare" className="transition-colors hover:text-purple-700">
                        Guardería
                    </Link>
                    <Link href="/hotel" className="transition-colors hover:text-purple-700">
                        Hotel de Mascotas
                    </Link>
                    <Link href="/cuidadores" className="transition-colors hover:text-purple-700">
                        Cuidadores
                    </Link>
                </div>

                {/* BLOQUE DE AUTENTICACIÓN Y ROLES INTEGRADO */}
                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <>
                            <span className="hidden text-sm text-gray-600 sm:inline">
                                Hola, <span className="font-semibold text-gray-800">{user?.name || "usuario"}</span>
                            </span>

                            {/* BOTONES DE ROLES INTERNOS: Integrados en el flujo, con diseño sutil y coherente */}
                            {user && user.ownerProfile && (
                                <Link href="/perfil-owner" className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 transition-all hover:bg-emerald-100">
                                    Perfil Dueño
                                </Link>
                            )}

                            {user && user.petsitterProfile && (
                                <Link href="/perfil-cuidador" className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 transition-all hover:bg-purple-100">
                                    Perfil Cuidador
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="rounded-full bg-purple-700 px-3.5 py-1 text-xs font-medium text-white transition-colors hover:bg-red-400">
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login"
                                className="hidden text-sm font-semibold text-gray-700 transition-colors hover:text-purple-700 sm:inline">
                                Iniciar sesión
                            </Link>

                            <Link href="/auth/register"
                                className="rounded-full bg-purple-700 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-purple-800">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
}