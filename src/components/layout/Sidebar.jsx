import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Sidebar.css";

export default function Sidebar({ open, onClose }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="mobile-sidebar" role="dialog" aria-modal="true">
      <button
        type="button"
        className="mobile-sidebar__backdrop"
        aria-label="Close menu"
        onClick={onClose}
      />
      <aside className="mobile-sidebar__panel">
        <div className="mobile-sidebar__head">
          <div className="mobile-sidebar__title">Menu</div>
          <button
            type="button"
            className="mobile-sidebar__close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <nav className="mobile-sidebar__nav" aria-label="Mobile">
          {isAuthenticated ? (
            <div className="mobile-sidebar__account">
              <div className="mobile-sidebar__hello">Signed in as</div>
              <div className="mobile-sidebar__email">{user.email}</div>
              <button
                type="button"
                className="mobile-sidebar__logout"
                onClick={() => {
                  logout();
                  onClose();
                  navigate("/");
                }}
              >
                Log out
              </button>
            </div>
          ) : null}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `mobile-sidebar__link ${isActive ? "is-active" : ""}`
            }
            onClick={onClose}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `mobile-sidebar__link ${isActive ? "is-active" : ""}`
            }
            onClick={onClose}
          >
            Products
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `mobile-sidebar__link ${isActive ? "is-active" : ""}`
            }
            onClick={onClose}
          >
            Cart
          </NavLink>
          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `mobile-sidebar__link ${isActive ? "is-active" : ""}`
                }
                onClick={onClose}
              >
                Sign in
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `mobile-sidebar__link ${isActive ? "is-active" : ""}`
                }
                onClick={onClose}
              >
                Create account
              </NavLink>
            </>
          ) : null}
        </nav>
        <p className="mobile-sidebar__fineprint">
          Licensed pharmacy partners only. This MVP is a storefront demo.
        </p>
      </aside>
    </div>
  );
}
