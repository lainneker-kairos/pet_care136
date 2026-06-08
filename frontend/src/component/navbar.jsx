import Link from "next/link";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-purple-100 bg-white/90 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
                {/* contenido del navbar */}
                <Link href="/" className="text-2xl font-bold text-purple-700">
                    PetCare
                </Link>

                <div className="hidden items-center gap-8 text-sm font-semibold text-gray-600 md:flex">
                    <a href="#services" className="hover:text-purple-700">
                        Paseo de perros
                    </a>
                    <a href="#services" className="hover:text-purple-700">
                        Guardería
                    </a>
                    <a href="#services" className="hover:text-purple-700">
                        Hotel de mascotas
                    </a>
                    <a href="#trust" className="hover:text-purple-700">
                        Cuidadores
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/auth/login"
                        className="hidden text-sm font-semibold text-gray-700 hover:text-purple-700 sm:inline"
                    >
                        Iniciar sesión
                    </Link>

                    <Link
                        href="/auth/register"
                        className="rounded-full bg-purple-700 px-5 py-3 text-sm font-bold text-white hover:bg-purple-800"
                    >
                        Registrarse
                    </Link>
                </div>
            </nav>
        </header>
    );
}