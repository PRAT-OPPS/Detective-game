// src/webpages/Interrogation.jsx
// FIXES APPLIED:
//   #3 - React Hooks violation fixed: all hooks now called unconditionally before any early returns
//        (useParams and useSearchParams moved above all conditional logic safely)

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { cases } from "../data/cases";
import { getCurrentUser } from "../utils/auth";
import { soundManager } from "../utils/soundManager";
import { getEvidence } from "../utils/storage";
import "../Interrogation.css";

import {
  ArrowLeft,
  Send,
  Activity,
  Gavel,
  Briefcase,
  X,
  CheckCircle2
} from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

function getPlayerSessionId() {
  let sId = sessionStorage.getItem("detective_game_session_id");
  if (!sId) {
    sId = "session_" + Math.random().toString(36).substring(2, 11);
    sessionStorage.setItem("detective_game_session_id", sId);
  }
  return sId;
}

const CASE_SUGGESTED_QUESTIONS = {
  1: [
    "Where were you at 11:45 PM when the watch stopped?",
    "Explain the threatening letter found in the study.",
    "Who had access to the silver key?",
    "Why are you clenching your hands?"
  ],
  2: [
    "Where were you at sunset when the tide came in?",
    "Why was the surfboard wax scraped?",
    "Did you see what happened by the pier?",
    "Why are you avoiding eye contact?"
  ],
  3: [
    "Explain your 18k gold cufflink wedged in Arthur's chaise.",
    "Who spiked Arthur's glass with industrial potassium cyanide?",
    "Why does the elevator log show a descent at 10:52 PM?",
    "Why was the brass metronome ticking if Arthur despised it?"
  ],
  4: [
    "Where were you at 11:47 PM when the watch stopped?",
    "Explain the red message written across the study mirror.",
    "What really happened to Anna Grey in Project Mirror?",
    "Why was the study door deadbolted from the inside?"
  ]
};

// ✅ FIX #3: Interrogation is now a pure wrapper — all hooks are called here unconditionally
// before any conditional rendering. This fully satisfies the Rules of Hooks.
function Interrogation() {
  const { id } = useParams();                        // ✅ Hook always called
  const [searchParams, setSearchParams] = useSearchParams(); // ✅ Hook always called

  // Derive values after hooks — safe to use conditionally
  const currentCase = cases.find((c) => c.id === Number(id));
  const suspectQueryId =
    currentCase
      ? Number(searchParams.get("suspect")) || currentCase.suspects[0]?.id || 1
      : 1;
  const currentSuspect = currentCase
    ? currentCase.suspects.find((s) => s.id === suspectQueryId) ||
      currentCase.suspects[0]
    : null;

  // Early returns AFTER all hooks — safe
  if (!currentCase) return <Navigate to="/" replace />;
  if (!currentSuspect) return <Navigate to="/" replace />;

  return (
    <InterrogationSession
      key={`${id}-${currentSuspect.id}`}
      id={id}
      currentCase={currentCase}
      currentSuspect={currentSuspect}
      suspectQueryId={suspectQueryId}
      setSearchParams={setSearchParams}
    />
  );
}

