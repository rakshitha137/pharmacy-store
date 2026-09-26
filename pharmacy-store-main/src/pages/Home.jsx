import { useMemo } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../components/product/ProductGrid.jsx";
import Button from "../components/ui/Button.jsx";
import { MOCK_PRODUCTS } from "../data/products.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import "./Home.css";

export default function Home() {
  const { addItem } = useCart();
  const { toast } = useToast();

  const featured = useMemo(
    () => MOCK_PRODUCTS.filter((p) => p.inStock).slice(0, 4),
    []
  );

  const onAdd = (product) => {
    addItem(product, 1);
    toast({
      title: "Added to cart",
      message: `${product.name} — 1 unit`,
      variant: "success",
    });
  };

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero__grid">
          <div className="home-hero__copy">
            <div className="home-hero__eyebrow">Same-day ready architecture</div>
            <h1 className="home-hero__title">
              Pharmacy-grade shopping,
              <span className="home-hero__serif"> Stripe-clean checkout feel.</span>
            </h1>
            <p className="home-hero__lead">
              Browse curated OTC essentials, wellness, and devices. Cart persists
              locally — swap in a MongoDB-backed API when your server is live.
            </p>
            <div className="home-hero__cta">
              <Link to="/products">
                <Button size="lg" variant="primary">
                  Shop medicines
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="secondary">
                  Create account
                </Button>
              </Link>
            </div>
            <div className="home-hero__stats">
              <div>
                <div className="home-hero__stat-num">4.8★</div>
                <div className="home-hero__stat-label">Avg. catalog rating</div>
              </div>
              <div>
                <div className="home-hero__stat-num">₹0</div>
                <div className="home-hero__stat-label">Delivery on ₹499+</div>
              </div>
              <div>
                <div className="home-hero__stat-num">100%</div>
                <div className="home-hero__stat-label">Cold-chain ready UI</div>
              </div>
            </div>
          </div>
          <div className="home-hero__visual" aria-hidden>
            <div className="home-hero__card home-hero__card--a">
              <div className="home-hero__pill">Trusted brands</div>
              <div className="home-hero__card-title">Wellness kits</div>
              <div className="home-hero__card-sub">Curated for daily care</div>
            </div>
            <div className="home-hero__card home-hero__card--b">
              <div className="home-hero__pill home-hero__pill--dark">Devices</div>
              <div className="home-hero__card-title">Home diagnostics</div>
              <div className="home-hero__card-sub">Accurate. Simple. Fast.</div>
            </div>
            <div className="home-hero__glow" />
          </div>
        </div>
      </section>

      <section className="home-band">
        <div className="home-band__inner">
          <div>
            <div className="home-band__title">Cold-chain friendly logistics UI</div>
            <div className="home-band__sub">
              Surface temperature-sensitive SKUs with clear compliance cues.
            </div>
          </div>
          <div className="home-band__chips">
            <span className="chip">Fever &amp; pain</span>
            <span className="chip">Immunity</span>
            <span className="chip">Devices</span>
            <span className="chip">Personal care</span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section__head">
          <div>
            <h2 className="home-section__title">Popular picks</h2>
            <p className="home-section__sub">
              High-intent SKUs modeled like a real pharmacy catalog.
            </p>
          </div>
          <Link to="/products" className="home-section__link">
            View all products →
          </Link>
        </div>
        <ProductGrid products={featured} onAdd={onAdd} />
      </section>

      <section className="home-trust">
        <div className="home-trust__card">
          <h3 className="home-trust__title">MongoDB-ready services</h3>
          <p className="home-trust__text">
            The UI calls <code>productsService</code> and <code>authService</code>.
            With <code>VITE_API_BASE_URL</code> unset, the app uses local mock data and
            local auth storage. When your API is ready, return Mongo-shaped JSON from{" "}
            <code>/products</code> and <code>/auth/*</code> routes.
          </p>
        </div>
        <div className="home-trust__card home-trust__card--accent">
          <h3 className="home-trust__title">Premium healthcare UI</h3>
          <p className="home-trust__text">
            Soft clinical palette, generous whitespace, crisp cards, and motion that
            feels calm — not flashy.
          </p>
        </div>
      </section>
    </div>
  );
}
