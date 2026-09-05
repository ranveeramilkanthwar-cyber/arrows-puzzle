/**
 * Level Definitions & Procedural Level Generator for ARROWS: Puzzle Escape
 * Includes 35 verified 100% solvable progressive campaign levels + endless procedural stage generator.
 */

const CAMPAIGN_LEVELS = [
  {
    "id": 1,
    "title": "First Steps",
    "hint": "Arrows with a clear path to the edge escape safely! Find the unblocked arrow.",
    "gridSize": 3,
    "layout": [
      [
        "right",
        null,
        "down"
      ],
      [
        null,
        "up",
        null
      ],
      [
        null,
        "left",
        "down"
      ]
    ]
  },
  {
    "id": 2,
    "title": "The Crossway",
    "hint": "Clear the outer perimeter arrows first to unblock the center.",
    "gridSize": 3,
    "layout": [
      [
        null,
        "left",
        "left"
      ],
      [
        "left",
        "down",
        "down"
      ],
      [
        "right",
        null,
        null
      ]
    ]
  },
  {
    "id": 3,
    "title": "Outer Ring",
    "hint": "Trace each arrow's forward line of sight before clicking.",
    "gridSize": 3,
    "layout": [
      [
        "left",
        null,
        "left"
      ],
      [
        "down",
        "left",
        "left"
      ],
      [
        null,
        "up",
        "down"
      ]
    ]
  },
  {
    "id": 4,
    "title": "Divergence",
    "hint": "Look for arrows pointing outward towards freedom.",
    "gridSize": 4,
    "layout": [
      [
        null,
        "left",
        null,
        null
      ],
      [
        "left",
        "right",
        null,
        null
      ],
      [
        "left",
        null,
        "down",
        null
      ],
      [
        "down",
        "down",
        "down",
        null
      ]
    ]
  },
  {
    "id": 5,
    "title": "Pinwheel",
    "hint": "Follow the directional flow. One key arrow unlocks the rest!",
    "gridSize": 4,
    "layout": [
      [
        "left",
        "up",
        null,
        "right"
      ],
      [
        null,
        "right",
        "up",
        null
      ],
      [
        null,
        null,
        "left",
        "right"
      ],
      [
        "up",
        null,
        "left",
        "right"
      ]
    ]
  },
  {
    "id": 6,
    "title": "Interlock",
    "hint": "Two arrows seem to cross paths, but one has a clear exit!",
    "gridSize": 4,
    "layout": [
      [
        "up",
        "left",
        "up",
        null
      ],
      [
        "left",
        null,
        "right",
        null
      ],
      [
        "left",
        "down",
        "down",
        null
      ],
      [
        "down",
        "down",
        null,
        "right"
      ]
    ]
  },
  {
    "id": 7,
    "title": "Traffic Jam",
    "hint": "Unclog the bottleneck arrow to trigger a cascading chain reaction.",
    "gridSize": 4,
    "layout": [
      [
        "left",
        "up",
        null,
        "down"
      ],
      [
        "down",
        null,
        "up",
        "right"
      ],
      [
        "left",
        "left",
        null,
        null
      ],
      [
        "left",
        "down",
        "left",
        "right"
      ]
    ]
  },
  {
    "id": 8,
    "title": "Symmetric Flow",
    "hint": "Look closely at the corners to find your initial escape vector.",
    "gridSize": 4,
    "layout": [
      [
        "left",
        "left",
        "up",
        "right"
      ],
      [
        null,
        "left",
        "right",
        "right"
      ],
      [
        "down",
        null,
        null,
        "down"
      ],
      [
        "left",
        "down",
        "left",
        "down"
      ]
    ]
  },
  {
    "id": 9,
    "title": "The Corridor",
    "hint": "Identify open corridors leading directly off the board.",
    "gridSize": 4,
    "layout": [
      [
        "down",
        "up",
        "up",
        "up"
      ],
      [
        "left",
        "right",
        null,
        "up"
      ],
      [
        "left",
        "down",
        "right",
        "up"
      ],
      [
        "down",
        "down",
        "down",
        null
      ]
    ]
  },
  {
    "id": 10,
    "title": "Spiral Core",
    "hint": "Work systematically from the outer edges inward towards the core.",
    "gridSize": 5,
    "layout": [
      [
        "up",
        "down",
        "down",
        "down",
        null
      ],
      [
        null,
        null,
        null,
        "left",
        null
      ],
      [
        null,
        "right",
        "down",
        "right",
        null
      ],
      [
        "up",
        null,
        null,
        "down",
        "down"
      ],
      [
        "left",
        "left",
        null,
        null,
        "right"
      ]
    ]
  },
  {
    "id": 11,
    "title": "Dual Vortex",
    "hint": "Release the outer swirling arrows to ease interior pressure.",
    "gridSize": 5,
    "layout": [
      [
        "up",
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        "down",
        null,
        "up"
      ],
      [
        "left",
        "up",
        "down",
        null,
        "right"
      ],
      [
        "down",
        "up",
        null,
        "up",
        "right"
      ],
      [
        null,
        "up",
        "down",
        "down",
        "right"
      ]
    ]
  },
  {
    "id": 12,
    "title": "The Keystone",
    "hint": "One critical arrow holds the cluster together. Set it free first!",
    "gridSize": 5,
    "layout": [
      [
        "up",
        "up",
        "down",
        "up",
        null
      ],
      [
        null,
        "right",
        "right",
        "right",
        "right"
      ],
      [
        null,
        null,
        "right",
        null,
        "down"
      ],
      [
        null,
        "left",
        "right",
        null,
        null
      ],
      [
        null,
        "down",
        "down",
        "right",
        "right"
      ]
    ]
  },
  {
    "id": 13,
    "title": "Chessboard Shift",
    "hint": "Alternating directional vectors require tactical foresight.",
    "gridSize": 5,
    "layout": [
      [
        "up",
        null,
        "left",
        null,
        "up"
      ],
      [
        "right",
        "up",
        null,
        "right",
        "up"
      ],
      [
        null,
        "left",
        null,
        "left",
        "left"
      ],
      [
        "left",
        null,
        "left",
        "right",
        "right"
      ],
      [
        null,
        "left",
        "right",
        "right",
        null
      ]
    ]
  },
  {
    "id": 14,
    "title": "Hex Grid",
    "hint": "Follow diagonal corridors and check long flight paths.",
    "gridSize": 5,
    "layout": [
      [
        "left",
        "down",
        "right",
        "up",
        "down"
      ],
      [
        "left",
        "left",
        null,
        "up",
        "down"
      ],
      [
        "left",
        "down",
        null,
        "up",
        null
      ],
      [
        "down",
        "right",
        null,
        null,
        null
      ],
      [
        "left",
        null,
        "right",
        "right",
        "right"
      ]
    ]
  },
  {
    "id": 15,
    "title": "Sixfold Domain",
    "hint": "Entering the 6x6 realm. Take your time to inspect perimeter edges.",
    "gridSize": 5,
    "layout": [
      [
        "down",
        null,
        "right",
        "up",
        null
      ],
      [
        "left",
        "up",
        "left",
        "up",
        null
      ],
      [
        "left",
        null,
        null,
        "up",
        "up"
      ],
      [
        "left",
        "left",
        null,
        "right",
        "right"
      ],
      [
        "left",
        "left",
        "right",
        "right",
        "right"
      ]
    ]
  },
  {
    "id": 16,
    "title": "Magnetic Field",
    "hint": "Arrows appear locked, but the outer rim is open.",
    "gridSize": 5,
    "layout": [
      [
        "up",
        "up",
        "right",
        "up",
        "right"
      ],
      [
        "up",
        "down",
        null,
        "left",
        "up"
      ],
      [
        null,
        "left",
        null,
        null,
        "right"
      ],
      [
        null,
        "left",
        "left",
        "down",
        "right"
      ],
      [
        "left",
        "down",
        "down",
        "down",
        "right"
      ]
    ]
  },
  {
    "id": 17,
    "title": "Concentric Orbit",
    "hint": "Layer upon layer of directional barriers peel away one by one.",
    "gridSize": 5,
    "layout": [
      [
        "left",
        "up",
        "left",
        "up",
        "right"
      ],
      [
        null,
        "right",
        "right",
        "down",
        null
      ],
      [
        null,
        "left",
        "left",
        "left",
        null
      ],
      [
        "left",
        "right",
        "right",
        "right",
        "right"
      ],
      [
        "down",
        "left",
        "left",
        "down",
        "down"
      ]
    ]
  },
  {
    "id": 18,
    "title": "The Prism",
    "hint": "Refract the arrows from the edges toward the open borders.",
    "gridSize": 6,
    "layout": [
      [
        null,
        null,
        "right",
        null,
        "up",
        null
      ],
      [
        "up",
        "up",
        null,
        "left",
        null,
        "right"
      ],
      [
        "left",
        null,
        "up",
        null,
        "left",
        "right"
      ],
      [
        "up",
        null,
        null,
        "up",
        "right",
        null
      ],
      [
        "down",
        "right",
        null,
        "right",
        null,
        null
      ],
      [
        "down",
        null,
        "down",
        "right",
        "down",
        "down"
      ]
    ]
  },
  {
    "id": 19,
    "title": "Turbulence",
    "hint": "High density vectors. Isolate one clean escape lane first.",
    "gridSize": 6,
    "layout": [
      [
        "left",
        "up",
        null,
        "up",
        "up",
        null
      ],
      [
        "up",
        "up",
        "down",
        null,
        "right",
        null
      ],
      [
        null,
        null,
        "left",
        null,
        null,
        "right"
      ],
      [
        "left",
        "up",
        null,
        null,
        "right",
        null
      ],
      [
        null,
        "left",
        "left",
        "left",
        null,
        "right"
      ],
      [
        "up",
        "right",
        "down",
        "down",
        "down",
        "down"
      ]
    ]
  },
  {
    "id": 20,
    "title": "Catalyst",
    "hint": "Find the catalyst arrow that initiates the grand domino escape.",
    "gridSize": 6,
    "layout": [
      [
        "left",
        "left",
        "up",
        "left",
        null,
        null
      ],
      [
        "down",
        null,
        "up",
        "right",
        null,
        "up"
      ],
      [
        null,
        "left",
        null,
        "down",
        null,
        null
      ],
      [
        null,
        "left",
        "left",
        "right",
        "up",
        null
      ],
      [
        "left",
        "left",
        "left",
        null,
        "left",
        null
      ],
      [
        "left",
        "down",
        "left",
        "down",
        "right",
        "down"
      ]
    ]
  },
  {
    "id": 21,
    "title": "Maze of Minos",
    "hint": "Carefully scan long flight corridors for potential collisions.",
    "gridSize": 6,
    "layout": [
      [
        "up",
        "up",
        "up",
        "down",
        "up",
        "up"
      ],
      [
        "left",
        null,
        null,
        null,
        "right",
        "up"
      ],
      [
        "left",
        null,
        "right",
        null,
        null,
        "right"
      ],
      [
        "left",
        null,
        "left",
        "left",
        "right",
        "right"
      ],
      [
        "up",
        null,
        "right",
        null,
        "down",
        "down"
      ],
      [
        "right",
        "up",
        "down",
        "right",
        "down",
        null
      ]
    ]
  },
  {
    "id": 22,
    "title": "The Enigma",
    "hint": "Look for arrows pointing in the direction of empty borders.",
    "gridSize": 6,
    "layout": [
      [
        null,
        "up",
        "up",
        "up",
        "up",
        "up"
      ],
      [
        "left",
        "left",
        "left",
        "up",
        null,
        "right"
      ],
      [
        "left",
        "right",
        null,
        null,
        "up",
        "right"
      ],
      [
        "right",
        "down",
        null,
        null,
        null,
        "right"
      ],
      [
        "right",
        null,
        null,
        "up",
        "down",
        "down"
      ],
      [
        "down",
        "down",
        "left",
        "right",
        "down",
        "right"
      ]
    ]
  },
  {
    "id": 23,
    "title": "Seven Seas",
    "hint": "A massive 7x7 expanse. Check all 4 outer boundaries first.",
    "gridSize": 6,
    "layout": [
      [
        "down",
        "up",
        "up",
        "up",
        "up",
        null
      ],
      [
        "left",
        "left",
        null,
        "right",
        "right",
        "right"
      ],
      [
        "left",
        null,
        "left",
        "right",
        "right",
        "down"
      ],
      [
        "left",
        null,
        "down",
        "right",
        "right",
        "right"
      ],
      [
        null,
        "down",
        null,
        "down",
        "right",
        null
      ],
      [
        "left",
        "down",
        null,
        "down",
        "right",
        "down"
      ]
    ]
  },
  {
    "id": 24,
    "title": "Centrifugal Force",
    "hint": "Arrows oriented towards the edges can escape with high momentum.",
    "gridSize": 6,
    "layout": [
      [
        "left",
        "up",
        "up",
        "right",
        "up",
        "up"
      ],
      [
        "up",
        "left",
        "up",
        "down",
        "up",
        "right"
      ],
      [
        "left",
        "left",
        "left",
        null,
        "right",
        "right"
      ],
      [
        "up",
        null,
        null,
        null,
        "down",
        "right"
      ],
      [
        "down",
        null,
        "right",
        "down",
        "down",
        null
      ],
      [
        "down",
        "right",
        "down",
        "down",
        "down",
        "down"
      ]
    ]
  },
  {
    "id": 25,
    "title": "Fractured Shield",
    "hint": "Break through the fortified perimeter corner by corner.",
    "gridSize": 7,
    "layout": [
      [
        "left",
        "down",
        null,
        "up",
        "left",
        null,
        "up"
      ],
      [
        "up",
        null,
        "up",
        null,
        "right",
        "right",
        "up"
      ],
      [
        "right",
        "down",
        null,
        "up",
        null,
        "right",
        "up"
      ],
      [
        "left",
        null,
        null,
        null,
        null,
        "right",
        null
      ],
      [
        "left",
        null,
        null,
        "down",
        null,
        null,
        "right"
      ],
      [
        null,
        null,
        "up",
        null,
        "down",
        null,
        "right"
      ],
      [
        "down",
        "down",
        "up",
        null,
        null,
        "down",
        "down"
      ]
    ]
  },
  {
    "id": 26,
    "title": "Hypercube",
    "hint": "Every move changes the board state. Think two steps ahead.",
    "gridSize": 7,
    "layout": [
      [
        "left",
        null,
        "left",
        "right",
        null,
        null,
        "right"
      ],
      [
        null,
        "left",
        "left",
        "left",
        "up",
        null,
        "right"
      ],
      [
        "left",
        "left",
        null,
        null,
        "right",
        "up",
        null
      ],
      [
        "left",
        "left",
        null,
        null,
        null,
        "right",
        "right"
      ],
      [
        "left",
        null,
        "left",
        null,
        null,
        "down",
        "left"
      ],
      [
        null,
        "left",
        null,
        "up",
        null,
        "down",
        "down"
      ],
      [
        null,
        "left",
        "down",
        null,
        "right",
        "down",
        "right"
      ]
    ]
  },
  {
    "id": 27,
    "title": "Vortex of Infinity",
    "hint": "Find the outer tail of the spiral to begin unraveling it.",
    "gridSize": 7,
    "layout": [
      [
        "up",
        null,
        "up",
        "right",
        "up",
        null,
        "up"
      ],
      [
        "left",
        "up",
        "up",
        "up",
        "right",
        "up",
        null
      ],
      [
        null,
        "left",
        "down",
        null,
        "right",
        null,
        "up"
      ],
      [
        null,
        "down",
        null,
        null,
        "up",
        "up",
        "up"
      ],
      [
        null,
        "left",
        null,
        "down",
        "down",
        null,
        "right"
      ],
      [
        "up",
        "down",
        null,
        null,
        null,
        "right",
        "right"
      ],
      [
        "left",
        "down",
        "left",
        "right",
        null,
        null,
        "down"
      ]
    ]
  },
  {
    "id": 28,
    "title": "Singularity",
    "hint": "Dense interior arrows depend on outer sentinels escaping first.",
    "gridSize": 7,
    "layout": [
      [
        "up",
        "up",
        "up",
        null,
        "up",
        "up",
        "up"
      ],
      [
        "left",
        null,
        "right",
        null,
        null,
        "up",
        "up"
      ],
      [
        null,
        "up",
        "down",
        "up",
        "up",
        null,
        "up"
      ],
      [
        "left",
        "down",
        "down",
        "right",
        null,
        null,
        "right"
      ],
      [
        "left",
        "left",
        null,
        "down",
        null,
        "left",
        "right"
      ],
      [
        null,
        "down",
        "down",
        "down",
        "left",
        null,
        "down"
      ],
      [
        "up",
        null,
        null,
        "down",
        "down",
        "right",
        null
      ]
    ]
  },
  {
    "id": 29,
    "title": "The Citadel",
    "hint": "A grand tactical trial. Plan your peel-off order in advance.",
    "gridSize": 7,
    "layout": [
      [
        "left",
        null,
        null,
        "up",
        "up",
        "right",
        "up"
      ],
      [
        "left",
        "up",
        "left",
        "down",
        null,
        null,
        "left"
      ],
      [
        "left",
        "up",
        null,
        null,
        null,
        "right",
        "right"
      ],
      [
        "left",
        "left",
        null,
        null,
        "up",
        "down",
        "right"
      ],
      [
        "up",
        "left",
        "down",
        null,
        "down",
        null,
        "right"
      ],
      [
        null,
        "left",
        "left",
        null,
        "left",
        "right",
        "right"
      ],
      [
        "down",
        "down",
        "down",
        "left",
        "down",
        "down",
        "down"
      ]
    ]
  },
  {
    "id": 30,
    "title": "Zero Point",
    "hint": "Clear outer corner sentinels before touching inner arrow clusters.",
    "gridSize": 7,
    "layout": [
      [
        "left",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up"
      ],
      [
        "left",
        null,
        "up",
        null,
        "down",
        "up",
        "down"
      ],
      [
        "left",
        "up",
        "up",
        null,
        null,
        "right",
        "right"
      ],
      [
        "down",
        null,
        "up",
        "up",
        null,
        null,
        "right"
      ],
      [
        "left",
        "left",
        null,
        "right",
        null,
        "right",
        "right"
      ],
      [
        "left",
        "down",
        "left",
        null,
        null,
        "down",
        "right"
      ],
      [
        "left",
        "down",
        "down",
        "down",
        "down",
        "down",
        "right"
      ]
    ]
  },
  {
    "id": 31,
    "title": "Quantum Lock",
    "hint": "Multiple candidate moves exist, but only one leads to a clear cascade.",
    "gridSize": 7,
    "layout": [
      [
        "up",
        "left",
        "right",
        "up",
        "up",
        "up",
        "right"
      ],
      [
        "left",
        "down",
        "down",
        "up",
        "right",
        "up",
        "right"
      ],
      [
        "up",
        null,
        "right",
        "right",
        "right",
        "right",
        "right"
      ],
      [
        "down",
        null,
        null,
        "left",
        "right",
        "up",
        "right"
      ],
      [
        "left",
        "left",
        null,
        null,
        "left",
        "down",
        "right"
      ],
      [
        "left",
        "down",
        null,
        null,
        null,
        null,
        "right"
      ],
      [
        "left",
        "down",
        "left",
        "left",
        "up",
        "down",
        "down"
      ]
    ]
  },
  {
    "id": 32,
    "title": "Chronos Weave",
    "hint": "Weave through the vectors by releasing the golden key arrows.",
    "gridSize": 7,
    "layout": [
      [
        null,
        "up",
        "up",
        "up",
        "up",
        "up",
        "left"
      ],
      [
        "left",
        null,
        "up",
        null,
        null,
        "up",
        "right"
      ],
      [
        "left",
        "left",
        null,
        "up",
        "left",
        "left",
        "right"
      ],
      [
        "left",
        "left",
        "down",
        "right",
        null,
        "right",
        "right"
      ],
      [
        "left",
        "down",
        "down",
        "right",
        "right",
        "right",
        "right"
      ],
      [
        "left",
        "down",
        null,
        "right",
        "up",
        "down",
        "down"
      ],
      [
        "left",
        "down",
        "down",
        "down",
        "right",
        "right",
        "right"
      ]
    ]
  },
  {
    "id": 33,
    "title": "The Gordian Knot",
    "hint": "Intricately woven arrows. One precise click unblocks the knot.",
    "gridSize": 7,
    "layout": [
      [
        "up",
        "up",
        "up",
        "up",
        "up",
        "left",
        "right"
      ],
      [
        "left",
        "up",
        "left",
        "down",
        "down",
        null,
        "up"
      ],
      [
        "left",
        "left",
        "left",
        "left",
        "left",
        "right",
        "right"
      ],
      [
        "left",
        "down",
        "left",
        null,
        null,
        null,
        "right"
      ],
      [
        "left",
        "left",
        "right",
        "down",
        "down",
        "down",
        "right"
      ],
      [
        "left",
        "left",
        "left",
        null,
        "left",
        null,
        "right"
      ],
      [
        "left",
        "left",
        "down",
        "down",
        "down",
        "down",
        "up"
      ]
    ]
  },
  {
    "id": 34,
    "title": "Event Horizon",
    "hint": "High-density 7x7 challenge. Patiently trace each arrow's horizon.",
    "gridSize": 7,
    "layout": [
      [
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "right"
      ],
      [
        null,
        "left",
        "left",
        "left",
        null,
        "left",
        "up"
      ],
      [
        "left",
        "left",
        "down",
        null,
        "up",
        null,
        "down"
      ],
      [
        "left",
        "left",
        "down",
        "left",
        "right",
        "right",
        "right"
      ],
      [
        "left",
        "left",
        null,
        "left",
        "right",
        "right",
        "right"
      ],
      [
        "left",
        "left",
        "left",
        "left",
        "down",
        "right",
        "down"
      ],
      [
        "down",
        "down",
        "down",
        "down",
        "right",
        "down",
        "right"
      ]
    ]
  },
  {
    "id": 35,
    "title": "Ascension",
    "hint": "The ultimate Grandmaster trial. Master all directional mechanics for total escape!",
    "gridSize": 7,
    "layout": [
      [
        "left",
        "up",
        "up",
        "up",
        "up",
        "right",
        "right"
      ],
      [
        "left",
        "left",
        "up",
        null,
        "up",
        "up",
        "up"
      ],
      [
        "left",
        "left",
        "left",
        "up",
        "left",
        null,
        "right"
      ],
      [
        "left",
        "left",
        "right",
        "up",
        "down",
        "up",
        "down"
      ],
      [
        "up",
        null,
        "down",
        "down",
        "down",
        "right",
        null
      ],
      [
        "left",
        "right",
        "down",
        "down",
        "down",
        "up",
        "down"
      ],
      [
        "left",
        "down",
        "down",
        "down",
        "down",
        "up",
        "down"
      ]
    ]
  }
];

