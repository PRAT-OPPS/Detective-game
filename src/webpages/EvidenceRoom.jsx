// src/webpages/EvidenceRoom.jsx

import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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
  Compass,
  Box
} from "lucide-react";

// Curated Photorealistic Forensic Item Imagery & Tells
const REALISTIC_EVIDENCE_ASSETS = {
  // ==========================================
  // Case 4: The Silent Witness (3D GLB Models)
  // ==========================================
  "4-1": {
    name: "Antique Brass Pocket Watch",
    glb: "/models/antique_luxury_pocket_watch_1147.glb",
    frontPhoto:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80",
    reverseTell:
      "REVERSE ANGLE INSPECTION: Blunt force impact halted the balance wheel at precisely 11:47 PM. Hairspring seized from an external lateral blow."
  },
  "4-2": {
    name: "Victorian Evidence Mirror",
    glb: "/models/antique_victorian_tabletop_mirror.glb",
    frontPhoto:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    reverseTell:
      "REVERSE ANGLE INSPECTION: Chemical analysis reveals medical-grade surgical wax and ferric dye from Dr. Miller's psychiatric kit, not human blood."
  },
  "4-3": {
    name: "Partially Burnt Letter",
    glb: "/models/partially_burnt_letter.glb",
    frontPhoto:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    reverseTell:
      "REVERSE ANGLE INSPECTION: Transmitted backlighting exposes iron-gall cursive: 'Victoria... He knows... Project Mirror...' proving premeditated silencing."
  },
  "4-4": {
    name: "2006 Institutional Photograph",
    glb: "/models/evidence_photograph_2006.glb",
    frontPhoto:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
    reverseTell:
      "REVERSE ANGLE INSPECTION: Depicts five children outside Blackwood clinic. The rightmost isolated child is Subject 05 (Anna Grey)."
  },
  "4-5": {
    name: "Handheld Audio Recorder",
    glb: "/models/handheld_audio_recorder.glb",
    frontPhoto:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    reverseTell:
      "REVERSE ANGLE INSPECTION: Track timer stopped at 00:47:12. Adrian's final consultation was recorded at 10:30 PM, proving Sophia killed him an hour before the alarm."
  },
  "4-6": {
    name: "Victorian Crystal Wine Glass",
    glb: "/models/antique_crystal_wine_glass.glb",
    frontPhoto:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80",
    reversePhoto:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
    reverseTell:
      "REVERSE ANGLE INSPECTION: Fatal potassium cyanide precipitate dissolved in vintage sediment. Latent thumbprint on stem knop matches Dr. Sophia Miller."
  }
};

// Interactive WebGL Viewer with Enhanced 3/4 Isometric Perspective
function ThreeModelViewer({ glbPath }) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!mountRef.current || !glbPath) return;

    let scene, camera, renderer, controls, animationId;
    let isMounted = true;
    setLoading(true);
    setLoadError(false);

    try {
      scene = new THREE.Scene();

      const width = mountRef.current.clientWidth || 600;
      const height = mountRef.current.clientHeight || 380;

      // Elevated 3/4 isometric angle so front lids never clip the dial
      camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 100);
      camera.position.set(0.6, 0.9, 2.2);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.4;

      mountRef.current.replaceChildren(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 0.5;
      controls.maxDistance = 4.5;
      controls.target.set(0, 0, 0);

      // Studio Lighting
      const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.6);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
      keyLight.position.set(3, 4, 3);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xb82631, 1.8);
      rimLight.position.set(-3, -2, -2);
      scene.add(rimLight);

      const fillLight = new THREE.DirectionalLight(0x7090b0, 1.3);
      fillLight.position.set(-2, 2, 2);
      scene.add(fillLight);

      const loader = new GLTFLoader();
      loader.load(
        glbPath,
        (gltf) => {
          if (!isMounted) return;
          const model = gltf.scene;

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          const maxDim = Math.max(size.x, size.y, size.z);
          const targetSize = 1.35;
          const scale = targetSize / (maxDim || 1);
          model.scale.setScalar(scale);

          model.position.x = -center.x * scale;
          model.position.y = -center.y * scale;
          model.position.z = -center.z * scale;

          // Default presentation tilt: reveals both the dial face and casing clearly
          model.rotation.x = THREE.MathUtils.degToRad(-10);
          model.rotation.y = THREE.MathUtils.degToRad(20);

          scene.add(model);
          setLoading(false);
        },
        undefined,
        (err) => {
          console.warn("Could not load GLB:", glbPath, err);
          if (isMounted) {
            setLoadError(true);
            setLoading(false);
          }
        }
      );

      function animate() {
        animationId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();

      function handleResize() {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
      window.addEventListener("resize", handleResize);

      return () => {
        isMounted = false;
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationId);
        controls.dispose();
        renderer.dispose();
      };
    } catch (e) {
      setLoadError(true);
      setLoading(false);
    }
  }, [glbPath]);

  if (loadError) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#8b949e", fontSize: "13px" }}>
        3D Model File Pending. Click "View Photographic Angle" below.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {loading && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#ffc870", fontSize: "12px", letterSpacing: "1.5px", fontWeight: "700" }}>
          STREAMING 3D MESH GEOMETRY...
        </div>
      )}
      <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />
    </div>
  );
}

function EvidenceRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentCase = cases.find((c) => c.id === Number(id)) || cases[0];
  const savedEvidence = getEvidence(id);
  const availableEvidence =
    savedEvidence.length > 0 ? savedEvidence : currentCase?.evidence || [];

  const [selectedItem, setSelectedItem] = useState(
    availableEvidence[0] || currentCase?.evidence[0]
  );

  const [viewMode, setViewMode] = useState("3d");
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

  function handleMouseDown(e) {
    if (viewMode === "3d" && selectedItem?.glb) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }

  function handleMouseMove(e) {
    if (!isDragging || (viewMode === "3d" && selectedItem?.glb)) return;
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
    reverseTell: "Surface forensic examination shows microscopic particulate residue.",
    glb: selectedItem?.glb || null
  };

  const hasGlb = Boolean(selectedItem?.glb || assetData.glb);

  return (
    <div className="evidence-re-page" onMouseUp={handleMouseUp}>
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
          {/* Left: Inventory Slots */}
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
                  }}
                >
                  <div className="re-slot-thumbnail">
                    <img src={itemAsset?.frontPhoto || item.image} alt={item.name} />
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

          {/* Right: 3D Item Examination Chamber */}
          <section className="re-examination-chamber">
            {/* 3D Turntable / WebGL Stage */}
            <div
              className="re-3d-stage"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
            >
              <div className="re-overhead-spotlight" />

              <div className="re-3d-drag-hint">
                <Move size={13} />
                <span>{hasGlb && viewMode === "3d" ? "Click & Drag Orbit (WebGL)" : "Drag to Rotate 3D"}</span>
              </div>

              {hasGlb && viewMode === "3d" ? (
                <ThreeModelViewer glbPath={selectedItem?.glb || assetData.glb} />
              ) : (
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
                      src={isFlipped ? assetData.reversePhoto : assetData.frontPhoto}
                      alt={selectedItem?.name}
                      draggable={false}
                    />
                  </div>
                </div>
              )}

              <div className="re-3d-grid-hud">
                {hasGlb && viewMode === "3d"
                  ? "MODE: REAL-TIME 3D GLTF MESH // SHADERS: ACTIVE"
                  : `ROT: X:${Math.round(rotation.x)}° Y:${Math.round(rotation.y)}° // ZOOM:${zoom.toFixed(1)}x`}
              </div>
            </div>

            {/* Resident Evil Examination Controls Strip */}
            <div className="re-controls-strip">
              {hasGlb && (
                <button
                  className="re-ctrl-btn"
                  onClick={() => setViewMode(viewMode === "3d" ? "photo" : "3d")}
                  style={{
                    background: viewMode === "3d" ? "#b82631" : "rgba(255, 255, 255, 0.08)",
                    color: "#fff",
                    borderColor: "#ffc870"
                  }}
                >
                  <Box size={14} />
                  <span>{viewMode === "3d" ? "3D Mesh (Active)" : "Switch to 3D WebGL"}</span>
                </button>
              )}

              <button
                className="re-ctrl-btn"
                onClick={() => setRotation((prev) => ({ ...prev, y: prev.y - 45 }))}
              >
                <RotateCcw size={14} /> Rotate Left
              </button>

              <button
                className="re-ctrl-btn"
                onClick={() => setRotation((prev) => ({ ...prev, y: prev.y + 45 }))}
              >
                <RotateCw size={14} /> Rotate Right
              </button>

              <button
                className="re-ctrl-btn"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <Layers size={14} /> {isFlipped ? "View Front" : "Inspect Reverse Tell"}
              </button>

              <button
                className="re-ctrl-btn"
                onClick={() => setZoom((prev) => (prev >= 1.4 ? 1 : prev + 0.2))}
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
              <div className="re-jane-insight-box">
                <div className="insight-jane-badge">☕ JANE'S PSYCHOLOGICAL READ</div>
                <p>
                  "Objects tell the stories people are too terrified to confess. Look beyond what is visible—every fracture, scratch, and chemical residue reveals an emotional impulse."
                </p>
              </div>

              {/* Bottom Nav Action Bar (Cleanly Separated) */}
              <div className="re-nav-action-bar">
                <button
                  className="re-secondary-btn"
                  onClick={() => navigate(`/crime-scene/${id}`)}
                >
                  <Compass size={15} />
                  <span>Re-examine Crime Scene</span>
                </button>

                <button
                  className="re-primary-btn"
                  onClick={() => navigate(`/suspects/${id}`)}
                >
                  <span>Question Suspects</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default EvidenceRoom;