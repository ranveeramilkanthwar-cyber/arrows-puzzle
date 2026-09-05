# 🎯 ARROWS: Puzzle Escape

A sleek, tactile "Tap-Away" logic puzzle game built with modern web standards, physical raycasting collision mechanics, Web Audio synthesizers, and canvas particle engines.

---

## 🎮 Gameplay & Features

- **Directional Raycasting Physics**: Each arrow scans its line of sight. Unblocked arrows fly off the board with particle trails and ascending harmonic chimes; blocked arrows bump and recoil with mallet bonk sound effects and spark bursts.
- **Dynamic Combo Multipliers**: Build consecutive escape streaks (x1, x2, x3...) to multiply your scores and scale chime pitches.
- **35 Progressive Campaign Levels**: From 3x3 introductory puzzles to 7x7 interlocking mazes, featuring a 3-star rating system based on mistake-free solving.
- **Infinite Solvable Generator**: Reverse-simulation puzzle generation that guarantees 100% solvable boards across any size (4x4 to 7x7).
- **60-Second Blitz Mode**: High-intensity rush mode where every cleared board awards +5 bonus seconds and multiplier points.
- **Interactive Level Editor**: Create custom boards, test them instantly with one click, and export/import puzzles via base64 codes.
- **4 Rich Visual Themes**:
  - 🌌 **Obsidian Noir**: Dark glassmorphism with electric violet accents.
  - 🍵 **Zen Garden**: Calming slate, jade green, and earthen minimalism.
  - 🌆 **Vaporwave Neon**: Retro 80s magenta, cyan, and vibrant gradients.
  - 📟 **Matrix Cyberpunk**: Terminal dark theme with emerald luminescence.
- **Zero-Dependency Sound Synthesizer**: Procedural Web Audio engine producing whooshes, pentatonic chimes, mallet bonks, victory fanfare, and optional ambient drone pad.
- **HTML5 Canvas Particle Engine**: Interactive motes, laser flight trails, collision sparks, and dual-cannon victory confetti.

---

## 🚀 How to Play

### Local Setup
No build tools or npm dependencies required:

1. Clone or download this repository.
2. Open `index.html` directly in any web browser, or serve it with Python:
   ```bash
   python -m http.server 8080
   ```
3. Visit `http://localhost:8080` and start escaping!

---

## ⌨️ Controls

| Key / Action | Function |
| :--- | :--- |
| **Left Click / Tap** | Tap arrow to launch raycast escape |
| `Z` | Undo last move |
| `H` | Smart hint (highlights a guaranteed escape route in gold) |
| `R` | Reset current puzzle |
| `M` | Toggle audio mute |
| `Esc` | Close any open modal |

---

## 📜 License
MIT License. Created with ❤️.
