// src/webpages/FinalAccusation.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cases } from "../data/cases";
import Navbar from "../components/Navbar";
import { soundManager } from "../utils/soundManager";
import "../Accusation.css";

import {
  Gavel,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Coffee,
  Check
} from "lucide-react";

// Curated High-Resolution Suspect Photos
const SUSPECT_PHOTOS = {
  // Case 1
  "1-1": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=450&auto=format&fit=crop&q=80",
  "1-2": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=450&auto=format&fit=crop&q=80",
  "1-3": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=450&auto=format&fit=crop&q=80",

  // Case 2
  "2-1": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=450&auto=format&fit=crop&q=80",
  "2-2": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=450&auto=format&fit=crop&q=80",
  "2-3": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=450&auto=format&fit=crop&q=80"
};

const VERDICT_STORIES = {
  "1-1": {
    correct: true,
    confession:
      "All right, stop! Richard was cutting me out of our father's inheritance! I came down to his study at 11:45 PM to plead with him... but when he laughed in my face, I grabbed the paperweight. The broken watch... it stopped when he struck the floor. I didn't want to kill him, but he left me nothing!",
    defense: ""
  },
  "1-2": {
    correct: false,
    defense:
      "Are you mad, detective?! I was Mr. Morgan's faithful assistant for six years! My toll receipts and GPS prove I was already home across town by 10 PM. You've arrested an innocent person while the true murderer walks free!"
  },
  "1-3": {
    correct: false,
    defense:
      "My business dinner was attended by five prominent associates and logged by restaurant staff. This is reckless police incompetence. My attorneys will have this warrant dismissed before breakfast."
  },
  "2-3": {
    correct: true,
    confession:
      "She was going to tell the coast guard about the illicit drops off our family skiff! I took Christine out past the pier to intimidate her into silence, but she fought back! She tore her silver locket trying to break free, slipped on the wet pier deck, and hit her head! I panicked... I smashed the flashlight on the rocks so no one would see us and let the tide carry her out! It was an accident!",
    defense: ""
  },
  "2-1": {
    correct: false,
    defense:
      "You're making a catastrophic mistake! Yeah, I'm loud, and yeah, I got into an argument with her over surf territory, but Christine was family to our crew! I would never drown her! Check Jason's family boat!"
  },
  "2-2": {
    correct: false,
    defense:
      "I didn't hurt her! I swear on my life! I only watched them walk toward the pier from my truck... I was too terrified of Jason to speak up, but I never touched her!"
  }
};

