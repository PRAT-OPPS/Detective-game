// src/webpages/Home.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cases } from "../data/cases";
import Navbar from "../components/Navbar";
import { soundManager } from "../utils/soundManager";
import "../Home.css";

// Wallpapers (Red Space Background)
import janeWallpaper from "../assets/patric jane wallpaper.jpeg";
import lisbonWallpaper from "../assets/lesbon wallpaper.jpeg";
import choWallpaper from "../assets/agent cho wallpaper.jpeg";
import rigsbyWallpaper from "../assets/rigsby wallpaler.jpeg";
import vanPeltWallpaper from "../assets/van oelt wallpaper.jpeg";

// Profile Photos (Yellow Box & Icons)
import janePro from "../assets/jane pro.jpeg";
import lisbonPro from "../assets/lisbon pro.jpeg";
import choPro from "../assets/ajent cho pro.jpeg";
import rigsbyPro from "../assets/rigsby pro.jpeg";
import vanPeltPro from "../assets/van pelt pro.jpeg";

import {
  Search,
  FolderSearch,
  ShieldCheck,
  FileSearch,
  Fingerprint,
  MapPin,
  User,
  ArrowRight,
  Users,
  Volume2,
  VolumeX
} from "lucide-react";

const CBI_AGENT_ROSTER = [
  {
    id: "jane",
    name: "Patrick Jane",
    role: "Senior Consultant",
    proIcon: janePro,
    wallpaper: janeWallpaper
  },
  {
    id: "lisbon",
    name: "Teresa Lisbon",
    role: "Unit Leader",
    proIcon: lisbonPro,
    wallpaper: lisbonWallpaper
  },
  {
    id: "cho",
    name: "Kimball Cho",
    role: "Tactical Interrogation",
    proIcon: choPro,
    wallpaper: choWallpaper
  },
  {
    id: "rigsby",
    name: "Wayne Rigsby",
    role: "Arson & Ballistics",
    proIcon: rigsbyPro,
    wallpaper: rigsbyWallpaper
  },
  {
    id: "vanpelt",
    name: "Grace Van Pelt",
    role: "Digital Forensics",
    proIcon: vanPeltPro,
    wallpaper: vanPeltWallpaper
  }
];