/**
 * Procedural Solvable Puzzle Generator
 * Uses reverse-simulation to guarantee 100% solvable boards of any size.
 */
class LevelGenerator {
  /**
   * Generates a guaranteed-solvable grid of size R x C
   */
  static generateSolvablePuzzle(size = 5, density = 0.90) {
    const directions = ['up', 'down', 'left', 'right'];
    const totalCells = size * size;
    const targetArrows = Math.max(3, Math.floor(totalCells * density));

    // Try up to 20 generation passes to guarantee 100% forward solvability
    for (let pass = 0; pass < 20; pass++) {
      const grid = Array.from({ length: size }, () => Array(size).fill(null));
      const placedOrder = [];

      const isRayEmpty = (r, c, dir) => {
        let currR = r;
        let currC = c;
        while (true) {
          if (dir === 'up') currR--;
          else if (dir === 'down') currR++;
          else if (dir === 'left') currC--;
          else if (dir === 'right') currC++;

          if (currR < 0 || currR >= size || currC < 0 || currC >= size) {
            return true;
          }
          if (grid[currR][currC] !== null) {
            return false;
          }
        }
      };

      let attempts = 0;
      const maxAttempts = 2500;

      while (placedOrder.length < targetArrows && attempts < maxAttempts) {
        attempts++;
        const emptyCells = [];
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (grid[r][c] === null) emptyCells.push({ r, c });
          }
        }

        if (emptyCells.length === 0) break;

        const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);

