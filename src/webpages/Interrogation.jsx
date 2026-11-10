// src/webpages/Interrogation.jsx

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { cases } from "../data/cases";
import { getCurrentUser } from "../utils/auth";
import { soundManager } from "../utils/soundManager";
import "../Interrogation.css";

import {
  ArrowLeft,
  Send,
  Coffee,
  Sparkles,
  ShieldAlert,
  Activity,
  CheckCircle2,
  HelpCircle,
  Gavel
} from "lucide-react";

// Case-specific suggested interrogation prompts
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
  ]
};

// In-Character Psychological Dialogue Generation
function generateSuspectResponse(suspect, userMessage, caseId) {
  const msg = userMessage.toLowerCase();
  const name = suspect.name;
  const numId = Number(caseId);

  // ==========================================
  // CASE 3: The Case of the Hollow Maestro
  // ==========================================
  if (numId === 3) {
    if (msg.includes("cufflink") || msg.includes("gold") || msg.includes("balance") || msg.includes("chaise")) {
      if (name.includes("Julian")) {
        return "My cufflinks? Bespoke 18-karat gold, commissioned in Zurich. I might have lost one while reviewing art appraisals with Arthur earlier in the week. Clinging to jewelry forensics is rather desperate, detective.";
      }
      if (name.includes("Evelyn")) {
        return "Julian always flaunted those obnoxious gold cufflinks. When I slipped past the gallery at 9:30 PM, Arthur's chaise was empty, but Julian's amber cologne was still hanging thick in the foyer.";
      }
      if (name.includes("Isaac")) {
        return "I noticed that gold cufflink wedged in the chaise woodwork yesterday afternoon. Pendelton told me to leave it—he said a trap works best when the bait glistens.";
      }
      return "Cufflinks? I know nothing of Arthur's personal jewelry. I was strictly his neurological and medical advisor.";
    }

    if (msg.includes("cyanide") || msg.includes("poison") || msg.includes("tonic") || msg.includes("tumbler") || msg.includes("drink") || msg.includes("glass")) {
      if (name.includes("Julian")) {
        return "Arthur had a lifelong ritual of drinking cold tonic water to settle his gastric palpitations before tense business arguments. If someone introduced potassium salts into his glass, check with someone who had access to industrial chemicals.";
      }
      if (name.includes("Sterling")) {
        return "Cyanide is an unrefined industrial leaching reagent! As a certified physician, I prescribe pharmaceutical anti-arrhythmics, not gold-mine poisons! I brought him cardiovascular drops which he dismissed at the door!";
      }
      if (name.includes("Evelyn")) {
        return "I saw that crystal tumbler on the table when I took back my sketches... it was still full. Arthur hadn't touched it yet. Oh god... whoever came in after me watched him drink it!";
      }
      return "Tonic water was Pendelton's victory drink. Every time he broke a collector down with psychological profiling, he poured himself a glass. He died drinking his own triumph.";
    }

    if (msg.includes("mirror") || msg.includes("metronome") || msg.includes("gramophone") || msg.includes("chopin")) {
      if (name.includes("Julian")) {
        return "Arthur was an insufferable theatrical synesthete who fancied himself a maestro of human flaws. The metronome and Chopin Nocturne were obviously part of his own dramatic suicide staging.";
      }
      if (name.includes("Evelyn")) {
        return "Arthur HATED mechanical metronomes! He had synesthesia and perfect pitch—monotonous clicking gave him blinding migraines! Whoever wound that metronome didn't know him at all!";
      }
      if (name.includes("Isaac")) {
        return "That vanity mirror was angled precisely at forty-five degrees toward the mahogany door. Pendelton didn't position it to admire his own reflection; he wanted to see who entered behind his back.";
      }
      return "Chopin in C Minor was Arthur's self-diagnosed acoustic trigger for distress. I noted it in his confidential clinical charts weeks ago.";
    }

    if (msg.includes("elevator") || msg.includes("log") || msg.includes("time") || msg.includes("10:52") || msg.includes("10:30")) {
      if (name.includes("Julian")) {
        return "The elevator log? Digital system clocks drift constantly in luxury high-rises. I was already seated at the bistro on 4th Street by 10:30 PM. Speak to the maître d'.";
      }
      if (name.includes("Sterling")) {
        return "My vehicle was clocked exiting the underground parking garage at 10:35 PM sharp! The street security feeds will completely exonerate me!";
      }
      return "The private penthouse elevator requires a registered biometric keycard. Only Pendelton and Julian Vance possessed master executive access.";
    }

    if (msg.includes("ledger") || msg.includes("money") || msg.includes("launder") || msg.includes("audit") || msg.includes("embezzle") || msg.includes("shares")) {
      if (name.includes("Julian")) {
        return "Careful, detective. Defamation carries devastating legal repercussions. Pendelton Vance Fine Art is an unimpeachable partnership. Arthur was hallucinating irregularities due to his failing cognition.";
      }
      return "Arthur had uncovered millions in forged estate imports laundered through European auctions. He gave Julian until 9:00 AM this morning to surrender his equity or face federal indictment.";
    }

    if (msg.includes("pen") || msg.includes("sketch") || msg.includes("stolen") || msg.includes("art")) {
      if (name.includes("Evelyn")) {
        return "Arthur took twenty-four of my original charcoal studies, signed his own monogram on the margins, and sold them to Tokyo collectors for six figures! I broke in to reclaim my own soul, not commit murder!";
      }
      return "Arthur's gallery was filled with copyists eager to bask in his prestige. Creative rivalries are common in the high-end art world.";
    }

    if (msg.includes("kill") || msg.includes("murder") || msg.includes("cyanide") || msg.includes("die")) {
      if (name.includes("Julian")) {
        return "Accusing me of murder? I built this empire with Arthur. Without him, our portfolio faces turmoil. Killing him would be financially irrational.";
      }
      if (name.includes("Evelyn")) {
        return "I hated him for exploiting my talent, but I could never watch a human being choke on poison! I heard footsteps and ran!";
      }
      if (name.includes("Sterling")) {
        return "I swore the Hippocratic oath! Yes, I was terrified he would expose my falsified reports, but I would never poison a patient!";
      }
      return "I spent ten years behind bars for cracking bank safes. I know what murder sentences carry. I didn't touch Arthur.";
    }
  }

  // ==========================================
  // CASE 2: Red Tide
  // ==========================================
  if (numId === 2) {
    if (msg.includes("board") || msg.includes("surf") || msg.includes("wax")) {
      if (name.includes("Lance")) {
        return "I was testing the point break before the sun went down. If there's wax transfer on her board, it's because we keep them in the same rack at the club. Don't look at me like that.";
      }
      if (name.includes("Andy")) {
        return "The... the boards? I saw Lance and Christine arguing near the red board around 8:30 PM. I looked away. I didn't want any trouble.";
      }
      if (name.includes("Jason")) {
        return "Surfboards touch each other all the time in Santa Marta, detective. Are we really analyzing paraffin wax now?";
      }
    }

    if (msg.includes("towel") || msg.includes("fuel") || msg.includes("boat") || msg.includes("pier")) {
      if (name.includes("Lance")) {
        return "The club launch boat was tied up all night. What are you getting at?";
      }
      if (name.includes("Andy")) {
        return "I heard an outboard motor cough around 9:15 PM near the pier. It terrified me. Please don't tell Jason I told you that.";
      }
      if (name.includes("Jason")) {
        return "The pier? I haven't been near the harbor since last weekend. My family owns two skiffs there, but I was at the beach house. Ask anyone.";
      }
    }

    if (msg.includes("locket") || msg.includes("silver") || msg.includes("neck")) {
      if (name.includes("Jason")) {
        return "She had a lot of trinkets. Look, she was alive when I said goodbye. You're trying to pin this on me because my father owns half this town.";
      }
      return "Christine never took off that locket. If it was found torn at the pier, someone grabbed her by force.";
    }

    if (msg.includes("kill") || msg.includes("murder") || msg.includes("die") || msg.includes("drown")) {
      if (name.includes("Jason")) {
        return "I didn't kill her! It was an accident—I mean, whatever happened in the water was tragic, but I had nothing to do with it!";
      }
      if (name.includes("Andy")) {
        return "I should have stopped them... I knew they went out past the buoy in the dark. It's my fault for staying silent.";
      }
      return "Accusing me of murder? Watch your mouth, detective. I loved that girl like a sister.";
    }
  }

  // ==========================================
  // CASE 1: The Midnight Murder
  // ==========================================
  if (numId === 1) {
    if (msg.includes("watch") || msg.includes("time") || msg.includes("11:45")) {
      if (name.includes("James")) {
        return "My watch stopped? No, that was Richard's watch! I told you I was asleep in the guest wing. A loud crash woke me, but I didn't go downstairs until midnight!";
      }
      return "The time of death was quarter to midnight? That completely exonerates me; my alibi is airtight.";
    }

    if (msg.includes("letter") || msg.includes("threat") || msg.includes("blood")) {
      if (name.includes("James")) {
        return "Richard was paranoid. He wrote letters to everyone when he was angry. That doesn't mean I struck him!";
      }
      return "Richard received many threats concerning his business dealings. You should examine his financial ledgers.";
    }

    if (msg.includes("key") || msg.includes("safe") || msg.includes("vault")) {
      return "The study safe contained Richard's will and title deeds. Whoever took that key was looking for inheritance records.";
    }
  }

  // General default fallback responses
  if (name.includes("Julian")) {
    return "Your hypothesis is charming, detective, but forensic speculation will not stand up in an appellate court.";
  }
  if (name.includes("Evelyn")) {
    return "I... I've told you everything! Stop staring at my hands!";
  }
  if (name.includes("Sterling")) {
    return "I suggest you consult Arthur's complete neurological file before making wild accusations.";
  }
  if (name.includes("Isaac")) {
    return "I keep my head down and do my work. You want a killer? Look at the suits who stood to inherit millions.";
  }
  if (name.includes("Lance") || name.includes("James")) {
    return "You're fishing for things that aren't there. I've told you my statement three times already.";
  }
  if (name.includes("Andy")) {
    return "I... I just want to go home. Everything is so loud and I keep replaying that evening in my head.";
  }
  return "Interesting theory, detective. But without solid proof, you're merely speculating.";
}

