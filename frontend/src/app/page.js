import Navbar from "../component/navbar";

export default function HomePage() {
  return (
    <>
    <Navbar />

    <main>

      {/* Hero Section */}

      <section className="bg-[#f7f8ff] px-8 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">

          {/* Lado izquierdo */}
          <div className="flex flex-col gap-6">
            <span className="w-fit rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700">
              ✓ Cuidadores verificados en tu zona
            </span>

            <h1 className="text-5xl font-bold leading-tight text-purple-700">
              El mejor cuidado para tu mejor amigo
            </h1>

            <p className="text-lg leading-7 text-gray-600">
              Encuentra paseadores y cuidadores de confianza cerca de ti, listos para tratar a tu mascota como parte de su familia.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="#services" className="rounded-lg bg-purple-700 px-8 py-4 text-center font-bold text-white">
                Encontrar un cuidador
              </a>
              <a href="/auth/register" className="rounded-lg border-2 border-purple-700 px-8 py-4 text-center font-bold text-purple-700">
                Convertirse en cuidador
              </a>
            </div>

            {/* Barra de búsqueda */}
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-md sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-4 py-3">
                <span>📍</span>
                <input
                  type="text"
                  placeholder="¿Dónde buscas cuidado?"
                  className="w-full text-sm outline-none"
                />
              </div>
              <select className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none">
                <option>Paseos</option>
                <option>Guardería</option>
                <option>Hotel</option>
                <option>Cuidado nocturno</option>
              </select>
              <button className="rounded-lg bg-teal-600 px-6 py-3 font-bold text-white">
                🔍 Buscar
              </button>
            </div>
          </div>

          {/* Lado derecho */}
          <div className="relative">

            <img
              src="https://images.unsplash.com/photo-1587300003388-59208cc962cb"
              alt="Persona paseando un perro"
              className="h-[420px] w-full rounded-[28px] object-cover"
            />

            <div className="absolute bottom-[-16px] right-[-16px] rounded-xl bg-white p-4 shadow-xl">
              <p className="text-2xl font-bold text-purple-700">100+</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Mascotas felices</p>
            </div>
          </div>

        </div>
      </section>

      {/* Services Section */}

      <section id="services" className="bg-[#eaf1ff] px-8 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-4xl font-bold text-purple-700">
              Nuestros Servicios Premium
            </h2>

            <p className="text-gray-600">
              Soluciones personalizadas para cada etapa de la vida de tu mascota,
              garantizando seguridad, cuidado y diversión.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <article className="rounded-[28px] bg-white px-8 py-14 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-700">
                W
              </div>

              <h3 className="mb-4 text-2xl font-bold text-purple-700">
                Paseos
              </h3>

              <p className="mb-6 text-sm leading-6 text-gray-600">
                Ejercicio diario y socialización bajo la supervisión de expertos
                apasionados por los animales.
              </p>

              <a href="#" className="font-bold text-teal-700">
                Ver más →
              </a>
            </article>

            <article className="rounded-[28px] bg-white px-8 py-14 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-200 text-2xl font-bold text-teal-700">
                H
              </div>

              <h3 className="mb-4 text-2xl font-bold text-purple-700">
                Guardería
              </h3>

              <p className="mb-6 text-sm leading-6 text-gray-600">
                Un hogar lejos de casa donde tu mejor amigo recibirá atención
                constante, cariño y compañía.
              </p>

              <a href="#" className="font-bold text-teal-700">
                Ver más →
              </a>
            </article>

            <article className="rounded-[28px] bg-white px-8 py-14 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-2xl font-bold text-pink-600">
                B
              </div>

              <h3 className="mb-4 text-2xl font-bold text-purple-700">
                Hotel de Mascotas
              </h3>

              <p className="mb-6 text-sm leading-6 text-gray-600">
                Hospedaje cómodo para estancias largas con seguimiento diario y
                cuidado personalizado.
              </p>

              <a href="#" className="font-bold text-teal-700">
                Ver más →
              </a>
            </article>
          </div>
        </div>
      </section>

      {/*Trust Section*/}

      <section className="bg-[#f7f8ff] px-8 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1537151625747-768eb6cf92b2"
              alt="Perro recibiendo cuidados"
              className="h-[420px] w-full rounded-[28px] object-cover"
            />

            <div className="absolute bottom-[-24px] right-[-24px] w-44 rounded-xl bg-purple-700 p-6 text-white shadow-xl">
              <p className="text-lg font-bold leading-tight">
                Seguridad 100% garantizada en cada reserva.
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-8 text-4xl font-bold leading-tight text-purple-700">
              ¿Por qué confiar en PetCare?
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-200">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Cuidadores Verificados</h3>
                  <p className="text-sm text-gray-600">
                    Realizamos entrevistas personales y revisión de antecedentes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-200">
                  24
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Soporte 24/7</h3>
                  <p className="text-sm text-gray-600">
                    Nuestro equipo está disponible ante cualquier emergencia.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-200">
                  +
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Seguro Veterinario</h3>
                  <p className="text-sm text-gray-600">
                    Todas las reservas incluyen cobertura médica básica.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section pendiente: se mostrara cuando existan reseñas reales */}

      <section>
        <h2 className="mb-8 text-4xl font-bold text-center text-purple-700">Lo que dicen los Pet Parents</h2>
      </section>

      {/*CallToAction*/}

      <section className="bg-[#f7f8ff] px-8 py-20">
        <div className="mx-auto max-w-6xl rounded-[28px] bg-purple-700 px-8 py-16 text-center text-white">
          <h2 className="mb-4 text-4xl font-bold">
            ¿Listo para darle lo mejor a tu mascota?
          </h2>

          <p className="mx-auto mb-10 max-w-2xl text-sm leading-6 text-purple-100">
            Únete a cientos de familias que ya confían en PetCare para el cuidado
            de sus mejores amigos.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a href="/auth/register" className="rounded-lg bg-white px-12 py-4 font-bold text-purple-700"> Empezar Ahora</a>

            <a href="#services" className="rounded-lg bg-purple-900 px-12 py-4 font-bold text-white">Ver Precios</a>
          </div>
        </div>
      </section>
    </main >

    <footer className="bg-[#eaf1ff] px-8 pt-16 pb-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-purple-700">
              PetCare
            </h2>
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
            © 2026 PetCare. Afectuosidad profesional para cada mascota..
          </p>
        </div>
      </footer>
    </>
  );
}