        for (const dir of shuffledDirs) {
          if (isRayEmpty(cell.r, cell.c, dir)) {
            grid[cell.r][cell.c] = dir;
            placedOrder.push({ r: cell.r, c: cell.c, dir });
            break;
          }
        }
      }

      // Verify with forward solver
      const verification = LevelGenerator.verifySolvable(grid);
      if (verification.isSolvable && placedOrder.length >= Math.floor(targetArrows * 0.8)) {
        return {
          gridSize: size,
          layout: grid,
          solutionCount: placedOrder.length
        };
      }
    }

    // Fallback safe 4x4 if generation somehow had bad luck
    return LevelGenerator.createFallbackLevel(size);
  }

  /**
   * Deterministic Forward Solver
   * Simulates forward play to verify a level is 100% solvable and find the next safe hint.
   */
  static findSafeMoves(grid) {
    const size = grid.length;
    const safeMoves = [];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const dir = grid[r][c];
        if (!dir) continue;

        let currR = r;
        let currC = c;
        let blocked = false;

        while (true) {
          if (dir === 'up') currR--;
          else if (dir === 'down') currR++;
          else if (dir === 'left') currC--;
          else if (dir === 'right') currC++;

          if (currR < 0 || currR >= size || currC < 0 || currC >= size) {
            break; // Clear to edge!
          }

          if (grid[currR][currC] !== null) {
            blocked = true;
            break;
          }
        }

        if (!blocked) {
          safeMoves.push({ r, c, dir });
        }
      }
    }

    return safeMoves;
  }

  /**
   * Full forward simulation check
   */
  static verifySolvable(grid) {
    const size = grid.length;
    const testGrid = grid.map(row => [...row]);
    let totalArrows = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (testGrid[r][c]) totalArrows++;
      }
    }

    let cleared = 0;
    while (true) {
      const safeMoves = LevelGenerator.findSafeMoves(testGrid);
      if (safeMoves.length === 0) break;
      // Clear first safe move
      const move = safeMoves[0];
      testGrid[move.r][move.c] = null;
      cleared++;
    }

    return {
      isSolvable: cleared === totalArrows && totalArrows > 0,
      totalArrows,
      cleared
    };
  }

  /**
   * Dynamic Campaign Generator for Level 36+ (Infinite Progression)
   */
  static generateCampaignLevel(levelNum) {
    let size = 5;
    if (levelNum > 65) {
      size = 8;
    } else if (levelNum > 45) {
      size = 7;
    } else if (levelNum > 35) {
      size = 6;
    }

    const density = Math.min(0.92, 0.75 + ((levelNum % 10) * 0.015));
    const puzzle = LevelGenerator.generateSolvablePuzzle(size, density);

    const themeNames = [
      "Vector Nexus", "Quantum Weave", "Chrono Rift", "Celestial Helix",
      "Prism Vortex", "Aura Singularity", "Hyperion Core", "Starlight Matrix",
      "Void Sentinel", "Apex Zenith", "Eclipse Gate", "Solaris Array"
    ];
    const name = themeNames[(levelNum - 36) % themeNames.length];

    return {
      id: levelNum,
      title: `${name} #${levelNum}`,
      hint: `Stage ${levelNum}: Inspect outer perimeter borders for your initial escape route!`,
      gridSize: puzzle.gridSize,
      layout: puzzle.layout,
      isProcedural: true
    };
  }

  static createFallbackLevel(size) {
    const grid = Array.from({ length: size }, () => Array(size).fill(null));
    // Safe perimeter arrows
    for (let i = 0; i < size; i++) {
      grid[0][i] = 'up';
      grid[size - 1][i] = 'down';
      grid[i][0] = 'left';
      grid[i][size - 1] = 'right';
    }
    return { gridSize: size, layout: grid, solutionCount: size * 4 - 4 };
  }
}

window.CAMPAIGN_LEVELS = CAMPAIGN_LEVELS;
window.LevelGenerator = LevelGenerator;
window.EXTENDED_LEVELS = {};
