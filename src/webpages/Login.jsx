// src/webpages/Login.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginAgent } from "../utils/auth";
import {
  ShieldAlert,
  KeyRound,
  Mail,
  Fingerprint,
  Coffee,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!credential || !password) {
      setError("Enter your CBI credential (email/badge) and key.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = loginAgent(credential, password);
      setLoading(false);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    }, 400);
  }

  function handleQuickLogin(userEmail, userPass) {
    setCredential(userEmail);
    setPassword(userPass);
    const result = loginAgent(userEmail, userPass);
    if (result.success) {
      navigate("/");
    }
  }

  return (
    <div className="mentalist-auth-wrapper">
      <div className="mentalist-auth-bg">
        <div className="cbi-watermark">CBI</div>
        <div className="redjohn-smiley" title="Red John's Mark">
          ◡̈
        </div>
      </div>

      <div className="mentalist-auth-card">
        {/* Header with Series Branding */}
        <div className="cbi-badge-header">
          <div className="cbi-seal">
            <Fingerprint size={28} />
          </div>
          <div className="cbi-titles">
            <span className="cbi-department">CALIFORNIA BUREAU OF INVESTIGATION</span>
            <h2>PSYCHOLOGICAL FORENSICS UNIT</h2>
            <span className="cbi-subtag">SACRAMENTO HEADQUARTERS // DIVISION 04</span>
          </div>
        </div>

        {/* Mentalist Quote Banner */}
        <div className="mentalist-quote-box">
          <Coffee size={18} className="quote-icon" />
          <p>
            <em>"If you stop and look around, this life is pretty amazing. Keep a sharp eye."</em>
          </p>
          <span>— Patrick Jane, Senior Consultant</span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mentalist-form">
          {error && (
            <div className="auth-alert error">
              <ShieldAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="input-group">
            <label>CBI Email or Badge ID</label>
            <div className="input-field">
              <Mail size={18} />
              <input
                type="text"
                placeholder="e.g. jane@cbi.gov or CBI-SPEC-001"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Access Key / Password</label>
            <div className="input-field">
              <KeyRound size={18} />
              <input
                type="password"
                placeholder="Enter access password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="cbi-submit-btn" disabled={loading}>
            {loading ? "Authenticating Clearance..." : "Authorize CBI Clearance"}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Demo Agent Logins */}
        <div className="quick-demo-section">
          <span className="divider-label">QUICK REQUISITION (TEST ACCOUNTS)</span>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-agent-btn"
              onClick={() => handleQuickLogin("jane@cbi.gov", "tea")}
            >
              <span className="demo-avatar">☕</span>
              <div>
                <strong>Patrick Jane</strong>
                <small>Password: tea</small>
              </div>
            </button>

            <button
              type="button"
              className="demo-agent-btn"
              onClick={() => handleQuickLogin("lisbon@cbi.gov", "rules")}
            >
              <span className="demo-avatar">🛡️</span>
              <div>
                <strong>Teresa Lisbon</strong>
                <small>Password: rules</small>
              </div>
            </button>
          </div>
        </div>

        <div className="auth-footer-link">
          <span>New consultant or field agent?</span>{" "}
          <Link to="/register">Enlist for CBI Clearance</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;