import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingNotification from "@/components/FloatingNotification";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "PetCare",
  description: "El mejor cuidado para tu mejor amigo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <Navbar />
        <FloatingNotification />
        {children}
        <Footer />
      </body>
    </html>
  );
}
