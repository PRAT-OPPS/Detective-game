// src/webpages/Suspects.jsx

import { useParams, useNavigate } from "react-router-dom";
import { cases } from "../data/cases";
import Navbar from "../components/Navbar";
import "../Suspects.css";

import {
  Users,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Coffee,
  Sparkles,
  Compass,
  Gavel,
  Activity,
  Fingerprint
} from "lucide-react";

function Suspects() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentCase = cases.find((item) => item.id === Number(id));

  if (!currentCase) {
    return (
      <div className="suspects-vivid-page" style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2>Case Dossier Not Found</h2>
        <button
          className="bottom-action-btn"
          onClick={() => navigate("/")}
          style={{ margin: "20px auto" }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const suspects = currentCase.suspects || [];

  return (
    <div className="suspects-vivid-page">
      {/* Universal Investigation Navigation Bar */}
      <Navbar caseId={id} activePage="suspects" />

      <main className="suspects-main-container">
        {/* Hero Header Banner */}
        <section className="suspects-hero-banner">
          <div>
            <div className="suspects-tag-row">
              <span className="cbi-badge-pill">CBI // DOSSIER 00{id}</span>
              <span className="case-link-pill">{currentCase.title}</span>
            </div>
            <h1>Suspect Investigation</h1>
            <p>
              Compare sworn alibis, review psychological tells, and bring persons of interest in for direct questioning.
            </p>
          </div>

          {/* Patrick Jane's Observation Box */}
          <div className="jane-mindset-box">
            <div className="jane-avatar-ring">☕</div>
            <div className="jane-quote-text">
              <strong>PATRICK JANE'S PSYCHOLOGICAL READ</strong>
              <p>
                "Nobody tells the whole truth on the first interview. Pay attention to what they deliberately choose not to say."
              </p>
            </div>
          </div>
        </section>

        {/* Quick Investigation Metrics Strip */}
        <section className="suspects-metrics-strip">
          <div className="metric-pill-card">
            <div className="metric-icon-wrap">
              <Users size={20} />
            </div>
            <div className="metric-data">
              <span>PERSONS OF INTEREST</span>
              <strong>{suspects.length} Suspects Logged</strong>
            </div>
          </div>

          <div className="metric-pill-card">
            <div className="metric-icon-wrap">
              <Fingerprint size={20} />
            </div>
            <div className="metric-data">
              <span>VICTIM</span>
              <strong>{currentCase.victim}</strong>
            </div>
          </div>

          <div className="metric-pill-card">
            <div className="metric-icon-wrap">
              <MapPin size={20} />
            </div>
            <div className="metric-data">
              <span>CRIME LOCATION</span>
              <strong>{currentCase.location}</strong>
            </div>
          </div>

          <div className="metric-pill-card">
            <div className="metric-icon-wrap">
              <Activity size={20} />
            </div>
            <div className="metric-data">
              <span>CLEARANCE STATUS</span>
              <strong style={{ color: "#ffc870" }}>Active Investigation</strong>
            </div>
          </div>
        </section>

        {/* Section Headline */}
        <div className="section-headline">
          <h2>Registered Persons of Interest</h2>
          <span>{suspects.length} CONFIDENTIAL FILES AVAILABLE</span>
        </div>

        {/* Clean 3-Column Suspect Dossier Grid */}
        <section className="suspect-dossier-grid">
          {suspects.map((suspect, index) => {
            const isHighThreat =
              (suspect.traits?.deception || 50) > 70 ||
              (suspect.traits?.defensiveness || 50) > 75;

            return (
              <div key={suspect.id} className="suspect-dossier-card">
                {/* Stamp & Threat Tag */}
                <div className="card-stamp-row">
                  <span className="dossier-file-stamp">POI FILE // 00{suspect.id}</span>
                  <span className={`threat-tag ${isHighThreat ? "high" : "moderate"}`}>
                    {isHighThreat ? "HIGH DEFENSIVENESS" : "GUARDED"}
                  </span>
                </div>

                {/* Avatar Portrait & Identity */}
                <div className="suspect-profile-center">
                  <div className="suspect-badge-portrait">
                    {index === 0 ? "🏄" : index === 1 ? "🚘" : "🍸"}
                  </div>
                  <div className="suspect-title-group">
                    <h3>{suspect.name}</h3>
                    <span>{suspect.role}</span>
                  </div>
                </div>

                {/* Alibi Tag */}
                <div className="dossier-alibi-strip">
                  <MapPin size={14} color="#ffc870" />
                  <span>
                    <strong>Claimed Alibi:</strong> {suspect.alibi}
                  </span>
                </div>

                {/* Sworn Initial Statement */}
                <div className="statement-transcript-box">
                  "{suspect.statement}"
                </div>

                {/* Psychological Behavior Read */}
                <div className="psych-intel-box">
                  <strong>PSYCHOLOGICAL BEHAVIOR PROFILE</strong>
                  {suspect.personality || "Guarded demeanour during preliminary questioning."}
                </div>

                {/* Interrogate CTA */}
                <button
                  className="card-interrogate-btn"
                  onClick={() =>
                    navigate(`/interrogation/${id}?suspect=${suspect.id}`)
                  }
                >
                  <span>Interrogate {suspect.name.split(" ")[0]}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </section>

        {/* Bottom Navigation */}
        <div className="suspects-bottom-nav">
          <button
            className="bottom-action-btn"
            onClick={() => navigate(`/crime-scene/${id}`)}
          >
            <Compass size={16} />
            <span>Search Crime Scene</span>
          </button>

          <button
            className="bottom-action-btn primary"
            onClick={() => navigate(`/accusation/${id}`)}
          >
            <span>Proceed to Final Accusation</span>
            <Gavel size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}

export default Suspects;