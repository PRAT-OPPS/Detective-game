// src/utils/auth.js

import janeImg from "../assets/PATRIC JANE.jpg";
import lisbonImg from "../assets/lisbon.jpg";
import choImg from "../assets/AGENT CHO.jpg";
import rigsbyImg from "../assets/Wayne Rigsby.jpg";
import vanPeltImg from "../assets/Val Pelt icon mentalista.jpg";
import { sqlDb } from "./sqlDatabase";

// Styled Red John smiley SVG emblem for the mystery avatar
const redJohnImg =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%2319080c' stroke='%23b82631' stroke-width='4'/><circle cx='34' cy='38' r='5.5' fill='%23b82631'/><circle cx='66' cy='38' r='5.5' fill='%23b82631'/><path d='M 28 62 Q 50 86 72 62' stroke='%23b82631' stroke-width='5' fill='none' stroke-linecap='round'/></svg>";

const SESSION_STORAGE_KEY = "cbi_active_agent";

// The Mentalist CBI Cast with series photos
export const MENTALIST_AVATARS = [
  {
    id: "jane",
    name: "Patrick Jane",
    role: "Senior Consultant",
    specialty: "Psychological Forensics",
    badge: "CBI-SPEC-001",
    quote: "A cup of tea and a keen eye solve what brute force cannot.",
    avatarUrl: janeImg
  },
  {
    id: "lisbon",
    name: "Teresa Lisbon",
    role: "Senior Special Agent",
    specialty: "Unit Team Leader",
    badge: "CBI-LEAD-204",
    quote: "Jane, don't do anything illegal. At least wait until I turn around.",
    avatarUrl: lisbonImg
  },
  {
    id: "cho",
    name: "Kimball Cho",
    role: "Special Agent",
    specialty: "Interrogation Specialist",
    badge: "CBI-TACT-319",
    quote: "There is no business like show business.",
    avatarUrl: choImg
  },
  {
    id: "rigsby",
    name: "Wayne Rigsby",
    role: "Special Agent",
    specialty: "Arson & Ballistics",
    badge: "CBI-FIELD-408",
    quote: "Does anyone want the last donut?",
    avatarUrl: rigsbyImg
  },
  {
    id: "vanpelt",
    name: "Grace Van Pelt",
    role: "Special Agent",
    specialty: "Digital Forensics",
    badge: "CBI-TECH-512",
    quote: "Everything leaves a digital trace. You just have to know where to search.",
    avatarUrl: vanPeltImg
  },
  {
    id: "redjohn",
    name: "Red John",
    role: "Mystery Consultant",
    specialty: "Coded Advisory Observer",
    badge: "CBI-SHADOW-999",
    quote: "Tyger, tyger, burning bright in the forests of the night...",
    avatarUrl: redJohnImg
  }
];

// Get current active session
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!userStr) return null;
    const user = JSON.parse(userStr);

    const freshAvatar = MENTALIST_AVATARS.find(
      (a) => a.id === (user.avatar?.id || user.avatarId || user.avatar_id)
    );
    if (freshAvatar) {
      user.avatar = freshAvatar;
    }
    return user;
  } catch (err) {
    return null;
  }
}

// Register Agent via SQL Query
export function registerAgent({ name, email, badge, password, avatarId }) {
  try {
    const selectedAvatar =
      MENTALIST_AVATARS.find((a) => a.id === avatarId) || MENTALIST_AVATARS[0];

    const agentId = `agent-${Date.now()}`;
    const cleanBadge = badge.trim() || selectedAvatar.badge;

    // Execute SQL INSERT
    sqlDb.query(
      "INSERT INTO agents (id, name, email, badge, password, role, avatar_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        agentId,
        name.trim(),
        email.trim().toLowerCase(),
        cleanBadge,
        password,
        selectedAvatar.role,
        avatarId,
        new Date().toISOString()
      ]
    );

    const newAgent = {
      id: agentId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      badge: cleanBadge,
      role: selectedAvatar.role,
      avatar: selectedAvatar,
      registeredAt: new Date().toISOString()
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newAgent));
    return { success: true, user: newAgent };
  } catch (err) {
    return {
      success: false,
      message: err.message.includes("UNIQUE")
        ? "SQL Error: An operative with this official CBI email already exists in the database."
        : err.message
    };
  }
}

// Login Agent via SQL Query
export function loginAgent(credential, password) {
  const cleaned = credential.trim().toLowerCase();

  // Execute SQL SELECT
  const results = sqlDb.query(
    "SELECT * FROM agents WHERE (email = ? OR badge = ?) AND password = ?",
    [cleaned, cleaned, password]
  );

  if (results.length === 0) {
    return {
      success: false,
      message: "SQL Auth Failed: Invalid credentials or security key in CBI database."
    };
  }

  const rawUser = results[0];
  const freshAvatar =
    MENTALIST_AVATARS.find((a) => a.id === rawUser.avatar_id) || MENTALIST_AVATARS[0];

  const user = {
    ...rawUser,
    avatar: freshAvatar
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  return { success: true, user };
}

// Logout Agent
export function logoutAgent() {
  sqlDb.query("DELETE FROM sessions");
  localStorage.removeItem(SESSION_STORAGE_KEY);
}