// src/webpages/Register.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerAgent, MENTALIST_AVATARS } from "../utils/auth";
import {
  Fingerprint,
  BadgeAlert,
  User,
  Mail,
  KeyRound,
  ShieldCheck,
  Check,
  ArrowRight
} from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [badge, setBadge] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState("jane");
  const [error, setError] = useState("");

  const currentAvatar =
    MENTALIST_AVATARS.find((a) => a.id === selectedAvatarId) || MENTALIST_AVATARS[0];

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please state your full operative name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("A valid official CBI email is required.");
      return;
    }
    if (password.length < 3) {
      setError("Security clearance key must be at least 3 characters long.");
      return;
    }

    const result = registerAgent({
      name,
      email,
      badge: badge || currentAvatar.badge,
      password,
      avatarId: selectedAvatarId
    });

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="mentalist-auth-wrapper">
      <div className="mentalist-auth-bg">
        <div className="cbi-watermark">CBI</div>
        <div className="redjohn-smiley">◡̈</div>
      </div>

      <div className="mentalist-auth-card register-wide">
        {/* Header */}
        <div className="cbi-badge-header">
          <div className="cbi-seal">
            <Fingerprint size={28} />
          </div>
          <div className="cbi-titles">
            <span className="cbi-department">CALIFORNIA BUREAU OF INVESTIGATION</span>
            <h2>AGENT & CONSULTANT ENLISTMENT</h2>
            <span className="cbi-subtag">SACRAMENTO PERSONNEL DOSSIER CREATION</span>
          </div>
        </div>

        {error && (
          <div className="auth-alert error">
            <BadgeAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mentalist-form">
          {/* Avatar Selector Section */}
          <div className="avatar-selection-container">
            <label className="section-label">SELECT YOUR CBI AVATAR & SPECIALIZATION</label>
            <div className="avatar-grid">
              {MENTALIST_AVATARS.map((avatar) => {
                const isSelected = avatar.id === selectedAvatarId;
                return (
                  <div
                    key={avatar.id}
                    className={`avatar-option-card ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedAvatarId(avatar.id);
                      if (!badge) setBadge(avatar.badge);
                    }}
                  >
                    <div className="avatar-img-frame">
                      <img src={avatar.avatarUrl} alt={avatar.name} />
                      {isSelected && (
                        <div className="selected-badge-check">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                    <span className="avatar-name">{avatar.name}</span>
                    <span className="avatar-role">{avatar.role}</span>
                  </div>
                );
              })}
            </div>

            {/* Selected Avatar Spotlight Card */}
            <div className="selected-spotlight">
              <span className="spotlight-badge-id">{currentAvatar.badge}</span>
              <p className="spotlight-quote">"{currentAvatar.quote}"</p>
            </div>
          </div>

          {/* Input Fields */}
          <div className="form-two-column">
            <div className="input-group">
              <label>Agent / Consultant Name</label>
              <div className="input-field">
                <User size={18} />
                <input
                  type="text"
                  placeholder="e.g. Patrick Jane"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Badge Number (Auto or Custom)</label>
              <div className="input-field">
                <ShieldCheck size={18} />
                <input
                  type="text"
                  placeholder={currentAvatar.badge}
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-two-column">
            <div className="input-group">
              <label>Official Email</label>
              <div className="input-field">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="e.g. agent@cbi.ca.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Clearance Passcode</label>
              <div className="input-field">
                <KeyRound size={18} />
                <input
                  type="password"
                  placeholder="Create passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="cbi-submit-btn">
            Commission Agent Credential
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer-link">
          <span>Already commissioned with the CBI?</span>{" "}
          <Link to="/login">Sign in with Badge ID</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;