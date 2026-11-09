// src/webpages/DetroitInterrogation.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { cases } from "../data/cases";
import { getCurrentUser } from "../utils/auth";
import { soundManager } from "../utils/soundManager";
import Navbar from "../components/Navbar";
import "../DetroitInterrogation.css";

import {
  Activity,
  Heart,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Coffee,
  Sparkles,
  Send,
  Eye,
  Gavel,
  Flame,
  Shield,
  RotateCcw,
  Key,
  Sliders,
  Skull
} from "lucide-react";

// Curated Suspect Lineup Photos
const SUSPECT_PHOTOS = {
  "1-1": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=450&auto=format&fit=crop&q=80",
  "1-2": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=450&auto=format&fit=crop&q=80",
  "1-3": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=450&auto=format&fit=crop&q=80",
  "2-1": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=450&auto=format&fit=crop&q=80",
  "2-2": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=450&auto=format&fit=crop&q=80",
  "2-3": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=450&auto=format&fit=crop&q=80"
};

// Web Audio Synthesizer for Heartbeat & Tension Chimes
function playBiometricAudio(type = "heartbeat", stress = 50) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "heartbeat") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(55 + (stress * 0.4), ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "tell-alert") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "tell-success") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (err) {}
}

// Micro-Expression Definitions with Patrick Jane Insight
const MICRO_EXPRESSIONS = [
  {
    id: "pupil",
    name: "Pupil Dilation & Saccadic Blink",
    icon: "👁️",
    cue: "Sudden pupil expansion and eyes darting left",
    janeInsight: "Notice the ocular saccade? The sympathetic nervous system fired when he pictured the murder scene."
  },
  {
    id: "sweat",
    name: "Cold Temple Sweat Bead",
    icon: "💧",
    cue: "Micro-perspiration forming at the hairline",
    janeInsight: "Autonomic vasoconstriction. Blood is rushing away from the extremities to the core because he feels trapped."
  },
  {
    id: "lip",
    name: "Subtle Lip Compression",
    icon: "👄",
    cue: "Tightened lips and rapid tongue dart",
    janeInsight: "Micro-lip compression. Subconsciously biting back a confession he desperately wants to speak."
  },
  {
    id: "carotid",
    name: "Carotid Pulse Throbbing",
    icon: "🫀",
    cue: "Visible vein flutter in the neck artery",
    janeInsight: "His systolic blood pressure just jumped past 140. He's terrified of us searching the pier."
  },
  {
    id: "fingers",
    name: "Nervous Finger Drumming",
    icon: "🖐️",
    cue: "Rhythmic tapping and sudden palm clench",
    janeInsight: "Flight-or-fight motor leakage. His body wants to sprint out of this interrogation room."
  }
];

