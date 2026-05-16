import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { persistSessionToken, signup } from "../services/authService.js";
import "./Auth.css";

function validatePassword(pw) {
  if (pw.length < 8) return "Use at least 8 characters";
  if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) {
    return "Include both letters and numbers";
  }
  return "";
}

export default function Signup() {
  const navigate = useNavigate();
  const { login: setUser } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  async function onSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Name is required";
    if (!email.trim()) nextErrors.email = "Email is required";
    const pwErr = validatePassword(password);
    if (pwErr) nextErrors.password = pwErr;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const res = await signup({ name, email, password });
      const payload = res?.data || res;
      if (payload?.token) persistSessionToken(payload.token);
      setUser(payload.user);
      toast({
        title: "Account created",
        message: "You are signed in on this device.",
        variant: "success",
      });
      navigate("/", { replace: true });
    } catch (err) {
      toast({
        title: "Could not create account",
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
            <div className="auth__brand-sub">Create your patient profile</div>
          </div>
        </div>

        <h1 className="auth__title">Create account</h1>
        <p className="auth__lead">
          This MVP stores credentials locally for demo purposes only. Never reuse real
          passwords here.
        </p>

        <form className="auth__form" onSubmit={onSubmit} noValidate>
          <Input
            id="signup-name"
            label="Full name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <Input
            id="signup-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Input
            id="signup-password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            hint="Minimum 8 characters, include letters and numbers."
            error={errors.password}
          />
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <div className="auth__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
      <div className="auth__aside" aria-hidden>
        <div className="auth__aside-inner">
          <div className="auth__kpi">
            <div className="auth__kpi-num">AES-at-rest</div>
            <div className="auth__kpi-label">Modeled security posture for APIs</div>
          </div>
          <div className="auth__kpi">
            <div className="auth__kpi-num">JWT-ready</div>
            <div className="auth__kpi-label">Token slot wired in api client</div>
          </div>
        </div>
      </div>
    </div>
  );
}
