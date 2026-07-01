"use client";
import { useState } from "react";

export default function Accordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#f7f8ff] px-8 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-purple-700 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-600">
            Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[#EADBCE] rounded-lg overflow-hidden hover:border-purple-300 transition-colors"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-4 flex items-center justify-between bg-[#FAF6F0] hover:bg-[#EFE9E2] transition-colors"
              >
                <span className="text-left font-semibold text-gray-900">
                  {faq.pregunta}
                </span>
                <span
                  className={`text-purple-700 font-bold text-xl transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 bg-white border-t border-[#EADBCE]">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.respuesta}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}