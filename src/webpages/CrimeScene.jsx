// src/webpages/CrimeScene.jsx

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cases } from "../data/cases";
import { getEvidence, saveEvidence } from "../utils/storage";
import { getCurrentUser } from "../utils/auth";
import "../CrimeScene.css";

import {
  ArrowLeft,
  Search,
  Sparkles,
  CheckCircle2,
  Coffee,
  Flashlight,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  X,
  MapPin
} from "lucide-react";

// Native Web Audio Synthesizer for Discovery Chimes
function playCrimeAudio(type = "clue") {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "clue") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === "complete") {
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + 0.6);
      });
    }
  } catch (err) {}
}

// Multi-Case Crime Scene Visual & Forensic Coordinates
const CASE_SCENE_DATA = {
  // Case 1: The Midnight Murder
  1: {
    photoUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&auto=format&fit=crop&q=80",
    hotspots: {
      1: { x: 48, y: 72, label: "Mahogany Study Desk" },
      2: { x: 74, y: 64, label: "Study Bookcase & Letters" },
      3: { x: 26, y: 78, label: "Garden Balcony Sill" },
      4: { x: 62, y: 52, label: "Carved Fireplace Mantle" }
    },
    observations: {
      1: "Notice the crystal didn't shatter from a dropped fall. It was struck from the side at high impact. Richard was fighting for his life at exactly 11:45 PM.",
      2: "Folded three times, worn at the creases, yet Richard never reported the threat. He knew the sender intimately.",
      3: "Size 10 gentleman's oxford boot with garden clay. Walking at a measured, deliberate pace—the killer didn't run. Cold and calculated.",
      4: "Bears the crest of the inner study vault. Someone had access to Richard's personal records before or immediately after the murder."
    }
  },

  // Case 2: Red Tide (Santa Marta Beach Cove)
  2: {
    photoUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80",
    hotspots: {
      1: { x: 38, y: 70, label: "Surfboard on Wet Sand" },
      2: { x: 68, y: 78, label: "Pier Base & Damp Towel" },
      3: { x: 78, y: 54, label: "Wooden Pier Pylons" },
      4: { x: 22, y: 82, label: "Dune Shrubbery Sand" }
    },
    observations: {
      1: "Fresh wax cross-contamination. Christine didn't surf alone at dusk—another board was pressed directly against hers.",
      2: "Diesel fuel and engine oil. Someone tried using the launch boat before the tide turned.",
      3: "The chain clasp was snapped from behind. She was seized near the pier before reaching the water.",
      4: "Battery contacts deliberately smashed with a stone. Someone needed the beach completely dark."
    }
  },

  // Case 3: The Case of the Hollow Maestro (Gallery of Echoes Penthouse)
  3: {
    photoUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80",
    hotspots: {
      1: { x: 46, y: 72, label: "Velvet Chaise Woodwork" },
      2: { x: 34, y: 64, label: "Artisanal Tonic Tumbler" },
      3: { x: 84, y: 48, label: "Penthouse Elevator Keypad" },
      4: { x: 64, y: 38, label: "Fireplace Brass Metronome" }
    },
    observations: {
      1: "18-karat gold with microscopic balance indentations. Someone leaned over Arthur while he was collapsing to retrieve a document.",
      2: "Smell that faint bitter almond? Unrefined industrial cyanide. Not a chemist's poison—this came from an industrial gold-mining syndicate.",
      3: "Penthouse elevator called down at 10:52 PM. Julian swore on his corporate reputation he was dining across town at 10:30 PM.",
      4: "Set to 60 BPM. Arthur despised metronomes; he was a synesthete. The killer set this theatrical scene to mock an occult suicide."
    }
  }
};

