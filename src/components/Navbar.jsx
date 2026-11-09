// src/components/Navbar.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderSearch,
  FileSearch,
  Users,
  LayoutDashboard,
  LogOut,
  LogIn,
  Activity,
  Zap
} from "lucide-react";
import { getCurrentUser, logoutAgent } from "../utils/auth";

function Navbar({ caseId, activePage = "dashboard" }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  useEffect(() => {
    // Sync active agent profile
    setCurrentUser(getCurrentUser());
  }, []);

  function handleLogout() {
    logoutAgent();
    setCurrentUser(null);
    navigate("/login");
  }

  const navigation = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
      key: "dashboard"
    },
    {
      name: "Lie Detector [Arcade]",
      icon: Zap,
      path: "/mini-game",
      key: "mini-game"
    },
    {
      name: "Case Details",
      icon: FolderSearch,
      path: `/case/${caseId}`,
      key: "case"
    },
    {
      name: "Crime Scene",
      icon: FileSearch,
      path: `/crime-scene/${caseId}`,
      key: "scene"
    },
    {
      name: "Evidence Room",
      icon: FileSearch,
      path: `/evidence/${caseId}`,
      key: "evidence"
    },
    {
      name: "Suspects",
      icon: Users,
      path: `/suspects/${caseId}`,
      key: "suspects"
    },
    {
      name: "Lie Detector",
      icon: Activity,
      path: caseId ? `/lie-detector/${caseId}` : "/lie-detector",
      key: "lie-detector"
    }
  ];

  return (
    <nav className="main-navbar">
      {/* Brand Logo & Title */}
      <div className="navbar-brand" onClick={() => navigate("/")}>
        <span className="brand-icon">☕</span>
        <div>
          <h2>SHADOW FILES</h2>
          <span>CBI PSYCHOLOGICAL INVESTIGATION</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        {navigation
          // Shows Dashboard, Arcade, & Lie Detector everywhere; shows Case tabs when inside a case
          .filter(
            (link) =>
              caseId ||
              link.key === "dashboard" ||
              link.key === "mini-game" ||
              link.key === "lie-detector"
          )
          .map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.key}
                className={
                  activePage === link.key ? "nav-link active" : "nav-link"
                }
                onClick={() => navigate(link.path)}
              >
                <Icon size={17} />
                {link.name}
              </button>
            );
          })}
      </div>

      {/* Mentalist Agent Profile Status */}
      <div className="navbar-auth-section">
        {currentUser ? (
          <div className="cbi-agent-profile">
            <img
              src={currentUser.avatar?.avatarUrl}
              alt={currentUser.name}
              className="cbi-nav-avatar"
            />
            <div className="cbi-agent-info">
              <span className="cbi-agent-name">{currentUser.name}</span>
              <span className="cbi-agent-badge">{currentUser.badge}</span>
            </div>
            <button
              className="cbi-logout-btn"
              title="Sign Out of CBI Terminal"
              onClick={handleLogout}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            className="cbi-signin-btn"
            onClick={() => navigate("/login")}
          >
            <LogIn size={16} />
            <span>CBI Access</span>
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;