function InterrogationSession({ id, currentCase, currentSuspect, suspectQueryId, setSearchParams }) {
  const navigate = useNavigate();
  const chatBottomRef = useRef(null);
  const activeUser = getCurrentUser();
  const sessionId = getPlayerSessionId();

  useEffect(() => {
    soundManager.playInterrogationTheme();
    return () => soundManager.stopAll();
  }, []);

  // Collected evidence from Crime Scene
  const [collectedEvidence, setCollectedEvidence] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [showEvidenceDrawer, setShowEvidenceDrawer] = useState(false);

  useEffect(() => {
    const ev = getEvidence(Number(id));
    setCollectedEvidence(ev || []);
  }, [id]);

  // Dynamic Trait meters state
  const [traits, setTraits] = useState({
    stress: currentSuspect?.traits?.defensiveness || 50,
    deception: currentSuspect?.traits?.deception || 50,
    guilt: currentSuspect?.traits?.guilt || 30,
    consistency: currentSuspect?.traits?.consistency || 70
  });

  // Chat conversation state
  const [messages, setMessages] = useState([
    {
      sender: "system",
      text: `Interrogation room initialized. Questioning ${currentSuspect?.name} (${currentSuspect?.role}).`
    },
    {
      sender: "suspect",
      name: currentSuspect?.name,
      text: `"${currentSuspect?.statement}"`
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function handleSendMessage(textToSend) {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      sender: "detective",
      name: activeUser?.name || "Detective",
      text: selectedEvidence
        ? `[Confronting with: ${selectedEvidence.name}] ${text.trim()}`
        : text.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    const evidenceToPresent = selectedEvidence;
    setSelectedEvidence(null);
    setShowEvidenceDrawer(false);

    try {
      const response = await fetch(`${BACKEND_URL}/api/interrogate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          caseId: Number(id),
          suspectId: currentSuspect.id,
          question: text.trim(),
          stress: traits.stress,
          caseInfo: {
            title: currentCase.title,
            victim: currentCase.victim,
            location: currentCase.location,
            description: currentCase.description
          },
          suspect: {
            id: currentSuspect.id,
            name: currentSuspect.name,
            role: currentSuspect.role,
            statement: currentSuspect.statement,
            alibi: currentSuspect.alibi,
            personality: currentSuspect.personality
          },
          evidence: evidenceToPresent
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "suspect",
            name: currentSuspect.name,
            text: data.reply
          }
        ]);

        if (data.traitsDelta) {
          setTraits((prev) => ({
            stress: Math.min(100, Math.max(10, prev.stress + (data.traitsDelta.stress || 5))),
            deception: Math.min(100, Math.max(10, prev.deception + (data.traitsDelta.deception || 2))),
            guilt: prev.guilt,
            consistency: Math.max(15, prev.consistency - 4)
          }));
        }

        if (data.detectiveHint) {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                sender: "jane",
                text: data.detectiveHint
              }
            ]);
          }, 600);
        }
      } else {
        throw new Error(data.error || "Failed to generate reply");
      }
    } catch (err) {
      console.warn("Backend offline, using fallback:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "suspect",
          name: currentSuspect.name,
          text: `"${currentSuspect.statement || "I have already told you everything I know, detective."}"`
        },
        {
          sender: "jane",
          text: `☕ Patrick Jane whispers: "The suspect is guarded. Ensure your backend server is running on port 5000."`
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  const suggestedQuestions =
    CASE_SUGGESTED_QUESTIONS[Number(id)] || CASE_SUGGESTED_QUESTIONS[1];

  return (
    <div className="interrogation-page">
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 5%",
          background: "rgba(13, 16, 22, 0.9)",
          borderBottom: "1px solid rgba(184, 38, 49, 0.3)"
        }}
      >
        <button
          className="back-case-btn"
          onClick={() => navigate(`/suspects/${id}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          <ArrowLeft size={16} />
          Back to Suspect List
        </button>

        <span style={{ fontSize: "12px", color: "#ffc870", fontWeight: "700", letterSpacing: "1px" }}>
          CBI SACRAMENTO // INTERROGATION CHAMBER — {currentCase.title.toUpperCase()}
        </span>
      </nav>

      <main className="interrogation-layout">
        <aside className="suspect-sidebar">
          <div className="suspect-portrait-box">
            <div className="suspect-avatar-circle">🕵️</div>
            <h2 className="suspect-name-title">{currentSuspect.name}</h2>
            <span className="suspect-role-sub">{currentSuspect.role}</span>
          </div>

          <div className="suspect-intel-card">
            <div className="intel-row">
              <span className="intel-label">OFFICIAL ALIBI</span>
              <span className="intel-value">{currentSuspect.alibi}</span>
            </div>
            <div className="intel-row">
              <span className="intel-label">PSYCHOLOGICAL PROFILE</span>
              <span className="intel-value">{currentSuspect.personality}</span>
            </div>
          </div>

          {/* Real-time Psychological Trait Meters */}
          <div className="trait-meters-container">
            <div className="trait-meter-title">
              <Activity size={14} />
              LIVE TRAIT &amp; STRESS ANALYSIS
            </div>

            <div className="trait-bar-item">
              <div className="trait-label-row">
                <span>Tension &amp; Stress Level</span>
                <strong>{traits.stress}%</strong>
              </div>
              <div className="trait-meter-track">
                <div
                  className="trait-meter-fill stress"
                  style={{ width: `${traits.stress}%` }}
                />
              </div>
            </div>

            <div className="trait-bar-item">
              <div className="trait-label-row">
                <span>Deception / Concealment</span>
                <strong>{traits.deception}%</strong>
              </div>
              <div className="trait-meter-track">
                <div
                  className="trait-meter-fill deception"
                  style={{ width: `${traits.deception}%` }}
                />
              </div>
            </div>

            <div className="trait-bar-item">
              <div className="trait-label-row">
                <span>Guilt &amp; Remorse Index</span>
                <strong>{traits.guilt}%</strong>
              </div>
              <div className="trait-meter-track">
                <div
                  className="trait-meter-fill guilt"
                  style={{ width: `${traits.guilt}%` }}
                />
              </div>
            </div>

            <div className="trait-bar-item">
              <div className="trait-label-row">
                <span>Statement Consistency</span>
                <strong>{traits.consistency}%</strong>
              </div>
              <div className="trait-meter-track">
                <div
                  className="trait-meter-fill defensiveness"
                  style={{ width: `${traits.consistency}%` }}
                />
              </div>
            </div>
          </div>

          <button
            className="conclude-interrogation-btn"
            onClick={() => setShowAnalysis(!showAnalysis)}
          >
            {showAnalysis ? "Hide Jane's Assessment" : "View Psychological Verdict"}
          </button>

          {showAnalysis && (
            <div
              style={{
                background: "rgba(45, 15, 20, 0.7)",
                border: "1px dashed #ffc870",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "12px",
                lineHeight: "1.4",
                color: "#ffc870"
              }}
            >
              <strong>Patrick Jane's Verdict:</strong>
              <p style={{ margin: "5px 0 0", fontStyle: "italic", color: "#eee" }}>
                {traits.stress > 70
                  ? `"${currentSuspect.name} is visibly cornered. Their micro-tells betray direct involvement. Present contradictory evidence now."`
                  : `"${currentSuspect.name} is composed and rehearsed. Probe into their physical whereabouts and watch for involuntary autonomic twitches."`}
              </p>
            </div>
          )}

          <button
            onClick={() => navigate(`/accusation/${id}`)}
            style={{
              background: "linear-gradient(135deg, #a61c27, #680d14)",
              color: "#fff",
              border: "1px solid rgba(255,200,112,0.3)",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <Gavel size={16} /> Proceed to Final Accusation
          </button>
        </aside>

        <section className="interrogation-chat-chamber">
          <div className="chat-chamber-header">
            <div className="chat-chamber-title">
              <h2>Interrogating: {currentSuspect.name}</h2>
              <span>Direct AI-powered psychological channel</span>
            </div>

            <select
              className="switch-suspect-select"
              value={suspectQueryId}
              onChange={(e) => setSearchParams({ suspect: e.target.value })}
            >
              {currentCase.suspects.map((s) => (
                <option key={s.id} value={s.id}>
                  Switch to {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="chat-messages-container">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-message-bubble ${m.sender}`}>
                {m.sender !== "system" && m.sender !== "jane" && (
                  <span className="bubble-sender-name">{m.name}</span>
                )}
                <div className="bubble-content">{m.text}</div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message-bubble suspect">
                <span className="bubble-sender-name">{currentSuspect.name}</span>
                <div className="typing-dots">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          <div className="quick-questions-strip">
            <span style={{ fontSize: "11px", color: "#ffc870", alignSelf: "center", fontWeight: "700" }}>
              SUGGESTED:
            </span>
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                className="quick-q-chip"
                onClick={() => handleSendMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Evidence Confrontation Tray */}
          <div style={{ padding: "0 16px 8px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
              <button
                type="button"
                onClick={() => setShowEvidenceDrawer(!showEvidenceDrawer)}
                style={{
                  background: selectedEvidence ? "rgba(184, 38, 49, 0.3)" : "rgba(255, 255, 255, 0.08)",
                  border: selectedEvidence ? "1px solid #ffc870" : "1px solid rgba(255, 255, 255, 0.15)",
                  color: selectedEvidence ? "#ffc870" : "#fff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Briefcase size={14} />
                {selectedEvidence ? `Confronting with: ${selectedEvidence.name}` : "Confront with Evidence…"}
              </button>

              {selectedEvidence && (
                <button
                  type="button"
                  onClick={() => setSelectedEvidence(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ff6b6b",
                    fontSize: "11px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <X size={12} /> Clear Evidence
                </button>
              )}
            </div>

            {showEvidenceDrawer && (
              <div
                style={{
                  background: "rgba(15, 20, 28, 0.95)",
                  border: "1px solid rgba(255, 200, 112, 0.3)",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "8px"
                }}
              >
                {collectedEvidence.length === 0 ? (
                  <span style={{ fontSize: "12px", color: "#888", fontStyle: "italic" }}>
                    No evidence collected yet. Visit the Crime Scene to gather forensic clues.
                  </span>
                ) : (
                  collectedEvidence.map((item) => {
                    const isSelected = selectedEvidence?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedEvidence(item);
                          setShowEvidenceDrawer(false);
                        }}
                        style={{
                          background: isSelected ? "rgba(184, 38, 49, 0.6)" : "rgba(255, 255, 255, 0.05)",
                          border: isSelected ? "1px solid #ffc870" : "1px solid rgba(255, 255, 255, 0.12)",
                          color: "#fff",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <span>{item.icon || "🔍"}</span>
                        <span>{item.name}</span>
                        {isSelected && <CheckCircle2 size={12} color="#ffc870" />}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Chat Form */}
          <form
            className="chat-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              placeholder={
                selectedEvidence
                  ? `Confront ${currentSuspect.name} about the ${selectedEvidence.name}...`
                  : `Ask ${currentSuspect.name} anything (alibis, motives, discrepancies)...`
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <span>{selectedEvidence ? "Confront" : "Press Suspect"}</span>
              <Send size={15} />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Interrogation;
