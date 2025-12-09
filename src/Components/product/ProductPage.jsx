import { useParams } from "react-router-dom";
import { products } from "../data/product"; // Make sure this matches your exported array
import ProductPageContent from "./ProductPageContent";

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return <h1 className="text-center text-2xl mt-20">Product not found</h1>;
  }

  return <ProductPageContent product={product} />;
}
