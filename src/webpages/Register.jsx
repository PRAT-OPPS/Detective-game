// src/webpages/Register.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerAgent, MENTALIST_AVATARS } from "../utils/auth";
import {
  Fingerprint,
  Mail,
  KeyRound,
  ShieldCheck,
  Check,
  ArrowRight,
  Database
} from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [badge, setBadge] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState("jane");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentAvatar =
    MENTALIST_AVATARS.find((a) => a.id === selectedAvatarId) || MENTALIST_AVATARS[0];

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your operative name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid official CBI email address.");
      return;
    }
    if (password.length < 3) {
      setError("Password key must be at least 3 characters long.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = registerAgent({
        name,
        email,
        badge: badge.trim() || currentAvatar.badge,
        password,
        avatarId: selectedAvatarId
      });
      setLoading(false);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    }, 350);
  }

  return (
    <div className="netflix-register-wrapper">
      <div className="netflix-backdrop-overlay" />

      {/* Header */}
      <header className="netflix-header">
        <div className="netflix-brand-title" onClick={() => navigate("/")}>
          <span className="netflix-cbi-tag">CBI</span>
          THE JANE METHOD
        </div>
        <Link to="/login" className="netflix-login-link-btn">
          Sign In
        </Link>
      </header>

      <main className="netflix-register-container">
        {/* STEP 1: Netflix "Who's Investigating?" Profile Picker */}
        <section className="netflix-avatar-hero-section">
          <h1>Who's Investigating?</h1>
          <p>Choose your CBI operative avatar to customize your psychological dossier.</p>

          <div className="netflix-profiles-grid">
            {MENTALIST_AVATARS.map((agent) => {
              const isSelected = selectedAvatarId === agent.id;
              return (
                <div
                  key={agent.id}
                  className={`netflix-profile-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedAvatarId(agent.id)}
                >
                  <div className="profile-img-frame">
                    <img src={agent.avatarUrl} alt={agent.name} />
                    {isSelected && (
                      <div className="netflix-check-badge">
                        <Check size={18} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <strong className="profile-agent-name">{agent.name}</strong>
                  <span className="profile-agent-role">{agent.role}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* STEP 2: Netflix Styled Registration Card */}
        <section className="netflix-register-card">
          <div className="card-heading-tag">
            <span>CBI ENCRYPTED ENLISTMENT // STEP 2 OF 2</span>
          </div>

          <h2>Complete Your CBI Profile</h2>
          <p className="card-sub-desc">
            Enlisting as <strong>{currentAvatar.name}</strong> ({currentAvatar.role})
          </p>

          {error && <div className="netflix-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="netflix-form">
            <div className="netflix-input-group">
              <input
                type="text"
                required
                placeholder="Full Operative Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="netflix-input-group">
              <input
                type="email"
                required
                placeholder="Official CBI Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="netflix-input-row">
              <div className="netflix-input-group">
                <input
                  type="text"
                  placeholder={`Badge (Default: ${currentAvatar.badge})`}
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                />
              </div>

              <div className="netflix-input-group">
                <input
                  type="password"
                  required
                  placeholder="Security Key (Password)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="netflix-submit-btn" disabled={loading}>
              <Fingerprint size={18} />
              <span>{loading ? "Writing to CBI ENCRYPTED Ledger..." : "Register into CBI Database"}</span>
            </button>

            <div className="netflix-card-footer" style={{ textAlign: "center", marginTop: "16px" }}>
              <p>
                Already registered?{" "}
                <Link to="/login" className="netflix-signup-link">
                  Sign in to your terminal.
                </Link>
              </p>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Register;