function Interrogation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const chatBottomRef = useRef(null);

  const currentCase = cases.find((c) => c.id === Number(id)) || cases[0];
  const activeUser = getCurrentUser();

  // Play interrogation soundtrack on mount, stop on leave
  useEffect(() => {
    soundManager.playInterrogationTheme();
    return () => soundManager.stopAll();
  }, []);

  // Selected suspect ID
  const suspectQueryId = Number(searchParams.get("suspect")) || currentCase?.suspects[0]?.id || 1;
  const currentSuspect =
    currentCase?.suspects.find((s) => s.id === suspectQueryId) ||
    currentCase?.suspects[0];

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

  // Sync traits when suspect changes
  useEffect(() => {
    if (currentSuspect) {
      setTraits({
        stress: currentSuspect.traits?.defensiveness || 50,
        deception: currentSuspect.traits?.deception || 50,
        guilt: currentSuspect.traits?.guilt || 30,
        consistency: currentSuspect.traits?.consistency || 70
      });
      setMessages([
        {
          sender: "system",
          text: `Now interrogating ${currentSuspect.name} (${currentSuspect.role}).`
        },
        {
          sender: "suspect",
          name: currentSuspect.name,
          text: `"${currentSuspect.statement}"`
        }
      ]);
    }
  }, [suspectQueryId, currentSuspect]);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!currentCase || !currentSuspect) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "#fff" }}>
        <h2>Suspect or Case not found</h2>
        <button onClick={() => navigate("/")}>Return to Dashboard</button>
      </div>
    );
  }

  // Send question to suspect
  function handleSendMessage(textToSend) {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      sender: "detective",
      name: activeUser?.name || "Detective",
      text: text.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Fluctuate traits based on user question keywords
    const lower = text.toLowerCase();
    let stressDelta = 4;
    let deceptionDelta = 2;

    if (
      lower.includes("kill") ||
      lower.includes("murder") ||
      lower.includes("cyanide") ||
      lower.includes("cufflink") ||
      lower.includes("ledger") ||
      lower.includes("elevator") ||
      lower.includes("pier") ||
      lower.includes("watch") ||
      lower.includes("blood")
    ) {
      stressDelta = 16;
      deceptionDelta = 10;
    }

    setTimeout(() => {
      const suspectReplyText = generateSuspectResponse(currentSuspect, text, id);
      const replyMsg = {
        sender: "suspect",
        name: currentSuspect.name,
        text: suspectReplyText
      };

      setMessages((prev) => [...prev, replyMsg]);
      setIsTyping(false);

      // Update psychological trait meters
      setTraits((prev) => ({
        stress: Math.min(100, Math.max(10, prev.stress + stressDelta)),
        deception: Math.min(100, Math.max(10, prev.deception + deceptionDelta)),
        guilt: prev.guilt,
        consistency: Math.max(15, prev.consistency - 4)
      }));

      // Patrick Jane commentary trigger on high stress
      if (stressDelta > 10) {
        setTimeout(() => {
          let customJaneComment = `☕ Patrick Jane leans in: "Notice how ${currentSuspect.name}'s posture froze? Their pulse is racing. Press them on that exact detail."`;

          if (currentSuspect.name.includes("Julian")) {
            customJaneComment = `☕ Patrick Jane smiles softly: "Watch his left thumb, detective. He's polished that gold cufflink five times since you mentioned the ledger. He's terrified."`;
          } else if (currentSuspect.name.includes("Evelyn")) {
            customJaneComment = `☕ Patrick Jane whispers: "Listen to her breathing—rapid, shallow upper-chest. She's hiding her own break-in, but she didn't poison the glass."`;
          } else if (currentSuspect.name.includes("Sterling")) {
            customJaneComment = `☕ Patrick Jane sighs: "He tugs at his collar every time you say 'records.' Classic displacement activity for a guilty conscience."`;
          } else if (currentSuspect.name.includes("Isaac")) {
            customJaneComment = `☕ Patrick Jane observes: "Look at his jaw muscles clenching rhythmically. An ex-con measuring the physical exits. He's innocent of murder, but guilty of theft."`;
          }

          setMessages((prev) => [
            ...prev,
            {
              sender: "jane",
              text: customJaneComment
            }
          ]);
        }, 900);
      }
    }, 1000);
  }

  const suggestedQuestions =
    CASE_SUGGESTED_QUESTIONS[Number(id)] || CASE_SUGGESTED_QUESTIONS[1];

  return (
    <div className="interrogation-page">
      {/* Navigation */}
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
        {/* Left Column: Suspect Profile & Dynamic Trait Meters */}
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
              LIVE TRAIT & STRESS ANALYSIS
            </div>

            <div className="trait-bar-item">
              <div className="trait-label-row">
                <span>Tension & Stress Level</span>
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
                <span>Guilt & Remorse Index</span>
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
                  ? `"${currentSuspect.name} is visibly cornered. Their physical micro-tells are betraying direct involvement. Deliver the forensic contradiction."`
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

        {/* Right Column: Real-time Chat Room */}
        <section className="interrogation-chat-chamber">
          {/* Header & Suspect Switcher */}
          <div className="chat-chamber-header">
            <div className="chat-chamber-title">
              <h2>Interrogating: {currentSuspect.name}</h2>
              <span>Direct psychological questioning channel</span>
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

          {/* Messages Feed */}
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

          {/* Suggested Quick Questions (Dynamic per case) */}
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

          {/* Input Form */}
          <form
            className="chat-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              placeholder={`Ask ${currentSuspect.name} anything (alibis, evidence, motives)...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <span>Press Suspect</span>
              <Send size={15} />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Interrogation;