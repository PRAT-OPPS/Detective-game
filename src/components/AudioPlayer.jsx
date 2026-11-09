// src/components/AudioPlayer.jsx

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, SkipForward, Music } from "lucide-react";

// Import your downloaded MP3 audio files from src/assets
import mentalistTheme from "../assets/the_mentalist.mp3";
import janeTheme from "../assets/patrick_jane_the_mentalist.mp3";
import redJohnTheme from "../assets/red_john_skywriting.mp3";

const SOUNDTRACKS = [
  { id: "main", name: "The Mentalist (Main Theme)", file: mentalistTheme },
  { id: "jane", name: "Patrick Jane's Theme", file: janeTheme },
  { id: "redjohn", name: "Red John Skywriting", file: redJohnTheme }
];

function AudioPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const activeTrack = SOUNDTRACKS[currentTrackIndex];

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }

  function toggleMute() {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }

  function nextTrack() {
    const nextIdx = (currentTrackIndex + 1) % SOUNDTRACKS.length;
    setCurrentTrackIndex(nextIdx);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 100);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "rgba(18, 22, 32, 0.85)",
        border: "1px solid rgba(255, 200, 112, 0.3)",
        borderRadius: "24px",
        padding: "4px 12px 4px 10px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.4)"
      }}
    >
      <audio
        ref={audioRef}
        src={activeTrack.file}
        loop
        preload="auto"
      />

      {/* Play / Pause Toggle Button */}
      <button
        onClick={togglePlay}
        title={isPlaying ? "Pause Soundtrack" : "Play CBI Soundtrack"}
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: isPlaying
            ? "linear-gradient(135deg, #a61c27, #680d14)"
            : "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,200,112,0.4)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
      >
        {isPlaying ? <Pause size={13} /> : <Play size={13} style={{ marginLeft: "2px" }} />}
      </button>

      {/* Track Label */}
      <div style={{ display: "flex", flexDirection: "column", maxWidth: "125px" }}>
        <span
          style={{
            fontSize: "9px",
            color: "#ffc870",
            fontWeight: "800",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <Music size={10} />
          {isPlaying ? "SOUNDTRACK PLAYING" : "CBI AUDIO"}
        </span>
        <span
          style={{
            fontSize: "11px",
            color: "#ffffff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
          title={activeTrack.name}
        >
          {activeTrack.name}
        </span>
      </div>

      {/* Next Track Button */}
      <button
        onClick={nextTrack}
        title="Next Theme"
        style={{
          background: "transparent",
          border: "none",
          color: "#8b949e",
          cursor: "pointer",
          padding: "3px"
        }}
      >
        <SkipForward size={14} />
      </button>

      {/* Mute Toggle */}
      <button
        onClick={toggleMute}
        title={isMuted ? "Unmute" : "Mute"}
        style={{
          background: "transparent",
          border: "none",
          color: isMuted ? "#ff7882" : "#c9d1d9",
          cursor: "pointer",
          padding: "3px"
        }}
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>
    </div>
  );
}

export default AudioPlayer;