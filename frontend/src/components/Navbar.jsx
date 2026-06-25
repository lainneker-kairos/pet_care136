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
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
                {/* contenido del navbar */}
                <Link href="/" className="text-2xl font-bold text-purple-700">
                    <Image
                        src="/logo_petcare.svg"
                        alt="Logo de PetCare"
                        width={150}
                        height={150}
                        className="w-18 h-18"
                    />
                </Link>

                <div className="hidden items-center gap-8 text-sm font-semibold text-gray-600 md:flex">
                    <a href="/DogWalkingPage" className="hover:text-purple-700">
                        Paseo de perros
                    </a>
                    <a href="daycare" className="hover:text-purple-700">
                        Guardería
                    </a>
                    <a href="hotel" className="hover:text-purple-700">
                        Hotel de mascotas
                    </a>
                    <a href="listacuidadores" className="hover:text-purple-700">
                        Cuidadores
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <>

                            <span className="hidden text-sm font-semibold text-gray-700 sm:inline">
                                Hola, {user?.name || "usuario"}
                            </span>

                            <span className="hidden text-gray-300 sm:inline">|</span>

                            <a href="#" className="text-sm font-semibold text-gray-700 hover:text-purple-700 mr-2">
                                Mi perfil
                            </a>

                            <button
                                onClick={handleLogout}
                                className="rounded-full bg-purple-700 px-5 py-3 text-sm font-bold text-white hover:bg-purple-800">
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login"
                                className="hidden text-sm font-semibold text-gray-700 hover:text-purple-700 sm:inline">
                                Iniciar sesión
                            </Link>

                            <Link href="/auth/register"
                                className="rounded-full bg-purple-700 px-5 py-3 text-sm font-bold text-white hover:bg-purple-800">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
}