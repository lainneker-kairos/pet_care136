import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-[#eaf1ff] px-8 pt-16 pb-8">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-4">
                <div>
                    <Link href="/" className="text-2xl font-bold text-purple-700">
                    <Image 
                        src="/logo_petcare.svg" 
                        alt="Logo de PetCare" 
                        width={150} 
                        height={150} 
                        className="w-18 h-18" 
                    />
                </Link>
                    <p className="max-w-xs text-sm leading-6 text-gray-600">
                        Brindando cuidado profesional para cada mascota, todos los días.
                    </p>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900">
                        Compañía
                    </h3>

                    <ul className="space-y-3 text-sm text-gray-600">
                        <li>
                            <a href="#">Sobre Nosotros</a>
                        </li>
                        <li>
                            <a href="#">Contactar con soporte</a>
                        </li>
                        <li>
                            <a href="#">Conviértete en cuidador</a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900">
                        Legal
                    </h3>

                    <ul className="space-y-3 text-sm text-gray-600">
                        <li>
                            <a href="#">Política de privacidad</a>
                        </li>
                        <li>
                            <a href="#">Términos de servicio</a>
                        </li>
                        <li>
                            <a href="#">Confianza y seguridad</a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900">
                        Síguenos
                    </h3>

                    <div className="flex gap-3">
                        <a
                            href="#"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-purple-700"
                        >
                            f
                        </a>

                        <a
                            href="#"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-purple-700"
                        >
                            in
                        </a>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-12 max-w-6xl border-t border-purple-100 pt-6 text-center">
                <p className="text-sm text-gray-500">
                    © 2026 PetCare. Afectuosidad profesional para cada mascota.
                </p>
            </div>
        </footer>
    );
}