// src/utils/auth.js

// 1. Import your downloaded series photos from src/assets
import janeImg from "../assets/PATRIC JANE.jpg";
import lisbonImg from "../assets/lisbon.jpg";
import choImg from "../assets/AGENT CHO.jpg";
import rigsbyImg from "../assets/Wayne Rigsby.jpg";
import vanPeltImg from "../assets/Val Pelt icon mentalista.jpg";

// Styled Red John smiley SVG emblem for the 6th mystery avatar
const redJohnImg =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%2319080c' stroke='%23b82631' stroke-width='4'/><circle cx='34' cy='38' r='5.5' fill='%23b82631'/><circle cx='66' cy='38' r='5.5' fill='%23b82631'/><path d='M 28 62 Q 50 86 72 62' stroke='%23b82631' stroke-width='5' fill='none' stroke-linecap='round'/></svg>";

const USERS_STORAGE_KEY = "cbi_registered_agents";
const SESSION_STORAGE_KEY = "cbi_active_agent";

// 2. The Mentalist CBI Cast with series photos
export const MENTALIST_AVATARS = [
  {
    id: "jane",
    name: "Patrick Jane",
    role: "CBI Consultant",
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

// Helper to load stored users
function getStoredUsers() {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  if (!users) {
    const defaultUsers = [
      {
        id: "demo-jane",
        name: "Patrick Jane",
        email: "jane@cbi.gov",
        badge: "CBI-SPEC-001",
        password: "tea",
        role: "CBI Consultant",
        avatar: MENTALIST_AVATARS[0]
      },
      {
        id: "demo-lisbon",
        name: "Teresa Lisbon",
        email: "lisbon@cbi.gov",
        badge: "CBI-LEAD-204",
        password: "rules",
        role: "Senior Agent",
        avatar: MENTALIST_AVATARS[1]
      }
    ];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(users);
}

// Get the current active agent (syncs latest photo)
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!userStr) return null;
    const user = JSON.parse(userStr);

    // Ensure avatar image stays updated if photos change
    const freshAvatar = MENTALIST_AVATARS.find(
      (a) => a.id === (user.avatar?.id || user.avatarId)
    );
    if (freshAvatar) {
      user.avatar = freshAvatar;
    }
    return user;
  } catch (err) {
    console.error("Failed to load user:", err);
    return null;
  }
}

// Register a new agent
export function registerAgent({ name, email, badge, password, avatarId }) {
  const users = getStoredUsers();

  const emailExists = users.some(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (emailExists) {
    return {
      success: false,
      message: "An agent with this official email is already registered."
    };
  }

  const selectedAvatar =
    MENTALIST_AVATARS.find((a) => a.id === avatarId) || MENTALIST_AVATARS[0];

  const newAgent = {
    id: `agent-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    badge: badge.trim() || selectedAvatar.badge,
    password,
    role: selectedAvatar.role,
    avatar: selectedAvatar,
    registeredAt: new Date().toISOString()
  };

  users.push(newAgent);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newAgent));

  return { success: true, user: newAgent };
}

// Login agent
export function loginAgent(credential, password) {
  const users = getStoredUsers();
  const cleaned = credential.trim().toLowerCase();

  const user = users.find(
    (u) =>
      (u.email.toLowerCase() === cleaned || u.badge.toLowerCase() === cleaned) &&
      u.password === password
  );

  if (!user) {
    return {
      success: false,
      message: "Access Denied: Invalid CBI credentials or security clearance key."
    };
  }

  // Ensure latest photo is synced
  const freshAvatar = MENTALIST_AVATARS.find(
    (a) => a.id === (user.avatar?.id || user.avatarId)
  );
  if (freshAvatar) {
    user.avatar = freshAvatar;
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  return { success: true, user };
}

// Logout
export function logoutAgent() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}