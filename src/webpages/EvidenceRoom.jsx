// src/webpages/EvidenceRoom.jsx

import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cases } from "../data/cases";
import { getEvidence } from "../utils/storage";
import Navbar from "../components/Navbar";
import "../Evidence.css";

import {
  RotateCcw,
  RotateCw,
  ZoomIn,
  Move,
  Layers,
  ArrowRight,
  Coffee,
  Sparkles,
  Compass,
  ArrowLeft,
  Gavel
} from "lucide-react";

// Curated Photorealistic Forensic Item Imagery for Case 1 & Case 2
const REALISTIC_EVIDENCE_ASSETS = {
  // Case 2: Red Tide (Santa Marta Beach Cove - S01E03)
  "2-1": {
    name: "Waxed Red Surfboard",
    frontPhoto:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=600&auto=format&fit=crop&q=80",
    reverseTell:
      "REVERSE ANGLE INSPECTION: High-pressure impact fracture near the tail fin matching Lance's board."
  },
  "2-2": {
    name: "Stained Beach Towel",
    frontPhoto:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&auto=format&fit=crop&q=80",
    reverseTell:
      "REVERSE ANGLE INSPECTION: Diesel engine grease and boat registration fiber transfer from the skiff."
  },
  "2-3": {
    name: "Silver Shell Locket",
    frontPhoto:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1611591475155-426462725838?w=600&auto=format&fit=crop&q=80",
    reverseTell:
      "REVERSE ANGLE INSPECTION: Broken link clasp snapped by human force. Initials 'J.R.' engraved inside."
  },
  "2-4": {
    name: "Saltwater Flashlight",
    frontPhoto:
      "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80",
    reverseTell:
      "REVERSE ANGLE INSPECTION: Battery housing shattered with a quartz rock to kill illumination instantly."
  },

  // Case 1: The Midnight Murder
  "1-1": {
    name: "Broken Watch",
    frontPhoto:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80",
    reverseTell:
      "REVERSE ANGLE INSPECTION: Hairline crack in balance spring caused by a blunt strike from the left."
  },
  "1-2": {
    name: "Blood-stained Letter",
    frontPhoto:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    reverseTell:
      "REVERSE ANGLE INSPECTION: Imprinted watermark of Morgan Family Crest paper from the study drawer."
  },
  "1-3": {
    name: "Footprint",
    frontPhoto:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
    reverseTell:
      "REVERSE ANGLE INSPECTION: Depth indent shows weight shifted back—the walker paused deliberately."
  },
  "1-4": {
    name: "Silver Key",
    frontPhoto:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80",
    reverseTell:
      "REVERSE ANGLE INSPECTION: Microscopic scratches on teeth indicate it opened the study floor safe."
  }
};

// Resident Evil Click / Clack Mechanical Audio Synthesizer
function playMechanicalAudio(type = "click") {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === "click") {
      osc.type = "square";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === "flip") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }
  } catch (err) {}
}

function EvidenceRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentCase = cases.find((c) => c.id === Number(id));

  // Load collected evidence (or fallback to full case evidence so you can inspect right away)
  const savedEvidence = getEvidence(id);
  const availableEvidence =
    savedEvidence.length > 0
      ? savedEvidence
      : currentCase?.evidence || [];

  const [selectedItem, setSelectedItem] = useState(
    availableEvidence[0] || currentCase?.evidence[0]
  );

  // 3D Examination States (Resident Evil Mechanism)
  const [rotation, setRotation] = useState({ x: 12, y: -18 });
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  if (!currentCase) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "#fff" }}>
        <h2>Case Dossier Not Found</h2>
        <button onClick={() => navigate("/")}>Return to Dashboard</button>
      </div>
    );
  }

  // Resident Evil Click & Drag 3D Turntable Movement
  function handleMouseDown(e) {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    playMechanicalAudio("click");
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setRotation((prev) => ({
      x: Math.max(-55, Math.min(55, prev.x - deltaY * 0.45)),
      y: prev.y + deltaX * 0.45
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  const assetKey = `${id}-${selectedItem?.id}`;
  const assetData = REALISTIC_EVIDENCE_ASSETS[assetKey] || {
    frontPhoto:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
    reverseTell: "Surface forensic examination shows microscopic particulate residue."
  };

  return (
    <div className="evidence-re-page" onMouseUp={handleMouseUp}>
      {/* Universal Investigation Navigation Bar */}
      <Navbar caseId={id} activePage="evidence" />

      <main className="evidence-re-container">
        {/* Header Banner */}
        <section className="evidence-re-header">
          <div>
            <span className="cbi-lab-stamp">
              CALIFORNIA BUREAU OF INVESTIGATION // FORENSIC REPOSITORY
            </span>
            <h1>3D Forensic Evidence Locker — {currentCase.title}</h1>
          </div>

          <div className="re-status-pill">
            CBI CHAIN OF CUSTODY // {availableEvidence.length} ITEMS CATALOGED
          </div>
        </section>

        {/* Main Resident Evil Layout */}
        <div className="evidence-re-layout">
          {/* Left: Resident Evil Inventory Slots */}
          <aside className="re-inventory-sidebar">
            <div className="inventory-slot-title">
              <span>EVIDENCE INVENTORY SLOTS</span>
              <span>[RE-EXAMINE]</span>
            </div>

            {availableEvidence.map((item) => {
              const itemAssetKey = `${id}-${item.id}`;
              const itemAsset = REALISTIC_EVIDENCE_ASSETS[itemAssetKey];
              const isSelected = selectedItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`re-slot-card ${isSelected ? "active" : ""}`}
                  onClick={() => {
                    setSelectedItem(item);
                    setIsFlipped(false);
                    setRotation({ x: 12, y: -18 });
                    playMechanicalAudio("click");
                  }}
                >
                  <div className="re-slot-thumbnail">
                    <img
                      src={itemAsset?.frontPhoto}
                      alt={item.name}
                    />
                  </div>
                  <div className="re-slot-info">
                    <h4>{item.name}</h4>
                    <span>ITEM #{item.id} // SECURED</span>
                  </div>
                  <div className="re-slot-indicator" />
                </div>
              );
            })}
          </aside>

          {/* Right: Resident Evil 3D Item Examination Chamber */}
          <section className="re-examination-chamber">
            {/* 3D Turntable Stage */}
            <div
              className="re-3d-stage"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
            >
              <div className="re-overhead-spotlight" />

              <div className="re-3d-drag-hint">
                <Move size={13} />
                <span>Drag to Rotate 3D</span>
              </div>

              {/* Rotatable Object */}
              <div
                className="re-3d-object-wrap"
                style={{
                  transform: `rotateX(${rotation.x}deg) rotateY(${
                    rotation.y + (isFlipped ? 180 : 0)
                  }deg) scale(${zoom})`
                }}
              >
                <div className="re-item-card-3d">
                  <img
                    src={
                      isFlipped
                        ? assetData.reversePhoto
                        : assetData.frontPhoto
                    }
                    alt={selectedItem?.name}
                    draggable={false}
                  />
                </div>
              </div>

              <div className="re-3d-grid-hud">
                ROT: X:{Math.round(rotation.x)}° Y:{Math.round(rotation.y)}° // ZOOM:{zoom.toFixed(1)}x
              </div>
            </div>

            {/* Resident Evil Examination Controls Strip */}
            <div className="re-controls-strip">
              <button
                className="re-ctrl-btn"
                onClick={() => {
                  setRotation((prev) => ({ ...prev, y: prev.y - 45 }));
                  playMechanicalAudio("click");
                }}
              >
                <RotateCcw size={14} /> Rotate Left
              </button>

              <button
                className="re-ctrl-btn"
                onClick={() => {
                  setRotation((prev) => ({ ...prev, y: prev.y + 45 }));
                  playMechanicalAudio("click");
                }}
              >
                <RotateCw size={14} /> Rotate Right
              </button>

              <button
                className="re-ctrl-btn"
                onClick={() => {
                  setIsFlipped(!isFlipped);
                  playMechanicalAudio("flip");
                }}
              >
                <Layers size={14} /> {isFlipped ? "View Front" : "Inspect Reverse"}
              </button>

              <button
                className="re-ctrl-btn"
                onClick={() => {
                  setZoom((prev) => (prev >= 1.4 ? 1 : prev + 0.2));
                  playMechanicalAudio("click");
                }}
              >
                <ZoomIn size={14} /> Zoom ({zoom.toFixed(1)}x)
              </button>
            </div>

            {/* Forensic Dossier & Patrick Jane's Micro-Read */}
            <div className="re-forensic-dossier">
              <div className="forensic-title-row">
                <h3>{selectedItem?.name}</h3>
                <span className="custody-badge">TAG: CBI-EVD-00{selectedItem?.id}</span>
              </div>

              <p className="forensic-desc">{selectedItem?.description}</p>

              {/* Reveal message on flip */}
              {isFlipped && (
                <div
                  style={{
                    background: "rgba(184, 38, 49, 0.25)",
                    border: "1px solid rgba(184, 38, 49, 0.5)",
                    color: "#ff8e95",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "700",
                    marginBottom: "12px"
                  }}
                >
                  {assetData.reverseTell}
                </div>
              )}

              {/* Jane's Psychological Assessment */}
              <div className="re-jane-observation">
                <Coffee size={20} color="#ffc870" style={{ flexShrink: 0 }} />
                <div>
                  <strong>PATRICK JANE'S FORENSIC OBSERVATION</strong>
                  <span>
                    "Rotate the object. The front is what the killer wanted us to find. The reverse and edges tell the true story."
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="re-chamber-actions">
              <button
                className="re-ctrl-btn"
                onClick={() => navigate(`/crime-scene/${id}`)}
              >
                <ArrowLeft size={15} /> Revisit Crime Scene
              </button>

              <button
                className="re-ctrl-btn"
                style={{
                  background: "linear-gradient(135deg, #a61c27, #680d14)",
                  color: "#fff",
                  borderColor: "rgba(255, 200, 112, 0.35)"
                }}
                onClick={() => navigate(`/suspects/${id}`)}
              >
                <span>Confront Suspects with Clues</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default EvidenceRoom;