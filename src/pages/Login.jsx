import { useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { login, persistSessionToken } from "../services/authService.js";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setUser } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const redirectTo = useMemo(() => {
    const state = location.state;
    if (state && typeof state.from === "string") return state.from;
    return "/";
  }, [location.state]);

  async function onSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = "Email is required";
    if (!password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const res = await login({ email, password });
      const payload = res?.data || res;
      if (payload?.token) persistSessionToken(payload.token);
      setUser(payload.user);
      toast({ title: "Welcome back", message: payload.user.name, variant: "success" });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast({
        title: "Sign-in failed",
        message: err.message || "Please try again",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth__panel">
        <div className="auth__brand">
          <span className="auth__mark" aria-hidden />
          <div>
            <div className="auth__brand-name">CareRx</div>
            <div className="auth__brand-sub">Secure access to your health orders</div>
          </div>
        </div>

        <h1 className="auth__title">Sign in</h1>
        <p className="auth__lead">
          Local demo auth stores users in LocalStorage. Swap endpoints when your MongoDB
          API is ready.
        </p>

        <form className="auth__form" onSubmit={onSubmit} noValidate>
          <Input
            id="login-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Input
            id="login-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting}>
            {submitting ? "Signing in…" : "Continue"}
          </Button>
        </form>

        <div className="auth__footer">
          New here?{" "}
          <Link to="/signup" state={location.state}>
            Create an account
          </Link>
        </div>
      </div>
      <div className="auth__aside" aria-hidden>
        <div className="auth__aside-inner">
          <div className="auth__quote">
            “Healthcare commerce should feel calm, fast, and obsessively clear.”
          </div>
          <div className="auth__quote-meta">CareRx design principles</div>
        </div>
      </div>
    </div>
  );
}
