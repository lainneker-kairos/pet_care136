"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {

    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [user, setUser] = useState(null)

    return (
        <header className="sticky top-0 z-50 border-b border-purple-100 bg-white/90 backdrop-blur">
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
                    <a href="#trust" className="hover:text-purple-700">
                        Cuidadores
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (

                        <>
                            <p>Has inciado sesión</p>
                            <button> Cerrar sesión </button>
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
        </header>
    );
}