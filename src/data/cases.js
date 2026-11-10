// src/data/cases.js

export const cases = [
  // ==========================================
  // CASE 1: The Midnight Murder
  // ==========================================
  {
    id: 1,
    title: "The Midnight Murder",
    victim: "Richard Morgan",
    location: "Blackwood Mansion",
    description:
      "Richard Morgan was found dead in his study at midnight. Three people were present at the mansion that evening. Everyone has a story, but someone is hiding the truth.",
    status: "unsolved",
    difficulty: "Medium",
    suspects: [
      {
        id: 1,
        name: "James Morgan",
        role: "Victim's Brother",
        statement: "I was sleeping in my bedroom.",
        alibi: "Bedroom",
        traits: { defensiveness: 78, deception: 88, guilt: 65, consistency: 42 },
        personality: "Defensive, quick-tempered when pressed on family inheritance."
      },
      {
        id: 2,
        name: "Sarah Williams",
        role: "Personal Assistant",
        statement: "I left the mansion at 10 PM.",
        alibi: "Office",
        traits: { defensiveness: 35, deception: 20, guilt: 15, consistency: 85 },
        personality: "Methodical, cooperative, keeps strict records."
      },
      {
        id: 3,
        name: "David Wilson",
        role: "Business Partner",
        statement: "I was at a restaurant.",
        alibi: "Restaurant",
        traits: { defensiveness: 60, deception: 45, guilt: 30, consistency: 70 },
        personality: "Calculating, talks about business contracts, slightly haughty."
      }
    ],
    evidence: [
      {
        id: 1,
        name: "Broken Watch",
        icon: "⌚",
        description: "A broken watch stopped at 11:45 PM."
      },
      {
        id: 2,
        name: "Blood-stained Letter",
        icon: "📜",
        description: "A letter containing a hidden threat."
      },
      {
        id: 3,
        name: "Footprint",
        icon: "👣",
        description: "A muddy footprint near the study window."
      },
      {
        id: 4,
        name: "Silver Key",
        icon: "🗝️",
        description: "A mysterious key found near the bookshelf."
      }
    ],
    culprit: 1
  },

  // ==========================================
  // CASE 2: Red Tide (The Mentalist S01E03)
  // ==========================================
  {
    id: 2,
    title: "Red Tide",
    victim: "Christine Tanner",
    location: "Santa Marta Beach Cove",
    description:
      "High school student Christine Tanner was found drowned off the secluded Santa Marta surf cove at dawn. A tight-knit crew of local surfers claims she left their beach campfire hours before the tide came in. Patrick Jane senses a pact of silence.",
    status: "unsolved",
    difficulty: "Hard",
    suspects: [
      {
        id: 1,
        name: "Lance Wheeler",
        role: "Surf Crew Leader",
        statement: "We were surfing the sunset set. Christine packed up and walked home before 9 PM. We didn't touch her board.",
        alibi: "North Dunes Campfire",
        traits: { defensiveness: 85, deception: 75, guilt: 40, consistency: 55 },
        personality: "Territorial, aggressive, obsessed with his status and reputation as king of Santa Marta."
      },
      {
        id: 2,
        name: "Andy Bromgard",
        role: "Friend / Quiet Surfer",
        statement: "I... I was listening to music in my truck. I thought she was with Lance and Jason. I didn't see anything, I swear.",
        alibi: "Beach Parking Lot",
        traits: { defensiveness: 45, deception: 60, guilt: 90, consistency: 40 },
        personality: "Nervous, easily intimidated, avoids eye contact, harbors deep remorse."
      },
      {
        id: 3,
        name: "Jason Richter",
        role: "Wealthy Local Surfer",
        statement: "Christine was in great spirits. We shared a soda, laughed, and she headed back. You detectives love manufacturing drama.",
        alibi: "The Beach House Deck",
        traits: { defensiveness: 70, deception: 92, guilt: 25, consistency: 68 },
        personality: "Smug, charismatic, masks guilt with patronizing smiles and rehearsed alibis."
      }
    ],
    evidence: [
      {
        id: 1,
        name: "Waxed Red Surfboard",
        icon: "🏄",
        description: "Christine's custom surfboard with fresh wax transfer matching Lance's board."
      },
      {
        id: 2,
        name: "Stained Beach Towel",
        icon: "🏖️",
        description: "A damp beach towel soaked with diesel fuel from the pier launch boat."
      },
      {
        id: 3,
        name: "Silver Shell Locket",
        icon: "🐚",
        description: "Christine's locket found caught between the pier pylons, torn off violently."
      },
      {
        id: 4,
        name: "Saltwater Flashlight",
        icon: "🔦",
        description: "A heavy waterproof torch half-buried in the sand with the battery smashed."
      }
    ],
    culprit: 3 // Jason Richter
  },

  // ==========================================
  // CASE 3: The Case of the Hollow Maestro
  // ==========================================
  {
    id: 3,
    title: "The Case of the Hollow Maestro",
    victim: "Arthur Pendelton (Age 58)",
    location: "The Gallery of Echoes Penthouse",
    description:
      "Celebrated art dealer and psychological profiler Arthur Pendelton was found poisoned inside his deadbolted penthouse gallery, upright on a velvet chaise lounge with a chilling frozen smile. A spinning gramophone playing Chopin, an angled mirror, and a ticking brass metronome mask a calculated execution.",
    status: "unsolved",
    difficulty: "Expert",
    suspects: [
      {
        id: 1,
        name: "Julian Vance",
        role: "Narcissistic Business Partner (The Culprit)",
        statement: "Arthur was a mentor, though undeniably eccentric. We parted amicably before 10 PM. You detectives are confusing theatre with criminality.",
        alibi: "Dining across town (Claimed 10:30 PM)",
        traits: { defensiveness: 92, deception: 96, guilt: 15, consistency: 48 },
        personality: "Machiavellian, grandiose, hyper-rational. Polishes gold cufflink compulsively and maintains unblinking, unnerving eye contact."
      },
      {
        id: 2,
        name: "Evelyn Cross",
        role: "Obsessive Protégée & Copyist",
        statement: "I... I wasn't there when he died! I only wanted my stolen sketches back! Arthur took my work and signed his own name!",
        alibi: "Home studio (after 10 PM)",
        traits: { defensiveness: 65, deception: 55, guilt: 85, consistency: 40 },
        personality: "Neurotic, rapid shallow upper-chest breathing, compulsively clicks fountain pen cap against her knuckles."
      },
      {
        id: 3,
        name: "Dr. Mark Sterling",
        role: "Disgraced Attending Physician",
        statement: "As Arthur's personal physician, I was merely reviewing his medical charts. He dismissed me at the door before 10:20 PM.",
        alibi: "Private Clinic Office",
        traits: { defensiveness: 75, deception: 70, guilt: 60, consistency: 55 },
        personality: "Anxious, hides behind abstract medical jargon, persistently tugs stiff shirt collar and checks his wristwatch."
      },
      {
        id: 4,
        name: "Isaac Cole",
        role: "Gallery Curator & Ex-Safecracker",
        statement: "I catalogued ancient coins in the basement vault until midnight. Pendelton kept me under his thumb, but I didn't poison his drink.",
        alibi: "Basement Vault Archive",
        traits: { defensiveness: 80, deception: 50, guilt: 35, consistency: 78 },
        personality: "Stoic, rigid military posture, rhythmically clenches jaw muscles, eyes dart to ceiling joints and security latches."
      }
    ],
    evidence: [
      {
        id: 1,
        name: "Engraved Gold Cufflink",
        icon: "✨",
        description: "An 18k gold cufflink bearing microscopic balance-scale scratches, wedged deep in the chaise lounge woodwork."
      },
      {
        id: 2,
        name: "Cyanide Tonic Tumbler",
        icon: "🥃",
        description: "Crystal glass with bitter almond scent and unrefined industrial gold-leaching cyanide residue."
      },
      {
        id: 3,
        name: "Elevator Electronic Log",
        icon: "🛗",
        description: "Penthouse private elevator record showing a descent at precisely 10:52 PM, shattering Julian's alibi."
      },
      {
        id: 4,
        name: "Ticking Brass Metronome",
        icon: "⏱️",
        description: "Metronome ticking at 60 BPM with an oily fingerprint on the sliding weight, set up as psychological misdirection."
      }
    ],
    culprit: 1 // Julian Vance
  }
];