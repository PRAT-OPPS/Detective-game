// src/utils/soundManager.js

import homeTrack from "../assets/the_mentalist.mp3";
import interrogationTrack from "../assets/red_john_skywriting.mp3";
import victoryTrack from "../assets/patrick_jane_the_mentalist.mp3";

class SoundManager {
  constructor() {
    this.currentAudio = null;
    this.currentTrackType = null;
    this.muted = false;
    this.unlockListener = null;
  }

  // Play a specific track and automatically terminate whatever was playing before
  playTrack(type, volume = 0.5, loop = true) {
    // If the exact same track is already playing, don't restart it
    if (this.currentTrackType === type && this.currentAudio && !this.currentAudio.paused) {
      return;
    }

    // 1. STOP ALL previous audio immediately
    this.stopAll();

    let trackFile = null;
    if (type === "home") trackFile = homeTrack;
    else if (type === "interrogation") trackFile = interrogationTrack;
    else if (type === "victory") trackFile = victoryTrack;

    if (!trackFile) return;

    const audio = new Audio(trackFile);
    audio.loop = loop;
    audio.volume = this.muted ? 0 : volume;
    this.currentAudio = audio;
    this.currentTrackType = type;

    // Play with autoplay protection
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy: start audio on next user click ONLY if this track is still active
        this.unlockListener = () => {
          if (this.currentAudio === audio && this.currentTrackType === type) {
            audio.play().catch(() => {});
          }
          this.removeUnlockListener();
        };
        window.addEventListener("click", this.unlockListener);
      });
    }
  }

  // Specific helper methods
  playHomeTheme() {
    this.playTrack("home", 0.5, true);
  }

  playInterrogationTheme() {
    this.playTrack("interrogation", 0.45, true);
  }

  playVictoryTheme() {
    // Stops the interrogation theme and starts victory
    this.playTrack("victory", 0.55, false);
  }

  // Stop ALL music across the entire app
  stopAll() {
    this.removeUnlockListener();

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.src = "";
      this.currentAudio = null;
    }
    this.currentTrackType = null;
  }

  removeUnlockListener() {
    if (this.unlockListener) {
      window.removeEventListener("click", this.unlockListener);
      this.unlockListener = null;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.currentAudio) {
      this.currentAudio.volume = this.muted ? 0 : 0.5;
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }
}

export const soundManager = new SoundManager();