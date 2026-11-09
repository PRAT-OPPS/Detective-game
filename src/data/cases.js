// src/data/cases.js

export const cases = [
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

  // CASE 2: Inspired by The Mentalist Season 1, Episode 3 ("Red Tide")
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
    culprit: 3 // Jason Richter was hiding what happened by the pier
  }
];