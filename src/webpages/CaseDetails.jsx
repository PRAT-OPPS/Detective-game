// src/webpages/CaseDetails.jsx

import { useNavigate, useParams } from "react-router-dom";
import { cases } from "../data/cases";
import Navbar from "../components/Navbar";
import {
  Users,
  Compass,
  MapPin,
  User,
  ShieldAlert,
  ArrowRight,
  Coffee,
  Sparkles
} from "lucide-react";

function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentCase = cases.find((item) => item.id === Number(id));

  if (!currentCase) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "#fff" }}>
        <h2>Case file not found</h2>
        <button onClick={() => navigate("/")} style={{ marginTop: "15px", padding: "10px 20px" }}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0c0e14", color: "#e4e7eb" }}>
      <Navbar caseId={id} activePage="case" />

      <main style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
        {/* Case Dossier Header */}
        <div
          style={{
            background: "rgba(18, 22, 32, 0.8)",
            border: "1px solid rgba(255, 200, 112, 0.25)",
            borderLeft: "5px solid #b82631",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px"
          }}
        >
          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <span
              style={{
                background: "#b82631",
                color: "#fff",
                fontSize: "11px",
                fontWeight: "800",
                padding: "4px 10px",
                borderRadius: "4px",
                letterSpacing: "1px"
              }}
            >
              CBI CASE FILE 00{currentCase.id}
            </span>
            <span
              style={{
                background: "rgba(0,0,0,0.5)",
                color: "#ffc870",
                fontSize: "12px",
                padding: "4px 12px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <MapPin size={13} /> {currentCase.location}
            </span>
          </div>

          <h1 style={{ fontSize: "32px", color: "#fff", margin: "0 0 10px" }}>
            {currentCase.title}
          </h1>

          <p style={{ color: "#a5b0c0", fontSize: "15px", lineHeight: "1.6", margin: "0 0 20px" }}>
            {currentCase.description}
          </p>

          <div
            style={{
              display: "flex",
              gap: "30px",
              paddingTop: "15px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              fontSize: "13.5px",
              color: "#c0c7d2"
            }}
          >
            <div>
              <strong style={{ color: "#ffc870" }}>Victim:</strong> {currentCase.victim}
            </div>
            <div>
              <strong style={{ color: "#ffc870" }}>Persons of Interest:</strong>{" "}
              {currentCase.suspects.length} Recorded
            </div>
            <div>
              <strong style={{ color: "#ffc870" }}>Known Clues:</strong>{" "}
              {currentCase.evidence.length} Items Cataloged
            </div>
          </div>
        </div>

        {/* Jane's Mentalist Guidance */}
        <div
          style={{
            background: "rgba(35, 16, 22, 0.6)",
            border: "1px dashed rgba(201, 147, 66, 0.4)",
            borderRadius: "10px",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "35px"
          }}
        >
          <Coffee size={28} color="#ffc870" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ color: "#ffc870", fontSize: "12px", letterSpacing: "1px" }}>
              PATRICK JANE'S STRATEGY NOTE
            </strong>
            <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "#dedede", fontStyle: "italic" }}>
              "Always inspect the people before the crime scene. Physical clues tell you how a crime was committed, but human behavior tells you why."
            </p>
          </div>
        </div>

        {/* Action Pathways */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Pathway 1: Examine Suspects First */}
          <div
            onClick={() => navigate(`/suspects/${id}`)}
            style={{
              background: "radial-gradient(circle at 50% 0%, rgba(184, 38, 49, 0.25) 0%, rgba(18, 22, 32, 0.9) 100%)",
              border: "1px solid rgba(184, 38, 49, 0.4)",
              borderRadius: "12px",
              padding: "26px",
              cursor: "pointer",
              transition: "transform 0.2s ease, border-color 0.2s ease"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ffc870")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(184, 38, 49, 0.4)")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
              <Users size={32} color="#ffc870" />
              <span style={{ fontSize: "11px", color: "#b82631", fontWeight: "800" }}>RECOMMENDED FIRST</span>
            </div>
            <h2 style={{ fontSize: "20px", color: "#fff", margin: "0 0 8px" }}>
              1. Review Suspect Dossiers
            </h2>
            <p style={{ fontSize: "13px", color: "#8b949e", lineHeight: "1.5", margin: "0 0 20px" }}>
              Study alibis, behavioral statements, and personality profiles of the {currentCase.suspects.length} suspects.
            </p>
            <button
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #a61c27, #680d14)",
                border: "none",
                color: "#fff",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer"
              }}
            >
              Examine Suspect Profiles <ArrowRight size={16} />
            </button>
          </div>

          {/* Pathway 2: Enter Crime Scene */}
          <div
            onClick={() => navigate(`/crime-scene/${id}`)}
            style={{
              background: "rgba(18, 22, 32, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "26px",
              cursor: "pointer",
              transition: "transform 0.2s ease, border-color 0.2s ease"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255, 200, 112, 0.5)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
              <Compass size={32} color="#c9d1d9" />
              <span style={{ fontSize: "11px", color: "#7a828e", fontWeight: "700" }}>FORENSIC SEARCH</span>
            </div>
            <h2 style={{ fontSize: "20px", color: "#fff", margin: "0 0 8px" }}>
              2. Inspect Crime Scene
            </h2>
            <p style={{ fontSize: "13px", color: "#8b949e", lineHeight: "1.5", margin: "0 0 20px" }}>
              Explore the location with flashlight mode, uncover forensic pins, and gather material clues.
            </p>
            <button
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#fff",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer"
              }}
            >
              Enter Crime Scene <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CaseDetails;