function FinalAccusation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentCase = cases.find((item) => item.id === Number(id));

  const [selectedSuspectId, setSelectedSuspectId] = useState(null);
  const [verdictResult, setVerdictResult] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  // Accusation Room Lifecycle: Starts Red John Theme, STOPS on leave
  useEffect(() => {
    soundManager.playInterrogationTheme();

    return () => {
      // Guaranteed stop when leaving the Accusation room
      soundManager.stopAll();
    };
  }, []);

  if (!currentCase) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "#fff" }}>
        <h2>Case not found</h2>
        <button onClick={() => navigate("/")}>Return to Dashboard</button>
      </div>
    );
  }

  const suspects = currentCase.suspects || [];

  function handleSubmitAccusation() {
    if (!selectedSuspectId) return;

    const isCorrect = Number(selectedSuspectId) === currentCase.culprit;
    const lookupKey = `${id}-${selectedSuspectId}`;
    const story = VERDICT_STORIES[lookupKey] || {
      confession: "The evidence against me is overwhelming... I did it.",
      defense: "You have accused the wrong person! I am completely innocent!"
    };

    const chosenSuspect = suspects.find((s) => s.id === Number(selectedSuspectId));

    if (isCorrect) {
      // STOPS Interrogation theme and switches immediately to Victory!
      soundManager.playVictoryTheme();
    } else {
      // Screen shake animation
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }

    setVerdictResult({
      isCorrect,
      suspect: chosenSuspect,
      text: isCorrect ? story.confession : story.defense
    });
  }

  function handleReconsider() {
    setVerdictResult(null);
    // Resume Interrogation theme
    soundManager.playInterrogationTheme();
  }

  return (
    <div className={`accusation-page ${isShaking ? "shake-screen" : ""}`}>
      <Navbar caseId={id} activePage="case" />

      <main className="accusation-container">
        <div className="accusation-header">
          <span className="accusation-badge-pill">
            <Gavel size={14} />
            CBI FORMAL INDICTMENT // CASE 00{id}
          </span>
          <h1>Final Accusation Tribunal</h1>
          <p>
            Study the lineup. Every clue, alibi, and psychological tell leads to one perpetrator.
            Select the culprit to close the case.
          </p>
        </div>

        <section className="lineup-grid">
          {suspects.map((suspect) => {
            const isSelected = selectedSuspectId === suspect.id;
            const photoKey = `${id}-${suspect.id}`;
            const photoUrl =
              SUSPECT_PHOTOS[photoKey] ||
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=450&auto=format&fit=crop&q=80";

            return (
              <div
                key={suspect.id}
                className={`suspect-lineup-card ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedSuspectId(suspect.id)}
              >
                <div className="suspect-photo-box">
                  <img src={photoUrl} alt={suspect.name} />
                  <div className="photo-overlay-gradient" />
                  <div className="selection-ring-badge">
                    {isSelected ? <Check size={16} /> : null}
                  </div>
                </div>

                <div className="suspect-lineup-info">
                  <h3>{suspect.name}</h3>
                  <span className="role-tag">{suspect.role}</span>
                  <div className="suspect-claim-bubble">
                    "{suspect.statement}"
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <div className="accusation-submit-wrapper">
          <button
            className="accuse-action-btn"
            disabled={!selectedSuspectId}
            onClick={handleSubmitAccusation}
          >
            <Gavel size={18} />
            <span>Deliver CBI Indictment</span>
          </button>
        </div>
      </main>

      {verdictResult && (
        <div className="verdict-backdrop">
          <div
            className={`verdict-card ${verdictResult.isCorrect ? "correct" : "wrong"}`}
          >
            <div className="verdict-stamp-header">
              <span className="verdict-status-tag">
                {verdictResult.isCorrect
                  ? "✓ CASE SOLVED // ARREST EXECUTED"
                  : "✗ WRONGFUL ACCUSATION // CASE COMPROMISED"}
              </span>
            </div>

            <h2>
              {verdictResult.isCorrect
                ? `Guilty as Charged: ${verdictResult.suspect.name}`
                : `False Arrest: ${verdictResult.suspect.name} is Innocent!`}
            </h2>

            <p className="verdict-subtitle">
              {verdictResult.isCorrect
                ? "The suspect broke down under the weight of forensic evidence and confessed."
                : "Your deduction missed a critical contradiction. The real killer slipped away."}
            </p>

            <div className="confession-box">
              <span className="confession-speaker">
                {verdictResult.isCorrect ? <Gavel size={14} /> : <AlertTriangle size={14} />}
                {verdictResult.suspect.name.toUpperCase()} (LAST VERDICT):
              </span>
              <p className="confession-text">"{verdictResult.text}"</p>
            </div>

            <div className="jane-verdict-quote">
              <Coffee size={24} color="#ffc870" style={{ flexShrink: 0 }} />
              <p>
                {verdictResult.isCorrect
                  ? `Patrick Jane smiles: "Brilliant work, detective. They thought their privilege and lies could bury the truth, but human nature never lies."`
                  : `Patrick Jane sighs: "A costly mistake. Don't let emotion guide your choice—revisit the clues and trace the physical contradictions."`}
              </p>
            </div>

            <div className="verdict-actions-row">
              {verdictResult.isCorrect ? (
                <button
                  className="verdict-btn primary"
                  onClick={() => navigate("/")}
                >
                  <CheckCircle2 size={16} />
                  Close Case & Return to Dashboard
                </button>
              ) : (
                <>
                  <button
                    className="verdict-btn secondary"
                    onClick={handleReconsider}
                  >
                    <RotateCcw size={16} />
                    Reconsider Suspects
                  </button>
                  <button
                    className="verdict-btn primary"
                    onClick={() => navigate(`/crime-scene/${id}`)}
                  >
                    Re-examine Crime Scene
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinalAccusation;