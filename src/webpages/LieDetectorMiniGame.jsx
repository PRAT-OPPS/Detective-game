// src/webpages/LieDetectorMiniGame.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { soundManager } from "../utils/soundManager";
import "../LieDetectorMiniGame.css";

import {
  Zap,
  Activity,
  Heart,
  Flame,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Coffee,
  Sparkles,
  Trophy,
  Play,
  ArrowRight,
  Eye,
  Sliders
} from "lucide-react";

// 3 Progressive Interrogation Suspects
const ARCADE_SUSPECTS = [
  {
    id: 1,
    name: "Andy 'Shaky' Bromgard",
    role: "Nervous Accomplice (Level 1)",
    difficulty: "EASY",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80",
    tellWindowMs: 1800,
    baseStress: 45,
    statement: "I was just sitting in my truck! I never touched her board or the skiff, I swear!",
    confession: "OKAY, STOP! I watched Lance and Jason drag her board toward the water! I was too terrified of Jason to call Lisbon, but I saw everything!",
    tellsToBreak: 2
  },
  {
    id: 2,
    name: "Lance Wheeler",
    role: "Aggressive Surf Captain (Level 2)",
    difficulty: "MEDIUM",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    tellWindowMs: 1350,
    baseStress: 58,
    statement: "You CBI suits don't understand how Santa Marta works. We keep outsiders off our waves. That doesn't make me a killer.",
    confession: "Fine! Yes, I argued with Christine on the beach about the club drop-offs! But it was Jason who took her out to the pier pylon!",
    tellsToBreak: 3
  },
  {
    id: 3,
    name: "Jason Richter",
    role: "Smug Psychopath (Level 3 - BOSS)",
    difficulty: "HARD / HIGH REFLEX",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80",
    tellWindowMs: 950, // 0.95 second reaction window!
    baseStress: 68,
    statement: "My attorneys will have your badge before lunch, detective. You have zero physical proof connecting me to Christine's drowning.",
    confession: "SHE WAS GOING TO DESTROY US! She threatened to hand over our smuggling skiff log to the Coast Guard! I tried to silence her on the pier deck, but she slipped and hit her head... I had to let the tide take her!",
    tellsToBreak: 4
  }
];

// Micro-Expression Anatomy Tells
const MICRO_EXPRESSIONS = [
  {
    id: "pupil",
    name: "Pupil Dilation & Ocular Saccade",
    targetZone: "EYES",
    cue: "Rapid eye flutter & pupils expanding (Sympathetic Surge)",
    janeInsight: "Look at the pupil dilation. Autonomic nervous system betrayal under deception."
  },
  {
    id: "carotid",
    name: "Carotid Pulse Flutter",
    targetZone: "NECK",
    cue: "Artery pulsing at 145 BPM in the neck hollow",
    janeInsight: "Carotid pulse spike. Systolic blood pressure surge."
  },
  {
    id: "lip",
    name: "Micro-Lip Compression",
    targetZone: "MOUTH",
    cue: "Tightened lips pressing into a grim line",
    janeInsight: "Lip compression. The subconscious mind suppressing forbidden words."
  },
  {
    id: "sweat",
    name: "Cold Temple Perspiration",
    targetZone: "TEMPLE",
    cue: "Sudden bead of sweat forming at the hairline",
    janeInsight: "Vasoconstriction. Blood retreating from facial capillaries."
  }
];

// Web Audio Biometric Synthesizer
function playArcadeAudio(type = "heartbeat", pitch = 1) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "heartbeat") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(60 * pitch, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === "alert") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === "catch") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "strike") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (err) {}
}

function LieDetectorMiniGame() {
  const navigate = useNavigate();

  // Game Progress State
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [gameState, setGameState] = useState("start"); // "start", "playing", "confessed", "gameover", "victory"

  const suspect = ARCADE_SUSPECTS[currentLevelIdx];

  // Detroit Stress & Score States
  const [stress, setStress] = useState(45);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [strikes, setStrikes] = useState(3);
  const [caughtTells, setCaughtTells] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("cbi_arcade_highscore")) || 0);

  // Micro-Expression Reflex State
  const [activeTell, setActiveTell] = useState(null);
  const [tellDuration, setTellDuration] = useState(1500);
  const [tellTimeLeft, setTellTimeLeft] = useState(0);
  const [isSlowMo, setIsSlowMo] = useState(false);
  const [teaCharges, setTeaCharges] = useState(1);
  const [focusCharges, setFocusCharges] = useState(1);
  const [targetHint, setTargetHint] = useState(null);

  // Jane's Commentary Log
  const [janeTip, setJaneTip] = useState(
    "Welcome to the Lie Detection Reflex Chamber. Watch the suspect's eyes, throat, and lips. The optimal confession sweet spot is 70% to 85% stress!"
  );

  // Sound loop setup
  useEffect(() => {
    soundManager.playInterrogationTheme();
    return () => soundManager.stopAll();
  }, []);

  // Heartbeat audio loop tied to stress
  useEffect(() => {
    if (gameState !== "playing") return;
    const intervalMs = Math.max(300, 1000 - stress * 7);
    const heartTimer = setInterval(() => {
      playArcadeAudio("heartbeat", 1 + stress * 0.008);
    }, intervalMs);
    return () => clearInterval(heartTimer);
  }, [gameState, stress]);

  // Start new round
  function startRound(levelIdx) {
    const s = ARCADE_SUSPECTS[levelIdx];
    setCurrentLevelIdx(levelIdx);
    setStress(s.baseStress);
    setCaughtTells(0);
    setActiveTell(null);
    setTeaCharges(1);
    setFocusCharges(1);
    setTargetHint(null);
    setGameState("playing");
    setJaneTip(`Questioning ${s.name}. Catch ${s.tellsToBreak} tells and push stress into 70%-85% to force a confession!`);
  }

  // Tell Countdown Timer
  useEffect(() => {
    if (!activeTell || gameState !== "playing") return;

    const startTime = Date.now();
    const duration = isSlowMo ? tellDuration * 1.8 : tellDuration;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setTellTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        setActiveTell(null);
        // Missed tell penalty
        setCombo(0);
        setStress((prev) => Math.max(20, prev - 6));
        setJaneTip("Tell expired! Suspect noticed your delay and regained composure.");
      }
    }, 30);

    return () => clearInterval(timer);
  }, [activeTell, tellDuration, isSlowMo, gameState]);

  // Random Micro-Expression Spawner Loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const delay = Math.floor(Math.random() * 2500) + 2000;
    const spawnTimer = setTimeout(() => {
      if (!activeTell && gameState === "playing") {
        const randomTell = MICRO_EXPRESSIONS[Math.floor(Math.random() * MICRO_EXPRESSIONS.length)];
        playArcadeAudio("alert");
        setActiveTell(randomTell);
        setTellDuration(suspect.tellWindowMs);
        setTellTimeLeft(suspect.tellWindowMs);
      }
    }, delay);

    return () => clearTimeout(spawnTimer);
  }, [activeTell, gameState, suspect]);

  // Handle Caught Tell Action
  const handleCatchTell = useCallback(() => {
    if (gameState !== "playing") return;

    if (!activeTell) {
      // False Alarm Penalty!
      playArcadeAudio("strike");
      setStrikes((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setGameState("gameover");
          setJaneTip("Three false alarms! The suspect's counsel intervened and the interview collapsed.");
        }
        return next;
      });
      setCombo(0);
      setScore((s) => Math.max(0, s - 100));
      setJaneTip("False alarm! You swung blindly when there was no physical tell.");
      return;
    }

    // SUCCESS! Caught in time
    playArcadeAudio("catch");
    const caught = activeTell;
    setActiveTell(null);

    const newCombo = combo + 1;
    setCombo(newCombo);

    const pointsGained = 200 + newCombo * 75;
    const newScore = score + pointsGained;
    setScore(newScore);

    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem("cbi_arcade_highscore", newScore);
    }

    const nextCaught = caughtTells + 1;
    setCaughtTells(nextCaught);

    // Push stress towards optimal zone
    setStress((prev) => Math.min(88, prev + 9));
    setJaneTip(`⚡ TELL CAUGHT! [${caught.targetZone}] ${caught.janeInsight} (+${pointsGained} pts!)`);
  }, [activeTell, combo, score, highScore, caughtTells, gameState]);

  // Spacebar Hotkey Listener
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === "Space") {
        e.preventDefault();
        handleCatchTell();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCatchTell]);

  // Tactical Powers
  function activateSlowMo() {
    if (teaCharges <= 0) return;
    setTeaCharges(0);
    setIsSlowMo(true);
    setJaneTip("☕ Patrick Jane's Chamomile Focus active: Time slowed by 50% for 6 seconds!");
    setTimeout(() => setIsSlowMo(false), 6000);
  }

  function activatePerceptionHint() {
    if (focusCharges <= 0) return;
    setFocusCharges(0);
    const nextTell = MICRO_EXPRESSIONS[Math.floor(Math.random() * MICRO_EXPRESSIONS.length)];
    setTargetHint(nextTell.targetZone);
    setJaneTip(`🔍 Focus active: Next micro-expression will leak from the [${nextTell.targetZone}]!`);
    setTimeout(() => setTargetHint(null), 8000);
  }

  // Detroit Interrogation Tactics
  function handleTactic(type) {
    if (gameState !== "playing") return;

    if (type === "pressure") {
      setStress((prev) => Math.min(100, prev + 12));
      setJaneTip("Heavy pressure applied! Suspect heart rate climbing!");
    } else if (type === "sympathy") {
      setStress((prev) => Math.max(30, prev - 11));
      setJaneTip("Jane's sympathy calmed the room, preventing a panic overload.");
    } else if (type === "contradiction") {
      // Must be in optimal zone (70% - 85%) and have caught enough tells to trigger confession!
      if (stress >= 70 && stress <= 87 && caughtTells >= suspect.tellsToBreak) {
        setGameState("confessed");
        soundManager.playVictoryTheme();
        setScore((s) => s + 1000);
        setJaneTip(`🎯 FULL CONFESSION! ${suspect.name} shattered under forensic pressure!`);
      } else {
        setStrikes((s) => s - 1);
        setStress((prev) => Math.min(100, prev + 15));
        setJaneTip("Premature accusation! Suspect is not in the confession zone or you missed their physical tells!");
      }
    }
  }

  // Stress Zone Indicator
  const getZone = () => {
    if (stress < 55) return { text: "PASSIVE / GUARDED", color: "#4fa3e3", class: "cold" };
    if (stress < 70) return { text: "UNSTABLE / ANXIOUS", color: "#f5a623", class: "warm" };
    if (stress <= 87) return { text: "⚡ OPTIMAL CONFESSION ZONE", color: "#5cdb95", class: "sweet" };
    return { text: "⚠️ CRITICAL BREAKDOWN WARNING", color: "#ff4d4f", class: "danger" };
  };

  const zone = getZone();
  const canConfess = stress >= 70 && stress <= 87 && caughtTells >= suspect.tellsToBreak;

  return (
    <div className={`arcade-lie-page ${zone.class}`}>
      <Navbar activePage="mini-game" />

      <main className="arcade-lie-container">
        {/* Arcade Top HUD */}
        <section className="arcade-hud-header">
          <div className="hud-metric">
            <span className="hud-label">CURRENT SCORE</span>
            <strong className="hud-val gold">{score.toLocaleString()}</strong>
          </div>

          <div className="hud-metric">
            <span className="hud-label">COMBO MULTIPLIER</span>
            <strong className="hud-val yellow">x{combo}</strong>
          </div>

          <div className="hud-metric">
            <span className="hud-label">CBI CREDIBILITY</span>
            <div className="strikes-wrap">
              {[...Array(3)].map((_, i) => (
                <ShieldAlert
                  key={i}
                  size={18}
                  color={i < strikes ? "#5cdb95" : "#3a414d"}
                />
              ))}
            </div>
          </div>

          <div className="hud-metric">
            <span className="hud-label">HIGH SCORE RECORD</span>
            <strong className="hud-val">{highScore.toLocaleString()}</strong>
          </div>
        </section>

        {/* START SCREEN */}
        {gameState === "start" && (
          <div className="arcade-modal-card">
            <span className="arcade-badge">CBI TACTICAL REFLEX SIMULATOR</span>
            <h1>The Mentalist: Lie Detector Chamber</h1>
            <p className="arcade-modal-desc">
              Inspired by <em>Detroit: Become Human</em> and <em>The Mentalist</em>. Study the suspect's camera feed. When a micro-expression tell flashes, hit <strong>SPACEBAR</strong> within the time limit. Push their stress into the green <strong>70% – 85% Sweet Spot</strong> and deliver the fatal contradiction to force a confession!
            </p>

            <div className="suspect-preview-strip">
              {ARCADE_SUSPECTS.map((s, idx) => (
                <div key={s.id} className="suspect-preview-pill">
                  <img src={s.photo} alt={s.name} />
                  <div>
                    <strong>{s.name}</strong>
                    <span>{s.difficulty} // {s.tellWindowMs}ms</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="arcade-launch-btn" onClick={() => startRound(0)}>
              <Play size={18} />
              <span>COMMENCE INVESTIGATION [LEVEL 1]</span>
            </button>
          </div>
        )}

        {/* GAME OVER SCREEN */}
        {gameState === "gameover" && (
          <div className="arcade-modal-card failure">
            <AlertTriangle size={42} color="#ff4d4f" />
            <h2>Investigation Compromised</h2>
            <p>You depleted your CBI credibility with false accusations and missed autonomic tells.</p>
            <div className="final-score-callout">FINAL SCORE: {score}</div>
            <button className="arcade-launch-btn retry" onClick={() => startRound(currentLevelIdx)}>
              <RotateCcw size={16} />
              <span>Retry Round {currentLevelIdx + 1}</span>
            </button>
          </div>
        )}

        {/* ROUND CONFESSED SCREEN */}
        {gameState === "confessed" && (
          <div className="arcade-modal-card victory">
            <CheckCircle2 size={46} color="#5cdb95" />
            <h2>Confession Extracted!</h2>
            <p className="confession-quote">"{suspect.confession}"</p>
            <div className="final-score-callout">ROUND CLEARED! +1,000 BONUS PTS</div>

            {currentLevelIdx < ARCADE_SUSPECTS.length - 1 ? (
              <button
                className="arcade-launch-btn next"
                onClick={() => startRound(currentLevelIdx + 1)}
              >
                <span>Proceed to Level {currentLevelIdx + 2}: {ARCADE_SUSPECTS[currentLevelIdx + 1].name}</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button className="arcade-launch-btn next" onClick={() => setGameState("start")}>
                <Trophy size={18} />
                <span>MASTER MENTALIST: ALL ROUNDS COMPLETED!</span>
              </button>
            )}
          </div>
        )}

        {/* ACTIVE GAMEPLAY STAGE */}
        {gameState === "playing" && (
          <div className="arcade-stage-grid">
            {/* Left: Suspect Video Cam Feed */}
            <div className="arcade-cam-box">
              <img src={suspect.photo} alt={suspect.name} className="cam-feed-img" />
              <div className="cam-hud-crosshairs" />
              <div className="cam-scan-overlay" />

              {/* Target Hint Glow */}
              {targetHint && (
                <div className="target-hint-indicator">
                  <Eye size={14} /> JANE NOTICED: WATCH THE [{targetHint}]
                </div>
              )}

              {/* Micro-Expression Alert Overlay */}
              {activeTell && (
                <div className="active-tell-popup">
                  <div className="tell-alert-label">
                    <Zap size={14} />
                    <span>MICRO-EXPRESSION: {activeTell.name}</span>
                  </div>
                  <p>{activeTell.cue}</p>

                  <div className="countdown-bar-wrap">
                    <div
                      className="countdown-bar-fill"
                      style={{
                        width: `${(tellTimeLeft / (isSlowMo ? tellDuration * 1.8 : tellDuration)) * 100}%`
                      }}
                    />
                  </div>

                  <button className="smash-tell-btn" onClick={handleCatchTell}>
                    <Zap size={18} />
                    <span>CAUGHT A TELL! [HIT SPACE]</span>
                  </button>
                </div>
              )}

              <div className="cam-bottom-strip">
                <span>POI: {suspect.name.toUpperCase()}</span>
                <span>TELLS CAUGHT: {caughtTells} / {suspect.tellsToBreak}</span>
                <span>HEART: {Math.round(65 + stress * 1.2)} BPM</span>
              </div>
            </div>

            {/* Right: Detroit Stress Engine & Controls */}
            <div className="arcade-controls-box">
              {/* Detroit Stress Bar */}
              <div className="detroit-stress-wrapper">
                <div className="stress-row-title">
                  <div className="stress-title-tag">
                    <Flame size={16} color={zone.color} />
                    <span>STRESS / DEFENSIVENESS</span>
                  </div>
                  <strong style={{ color: zone.color }}>{stress}% — {zone.text}</strong>
                </div>

                <div className="detroit-bar-track">
                  <div
                    className="detroit-bar-fill"
                    style={{ width: `${stress}%`, background: zone.color }}
                  />
                  <div className="detroit-sweet-zone" title="70% - 85% Optimal Zone" />
                </div>

                <div className="stress-sub-guide">
                  <span>0% Cold</span>
                  <span className="sweet-guide">70% — 85% CONFESSION ZONE</span>
                  <span>100% Panic</span>
                </div>
              </div>

              {/* Tactical Question Approaches */}
              <div className="tactical-approaches-group">
                <span className="tactics-label">INTERROGATION TACTICS:</span>
                <div className="tactics-grid">
                  <button className="tactic-btn" onClick={() => handleTactic("pressure")}>
                    <Flame size={15} color="#ff7882" />
                    <div>
                      <strong>Apply Pressure</strong>
                      <span>+12% Stress // Aggressive</span>
                    </div>
                  </button>

                  <button className="tactic-btn" onClick={() => handleTactic("sympathy")}>
                    <Coffee size={15} color="#5cdb95" />
                    <div>
                      <strong>Jane's Sympathy</strong>
                      <span>-11% Stress // Prevent Crash</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Detective Power-Ups */}
              <div className="powerups-row">
                <button
                  className={`powerup-btn ${teaCharges > 0 ? "ready" : "spent"}`}
                  onClick={activateSlowMo}
                  disabled={teaCharges <= 0 || isSlowMo}
                >
                  <Coffee size={15} />
                  <span>{isSlowMo ? "SLOW-MO ACTIVE..." : `Chamomile Focus (${teaCharges})`}</span>
                </button>

                <button
                  className={`powerup-btn ${focusCharges > 0 ? "ready" : "spent"}`}
                  onClick={activatePerceptionHint}
                  disabled={focusCharges <= 0}
                >
                  <Eye size={15} />
                  <span>Mentalist Insight ({focusCharges})</span>
                </button>
              </div>

              {/* Fatal Contradiction Strike Button */}
              <button
                className={`fatal-contradiction-btn ${canConfess ? "ready" : "locked"}`}
                onClick={() => handleTactic("contradiction")}
              >
                <Zap size={18} />
                <span>
                  {canConfess
                    ? "DELIVER FATAL CONTRADICTION [TRIGGER CONFESSION!]"
                    : `LOCKED: NEED 70-85% STRESS & ${suspect.tellsToBreak} TELLS`}
                </span>
              </button>

              {/* Jane's Insight Box */}
              <div className="jane-arcade-quote">
                <Coffee size={22} color="#ffc870" style={{ flexShrink: 0 }} />
                <p>{janeTip}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default LieDetectorMiniGame;