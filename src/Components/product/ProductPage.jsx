import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ProductPageContent from "./ProductPageContent";
import { productService } from "../../services/api";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productService.getProductBySlug(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/products')}
            className="bg-black text-white px-6 py-3 rounded-full"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return <ProductPageContent product={product} />;
}
