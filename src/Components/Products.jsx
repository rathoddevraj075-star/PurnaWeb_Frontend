import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { productService } from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts();
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-[#FDF8F0] py-20 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

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
          {products.map((product, index) => {
            const imageUrl = product.images?.[0]?.url || product.images?.[0] || '';
            const categoryName = product.category?.name || '';
            const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');

            return (
              <motion.div
                key={product._id || product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/collections/${categorySlug}/immersive`} className="block h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-64 w-full bg-[#F5F5F5] overflow-hidden flex items-center justify-center p-6">
                    {/* Background Circle */}
                    <div className="absolute inset-0 bg-[var(--color-orange)]/5 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out origin-center" />

                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="relative z-10 w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-2">
                      <span className="text-xs tracking-widest uppercase text-[var(--color-orange)]">
                        {product.tags?.[0] || categoryName}
                      </span>
                    </div>
                    <h3 className="text-xl mb-2 text-neutral-900 group-hover:text-[var(--color-orange)] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-neutral-500 text-sm mb-4 line-clamp-2 flex-1">
                      {product.tagline || product.shortDescription || product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg text-black">
                        ${product.price?.toFixed(2) || '0.00'}
                      </span>
                      <span className="text-sm font-medium text-neutral-500 group-hover:text-black transition-colors flex items-center gap-1">
                        View Product <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Products;
