import React from "react";

const features = [
  {
    img: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/lab.png?v=1737037643&width=1000",
    title: "Third-party tested",
    text: "We hold ourselves and our ingredients to the highest standards.",
  },
  {
    img: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/quality.png?v=1737037585&width=1000",
    title: "Quality ingredients",
    text: "We're dedicated to using scientifically backed, high-quality natural ingredients.",
  },
  {
    img: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/nogmo-2.png?v=1737037297&width=1000",
    title: "Non-GMO",
    text: "We carefully evaluate every ingredient, ensuring they are non-GMO.",
  },
  {
    img: "https://wonder-theme-wellness.myshopify.com/cdn/shop/files/vegan-2.png?v=1737037101&width=1000",
    title: "Vegan",
    text: "We ensure the highest standards with 100% vegan, cruelty-free formulations.",
  },
];

export default function FeaturesBanner() {
  return (
    <section className="py-12 bg-white border-b border-black">
      <div className="max-w-6xl mx-auto px-6">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {features.map((f, i) => (
            <li
              key={i}
              className="flex flex-col items-center hover:scale-105 transition-transform duration-300"
            >
              <img
                src={f.img}
                alt={f.title}
                className="mb-4 w-16 h-16 object-contain"
              />
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                {f.title}
              </h3>
              <p className="text-sm text-gray-600">{f.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
