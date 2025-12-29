"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What does “The Purna” stand for?",
      answer:
        "Purna means 'complete.' The Purna is built on the belief that everyday wellness should be simple, holistic, Natural and accessible covering every essential need, from morning to night.",
    },
    {
      question: "What kind of products does The Purna offer?",
      answer:
        "The Purna offers everyday personal care essentials across oral care, body care, hair care, and skin care designed to be used daily as part of a balanced routine.",
    },
    {
      question: "Are The Purna products herbal or Ayurvedic?",
      answer:
        "The Purna products are inspired by traditional herbal wisdom and formulated using carefully selected natural ingredients, while being designed for modern lifestyle and everyday use.",
    },
    {
      question: "Are The Purna products safe for daily use?",
      answer:
        "Yes. All The Purna products are formulated for regular, everyday use, with a strong focus on safety, quality, and comfort.",
    },
    {
      question: "Are your products suitable for all age groups?",
      answer:
        "The Purna products are suitable across all age groups. Specific usage instructions and precautions are mentioned clearly on each product.",
    },
    {
      question: "Do The Purna products contain harsh chemicals?",
      answer:
        "The Purna focuses on gentle and age old natural wellness. The products are thoughtfully formulated, avoiding unnecessary harsh ingredients wherever possible, while maintaining effectiveness and stability.",
    },
    {
      question: "How is The Purna different from other personal care brands?",
      answer:
        "The Purna is not built around trends, it is built around completeness ! Every product is designed to be a meaningful part of a daily routine, offering care that feels balanced, honest, and dependable.",
    },
    {
      question: "Are The Purna products tested for quality?",
      answer:
        "Yes. All products undergo quality checks and standard testing to ensure safety, consistency, and performance before reaching consumers.",
    },
    {
      question: "Where are The Purna products made?",
      answer:
        "The Purna products are made in India, supporting local manufacturing while maintaining high-quality standards.",
    },
    {
      question: "How can I incorporate The Purna into my daily routine?",
      answer:
        "The Purna is designed to fit naturally into your day: from oral care in the morning, to body and hair care during the day, to skin care at night—creating a complete everyday wellness routine.",
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
