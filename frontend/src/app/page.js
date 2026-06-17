import Navbar from "../component/Navbar"
import HeroSection from "../component/HeroSection";
import ServiceSection from "../component/ServicesSection";
import TrustSection from "../component/TrustSection";
import CallToAction from "../component/CallToAction";
import Footer from "../component/Footer";

export default function HomePage() {
  return (
    <>
    <Navbar />

    <main>

      <HeroSection />
      <ServiceSection />
      <TrustSection />

      {/* Testimonials Section pendiente: se mostrara cuando existan reseñas reales */}

      <section>
        <h2 className="mb-8 text-4xl font-bold text-center text-purple-700">Lo que dicen los Pet Parents</h2>
      </section>

      <CallToAction />
      
    </main >
    
    <Footer />

    </>
  );
}