function Home() {
  const navigate = useNavigate();

  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const activeAgent = CBI_AGENT_ROSTER[selectedAgentIndex];

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isAudioMuted, setIsAudioMuted] = useState(() => soundManager.isMuted());

  // Home Page Audio Lifecycle: Starts on mount, STOPS on leave
  useEffect(() => {
    soundManager.playHomeTheme();

    return () => {
      // Guaranteed stop when leaving the Home page
      soundManager.stopAll();
    };
  }, []);

  function handleToggleMute() {
    const muted = soundManager.toggleMute();
    setIsAudioMuted(muted);
  }

  const filteredCases = cases.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.victim.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "unsolved" && item.status !== "solved") ||
      (filter === "solved" && item.status === "solved");

    return matchesSearch && matchesFilter;
  });

  const totalCases = cases.length;
  const solvedCases = cases.filter((item) => item.status === "solved").length;
  const unsolvedCases = totalCases - solvedCases;

  return (
    <div className="cbi-home-wrapper">
      {/* Red Space: 16:9 Laptop Wallpaper Orientation */}
      <div className="cbi-dynamic-backdrop">
        <img
          src={activeAgent.wallpaper}
          alt={activeAgent.name}
          className="cbi-backdrop-img"
        />
        <div className="cbi-backdrop-overlay" />
      </div>

      <Navbar activePage="dashboard" />

      <main className="cbi-home-content">
        <section className="cbi-hero-section">
          <div className="cbi-hero-left">
            <span className="cbi-division-tag">
              <Fingerprint size={14} />
              CBI SACRAMENTO // CRIMINAL INVESTIGATION DIVISION
            </span>

            <h1>
              SHADOW <span>FILES</span>
            </h1>

            <p className="cbi-hero-subtitle">
              Every mind has a tell. Every crime leaves a trace.
            </p>

            <p className="cbi-hero-desc">
              Welcome, Agent. Select an open case file below, examine forensic evidence in 3D, and interrogate suspects to solve the murder.
            </p>

            <div className="cbi-wallpaper-switcher">
              <span className="switcher-label">CBI SQUAD ROSTER (CLICK TO SWITCH BACKDROP):</span>
              <div className="switcher-chips">
                {CBI_AGENT_ROSTER.map((agent, idx) => (
                  <button
                    key={agent.id}
                    className={`agent-chip-btn ${idx === selectedAgentIndex ? "active" : ""}`}
                    onClick={() => setSelectedAgentIndex(idx)}
                  >
                    <img
                      src={agent.proIcon}
                      alt={agent.name}
                      className="agent-profile-avatar-thumb"
                    />
                    <span>{agent.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Yellow Box: Upright Profile Photo */}
          <div className="cbi-hero-right">
            <div className="hero-preview-frame">
              <img
                src={activeAgent.proIcon}
                alt={activeAgent.name}
                className="hero-pro-img"
              />
              <div className="preview-caption-strip">
                <strong>{activeAgent.name}</strong>
                <span>{activeAgent.role}</span>
              </div>
            </div>

            <div className="home-audio-pill">
              <button onClick={handleToggleMute} className="home-audio-btn">
                {isAudioMuted ? (
                  <VolumeX size={15} color="#ff7882" />
                ) : (
                  <Volume2 size={15} color="#ffc870" />
                )}
              </button>
              <div>
                <span className="home-audio-tag">THEME SOUNDTRACK (50%)</span>
                <span className="home-audio-name">The Mentalist Main Theme</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cbi-stats-grid">
          <div className="cbi-stat-box">
            <div className="stat-icon-wrapper">
              <FolderSearch size={22} />
            </div>
            <div className="stat-info">
              <span>REGISTERED CASES</span>
              <h2>{totalCases} Cases</h2>
            </div>
          </div>

          <div className="cbi-stat-box">
            <div className="stat-icon-wrapper">
              <FileSearch size={22} />
            </div>
            <div className="stat-info">
              <span>ACTIVE INVESTIGATIONS</span>
              <h2>{unsolvedCases} Open</h2>
            </div>
          </div>

          <div className="cbi-stat-box">
            <div className="stat-icon-wrapper">
              <ShieldCheck size={22} />
            </div>
            <div className="stat-info">
              <span>CLOSED DOSSIERS</span>
              <h2>{solvedCases} Solved</h2>
            </div>
          </div>

          <div className="cbi-stat-box">
            <div className="stat-icon-wrapper">
              <Users size={22} />
            </div>
            <div className="stat-info">
              <span>CBI SQUAD</span>
              <h2>5 Operatives</h2>
            </div>
          </div>
        </section>

        <section className="cbi-cases-section">
          <div className="cases-section-head">
            <div className="cases-title-group">
              <h2>Classified Case Database</h2>
              <p>Select a homicide dossier to begin field investigation.</p>
            </div>

            <div className="search-filter-controls">
              <div className="cbi-search-input-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search case, victim, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-btn-group">
                <button
                  className={`filter-pill ${filter === "all" ? "active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All Cases
                </button>
                <button
                  className={`filter-pill ${filter === "unsolved" ? "active" : ""}`}
                  onClick={() => setFilter("unsolved")}
                >
                  Unsolved
                </button>
                <button
                  className={`filter-pill ${filter === "solved" ? "active" : ""}`}
                  onClick={() => setFilter("solved")}
                >
                  Solved
                </button>
              </div>
            </div>
          </div>

          <div className="cbi-case-cards-grid">
            {filteredCases.map((item) => (
              <div key={item.id} className="case-card-reloaded">
                <div className="case-top-stamp">
                  <span className="case-file-id">CASE 00{item.id}</span>
                  <span className="case-diff-badge">{item.difficulty || "MEDIUM"}</span>
                </div>

                <h3>{item.title}</h3>
                <p className="case-brief-desc">{item.description}</p>

                <div className="case-meta-tags-row">
                  <div className="meta-item">
                    <User size={14} color="#ffc870" />
                    <span><strong>Victim:</strong> {item.victim}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={14} color="#ffc870" />
                    <span><strong>Location:</strong> {item.location}</span>
                  </div>
                </div>

                <button
                  className="case-card-action-btn"
                  onClick={() => navigate(`/case/${item.id}`)}
                >
                  <span>Open Case Dossier</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;