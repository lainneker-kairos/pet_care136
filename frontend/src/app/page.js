import Navbar from "../components/Navbar"
import HeroSection from "../components/HeroSection";
import ServiceSection from "../components/ServicesSection";
import TrustSection from "../components/TrustSection";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

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