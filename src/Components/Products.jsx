import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "./data/product";

const Products = () => {
  return (
    <section id="products" className="w-full bg-[#FDF8F0] border-t border-b py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight"
            >
              Explore Our <br />
              <span className="text-[var(--color-orange)]">Essentials</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-neutral-600 max-w-lg"
            >
              From refreshing oral care to nurturing night-time rituals, experience wellness that completes your entire day.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#151515] text-white rounded-full transition-all hover:bg-[var(--color-orange)]"
            >
              View All Products
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Link to={`/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}/immersive`} className="block h-full flex flex-col">
                {/* Image Container */}
                <div className="relative h-64 w-full bg-[#F5F5F5] overflow-hidden flex items-center justify-center p-6">
                  {/* Background Circle */}
                  <div className="absolute inset-0 bg-[var(--color-orange)]/5 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out origin-center" />

                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="relative z-10 w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="text-xs tracking-widest uppercase text-[var(--color-orange)]">
                      {product.tags[0]}
                    </span>
                  </div>
                  <h3 className="text-xl mb-2 text-neutral-900 group-hover:text-[var(--color-orange)] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-neutral-500 text-sm mb-4 line-clamp-2 flex-1">
                    {product.tagline || product.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg text-black">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-neutral-500 group-hover:text-black transition-colors flex items-center gap-1">
                      Shop Now <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
