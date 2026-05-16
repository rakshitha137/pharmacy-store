import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { fetchProductBySlug } from "../services/productsService.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import "./ProductDetail.css";

function formatMoney(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError("");
      try {
        const res = await fetchProductBySlug(slug);
        const p = res?.data || res;
        if (!cancelled) setProduct(p);
      } catch (e) {
        if (!cancelled) setError(e.message || "Not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="pd">
        <div className="pd__state">Loading product…</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pd">
        <div className="pd__panel pd__panel--center">
          <h1 className="pd__oops">Product unavailable</h1>
          <p className="pd__oops-sub">{error || "This item may have been removed."}</p>
          <Button variant="primary" onClick={() => navigate("/products")}>
            Back to catalog
          </Button>
        </div>
      </div>
    );
  }

  const saving = product.mrp > product.price;

  return (
    <div className="pd">
      <div className="pd__crumbs">
        <Link to="/">Home</Link>
        <span aria-hidden> / </span>
        <Link to="/products">Products</Link>
        <span aria-hidden> / </span>
        <span>{product.name}</span>
      </div>

      <div className="pd__grid">
        <div className="pd__media">
          <img src={product.image} alt="" />
          <div className="pd__badges">
            {product.requiresPrescription ? (
              <span className="pd__badge pd__badge--rx">Prescription item</span>
            ) : (
              <span className="pd__badge pd__badge--otc">Over the counter</span>
            )}
            <span className="pd__badge pd__badge--muted">{product.form}</span>
          </div>
        </div>

        <div className="pd__info">
          <div className="pd__brand">{product.brand}</div>
          <h1 className="pd__title">{product.name}</h1>
          <div className="pd__meta">{product.packSize}</div>

          <div className="pd__rating" aria-label={`Rating ${product.rating} out of 5`}>
            <span className="pd__stars">★★★★★</span>
            <span className="pd__rating-num">{product.rating}</span>
            <span className="pd__reviews">
              {product.reviewCount.toLocaleString("en-IN")} verified purchases
            </span>
          </div>

          <div className="pd__price">
            <div className="pd__price-now">{formatMoney(product.price)}</div>
            {saving ? <div className="pd__price-was">{formatMoney(product.mrp)}</div> : null}
            {product.discountPercent ? (
              <div className="pd__off">{product.discountPercent}% off MRP</div>
            ) : null}
          </div>

          <div className="pd__qty">
            <div className="pd__qty-label">Quantity</div>
            <div className="pd__qty-row">
              <button
                type="button"
                className="pd__qty-btn"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <div className="pd__qty-value">{qty}</div>
              <button
                type="button"
                className="pd__qty-btn"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
              >
                +
              </button>
            </div>
          </div>

          <div className="pd__actions">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!product.inStock}
              onClick={() => {
                addItem(product, qty);
                toast({
                  title: "Added to cart",
                  message: `${product.name} — ${qty} unit(s)`,
                  variant: "success",
                });
              }}
            >
              {product.inStock ? "Add to cart" : "Out of stock"}
            </Button>
            <Button variant="secondary" size="lg" fullWidth onClick={() => navigate("/cart")}>
              View cart
            </Button>
          </div>

          <div className="pd__notes">
            <div className="pd__note">
              <div className="pd__note-title">Authenticity</div>
              <div className="pd__note-text">
                Demo storefront — wire your fulfillment checks on the server.
              </div>
            </div>
            <div className="pd__note">
              <div className="pd__note-title">Returns</div>
              <div className="pd__note-text">
                Cold-chain returns are modeled in UI copy only for this MVP.
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="pd__section">
        <h2 className="pd__section-title">About this product</h2>
        <p className="pd__desc">{product.description}</p>
        <ul className="pd__highlights">
          {product.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <div className="pd__tags">
          {product.tags.map((t) => (
            <span key={t} className="pd__tag">
              {t}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
