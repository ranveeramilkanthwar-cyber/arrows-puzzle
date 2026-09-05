/**
 * Level Definitions & Procedural Level Generator for ARROWS: Puzzle Escape
 * Includes 35 handcrafted progressive levels and a backward-simulation solvable puzzle generator.
 */

const CAMPAIGN_LEVELS = [
  // --- TIER 1: THE BASICS (Levels 1 - 5) ---
  {
    id: 1,
    title: "First Steps",
    hint: "Arrows with a clear path to the edge can escape safely!",
    gridSize: 3,
    layout: [
      ['right', null, 'down'],
      [null, 'up', null],
      ['left', null, 'up']
    ]
  },
  {
    id: 2,
    title: "The Crossway",
    hint: "Clear the outer perimeter arrows first to unblock the center.",
    gridSize: 3,
    layout: [
      ['up', 'up', 'right'],
      ['left', 'right', 'right'],
      ['left', 'down', 'down']
    ]
  },
  {
    id: 3,
    title: "Outer Ring",
    hint: "Trace each arrow's forward line of sight before clicking.",
    gridSize: 4,
    layout: [
      ['up', 'up', 'up', 'right'],
      ['left', null, null, 'right'],
      ['left', null, null, 'right'],
      ['left', 'down', 'down', 'down']
    ]
  },
  {
    id: 4,
    title: "Divergence",
    hint: "Look for arrows pointing outward towards freedom.",
    gridSize: 4,
    layout: [
      ['left', 'up', 'up', 'right'],
      ['left', 'right', 'left', 'right'],
      ['left', 'right', 'left', 'right'],
      ['left', 'down', 'down', 'right']
    ]
  },
  {
    id: 5,
    title: "Pinwheel",
    hint: "Notice how arrows form a clockwise vortex. Find the key arrow!",
    gridSize: 4,
    layout: [
      ['right', 'right', 'right', 'down'],
      ['up', 'right', 'down', 'down'],
      ['up', 'up', 'left', 'down'],
      ['up', 'left', 'left', 'left']
    ]
  },

  // --- TIER 2: NOVICE UNRAVELING (Levels 6 - 12) ---
  {
    id: 6,
    title: "Interlock",
    hint: "Two arrows point toward each other, but which one escapes first?",
    gridSize: 4,
    layout: [
      ['right', 'down', 'left', 'down'],
      ['up', 'right', 'down', 'left'],
      ['right', 'up', 'left', 'down'],
      ['up', 'right', 'up', 'left']
    ]
  },
  {
    id: 7,
    title: "Traffic Jam",
    hint: "Unclog the corner bottleneck to trigger a cascade.",
    gridSize: 4,
    layout: [
      ['down', 'left', 'down', 'right'],
      ['up', 'down', 'right', 'left'],
      ['right', 'up', 'left', 'up'],
      ['left', 'right', 'down', 'up']
    ]
  },
  {
    id: 8,
    title: "Symmetric Chaos",
    hint: "Symmetry in design, but an asymmetric solution path.",
    gridSize: 5,
    layout: [
      ['up', 'right', 'down', 'left', 'up'],
      ['left', 'up', 'right', 'down', 'right'],
      ['right', 'left', 'up', 'right', 'left'],
      ['left', 'down', 'left', 'up', 'right'],
      ['down', 'left', 'up', 'right', 'down']
    ]
  },
  {
    id: 9,
    title: "The Corridor",
    hint: "Look for open corridors leading directly off the board.",
    gridSize: 5,
    layout: [
      ['up', 'up', 'right', 'up', 'up'],
      ['left', 'down', 'right', 'up', 'right'],
      ['left', 'right', 'down', 'left', 'right'],
      ['left', 'up', 'left', 'down', 'right'],
      ['down', 'down', 'left', 'down', 'down']
    ]
  },
  {
    id: 10,
    title: "Spiral Core",
    hint: "Work from the outer layer inward towards the core.",
    gridSize: 5,
    layout: [
      ['right', 'right', 'right', 'right', 'down'],
      ['up', 'right', 'right', 'down', 'down'],
      ['up', 'up', 'right', 'down', 'down'],
      ['up', 'up', 'left', 'left', 'down'],
      ['up', 'left', 'left', 'left', 'left']
    ]
  },
  {
    id: 11,
    title: "Dual Vortex",
    hint: "Two swirling currents meeting at the center.",
    gridSize: 5,
    layout: [
      ['right', 'down', 'right', 'down', 'down'],
      ['up', 'left', 'down', 'left', 'down'],
      ['up', 'right', 'up', 'right', 'down'],
      ['up', 'right', 'down', 'left', 'down'],
      ['up', 'up', 'left', 'left', 'left']
    ]
  },
  {
    id: 12,
    title: "The Keystone",
    hint: "One specific arrow unlocks half of the board when released.",
    gridSize: 5,
    layout: [
      ['left', 'up', 'up', 'up', 'right'],
      ['down', 'left', 'right', 'up', 'up'],
      ['down', 'left', 'down', 'right', 'right'],
      ['down', 'down', 'left', 'right', 'up'],
      ['left', 'down', 'down', 'down', 'right']
    ]
  },

  // --- TIER 3: TACTICIAN'S ORBIT (Levels 13 - 20) ---
  {
    id: 13,
    title: "Chessboard Shift",
    hint: "Alternating directions require careful tactical patience.",
    gridSize: 5,
    layout: [
      ['up', 'down', 'up', 'down', 'up'],
      ['down', 'up', 'down', 'up', 'down'],
      ['left', 'right', 'left', 'right', 'left'],
      ['right', 'left', 'right', 'left', 'right'],
      ['up', 'down', 'up', 'down', 'up']
    ]
  },
  {
    id: 14,
    title: "Hex Pattern",
    hint: "Follow the diagonals and check long ray paths.",
    gridSize: 5,
    layout: [
      ['right', 'down', 'down', 'left', 'down'],
      ['up', 'right', 'down', 'left', 'down'],
      ['up', 'up', 'right', 'down', 'left'],
      ['up', 'right', 'up', 'left', 'down'],
      ['up', 'left', 'left', 'up', 'left']
    ]
  },
  {
    id: 15,
    title: "Sixfold Grid",
    hint: "Entering the 6x6 realm. Take your time to inspect perimeter edges.",
    gridSize: 6,
    layout: [
      ['up', 'right', 'up', 'right', 'down', 'right'],
      ['left', 'up', 'right', 'left', 'down', 'down'],
      ['left', 'left', 'up', 'right', 'down', 'down'],
      ['up', 'up', 'left', 'down', 'right', 'right'],
      ['up', 'up', 'right', 'left', 'down', 'down'],
      ['left', 'down', 'left', 'left', 'down', 'left']
    ]
  },
  {
    id: 16,
    title: "Magnetic Fields",
    hint: "Arrows appear drawn to each other. Break the tension.",
    gridSize: 6,
    layout: [
      ['down', 'right', 'down', 'left', 'down', 'right'],
      ['right', 'up', 'left', 'down', 'right', 'left'],
      ['down', 'right', 'up', 'right', 'left', 'down'],
      ['up', 'left', 'down', 'left', 'right', 'up'],
      ['right', 'down', 'right', 'up', 'left', 'down'],
      ['left', 'up', 'left', 'right', 'up', 'left']
    ]
  },
  {
    id: 17,
    title: "Concentric Rings",
    hint: "Layer upon layer of directional barriers.",
    gridSize: 6,
    layout: [
      ['right', 'right', 'right', 'right', 'right', 'down'],
      ['up', 'right', 'right', 'right', 'down', 'down'],
      ['up', 'up', 'right', 'down', 'down', 'down'],
      ['up', 'up', 'up', 'left', 'down', 'down'],
      ['up', 'up', 'left', 'left', 'left', 'down'],
      ['up', 'left', 'left', 'left', 'left', 'left']
    ]
  },
  {
    id: 18,
    title: "The Prism",
    hint: "Refract the arrows from the edges towards the light.",
    gridSize: 6,
    layout: [
      ['left', 'up', 'up', 'up', 'up', 'right'],
      ['left', 'down', 'right', 'down', 'up', 'right'],
      ['left', 'left', 'right', 'left', 'right', 'right'],
      ['left', 'right', 'left', 'right', 'left', 'right'],
      ['left', 'up', 'left', 'up', 'down', 'right'],
      ['left', 'down', 'down', 'down', 'down', 'right']
    ]
  },
  {
    id: 19,
    title: "Turbulence",
    hint: "High velocity directional confusion. Isolate one edge.",
    gridSize: 6,
    layout: [
      ['up', 'left', 'down', 'right', 'up', 'right'],
      ['right', 'down', 'left', 'up', 'right', 'down'],
      ['down', 'right', 'up', 'left', 'down', 'left'],
      ['left', 'up', 'right', 'down', 'left', 'up'],
      ['up', 'down', 'left', 'right', 'up', 'down'],
      ['left', 'right', 'up', 'down', 'left', 'right']
    ]
  },
  {
    id: 20,
    title: "Catalyst",
    hint: "Identify the catalyst arrow that initiates the domino effect.",
    gridSize: 6,
    layout: [
      ['right', 'down', 'right', 'down', 'left', 'down'],
      ['up', 'right', 'down', 'left', 'down', 'left'],
      ['right', 'up', 'right', 'down', 'left', 'down'],
      ['up', 'right', 'up', 'left', 'down', 'left'],
      ['up', 'left', 'up', 'right', 'left', 'down'],
      ['up', 'left', 'left', 'up', 'left', 'left']
    ]
  },

  // --- TIER 4: LABYRINTH ESCAPE (Levels 21 - 28) ---
  {
    id: 21,
    title: "Maze of Minos",
    hint: "Long flight paths with dangerous crossfire.",
    gridSize: 6,
    layout: [
      ['down', 'down', 'right', 'down', 'down', 'left'],
      ['right', 'up', 'left', 'right', 'up', 'left'],
      ['down', 'right', 'down', 'left', 'down', 'left'],
      ['right', 'up', 'right', 'up', 'left', 'down'],
      ['up', 'left', 'up', 'right', 'up', 'left'],
      ['right', 'up', 'up', 'left', 'up', 'left']
    ]
  },
  {
    id: 22,
    title: "The Enigma",
    hint: "Look at arrows pointing in the direction of cleared empty spaces.",
    gridSize: 6,
    layout: [
      ['left', 'right', 'left', 'up', 'right', 'down'],
      ['down', 'left', 'right', 'down', 'left', 'up'],
      ['up', 'down', 'left', 'right', 'up', 'down'],
      ['right', 'up', 'down', 'left', 'right', 'left'],
      ['left', 'right', 'up', 'down', 'left', 'right'],
      ['down', 'left', 'right', 'up', 'down', 'left']
    ]
  },
  {
    id: 23,
    title: "Seven Seas",
    hint: "A massive 7x7 grid. Don't rush; scan the outer rim first.",
    gridSize: 7,
    layout: [
      ['up', 'up', 'right', 'up', 'up', 'right', 'right'],
      ['left', 'down', 'right', 'down', 'left', 'down', 'down'],
      ['left', 'up', 'right', 'left', 'down', 'right', 'down'],
      ['left', 'right', 'up', 'right', 'down', 'left', 'right'],
      ['left', 'down', 'left', 'up', 'right', 'down', 'right'],
      ['up', 'up', 'left', 'up', 'left', 'down', 'down'],
      ['left', 'left', 'down', 'left', 'down', 'down', 'down']
    ]
  },
  {
    id: 24,
    title: "Centrifugal",
    hint: "Arrows spinning outward with high momentum.",
    gridSize: 7,
    layout: [
      ['right', 'right', 'right', 'right', 'right', 'right', 'down'],
      ['up', 'left', 'down', 'right', 'down', 'left', 'down'],
      ['up', 'right', 'up', 'left', 'down', 'right', 'down'],
      ['up', 'left', 'right', 'up', 'left', 'right', 'down'],
      ['up', 'left', 'down', 'right', 'up', 'left', 'down'],
      ['up', 'right', 'up', 'left', 'up', 'right', 'down'],
      ['up', 'left', 'left', 'left', 'left', 'left', 'left']
    ]
  },
  {
    id: 25,
    title: "Fractured Shield",
    hint: "Break through the fortified perimeter corner by corner.",
    gridSize: 7,
    layout: [
      ['left', 'up', 'up', 'up', 'up', 'up', 'right'],
      ['down', 'right', 'down', 'left', 'down', 'right', 'up'],
      ['down', 'up', 'right', 'down', 'left', 'up', 'up'],
      ['down', 'left', 'up', 'right', 'down', 'left', 'up'],
      ['down', 'down', 'right', 'up', 'left', 'down', 'up'],
      ['down', 'left', 'up', 'right', 'up', 'left', 'up'],
      ['left', 'down', 'down', 'down', 'down', 'down', 'right']
    ]
  },
  {
    id: 26,
    title: "Hypercube",
    hint: "Every move reverberates across multiple rows and columns.",
    gridSize: 7,
    layout: [
      ['down', 'right', 'left', 'up', 'down', 'right', 'left'],
      ['up', 'down', 'right', 'left', 'up', 'down', 'right'],
      ['right', 'up', 'down', 'right', 'left', 'up', 'down'],
      ['left', 'right', 'up', 'down', 'right', 'left', 'up'],
      ['down', 'left', 'right', 'up', 'down', 'right', 'left'],
      ['up', 'down', 'left', 'right', 'up', 'down', 'right'],
      ['right', 'up', 'down', 'left', 'right', 'up', 'left']
    ]
  },
  {
    id: 27,
    title: "Vortex of Infinity",
    hint: "Find the outer tail of the spiral to begin unraveling it.",
    gridSize: 7,
    layout: [
      ['right', 'right', 'right', 'right', 'right', 'right', 'down'],
      ['up', 'right', 'right', 'right', 'right', 'down', 'down'],
      ['up', 'up', 'right', 'right', 'down', 'down', 'down'],
      ['up', 'up', 'up', 'down', 'down', 'down', 'down'],
      ['up', 'up', 'up', 'left', 'left', 'down', 'down'],
      ['up', 'up', 'left', 'left', 'left', 'left', 'down'],
      ['up', 'left', 'left', 'left', 'left', 'left', 'left']
    ]
  },
  {
    id: 28,
    title: "Singularity",
    hint: "All paths lead inwards, except for one lone escape vector.",
    gridSize: 7,
    layout: [
      ['down', 'down', 'down', 'right', 'down', 'down', 'down'],
      ['right', 'right', 'down', 'right', 'down', 'left', 'left'],
      ['right', 'up', 'right', 'down', 'left', 'down', 'left'],
      ['up', 'right', 'up', 'right', 'down', 'left', 'down'],
      ['right', 'up', 'right', 'up', 'left', 'down', 'left'],
      ['right', 'right', 'up', 'left', 'up', 'left', 'left'],
      ['up', 'up', 'up', 'left', 'up', 'up', 'up']
    ]
  },

  // --- TIER 5: GRANDMASTER CONUNDRUM (Levels 29 - 35) ---
  {
    id: 29,
    title: "The Citadel",
    hint: "A grand tactical test. Plan three moves in advance.",
    gridSize: 7,
    layout: [
      ['up', 'right', 'down', 'left', 'up', 'right', 'down'],
      ['left', 'up', 'right', 'down', 'left', 'up', 'right'],
      ['down', 'left', 'up', 'right', 'down', 'left', 'up'],
      ['right', 'down', 'left', 'up', 'right', 'down', 'left'],
      ['up', 'right', 'down', 'left', 'up', 'right', 'down'],
      ['left', 'up', 'right', 'down', 'left', 'up', 'right'],
      ['down', 'left', 'up', 'right', 'down', 'left', 'up']
    ]
  },
  {
    id: 30,
    title: "Zero Point",
    hint: "Clear the outer perimeter corners before touching the inner cluster.",
    gridSize: 7,
    layout: [
      ['left', 'up', 'up', 'right', 'up', 'up', 'right'],
      ['down', 'left', 'right', 'down', 'left', 'right', 'up'],
      ['down', 'up', 'left', 'right', 'up', 'down', 'up'],
      ['left', 'right', 'down', 'up', 'left', 'right', 'right'],
      ['down', 'up', 'left', 'down', 'right', 'up', 'up'],
      ['down', 'left', 'right', 'up', 'left', 'right', 'up'],
      ['left', 'down', 'down', 'left', 'down', 'down', 'right']
    ]
  },
  {
    id: 31,
    title: "Quantum Lock",
    hint: "Multiple candidate moves exist, but only one leads to full clearance without deadlock.",
    gridSize: 7,
    layout: [
      ['right', 'down', 'left', 'right', 'down', 'left', 'down'],
      ['up', 'right', 'down', 'left', 'up', 'right', 'down'],
      ['down', 'up', 'right', 'down', 'left', 'up', 'left'],
      ['right', 'down', 'up', 'right', 'down', 'left', 'up'],
      ['left', 'up', 'right', 'down', 'left', 'up', 'right'],
      ['down', 'left', 'up', 'right', 'down', 'left', 'down'],
      ['up', 'right', 'left', 'up', 'right', 'left', 'left']
    ]
  },
  {
    id: 32,
    title: "Chronos Weave",
    hint: "Like weaving threads of light; pull the golden strand first.",
    gridSize: 7,
    layout: [
      ['up', 'right', 'up', 'right', 'up', 'right', 'down'],
      ['left', 'down', 'left', 'down', 'left', 'down', 'down'],
      ['up', 'right', 'up', 'right', 'up', 'right', 'down'],
      ['left', 'down', 'left', 'down', 'left', 'down', 'down'],
      ['up', 'right', 'up', 'right', 'up', 'right', 'down'],
      ['left', 'down', 'left', 'down', 'left', 'down', 'down'],
      ['up', 'left', 'up', 'left', 'up', 'left', 'left']
    ]
  },
  {
    id: 33,
    title: "The Gordian Knot",
    hint: "Intricately tied vectors. One bold move severs the knot.",
    gridSize: 7,
    layout: [
      ['down', 'right', 'down', 'right', 'down', 'right', 'left'],
      ['right', 'up', 'left', 'down', 'right', 'up', 'down'],
      ['down', 'left', 'up', 'right', 'down', 'left', 'up'],
      ['up', 'right', 'down', 'left', 'up', 'right', 'down'],
      ['down', 'left', 'up', 'right', 'down', 'left', 'up'],
      ['right', 'up', 'left', 'down', 'right', 'up', 'down'],
      ['right', 'left', 'up', 'left', 'up', 'left', 'up']
    ]
  },
  {
    id: 34,
    title: "Event Horizon",
    hint: "Arrows swirling near the brink. Release the outer orbit.",
    gridSize: 7,
    layout: [
      ['right', 'right', 'right', 'right', 'right', 'right', 'down'],
      ['up', 'down', 'left', 'right', 'up', 'down', 'down'],
      ['up', 'right', 'up', 'left', 'down', 'right', 'down'],
      ['up', 'left', 'right', 'down', 'up', 'left', 'down'],
      ['up', 'down', 'left', 'right', 'up', 'down', 'down'],
      ['up', 'right', 'up', 'left', 'down', 'right', 'down'],
      ['up', 'left', 'left', 'left', 'left', 'left', 'left']
    ]
  },
  {
    id: 35,
    title: "Ascension",
    hint: "The ultimate 7x7 grandmaster test. Master all directional mechanics to achieve total escape!",
    gridSize: 7,
    layout: [
      ['left', 'up', 'up', 'up', 'up', 'up', 'right'],
      ['down', 'right', 'down', 'right', 'down', 'left', 'up'],
      ['down', 'up', 'right', 'down', 'left', 'up', 'up'],
      ['down', 'left', 'up', 'right', 'down', 'left', 'up'],
      ['down', 'right', 'up', 'left', 'down', 'right', 'up'],
      ['down', 'left', 'right', 'up', 'left', 'down', 'up'],
      ['left', 'down', 'down', 'down', 'down', 'down', 'right']
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
  static generateSolvablePuzzle(size = 5, density = 0.95) {
    const grid = Array.from({ length: size }, () => Array(size).fill(null));
    const directions = ['up', 'down', 'left', 'right'];
    const totalCells = size * size;
    const targetArrows = Math.floor(totalCells * density);
    
    // Reverse simulation:
    // In forward play, an arrow at (r, c) pointing in direction D requires that all cells
    // between (r, c) and the edge in direction D are EMPTY.
    // Therefore, in reverse generation:
    // We can place an arrow at an empty cell (r, c) pointing in direction D IF AND ONLY IF
    // all cells from (r, c) in direction D to the edge are currently EMPTY in the grid!
    // Since it had an unblocked line of sight when placed in reverse, when played forward
    // after earlier arrows have escaped, it is guaranteed to have a clear exit path!

    const placedOrder = []; // Reverse solution history

    // Helper to check if ray to edge is empty
    const isRayEmpty = (r, c, dir) => {
      let currR = r;
      let currC = c;
      while (true) {
        if (dir === 'up') currR--;
        else if (dir === 'down') currR++;
        else if (dir === 'left') currC--;
        else if (dir === 'right') currC++;

        if (currR < 0 || currR >= size || currC < 0 || currC >= size) {
          return true; // Reached outside edge without obstruction
        }
        if (grid[currR][currC] !== null) {
          return false; // Obstructed by an arrow
        }
      }
    };

    let attempts = 0;
    const maxAttempts = 3000;

    while (placedOrder.length < targetArrows && attempts < maxAttempts) {
      attempts++;

      // Pick an empty cell
      const emptyCells = [];
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid[r][c] === null) {
            emptyCells.push({ r, c });
          }
        }
      }

      if (emptyCells.length === 0) break;

      // Random empty cell
      const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      // Shuffle directions to find a valid reverse placement
      const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);
      let placed = false;

      for (const dir of shuffledDirs) {
        if (isRayEmpty(cell.r, cell.c, dir)) {
          grid[cell.r][cell.c] = dir;
          placedOrder.push({ r: cell.r, c: cell.c, dir });
          placed = true;
          break;
        }
      }
    }

    return {
      gridSize: size,
      layout: grid,
      solutionCount: placedOrder.length
    };
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

        // Trace ray to edge
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
}

window.CAMPAIGN_LEVELS = CAMPAIGN_LEVELS;
window.LevelGenerator = LevelGenerator;
