"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "ARE WELLNESS SUPPLEMENTS SAFE TO USE?",
      answer:
        "Absolutely! All our products are manufactured in certified facilities and meet strict safety and quality standards. We recommend consulting your healthcare provider if you have specific health conditions or are taking medications. This is the demo store.",
    },
    {
      question: "HOW SHOULD I STORE MY SUPPLEMENTS?",
      answer:
        "To ensure the freshness and effectiveness of our products, store them in a cool, dry place away from direct sunlight. Always keep them out of reach of children.",
    },
    {
      question: "DO YOU OFFER INTERNATIONAL SHIPPING?",
      answer:
        "Yes, we ship worldwide! Shipping costs and delivery times may vary depending on your location. You can find more details on our Shipping Policy page",
    },
    {
      question: "WHAT IS YOUR RETURN POLICY?",
      answer:
        "We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, you can return it for a refund or exchange. Please visit our Return Policy page for more details.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#fafafa] py-16 border-b border-black">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Subtitle */}
        <p className="text-sm text-gray-600 mb-2">
          Everything You Need to Know!
        </p>
        {/* Title */}
        <h2 className="text-xl md:text-2xl mb-8 tracking-wide">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        {/* FAQ List */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-black pb-4">
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="uppercase font-semibold text-sm md:text-base">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>

              {/* Answer */}
              {openIndex === index && (
                <p className="mt-3 text-sm text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
