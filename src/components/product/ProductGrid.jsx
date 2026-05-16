import ProductCard from "./ProductCard.jsx";
import "./ProductGrid.css";

export default function ProductGrid({ products, onAdd }) {
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} onAdd={onAdd} />
      ))}
    </div>
  );
}