function CrimeScene() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sceneRef = useRef(null);

  const currentCase = cases.find((item) => item.id === Number(id)) || cases[0];
  const activeUser = getCurrentUser();

  const caseScene = CASE_SCENE_DATA[Number(id)] || CASE_SCENE_DATA[1];

  const [collected, setCollected] = useState(() => getEvidence(id));
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [perceptionMode, setPerceptionMode] = useState(false);
  const [flashlightEnabled, setFlashlightEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    saveEvidence(id, collected);
  }, [id, collected]);

  if (!currentCase) {
    return (
      <div className="vivid-crime-page" style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2>Case Dossier Not Found</h2>
        <button className="back-case-btn" onClick={() => navigate("/")}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Mouse tracking for 3D Parallax Tilt & Flashlight Beam
  function handleMouseMove(e) {
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
  }

  function handleMouseLeave() {
    // Smooth reset to center when mouse leaves
    setMousePos({ x: 50, y: 50 });
  }

  // Check if flashlight cursor is near a hotspot (within 13% radius)
  function isNearCursor(coords) {
    if (!flashlightEnabled && !perceptionMode) return false;
    const dx = mousePos.x - coords.x;
    const dy = mousePos.y - coords.y;
    return Math.sqrt(dx * dx + dy * dy) < 13.5;
  }

  function handleCollectItem(item) {
    const alreadyCollected = collected.some((e) => e.id === item.id);
    if (!alreadyCollected) {
      const updated = [...collected, item];
      setCollected(updated);
      if (soundEnabled) {
        if (updated.length === currentCase.evidence.length) {
          playCrimeAudio("complete");
        } else {
          playCrimeAudio("clue");
        }
      }
    }
  }

  const totalEvidence = currentCase.evidence.length;
  const progressPercent =
    totalEvidence === 0 ? 0 : Math.round((collected.length / totalEvidence) * 100);
  const allDiscovered = collected.length === totalEvidence && totalEvidence > 0;

  // Real-time 3D camera angles
  const tiltX = ((mousePos.y - 50) * -0.16).toFixed(2);
  const tiltY = ((mousePos.x - 50) * 0.16).toFixed(2);

  return (
    <div className="vivid-crime-page">
      {/* Top Navigation */}
      <nav className="vivid-navbar">
        <div className="nav-left">
          <button className="back-case-btn" onClick={() => navigate(`/case/${id}`)}>
            <ArrowLeft size={16} />
            Back to Case Briefing
          </button>
          <span className="brand-badge">
            <Compass size={16} />
            CBI FORENSIC SEARCH // SCENE 00{id}
          </span>
        </div>

        <div className="nav-actions">
          <button
            className={`toggle-btn ${perceptionMode ? "active" : ""}`}
            onClick={() => setPerceptionMode(!perceptionMode)}
            title="Toggle Patrick Jane's Sensory Observation Mode"
          >
            <Sparkles size={15} />
            <span>{perceptionMode ? "Jane's Vision ON" : "Perception Mode"}</span>
          </button>

          <button
            className={`toggle-btn ${flashlightEnabled ? "active" : ""}`}
            onClick={() => setFlashlightEnabled(!flashlightEnabled)}
            title="Toggle Searchlight Spotlight Beam"
          >
            <Flashlight size={15} />
            <span>Searchlight</span>
          </button>

          <button
            className="toggle-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="Toggle Audio Cues"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
        </div>
      </nav>

      <main className="crime-main-content">
        {/* Case Dossier Banner */}
        <section className="crime-dossier-banner">
          <div className="dossier-text">
            <div className="dossier-meta">
              <span className="case-id-tag">CASE 00{id}</span>
              <span className="location-tag">
                <MapPin size={13} />
                {currentCase.location}
              </span>
            </div>
            <h1>{currentCase.title} — Crime Scene</h1>
            <p>
              Sweep your searchlight across the room. Clues stay concealed in shadows until illuminated.
            </p>
          </div>

          <div className="jane-tip-card">
            <img
              src={
                activeUser?.avatar?.avatarUrl ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
              }
              alt="Patrick Jane"
              className="jane-avatar-mini"
            />
            <div className="jane-quote-wrapper">
              <strong>PATRICK JANE'S ADVISORY</strong>
              <p>
                {allDiscovered
                  ? "Splendid work. Every trace is gathered—now let's confront the suspects."
                  : "Listen to the room. The killer thought they hid every trace, but human panic always leaves a tell."}
              </p>
            </div>
          </div>
        </section>

        {/* 3D Perspective Stage Container */}
        <div className="interactive-scene-perspective-wrap">
          <section
            ref={sceneRef}
            className={`interactive-scene-frame ${perceptionMode ? "perception-mode" : ""}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              "--mouse-x": `${mousePos.x}%`,
              "--mouse-y": `${mousePos.y}%`,
              "--tilt-x": `${tiltX}deg`,
              "--tilt-y": `${tiltY}deg`
            }}
          >
            {/* 3D Parallax Background Image */}
            <img
              src={caseScene.photoUrl}
              alt={currentCase.title}
              className="scene-background-photo"
            />

            {/* Dynamic Volumetric Flashlight Overlay */}
            {flashlightEnabled && <div className="flashlight-overlay" />}

            {/* Forensic Hotspots: REVEAL ONLY ON PROXIMITY OR HOVER */}
            {currentCase.evidence.map((evidenceItem) => {
              const coords =
                caseScene.hotspots[evidenceItem.id] || { x: 50, y: 50, label: "Object" };
              const isCollected = collected.some((e) => e.id === evidenceItem.id);
              const isIlluminated = isNearCursor(coords);

              return (
                <div
                  key={evidenceItem.id}
                  className={`scene-hotspot-pin ${isCollected ? "collected" : ""} ${
                    isIlluminated ? "illuminated" : "hidden-in-dark"
                  }`}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  onClick={() => setActiveModalItem(evidenceItem)}
                >
                  <div className="pin-core">
                    {isCollected ? <CheckCircle2 size={18} /> : <Search size={18} />}
                  </div>
                  {!isCollected && <div className="pin-pulse-ring" />}

                  <div className="hotspot-tooltip">
                    {coords.label}: {evidenceItem.name} {isCollected && "✓"}
                  </div>
                </div>
              );
            })}

            {/* Ambient HUD Coordinates */}
            <div className="hud-coordinates">
              SECTOR: CBI-FORENSIC // X:{Math.round(mousePos.x)} Y:{Math.round(mousePos.y)} // 3D TILT: {tiltY}°
            </div>
          </section>
        </div>

        {/* Progress Tracker & Action Controls */}
        <section className="scene-footer-controls">
          <div className="investigation-progress-card">
            <div className="progress-header">
              <span className="progress-title">
                <Coffee size={18} />
                CBI Evidence Discovery Progress
              </span>
              <span className="progress-count">
                {collected.length} of {totalEvidence} Clues Cataloged ({progressPercent}%)
              </span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="scene-action-buttons">
            <button
              className="proceed-btn"
              onClick={() => navigate(`/suspects/${id}`)}
            >
              <span>Interrogate Suspects</span>
              <ArrowRight size={17} />
            </button>
            <button
              className="secondary-action-btn"
              onClick={() => navigate(`/evidence/${id}`)}
            >
              Open Evidence Locker
            </button>
          </div>
        </section>
      </main>

      {/* Jane's Forensic Inspection Modal Chamber */}
      {activeModalItem && (
        <div className="modal-backdrop" onClick={() => setActiveModalItem(null)}>
          <div
            className="clue-inspection-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal-btn"
              onClick={() => setActiveModalItem(null)}
            >
              <X size={20} />
            </button>

            <div className="clue-badge-header">
              <div className="clue-large-icon">{activeModalItem.icon}</div>
              <div className="clue-meta-titles">
                <span>EVIDENCE DOSSIER #{activeModalItem.id}</span>
                <h3>{activeModalItem.name}</h3>
              </div>
            </div>

            <div className="clue-evidence-body">
              <p>{activeModalItem.description}</p>
            </div>

            <div className="mentalist-dialogue-card">
              <span className="dialogue-speaker">
                <Sparkles size={14} />
                PATRICK JANE'S DEDUCTION
              </span>
              <p>
                "{caseScene.observations[activeModalItem.id] ||
                  "Everything leaves an impression if you know how to observe."}"
              </p>
            </div>

            {collected.some((e) => e.id === activeModalItem.id) ? (
              <button className="collect-evidence-action-btn collected-state" disabled>
                <CheckCircle2 size={18} />
                Cataloged in CBI Evidence Locker
              </button>
            ) : (
              <button
                className="collect-evidence-action-btn"
                onClick={() => {
                  handleCollectItem(activeModalItem);
                }}
              >
                <Search size={18} />
                Collect & Pocket Clue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CrimeScene;