function DetroitInterrogation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCase = cases.find((c) => c.id === Number(id)) || cases[1] || cases[0];
  const activeUser = getCurrentUser();

  const suspectQueryId = Number(searchParams.get("suspect")) || 1;
  const currentSuspect =
    currentCase?.suspects.find((s) => s.id === suspectQueryId) ||
    currentCase?.suspects[0];

  const isCulprit = currentSuspect?.id === currentCase?.culprit;

  // Detroit: Become Human Stress Mechanics
  const [stress, setStress] = useState(currentSuspect?.traits?.defensiveness || 48);
  const [deception, setDeception] = useState(currentSuspect?.traits?.deception || 65);
  const [status, setStatus] = useState("interrogating"); // "interrogating", "confessed", "breakdown"

  // Micro-Expression Lie Detector State
  const [activeTell, setActiveTell] = useState(null);
  const [tellTimeLeft, setTellTimeLeft] = useState(0); // 1.5s countdown
  const [caughtTellsCount, setCaughtTellsCount] = useState(0);
  const [unlockedBreakthrough, setUnlockedBreakthrough] = useState(false);
  const [janeComment, setJaneComment] = useState(
    "Observe their eyes and throat. The optimal confession zone is between 70% and 85% stress. Don't push them past 90% or they will clam up completely."
  );

  // Dialogue History
  const [transcript, setTranscript] = useState([
    {
      speaker: currentSuspect?.name,
      text: `"${currentSuspect?.statement}"`,
      type: "suspect"
    }
  ]);

  const [customQuestion, setCustomQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Gemini AI Mode Toggle & Key
  const [aiEnabled, setAiEnabled] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("cbi_gemini_key") || "");
  const [showConfig, setShowConfig] = useState(false);

  // Start Theme music
  useEffect(() => {
    soundManager.playInterrogationTheme();
    return () => soundManager.stopAll();
  }, []);

  // Biometric Heartbeat Loop
  useEffect(() => {
    if (status !== "interrogating") return;
    const intervalMs = Math.max(380, 1000 - stress * 6.5);
    const timer = setInterval(() => {
      playBiometricAudio("heartbeat", stress);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [stress, status]);

  // Micro-Expression Timer (1.5 seconds)
  useEffect(() => {
    if (!activeTell) return;

    const startTime = Date.now();
    const duration = 1500;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setTellTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setActiveTell(null);
        // Missed tell penalty: Stress decreases as suspect regains composure
        setStress((s) => Math.max(20, s - 4));
        setJaneComment("You missed the tell! The suspect noticed your hesitation and regained their composure.");
      }
    }, 30);

    return () => clearInterval(interval);
  }, [activeTell]);

  // Handle "CAUGHT A TELL!" Action (Click or Spacebar)
  const handleCatchTell = useCallback(() => {
    if (!activeTell) return;

    playBiometricAudio("tell-success");
    const caught = activeTell;
    setActiveTell(null);
    setCaughtTellsCount((c) => c + 1);
    setUnlockedBreakthrough(true);

    // Stress spikes towards the confession zone!
    setStress((s) => Math.min(88, s + 9));
    setDeception((d) => Math.max(10, d - 18));
    setJaneComment(`⚡ TELL CAUGHT! ${caught.janeInsight} Breakthrough question is UNLOCKED!`);
  }, [activeTell]);

  // Spacebar hotkey listener for lightning reflexes
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === "Space" && activeTell) {
        e.preventDefault();
        handleCatchTell();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTell, handleCatchTell]);

  // Trigger random micro-expression on high stress or specific questions
  function triggerMicroExpression() {
    playBiometricAudio("tell-alert");
    const randomTell = MICRO_EXPRESSIONS[Math.floor(Math.random() * MICRO_EXPRESSIONS.length)];
    setActiveTell(randomTell);
    setTellTimeLeft(1500);
  }

  // Gemini AI Calling Engine (with safe fallback)
  async function callGeminiInterrogation(promptText, currentStress) {
    if (!apiKey) return null;
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are roleplaying as ${currentSuspect.name} (${currentSuspect.role}) in a tense detective interrogation inspired by The Mentalist and Detroit: Become Human.
Case: ${currentCase.title} - Victim: ${currentCase.victim}.
Suspect alibi: ${currentSuspect.alibi}.
Are you the guilty killer? ${isCulprit ? "YES, but lie desperately unless stress > 75%." : "NO, you are innocent but have secrets."}
Current Stress Level: ${currentStress}% (If 70-85% you start breaking down; if >90% you scream or shut down).
Detective said: "${promptText}".
Respond in 1-2 short tense sentences in character. Do not break character.`
                  }
                ]
              }
            ]
          })
        }
      );
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (err) {
      return null;
    }
  }

  // Deliver Approach Question
  async function handleApproach(type, customText = "") {
    if (isProcessing) return;
    setIsProcessing(true);

    let stressDelta = 0;
    let questionLabel = "";
    let suspectReply = "";

    if (type === "pressure") {
      questionLabel = "AGGRESSIVE PRESSURE: 'We know your alibi is a fabricated lie.'";
      stressDelta = +12;
      suspectReply = isCulprit
        ? "Stop shouting at me! You have no right to twist my words! Where is your forensic proof?!"
        : "Pressure me all you want! I swore on my mother's grave I wasn't there!";
    } else if (type === "evidence") {
      questionLabel = "CONFRONT WITH FORENSICS: 'Explain why your traces were logged at the scene.'";
      stressDelta = +8;
      suspectReply = isCulprit
        ? "The... the scene? That was a coincidence! Anyone could have left those fibers!"
        : "Check the timestamps! I was miles away when the crime occurred!";
    } else if (type === "sympathy") {
      questionLabel = "PATRICK JANE'S SYMPATHY: 'It's exhausting keeping this secret, isn't it? Let it out.'";
      stressDelta = -11; // Jane's technique to cool them down from 90%
      suspectReply = isCulprit
        ? "You... you think you understand? You don't know what happened that night... it wasn't supposed to end like that."
        : "I appreciate the tone, detective. But I really didn't do this.";
    } else if (type === "bluff") {
      questionLabel = "MENTALIST BLUFF: 'Your accomplice in the other room just signed a confession.'";
      stressDelta = isCulprit ? +16 : -5;
      suspectReply = isCulprit
        ? "They... they WHAT?! They promised they would stay quiet! What did they tell you?!"
        : "A confession? Nice try, detective. I acted alone in my alibi and nobody can claim otherwise.";
    } else if (type === "breakthrough") {
      questionLabel = "💥 BREAKTHROUGH FATAL CONTRADICTION";
      stressDelta = +15;
      suspectReply = isCulprit
        ? "ALL RIGHT! ENOUGH! YES! I was on the pier! Christine threatened to expose everything... I grabbed her and she fell into the surge! It was an accident! I didn't want her to drown!"
        : "I swear on my life I am not the killer! I was hiding my own petty theft, not murder!";
    } else if (type === "custom") {
      questionLabel = `DIRECT QUESTION: "${customText}"`;
      stressDelta = +7;
      suspectReply = isCulprit
        ? "Why are you fixating on that specific detail? That has nothing to do with what happened!"
        : "I've already answered that. My story hasn't changed.";
    }

    const nextStress = Math.min(100, Math.max(10, stress + stressDelta));
    setStress(nextStress);

    // AI Dynamic Dialogue Override if enabled
    if (aiEnabled && apiKey) {
      const aiReply = await callGeminiInterrogation(questionLabel, nextStress);
      if (aiReply) suspectReply = aiReply;
    }

    setTranscript((prev) => [
      ...prev,
      { speaker: activeUser?.name || "Detective", text: questionLabel, type: "detective" },
      { speaker: currentSuspect.name, text: suspectReply, type: "suspect" }
    ]);

    setCustomQuestion("");
    setIsProcessing(false);

    // Check for Confession Sweet Spot (70% - 85%) or Breakdown (>90%)
    if (isCulprit && nextStress >= 70 && nextStress <= 86 && (type === "breakthrough" || unlockedBreakthrough)) {
      setStatus("confessed");
      soundManager.playVictoryTheme();
      setJaneComment("🎯 CONFESSION ACHIEVED! Suspect broke under psychological pressure in the optimal zone.");
      return;
    }

    if (nextStress >= 92) {
      setStatus("breakdown");
      setJaneComment("⚠️ CRITICAL BREAKDOWN! The suspect's heart rate spiked out of control. Use 'Sympathize' to de-escalate!");
      return;
    }

    // Trigger micro-expression tell chance
    if (Math.random() > 0.35 && !activeTell) {
      setTimeout(() => triggerMicroExpression(), 450);
    }
  }

  // Calculate Stress Zone details
  const getStressZone = () => {
    if (stress < 55) return { label: "PASSIVE / GUARDED", color: "#4fa3e3", statusClass: "calm" };
    if (stress < 70) return { label: "ANXIOUS / UNSTABLE", color: "#f5a623", statusClass: "anxious" };
    if (stress <= 86) return { label: "⚡ OPTIMAL CONFESSION ZONE", color: "#5cdb95", statusClass: "optimal" };
    return { label: "⚠️ CRITICAL BREAKDOWN", color: "#ff4d4f", statusClass: "breakdown" };
  };

  const zone = getStressZone();
  const photoUrl =
    SUSPECT_PHOTOS[`${id}-${currentSuspect?.id}`] ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=450&auto=format&fit=crop&q=80";

  return (
    <div className={`detroit-page ${zone.statusClass}`}>
      <Navbar caseId={id} activePage="lie-detector" />

      <main className="detroit-container">
        {/* Top Header Bar */}
        <div className="detroit-header">
          <div className="detroit-title-group">
            <span className="detroit-badge">
              <Activity size={13} /> CBI PSYCHOLOGICAL LIE DETECTOR CHAMBER
            </span>
            <h1>Interrogating {currentSuspect.name}</h1>
          </div>

          <div className="detroit-header-actions">
            <button
              className="detroit-config-btn"
              onClick={() => setShowConfig(!showConfig)}
            >
              <Sliders size={14} />
              <span>{aiEnabled ? "AI Mode: ON" : "AI Mode: OFF"}</span>
            </button>

            <select
              className="detroit-select-suspect"
              value={suspectQueryId}
              onChange={(e) => setSearchParams({ suspect: e.target.value })}
            >
              {currentCase.suspects.map((s) => (
                <option key={s.id} value={s.id}>
                  Switch Suspect: {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Optional AI Configuration Drawer */}
        {showConfig && (
          <div className="ai-config-drawer">
            <div className="ai-config-header">
              <Key size={16} color="#ffc870" />
              <strong>Google Gemini API Dynamic Interrogation Engine</strong>
            </div>
            <p>
              Paste your Gemini API key to enable autonomous AI dialogue generation. Leave blank to use the built-in Mentalist state machine.
            </p>
            <div className="ai-key-input-row">
              <input
                type="password"
                placeholder="Paste Gemini API Key (e.g. AIzaSy...)"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  localStorage.setItem("cbi_gemini_key", e.target.value);
                }}
              />
              <button
                className={`ai-toggle-btn ${aiEnabled ? "active" : ""}`}
                onClick={() => setAiEnabled(!aiEnabled)}
              >
                {aiEnabled ? "Enabled" : "Enable AI"}
              </button>
            </div>
          </div>
        )}

        {/* Main 2-Column Split: Biometric HUD & Interrogation Actions */}
        <div className="detroit-layout-grid">
          {/* Left Column: Biometric HUD & Suspect Cam */}
          <section className="detroit-cam-section">
            <div className="suspect-cam-feed">
              <img src={photoUrl} alt={currentSuspect.name} className="cam-portrait" />
              <div className="cam-scanline-overlay" />
              <div className="cam-corner-brackets" />

              {/* Live Tell Detection Overlay */}
              {activeTell && (
                <div className="micro-tell-alert-box">
                  <div className="tell-alert-header">
                    <span className="tell-pulse-dot" />
                    <strong>MICRO-EXPRESSION DETECTED: {activeTell.name}</strong>
                  </div>
                  <p>{activeTell.cue}</p>

                  <div className="tell-countdown-strip">
                    <div
                      className="tell-countdown-fill"
                      style={{ width: `${(tellTimeLeft / 1500) * 100}%` }}
                    />
                  </div>

                  <button className="catch-tell-btn" onClick={handleCatchTell}>
                    <Zap size={16} />
                    <span>CAUGHT A TELL! [HIT SPACE]</span>
                  </button>
                </div>
              )}

              {/* Status Watermark */}
              <div className="cam-hud-stats">
                <span>HEART: {Math.round(62 + stress * 1.15)} BPM</span>
                <span>PUPIL: {(2.8 + stress * 0.04).toFixed(1)} mm</span>
                <span>GSR: {(4.2 + stress * 0.12).toFixed(1)} µS</span>
              </div>
            </div>

            {/* Detroit: Become Human Stress Gauge */}
            <div className="stress-gauge-card">
              <div className="stress-gauge-header">
                <div className="gauge-label-group">
                  <Flame size={18} color={zone.color} />
                  <span>SUSPECT STRESS LEVEL</span>
                </div>
                <strong style={{ color: zone.color }}>{stress}% — {zone.label}</strong>
              </div>

              {/* Segmented Stress Meter */}
              <div className="detroit-stress-meter">
                <div
                  className="stress-fill-bar"
                  style={{ width: `${stress}%`, background: zone.color }}
                />
                <div className="optimal-zone-bracket" title="70% - 85% Sweet Spot" />
              </div>

              <div className="stress-zone-guide">
                <span>0% Calm</span>
                <span className="sweet-marker">70% — 85% CONFESSION SWEET SPOT</span>
                <span>100% Breakdown</span>
              </div>
            </div>

            {/* Patrick Jane's Micro-Read Card */}
            <div className="jane-psych-bubble">
              <Coffee size={22} color="#ffc870" style={{ flexShrink: 0 }} />
              <div>
                <strong>PATRICK JANE'S PSYCHOLOGICAL READ:</strong>
                <p>{janeComment}</p>
              </div>
            </div>
          </section>

          {/* Right Column: Interrogation Chamber & Dialogue */}
          <section className="detroit-dialogue-section">
            <div className="detroit-transcript-box">
              {transcript.map((item, idx) => (
                <div key={idx} className={`detroit-speech-node ${item.type}`}>
                  <span className="speech-speaker-tag">{item.speaker}</span>
                  <div className="speech-bubble">{item.text}</div>
                </div>
              ))}
            </div>

            {/* Confession Victory Modal Banner */}
            {status === "confessed" && (
              <div className="confession-breakthrough-banner">
                <div className="banner-badge">
                  <CheckCircle2 size={16} /> CONFESSION SIGNED UNDER RECORD
                </div>
                <h3>{currentSuspect.name} Broke Down Completely</h3>
                <p>The suspect admitted to their motive and actions on the record.</p>
                <button
                  className="proceed-tribunal-btn"
                  onClick={() => navigate(`/accusation/${id}`)}
                >
                  <Gavel size={16} /> Proceed to Final Accusation Tribunal
                </button>
              </div>
            )}

            {/* Critical Breakdown Warning */}
            {status === "breakdown" && (
              <div className="breakdown-warning-banner">
                <AlertTriangle size={18} />
                <div>
                  <strong>INTERVIEW TERMINATION RISK!</strong>
                  <span>Suspect is hyperventilating. Use "Sympathize" immediately to recover them.</span>
                </div>
              </div>
            )}

            {/* Detroit Approach Choices Grid */}
            <div className="detroit-approaches-grid">
              <button
                className="approach-btn pressure"
                onClick={() => handleApproach("pressure")}
                disabled={isProcessing || status === "confessed"}
              >
                <Flame size={15} />
                <div>
                  <strong>Pressure Suspect</strong>
                  <span>Stress +12% // Aggressive</span>
                </div>
              </button>

              <button
                className="approach-btn evidence"
                onClick={() => handleApproach("evidence")}
                disabled={isProcessing || status === "confessed"}
              >
                <Shield size={15} />
                <div>
                  <strong>Confront Clues</strong>
                  <span>Stress +8% // Forensic</span>
                </div>
              </button>

              <button
                className="approach-btn sympathy"
                onClick={() => handleApproach("sympathy")}
                disabled={isProcessing || status === "confessed"}
              >
                <Coffee size={15} />
                <div>
                  <strong>Jane's Sympathy</strong>
                  <span>Stress -11% // Cool Down</span>
                </div>
              </button>

              <button
                className="approach-btn bluff"
                onClick={() => handleApproach("bluff")}
                disabled={isProcessing || status === "confessed"}
              >
                <Sparkles size={15} />
                <div>
                  <strong>Mentalist Bluff</strong>
                  <span>Stress Swing +16%</span>
                </div>
              </button>
            </div>

            {/* Breakthrough Question (Unlocked via Caught Tell) */}
            {unlockedBreakthrough && status !== "confessed" && (
              <button
                className="breakthrough-fatal-btn"
                onClick={() => handleApproach("breakthrough")}
              >
                <Zap size={18} />
                <span>DELIVER FATAL BREAKTHROUGH QUESTION (PUSH INTO CONFESSION)</span>
              </button>
            )}

            {/* Custom Question Bar */}
            <form
              className="detroit-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (customQuestion.trim()) handleApproach("custom", customQuestion);
              }}
            >
              <input
                type="text"
                placeholder={`Ask ${currentSuspect.name} any specific theory or contradiction...`}
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                disabled={isProcessing || status === "confessed"}
              />
              <button type="submit" disabled={isProcessing || !customQuestion.trim()}>
                <Send size={15} />
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default DetroitInterrogation;