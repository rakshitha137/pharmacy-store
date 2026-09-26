import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Sidebar from "./Sidebar.jsx";
import "./Header.css";

function IconCart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.6" fill="currentColor" />
      <circle cx="17" cy="20" r="1.6" fill="currentColor" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header({ onOpenSearch }) {
  const { theme, toggleTheme } = useTheme();
  const { totals } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = totals.count;

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__left">
            <button
              type="button"
              className="icon-btn site-header__menu-btn"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <IconMenu />
            </button>
            <Link to="/" className="site-header__brand">
              <span className="site-header__mark" aria-hidden />
              <span className="site-header__wordmark">
                Care<span className="site-header__accent">Rx</span>
              </span>
            </Link>
            <nav className="site-header__nav" aria-label="Primary">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `site-header__link ${isActive ? "is-active" : ""}`
                }
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `site-header__link ${isActive ? "is-active" : ""}`
                }
              >
                Products
              </NavLink>
            </nav>
          </div>

          <button
            type="button"
            className="site-header__search"
            onClick={() => onOpenSearch?.()}
          >
            <span className="site-header__search-icon" aria-hidden>
              ⌕
            </span>
            <span className="site-header__search-text">
              Search medicines, brands, categories…
            </span>
            <kbd className="site-header__kbd">/</kbd>
          </button>

          <div className="site-header__actions">
            <button
              type="button"
              className="icon-btn"
              aria-label={
                theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
              onClick={toggleTheme}
            >
              {theme === "dark" ? <IconSun /> : <IconMoon />}
            </button>

            {isAuthenticated ? (
              <div className="site-header__user">
                <span className="site-header__user-name">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link to="/login" className="site-header__pill">
                Sign in
              </Link>
            )}

            <Link to="/cart" className="site-header__cart" aria-label="Cart">
              <IconCart />
              {cartCount > 0 ? (
                <span className="site-header__cart-badge">{cartCount}</span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
