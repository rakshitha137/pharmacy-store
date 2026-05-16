import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <div className="site-footer__logo" aria-hidden />
          <div>
            <div className="site-footer__name">CareRx Pharmacy</div>
            <p className="site-footer__tagline">
              Clean healthcare commerce UI — inspired by leading pharmacy
              experiences.
            </p>
          </div>
        </div>
        <div className="site-footer__cols">
          <div>
            <div className="site-footer__heading">Shop</div>
            <Link to="/products" className="site-footer__link">
              All products
            </Link>
            <Link to="/products?category=wellness" className="site-footer__link">
              Wellness
            </Link>
            <Link to="/products?category=devices" className="site-footer__link">
              Devices
            </Link>
          </div>
          <div>
            <div className="site-footer__heading">Account</div>
            <Link to="/login" className="site-footer__link">
              Sign in
            </Link>
            <Link to="/signup" className="site-footer__link">
              Create account
            </Link>
            <Link to="/cart" className="site-footer__link">
              Cart
            </Link>
          </div>
          <div>
            <div className="site-footer__heading">MongoDB-ready</div>
            <p className="site-footer__note">
              Catalog and auth are abstracted in <code>src/services</code>. Point{" "}
              <code>VITE_API_BASE_URL</code> at your API when ready.
            </p>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} CareRx Demo</span>
          <span className="site-footer__sep">·</span>
          <span>Not a real pharmacy — demo storefront only.</span>
        </div>
      </div>
    </footer>
  );
}
