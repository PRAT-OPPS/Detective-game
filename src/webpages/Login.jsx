// src/webpages/Login.jsx
// FIX #6 — Quick login now shows only the 2 real seeded accounts (Jane + Lisbon)
//           Previously showed 4 avatars but all logged in as jane or lisbon anyway

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginAgent, MENTALIST_AVATARS } from "../utils/auth";
import { sqlDb } from "../utils/sqlDatabase";
import {
  KeyRound,
  Mail,
  Fingerprint,
  ArrowRight,
  Database,
  X,
  Play,
  CheckCircle2,
  Lock
} from "lucide-react";

// ✅ FIX #6: Only the 2 actual seeded demo accounts — no more fake avatars with wrong creds
const DEMO_ACCOUNTS = [
  { id: "jane", email: "jane@cbi.gov", password: "tea" },
  { id: "lisbon", email: "lisbon@cbi.gov", password: "rules" }
];

function Login() {
  const navigate = useNavigate();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // SQL Inspector Modal State
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM agents;");
  const [sqlResult, setSqlResult] = useState(() => sqlDb.executeRaw("SELECT * FROM agents;"));

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!credential || !password) {
      setError("Please enter your email or CBI badge, and password.");
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
    }, 350);
  }

  function handleQuickLogin(userEmail, userPass) {
    setCredential(userEmail);
    setPassword(userPass);
    const result = loginAgent(userEmail, userPass);
    if (result.success) {
      navigate("/");
    }
  }

  function handleRunSql(e) {
    e.preventDefault();
    try {
      const res = sqlDb.executeRaw(sqlQuery);
      setSqlResult(res);
    } catch (err) {
      setSqlResult([{ error: err.message }]);
    }
  }

  return (
    <div className="netflix-login-wrapper">
      {/* Background with Dark Cinematic Film Vignette */}
      <div className="netflix-backdrop-overlay" />

      {/* Top Netflix-style Brand Bar */}
      <header className="netflix-header">
        <div className="netflix-brand-title" onClick={() => navigate("/")}>
          <span className="netflix-cbi-tag">CBI</span>
          THE JANE METHOD
        </div>

        <button
          className="netflix-sql-pill"
          onClick={() => setShowSqlModal(true)}
          title="Inspect SQL Relational Database"
        >
          <Database size={14} />
          <span>SQL Inspector</span>
        </button>
      </header>

      {/* Main Netflix Login Card */}
      <main className="netflix-login-container">
        <div className="netflix-login-card">
          <h1>Sign In</h1>

          {error && <div className="netflix-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="netflix-form">
            <div className="netflix-input-group">
              <input
                type="text"
                required
                placeholder="Email or CBI Badge Number"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
              />
            </div>

            <div className="netflix-input-group">
              <input
                type="password"
                required
                placeholder="Security Clearance Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="netflix-submit-btn" disabled={loading}>
              {loading ? "Authenticating SQL..." : "Sign In"}
            </button>

            <div className="netflix-form-meta">
              <label className="netflix-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a
                href="#help"
                onClick={(e) => {
                  e.preventDefault();
                  setError("Demo credentials: jane@cbi.gov (key: tea) or lisbon@cbi.gov (key: rules)");
                }}
              >
                Need help?
              </a>
            </div>
          </form>

          {/* ✅ FIX #6: Quick login — only the 2 actual seeded demo accounts are shown */}
          <div className="netflix-quick-profiles">
            <span className="quick-title">OR SIGN IN AS OPERATIVE:</span>
            <div className="quick-avatar-row">
              {DEMO_ACCOUNTS.map((account) => {
                const avatar = MENTALIST_AVATARS.find((a) => a.id === account.id);
                if (!avatar) return null;
                return (
                  <div
                    key={account.id}
                    className="quick-avatar-pill"
                    onClick={() => handleQuickLogin(account.email, account.password)}
                    title={`Fast Login as ${avatar.name}`}
                  >
                    <img src={avatar.avatarUrl} alt={avatar.name} />
                    <span>{avatar.name.split(" ")[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Callout */}
          <div className="netflix-card-footer">
            <p>
              New to The Jane Method?{" "}
              <Link to="/register" className="netflix-signup-link">
                Sign up now.
              </Link>
            </p>
            <span className="netflix-recaptcha-text">
              Protected by CBI Sacramento SQL Encrypted Ledger.
            </span>
          </div>
        </div>
      </main>

      {/* Interactive SQL Database Terminal Modal */}
      {showSqlModal && (
        <div className="sql-modal-backdrop" onClick={() => setShowSqlModal(false)}>
          <div className="sql-terminal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="sql-terminal-header">
              <div className="sql-term-title">
                <Database size={16} color="#e50914" />
                <strong>CBI SQLITE RELATIONAL DATABASE INSPECTOR</strong>
              </div>
              <button className="close-sql-btn" onClick={() => setShowSqlModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRunSql} className="sql-query-bar">
              <input
                type="text"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="Enter SQL Query (e.g. SELECT * FROM agents;)"
              />
              <button type="submit">
                <Play size={14} /> Run SQL
              </button>
            </form>

            <div className="sql-results-viewer">
              <pre>{JSON.stringify(sqlResult, null, 2)}</pre>
            </div>

            <div className="sql-schema-hints">
              <span>AVAILABLE TABLES: <code>agents</code>, <code>sessions</code>, <code>sql_audit_log</code></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
