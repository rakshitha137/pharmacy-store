import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";
import "./ProductCard.css";

function formatMoney(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export default function ProductCard({ product, onAdd }) {
  const saving = product.mrp > product.price;

  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-card__media">
        <img src={product.image} alt="" loading="lazy" />
        {product.requiresPrescription ? (
          <span className="product-card__rx">Rx</span>
        ) : (
          <span className="product-card__otc">OTC</span>
        )}
      </Link>
      <div className="product-card__body">
        <div className="product-card__brand">{product.brand}</div>
        <Link to={`/products/${product.slug}`} className="product-card__title">
          {product.name}
        </Link>
        <div className="product-card__meta">{product.packSize}</div>
        <div className="product-card__rating" aria-label={`Rating ${product.rating} out of 5`}>
          <span className="product-card__stars">★★★★★</span>
          <span className="product-card__rating-num">{product.rating}</span>
          <span className="product-card__reviews">
            ({product.reviewCount.toLocaleString("en-IN")})
          </span>
        </div>
        <div className="product-card__price-row">
          <div className="product-card__price">{formatMoney(product.price)}</div>
          {saving ? (
            <div className="product-card__mrp">{formatMoney(product.mrp)}</div>
          ) : null}
          {product.discountPercent ? (
            <div className="product-card__off">{product.discountPercent}% off</div>
          ) : null}
        </div>
        <div className="product-card__actions">
          <Button
            type="button"
            size="sm"
            variant="primary"
            fullWidth
            disabled={!product.inStock}
            onClick={() => onAdd(product)}
          >
            {product.inStock ? "Add to cart" : "Out of stock"}
          </Button>
        </div>
      </div>
    </article>
  );
}
