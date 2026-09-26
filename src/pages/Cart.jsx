import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import "./Cart.css";

function formatMoney(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export default function Cart() {
  const { items, totals, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h1 className="cart-empty__title">Your cart is empty</h1>
          <p className="cart-empty__sub">
            Items you add stay on this device via LocalStorage until you connect a
            persistent account API.
          </p>
          <Link to="/products">
            <Button size="lg" variant="primary">
              Browse products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__head">
        <h1 className="cart-page__title">Cart</h1>
        <button type="button" className="cart-page__clear" onClick={() => {
          clearCart();
          toast({ title: "Cart cleared", variant: "info" });
        }}>
          Clear cart
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-lines">
          {items.map((line) => (
            <div key={line.productId} className="cart-line">
              <Link to={`/products/${line.slug}`} className="cart-line__media">
                <img src={line.image} alt="" />
              </Link>
              <div className="cart-line__body">
                <Link to={`/products/${line.slug}`} className="cart-line__title">
                  {line.name}
                </Link>
                <div className="cart-line__meta">
                  {line.requiresPrescription ? (
                    <span className="cart-line__rx">Prescription</span>
                  ) : (
                    <span className="cart-line__otc">OTC</span>
                  )}
                </div>
                <div className="cart-line__price">{formatMoney(line.price)}</div>
              </div>
              <div className="cart-line__controls">
                <div className="cart-line__qty">
                  <button
                    type="button"
                    className="cart-line__qty-btn"
                    aria-label="Decrease quantity"
                    onClick={() => updateQuantity(line.productId, line.quantity - 1)}
                  >
                    −
                  </button>
                  <div className="cart-line__qty-val">{line.quantity}</div>
                  <button
                    type="button"
                    className="cart-line__qty-btn"
                    aria-label="Increase quantity"
                    onClick={() => updateQuantity(line.productId, line.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-line__line-total">
                  {formatMoney(line.price * line.quantity)}
                </div>
                <button
                  type="button"
                  className="cart-line__remove"
                  onClick={() => {
                    removeItem(line.productId);
                    toast({ title: "Removed", message: line.name, variant: "info" });
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary" aria-label="Order summary">
          <div className="cart-summary__title">Order summary</div>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>{formatMoney(totals.subtotal)}</span>
          </div>
          <div className="cart-summary__row">
            <span>MRP savings</span>
            <span className="cart-summary__pos">− {formatMoney(totals.savings)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Delivery</span>
            <span>{totals.delivery === 0 ? "FREE" : formatMoney(totals.delivery)}</span>
          </div>
          {totals.delivery > 0 ? (
            <div className="cart-summary__hint">
              Add {formatMoney(Math.max(0, 499 - totals.subtotal))} more for free delivery
              (demo rule).
            </div>
          ) : (
            <div className="cart-summary__hint">You unlocked free delivery on this order.</div>
          )}
          <div className="cart-summary__divider" />
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span>{formatMoney(totals.total)}</span>
          </div>
          <Button
            fullWidth
            size="lg"
            variant="primary"
            onClick={() =>
              toast({
                title: "Checkout is UI-only",
                message: "Wire payment + orders to your MongoDB-backed API.",
                variant: "info",
              })
            }
          >
            Proceed to checkout
          </Button>
          <Link to="/products" className="cart-summary__link">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
