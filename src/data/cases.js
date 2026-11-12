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
  // CASE 2: Red Tide
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
  },

  // ==========================================
  // CASE 4: The Silent Witness (With 3D Forensic Assets)
  // ==========================================
  {
    id: 4,
    title: "The Silent Witness",
    victim: "Dr. Adrian Blackwood (Age 58)",
    location: "Blackwood Manor — Mountain Study",
    description:
      "Renowned psychologist Dr. Adrian Blackwood was found dead inside his deadbolted mountain study at 11:47 PM with shattered crystal, a stopped clock, and a message scrawled on the vanity mirror in crimson: 'ONE OF YOU IS ALREADY DEAD.' Hidden within the locked-room execution lies Project Mirror—a classified psychological experiment from twenty years ago that was never supposed to exist.",
    status: "unsolved",
    difficulty: "Mastermind",
    suspects: [
      {
        id: 1,
        name: "Victoria Blackwood",
        role: "Estranged Wife & Accomplice Observer",
        statement: "Happiness is an emotional condition; marriage is a permanent legal arrangement. Adrian was rewriting his will to destroy me, but I never touched his drink.",
        alibi: "Master Suite (Reading until midnight)",
        traits: { defensiveness: 80, deception: 75, guilt: 50, consistency: 65 },
        personality: "Sophisticated, ice-cold, folds hands motionless, deflects emotional questions with transactional legalities."
      },
      {
        id: 2,
        name: "Daniel Blackwood",
        role: "Disinherited Son & Subject 02",
        statement: "I argued with my father yesterday and punched the study wall, not him! He ruined our childhoods... half the things I remember didn't even happen!",
        alibi: "Billiards Room (Drinking alone)",
        traits: { defensiveness: 90, deception: 65, guilt: 70, consistency: 38 },
        personality: "Volatile, clenches fists, taps knuckles rapidly against the table, hyperventilates when childhood memories are challenged."
      },
      {
        id: 3,
        name: "Dr. Sophia Miller",
        role: "Research Partner & Project Mirror Assistant (The Culprit)",
        statement: "I was merely Adrian's clinical assistant. I left his study before 11 PM after urging him not to publish classified subject files. Check the security lock.",
        alibi: "Guest Bedroom Library (Reviewing journals)",
        traits: { defensiveness: 94, deception: 98, guilt: 20, consistency: 52 },
        personality: "Hyper-composed, clinical terminology, rigid posture, studies the interrogator, masks premeditated murder behind psychiatric theory."
      },
      {
        id: 4,
        name: "Thomas Grey",
        role: "Manor Caretaker & Bereaved Father",
        statement: "My daughter Anna was taken into Project Mirror twenty years ago and never came home. The official verdict was an accident, but I know Adrian destroyed her.",
        alibi: "Grounds Maintenance Shed",
        traits: { defensiveness: 45, deception: 30, guilt: 85, consistency: 88 },
        personality: "Stoic, sorrowful, quiet rasping voice, grips his wooden pocket cross, speaks in riddles about the darkness."
      },
      {
        id: 5,
        name: "Rebecca Shaw",
        role: "Investigative Journalist & Daughter of Subject",
        statement: "Adrian convinced my mother she killed her own brother when it was all a fabricated lie! I brought a hidden recorder to force his confession, not murder him!",
        alibi: "Solarium (Reviewing audio logs)",
        traits: { defensiveness: 60, deception: 70, guilt: 30, consistency: 76 },
        personality: "Fearless, sharp smirk, investigative cadence, counter-questions the detective, conceals a micro-cassette recorder."
      }
    ],
    evidence: [
      {
        id: 1,
        name: "Antique Brass Pocket Watch",
        icon: "⌚",
        description: "Victorian brass pocket watch with balance wheel permanently seized at 11:47 PM from blunt force trauma.",
        glb: "/models/antique_luxury_pocket_watch_1147.glb"
      },
      {
        id: 2,
        name: "Victorian Evidence Mirror",
        icon: "🪞",
        description: "Bronze tabletop mirror with hairline stress fractures and a sinister crimson message: 'ONE OF YOU IS ALREADY DEAD.'",
        glb: "/models/antique_victorian_tabletop_mirror.glb"
      },
      {
        id: 3,
        name: "Partially Burnt Letter",
        icon: "📜",
        description: "Charred parchment retrieved from the hearth, bearing iron-gall cursive: 'Victoria... He knows... Project Mirror...'",
        glb: "/models/partially_burnt_letter.glb"
      },
      {
        id: 4,
        name: "2006 Institutional Photograph",
        icon: "📷",
        description: "Archival cold case photo of five children standing outside the Blackwood institution during Project Mirror.",
        glb: "/models/evidence_photograph_2006.glb"
      },
      {
        id: 5,
        name: "Handheld Audio Recorder",
        icon: "🎙️",
        description: "Digital recorder with twin mic capsules and track timer 00:47:12, recording the fatal final consultation.",
        glb: "/models/handheld_audio_recorder.glb"
      },
      {
        id: 6,
        name: "Victorian Crystal Wine Glass",
        icon: "🍷",
        description: "Cut-crystal goblet with burgundy sediment containing dissolved cyanide precipitate and a latent knop thumbprint.",
        glb: "/models/antique_crystal_wine_glass.glb"
      }
    ],
    culprit: 3 // Dr. Sophia Miller
  }
];