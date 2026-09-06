/**
 * Core Game Engine & State Controller for ARROWS: Puzzle Escape
 */

class ArrowsGame {
  constructor() {
    // Game State
    this.mode = 'campaign'; // 'campaign' | 'infinite' | 'blitz' | 'editor' | 'test'
    this.currentLevelIndex = 0;
    this.gridSize = 4;
    this.grid = [];
    this.initialGrid = [];
    this.tileElements = []; // 2D array of DOM elements
    this.moveHistory = [];
    
    // Stats & Counters
    this.totalArrows = 0;
    this.remainingArrows = 0;
    this.movesCount = 0;
    this.failedMoves = 0;
    this.comboStreak = 0;
    this.maxCombo = 0;
    this.score = 0;
    this.hintsRemaining = 3;
    
    // Blitz Mode specifics
    this.blitzTimeRemaining = 60;
    this.blitzScore = 0;
    this.blitzBoardsCleared = 0;
    
    // Timers
    this.timerSeconds = 0;
    this.timerInterval = null;
    this.isPaused = false;
    this.isLevelComplete = false;

    // Player Persistence
    this.progress = this.loadProgress();
    this.settings = this.loadSettings();

    // DOM Elements Cache
    this.cacheDom();
    this.initSettings();
    this.bindEvents();
    
    // Start initial level
    this.loadLevel(this.progress.lastLevelIndex || 0);
  }

  cacheDom() {
    this.boardFrame = document.getElementById('boardFrame');
    this.gameBoard = document.getElementById('gameBoard');
    this.hudLevel = document.getElementById('hudLevelNumber');
    this.hudRemaining = document.getElementById('hudRemainingArrows');
    this.hudTotal = document.getElementById('hudTotalArrows');
    this.hudTimer = document.getElementById('hudTimer');
    this.hudTimerLabel = document.getElementById('hudTimerLabel');
    this.hudCombo = document.getElementById('hudCombo');
    this.hudComboContainer = document.getElementById('hudComboContainer');
    this.modeSubtitle = document.getElementById('modeSubtitle');
    this.hintBadge = document.getElementById('hintBadge');

    // Modals
    this.victoryModal = document.getElementById('victoryModal');
    this.levelsModal = document.getElementById('levelsModal');
    this.settingsModal = document.getElementById('settingsModal');

    // Sound Icons
    this.iconSoundOn = document.getElementById('iconSoundOn');
    this.iconSoundOff = document.getElementById('iconSoundOff');

    // Controls
    this.btnUndo = document.getElementById('btnUndo');
    this.btnHint = document.getElementById('btnHint');
    this.btnReset = document.getElementById('btnReset');
    this.btnLevels = document.getElementById('btnLevels');
    this.btnSettings = document.getElementById('btnSettings');
    this.btnSound = document.getElementById('btnSound');

    // Editor elements
    this.editorBoard = document.getElementById('editorBoard');
    this.editorGridSize = document.getElementById('editorGridSize');
    this.editorGrid = [];
  }

  loadProgress() {
    try {
      const data = localStorage.getItem('arrows_game_progress');
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {
      unlockedLevel: 0,
      lastLevelIndex: 0,
      stars: {},
      blitzHighScore: 0
    };
  }

  saveProgress() {
    try {
      localStorage.setItem('arrows_game_progress', JSON.stringify(this.progress));
    } catch (e) {}
  }

  loadSettings() {
    try {
      const data = localStorage.getItem('arrows_game_settings');
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {
      theme: 'obsidian',
      volume: 80,
      ambientMusic: false,
      screenShake: true,
      particles: true
    };
  }

  saveSettings() {
    try {
      localStorage.setItem('arrows_game_settings', JSON.stringify(this.settings));
    } catch (e) {}
  }

  initSettings() {
    // Apply theme
    document.body.setAttribute('data-theme', this.settings.theme || 'obsidian');
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === this.settings.theme);
    });

    // Sound volume
    const volSlider = document.getElementById('sliderSfxVolume');
    if (volSlider) {
      volSlider.value = this.settings.volume;
      if (window.soundEngine) window.soundEngine.setVolume(this.settings.volume / 100);
    }

    // Ambient music checkbox
    const ambientCheck = document.getElementById('toggleAmbientMusic');
    if (ambientCheck) {
      ambientCheck.checked = this.settings.ambientMusic;
    }

    // Screen Shake
    const shakeCheck = document.getElementById('toggleScreenShake');
    if (shakeCheck) shakeCheck.checked = this.settings.screenShake;

    // Particles
    const partCheck = document.getElementById('toggleParticles');
    if (partCheck) {
      partCheck.checked = this.settings.particles;
      if (window.particleEngine) window.particleEngine.setEnabled(this.settings.particles);
    }
  }

  bindEvents() {
    // Action Buttons
    this.btnUndo.addEventListener('click', () => this.undoMove());
    this.btnHint.addEventListener('click', () => this.useHint());
    this.btnReset.addEventListener('click', () => this.resetLevel());

    // Navigation & Modals
    this.btnSound.addEventListener('click', () => this.toggleSound());
    this.btnLevels.addEventListener('click', () => this.openLevelsModal());
    this.btnSettings.addEventListener('click', () => this.openSettingsModal());

    document.getElementById('btnCloseLevels').addEventListener('click', () => this.closeModal(this.levelsModal));
    document.getElementById('btnCloseSettings').addEventListener('click', () => this.closeModal(this.settingsModal));

    // Victory actions
    document.getElementById('btnVictoryReplay').addEventListener('click', () => {
      this.closeModal(this.victoryModal);
      this.resetLevel();
    });
    document.getElementById('btnVictoryNext').addEventListener('click', () => {
      this.closeModal(this.victoryModal);
      this.nextLevel();
    });

    // Mode Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tabTarget = document.getElementById(`tab${btn.dataset.tab.charAt(0).toUpperCase() + btn.dataset.tab.slice(1)}`);
        if (tabTarget) tabTarget.classList.add('active');
        if (btn.dataset.tab === 'editor') this.initEditorBoard();
      });
    });

    // Infinite Generator Buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    document.getElementById('btnGenerateInfinite').addEventListener('click', () => {
      const activeSizeBtn = document.querySelector('.size-btn.active');
      const size = parseInt(activeSizeBtn ? activeSizeBtn.dataset.size : 5, 10);
      this.closeModal(this.levelsModal);
      this.startInfiniteMode(size);
    });

    // Blitz Mode Start
    document.getElementById('btnStartBlitz').addEventListener('click', () => {
      this.closeModal(this.levelsModal);
      this.startBlitzMode();
    });

    // Theme Switchers
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.theme-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const theme = btn.dataset.theme;
        this.settings.theme = theme;
        document.body.setAttribute('data-theme', theme);
        this.saveSettings();
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });

    // Settings inputs
    document.getElementById('sliderSfxVolume').addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      this.settings.volume = val;
      if (window.soundEngine) window.soundEngine.setVolume(val / 100);
      this.saveSettings();
    });

    document.getElementById('toggleAmbientMusic').addEventListener('change', (e) => {
      this.settings.ambientMusic = e.target.checked;
      if (window.soundEngine) window.soundEngine.toggleAmbientDrone(e.target.checked);
      this.saveSettings();
    });

    document.getElementById('toggleScreenShake').addEventListener('change', (e) => {
      this.settings.screenShake = e.target.checked;
      this.saveSettings();
    });

    document.getElementById('toggleParticles').addEventListener('change', (e) => {
      this.settings.particles = e.target.checked;
      if (window.particleEngine) window.particleEngine.setEnabled(e.target.checked);
      this.saveSettings();
    });

    // Level Editor Controls
    this.editorGridSize.addEventListener('change', () => this.initEditorBoard());
    document.getElementById('btnEditorClear').addEventListener('click', () => this.clearEditorBoard());
    document.getElementById('btnEditorRandom').addEventListener('click', () => this.randomizeEditorBoard());
    document.getElementById('btnEditorTest').addEventListener('click', () => this.testEditorLevel());
    document.getElementById('btnEditorExport').addEventListener('click', () => this.exportEditorLevel());
    document.getElementById('btnEditorImport').addEventListener('click', () => this.importEditorLevel());

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.key === 'z' || e.key === 'Z') this.undoMove();
      if (e.key === 'r' || e.key === 'R') this.resetLevel();
      if (e.key === 'h' || e.key === 'H') this.useHint();
      if (e.key === 'm' || e.key === 'M') this.toggleSound();
      if (e.key === 'Escape') {
        this.closeModal(this.victoryModal);
        this.closeModal(this.levelsModal);
        this.closeModal(this.settingsModal);
      }
    });
  }

  toggleSound() {
    if (!window.soundEngine) return;
    const muted = window.soundEngine.toggleMute();
    this.iconSoundOn.classList.toggle('hidden', muted);
    this.iconSoundOff.classList.toggle('hidden', !muted);
    this.showToast(muted ? "Sound Muted" : "Sound Enabled");
  }

  showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  // =========================================================================
  // LEVEL LOADING & BOARD RENDERING
  // =========================================================================

  loadLevel(index) {
    this.mode = 'campaign';
    this.currentLevelIndex = Math.max(0, index);
    this.progress.lastLevelIndex = this.currentLevelIndex;
    this.saveProgress();

    window.EXTENDED_LEVELS = window.EXTENDED_LEVELS || {};
    let levelData;
    if (this.currentLevelIndex < window.CAMPAIGN_LEVELS.length) {
      levelData = window.CAMPAIGN_LEVELS[this.currentLevelIndex];
    } else {
      if (!window.EXTENDED_LEVELS[this.currentLevelIndex]) {
        window.EXTENDED_LEVELS[this.currentLevelIndex] = window.LevelGenerator.generateCampaignLevel(this.currentLevelIndex + 1);
      }
      levelData = window.EXTENDED_LEVELS[this.currentLevelIndex];
    }

    const titleText = levelData && levelData.title ? levelData.title.toUpperCase() : `STAGE ${this.currentLevelIndex + 1}`;
    this.modeSubtitle.textContent = `CAMPAIGN — ${titleText}`;
    this.hudLevel.textContent = String(this.currentLevelIndex + 1).padStart(2, '0');

    this.setupBoard(levelData.gridSize, levelData.layout);
  }

  startInfiniteMode(size = 5) {
    this.mode = 'infinite';
    this.modeSubtitle.textContent = `INFINITE — ${size}×${size}`;
    this.hudLevel.textContent = '∞';

    const puzzle = window.LevelGenerator.generateSolvablePuzzle(size, 0.95);
    this.setupBoard(puzzle.gridSize, puzzle.layout);
    this.showToast(`New ${size}×${size} Puzzle Generated!`);
  }

  startBlitzMode() {
    this.mode = 'blitz';
    this.blitzTimeRemaining = 60;
    this.blitzScore = 0;
    this.blitzBoardsCleared = 0;
    this.hudTimerLabel.textContent = 'BLITZ';
    this.modeSubtitle.textContent = '60S TIME BLITZ';
    this.hudLevel.textContent = '⚡';

    this.nextBlitzBoard();
  }

  nextBlitzBoard() {
    // Generate fast 4x4 or 5x5 board
    const size = this.blitzBoardsCleared >= 3 ? 5 : 4;
    const puzzle = window.LevelGenerator.generateSolvablePuzzle(size, 0.9);
    this.setupBoard(puzzle.gridSize, puzzle.layout, false);
  }

  setupBoard(size, layout, resetBlitz = true) {
    this.gridSize = size;
    this.grid = layout.map(row => [...row]);
    this.initialGrid = layout.map(row => [...row]);
    this.tileElements = Array.from({ length: size }, () => Array(size).fill(null));
    this.moveHistory = [];

    this.movesCount = 0;
    this.failedMoves = 0;
    this.comboStreak = 0;
    this.maxCombo = 0;
    this.score = 0;
    this.hintsRemaining = 3;
    this.isLevelComplete = false;

    // Count arrows
    let count = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (this.grid[r][c]) count++;
      }
    }
    this.totalArrows = count;
    this.remainingArrows = count;

    // Update HUD
    this.hudRemaining.textContent = this.remainingArrows;
    this.hudTotal.textContent = this.totalArrows;
    this.hudCombo.textContent = 'x1';
    this.hintBadge.textContent = this.hintsRemaining;
    this.btnUndo.disabled = true;

    // CSS Grid Dimensions
    this.gameBoard.style.setProperty('--grid-cols', size);
    this.gameBoard.style.setProperty('--grid-rows', size);
    this.gameBoard.innerHTML = '';

    // Render DOM elements
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement('div');
        cell.className = 'arrow-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;

        const dir = this.grid[r][c];
        if (dir) {
          const tile = this.createTileElement(r, c, dir);
          cell.appendChild(tile);
          this.tileElements[r][c] = tile;
        }

        this.gameBoard.appendChild(cell);
      }
    }

    // Timer management
    this.startTimer(resetBlitz);
  }

  createTileElement(r, c, dir) {
    const tile = document.createElement('button');
    tile.className = `arrow-tile dir-${dir}`;
    tile.setAttribute('aria-label', `Arrow pointing ${dir}`);
    tile.dataset.row = r;
    tile.dataset.col = c;
    tile.dataset.dir = dir;

    // SVG Directional Arrow Glyph
    tile.innerHTML = `
      <svg class="arrow-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    `;

    // Click handler
    tile.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleArrowClick(r, c);
    });

    return tile;
  }

  startTimer(resetTimer = true) {
    if (this.timerInterval) clearInterval(this.timerInterval);

    if (this.mode === 'blitz') {
      if (resetTimer) this.blitzTimeRemaining = 60;
      this.updateTimerDisplay();

      this.timerInterval = setInterval(() => {
        if (this.isPaused || this.isLevelComplete) return;
        this.blitzTimeRemaining--;
        this.updateTimerDisplay();

        if (this.blitzTimeRemaining <= 0) {
          clearInterval(this.timerInterval);
          this.handleBlitzGameOver();
        }
      }, 1000);
    } else {
      if (resetTimer) this.timerSeconds = 0;
      this.updateTimerDisplay();

      this.timerInterval = setInterval(() => {
        if (this.isPaused || this.isLevelComplete) return;
        this.timerSeconds++;
        this.updateTimerDisplay();
      }, 1000);
    }
  }

  updateTimerDisplay() {
    if (this.mode === 'blitz') {
      const s = Math.max(0, this.blitzTimeRemaining);
      this.hudTimer.textContent = `00:${String(s).padStart(2, '0')}`;
      if (s <= 10) {
        this.hudTimer.style.color = '#ef4444';
      } else {
        this.hudTimer.style.color = '';
      }
    } else {
      const mins = Math.floor(this.timerSeconds / 60);
      const secs = this.timerSeconds % 60;
      this.hudTimer.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      this.hudTimer.style.color = '';
    }
  }

  // =========================================================================
  // ARROW INTERACTION & RAYCAST COLLISION LOGIC
  // =========================================================================

  handleArrowClick(r, c) {
    if (this.isLevelComplete) return;

    if (window.soundEngine && window.soundEngine.ctx && window.soundEngine.ctx.state === 'suspended') {
      window.soundEngine.ctx.resume().catch(() => {});
    }

    const dir = this.grid[r][c];
    if (!dir) return;

    const tile = this.tileElements[r][c];
    if (!tile || tile.classList.contains('escaping')) return;

    // Check Raycast in direction to board edge
    const checkResult = this.checkRaycast(r, c, dir);

    if (checkResult.canEscape) {
      // 1. UNBLOCKED ESCAPE!
      this.executeEscape(r, c, dir, tile);
    } else {
      // 2. BLOCKED COLLISION!
      this.executeCollision(r, c, dir, tile, checkResult.blockR, checkResult.blockC);
    }
  }

  /**
   * Raycasts along direction D from (r, c) to edge
   */
  checkRaycast(r, c, dir) {
    let currR = r;
    let currC = c;

    while (true) {
      if (dir === 'up') currR--;
      else if (dir === 'down') currR++;
      else if (dir === 'left') currC--;
      else if (dir === 'right') currC++;

      // Reached beyond grid edge
      if (currR < 0 || currR >= this.gridSize || currC < 0 || currC >= this.gridSize) {
        return { canEscape: true };
      }

      // Hit another arrow
      if (this.grid[currR][currC] !== null) {
        return {
          canEscape: false,
          blockR: currR,
          blockC: currC
        };
      }
    }
  }

  executeEscape(r, c, dir, tile) {
    this.movesCount++;
    this.comboStreak++;
    this.maxCombo = Math.max(this.maxCombo, this.comboStreak);
    this.score += 100 * this.comboStreak;

    // Combo UI punch
    this.hudCombo.textContent = `x${this.comboStreak}`;
    this.hudCombo.classList.remove('combo-pulse');
    void this.hudCombo.offsetWidth; // force reflow
    this.hudCombo.classList.add('combo-pulse');

    // Audio chime scaling up with combo streak
    if (window.soundEngine) {
      window.soundEngine.playChime(this.comboStreak);
    }

    // Particle flight trail
    if (window.particleEngine) {
      const rect = tile.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      window.particleEngine.createArrowTrail(centerX, centerY, dir);
    }

    // Save move to history for undo
    this.moveHistory.push({ r, c, dir, comboStreak: this.comboStreak });
    this.btnUndo.disabled = false;

    // Update Grid State
    this.grid[r][c] = null;
    this.remainingArrows--;
    this.hudRemaining.textContent = this.remainingArrows;

    // Flight Animation
    tile.classList.add('escaping', `escape-${dir}`);

    // Check level complete
    if (this.remainingArrows === 0) {
      this.handleLevelWin();
    }
  }

  executeCollision(r, c, dir, tile, blockR, blockC) {
    this.movesCount++;
    this.failedMoves++;
    this.comboStreak = 0;
    this.hudCombo.textContent = 'x1';

    // Audio bonk sound
    if (window.soundEngine) {
      window.soundEngine.playBonk();
    }

    // Bump recoil animation on clicked tile
    const bumpClass = `bump-${dir}`;
    tile.classList.remove(bumpClass);
    void tile.offsetWidth;
    tile.classList.add(bumpClass);

    // Screen Shake if enabled
    if (this.settings.screenShake) {
      this.boardFrame.classList.remove('shake-board');
      void this.boardFrame.offsetWidth;
      this.boardFrame.classList.add('shake-board');
    }

    // Collision spark particles at midpoint
    if (window.particleEngine) {
      const tileRect = tile.getBoundingClientRect();
      let sparkX = tileRect.left + tileRect.width / 2;
      let sparkY = tileRect.top + tileRect.height / 2;

      if (dir === 'up') sparkY = tileRect.top;
      if (dir === 'down') sparkY = tileRect.bottom;
      if (dir === 'left') sparkX = tileRect.left;
      if (dir === 'right') sparkX = tileRect.right;

      window.particleEngine.createBumpSparks(sparkX, sparkY, dir);
    }

    setTimeout(() => {
      tile.classList.remove(bumpClass);
    }, 350);
  }

  // =========================================================================
  // UNDO, HINT, RESET
  // =========================================================================

  undoMove() {
    if (this.moveHistory.length === 0 || this.isLevelComplete) return;

    const lastMove = this.moveHistory.pop();
    const { r, c, dir } = lastMove;

    // Restore state
    this.grid[r][c] = dir;
    this.remainingArrows++;
    this.hudRemaining.textContent = this.remainingArrows;

    // Restore combo
    const prevStreak = this.moveHistory.length > 0 ? this.moveHistory[this.moveHistory.length - 1].comboStreak : 0;
    this.comboStreak = prevStreak;
    this.hudCombo.textContent = `x${Math.max(1, this.comboStreak)}`;

    // Recreate / unhide tile DOM
    const cell = this.gameBoard.children[r * this.gridSize + c];
    cell.innerHTML = '';
    const newTile = this.createTileElement(r, c, dir);
    cell.appendChild(newTile);
    this.tileElements[r][c] = newTile;

    if (this.moveHistory.length === 0) {
      this.btnUndo.disabled = true;
    }

    if (window.soundEngine) window.soundEngine.playUndo();
    this.showToast("Move Undone");
  }

  useHint() {
    if (this.isLevelComplete) return;
    if (this.hintsRemaining <= 0) {
      this.showToast("No hints left for this stage!");
      return;
    }

    const safeMoves = window.LevelGenerator.findSafeMoves(this.grid);
    if (safeMoves.length === 0) {
      this.showToast("No safe moves! Try undoing or resetting.");
      return;
    }

    // Pick first safe move
    const hint = safeMoves[0];
    const tile = this.tileElements[hint.r][hint.c];
    if (tile) {
      tile.classList.add('hinted');
      this.hintsRemaining--;
      this.hintBadge.textContent = this.hintsRemaining;
      this.showToast(`Hint: Arrow at (${hint.r + 1}, ${hint.c + 1}) is clear to escape!`);

      if (window.soundEngine) window.soundEngine.playClick();

      setTimeout(() => {
        tile.classList.remove('hinted');
      }, 2400);
    }
  }

  resetLevel() {
    if (this.mode === 'campaign') {
      this.loadLevel(this.currentLevelIndex);
    } else if (this.mode === 'infinite') {
      this.setupBoard(this.gridSize, this.initialGrid);
    } else if (this.mode === 'blitz') {
      this.startBlitzMode();
    } else if (this.mode === 'test') {
      this.setupBoard(this.gridSize, this.initialGrid);
    }
    this.showToast("Level Reset");
    if (window.soundEngine) window.soundEngine.playClick();
  }

  nextLevel() {
    if (this.mode === 'campaign') {
      this.loadLevel(this.currentLevelIndex + 1);
    } else if (this.mode === 'infinite') {
      this.startInfiniteMode(this.gridSize);
    }
  }

  // =========================================================================
  // WIN CONDITION & MODALS
  // =========================================================================

  handleLevelWin() {
    this.isLevelComplete = true;
    clearInterval(this.timerInterval);

    // Audio & Confetti
    if (window.soundEngine) window.soundEngine.playVictory();
    if (window.particleEngine) window.particleEngine.createVictoryConfetti();

    if (this.mode === 'blitz') {
      // Blitz extension!
      this.blitzBoardsCleared++;
      this.blitzTimeRemaining += 5; // +5 seconds bonus
      this.blitzScore += 500 + this.maxCombo * 50;
      this.showToast(`Board Cleared! +5s Bonus!`);
      setTimeout(() => this.nextBlitzBoard(), 500);
      return;
    }

    // Calculate Star Rating for Campaign:
    // 3 Stars: 0 failed moves
    // 2 Stars: <= 2 failed moves
    // 1 Star: finished
    let starsEarned = 1;
    if (this.failedMoves === 0) starsEarned = 3;
    else if (this.failedMoves <= 2) starsEarned = 2;

    // Save progress
    if (this.mode === 'campaign') {
      this.progress.stars[this.currentLevelIndex] = Math.max(
        this.progress.stars[this.currentLevelIndex] || 0,
        starsEarned
      );
      if (this.currentLevelIndex + 1 > (this.progress.unlockedLevel || 0)) {
        this.progress.unlockedLevel = this.currentLevelIndex + 1;
      }
      this.saveProgress();
    }

    // Populate Victory Modal
    const starEls = document.querySelectorAll('#victoryStars .star-icon');
    starEls.forEach((el, idx) => {
      el.classList.toggle('star-active', idx < starsEarned);
    });

    const mins = Math.floor(this.timerSeconds / 60);
    const secs = this.timerSeconds % 60;
    document.getElementById('victoryTime').textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    document.getElementById('victoryMoves').textContent = this.movesCount;
    document.getElementById('victoryCombo').textContent = `x${this.maxCombo}`;
    document.getElementById('victoryScore').textContent = (this.score + starsEarned * 500).toLocaleString();

    setTimeout(() => {
      this.openModal(this.victoryModal);
    }, 450);
  }

  handleBlitzGameOver() {
    this.isLevelComplete = true;
    if (window.soundEngine) window.soundEngine.playBonk();

    if (this.blitzScore > (this.progress.blitzHighScore || 0)) {
      this.progress.blitzHighScore = this.blitzScore;
      this.saveProgress();
      this.showToast("New Blitz High Score!");
    }

    document.getElementById('blitzBestScore').textContent = this.progress.blitzHighScore.toLocaleString();
    this.openLevelsModal('blitz');
  }

  // =========================================================================
  // LEVEL SELECTOR & CAMPAIGN UI
  // =========================================================================

  openLevelsModal(defaultTab = 'campaign') {
    this.renderCampaignLevelsGrid();
    document.getElementById('blitzBestScore').textContent = (this.progress.blitzHighScore || 0).toLocaleString();
    
    // Switch to target tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === defaultTab);
    });
    document.querySelectorAll('.tab-content').forEach(c => {
      c.classList.toggle('active', c.id === `tab${defaultTab.charAt(0).toUpperCase() + defaultTab.slice(1)}`);
    });

    this.openModal(this.levelsModal);
  }

  renderCampaignLevelsGrid() {
    const gridContainer = document.getElementById('levelsGridContainer');
    gridContainer.innerHTML = '';

    const unlocked = this.progress.unlockedLevel || 0;
    let totalStars = 0;
    let completedCount = 0;
    const totalLevelsToShow = Math.max(window.CAMPAIGN_LEVELS.length, unlocked + 1);

    for (let idx = 0; idx < totalLevelsToShow; idx++) {
      const isLocked = idx > unlocked;
      const stars = this.progress.stars[idx] || 0;
      if (stars > 0) completedCount++;
      totalStars += stars;

      const card = document.createElement('div');
      card.className = `level-card ${isLocked ? 'locked' : ''} ${idx === this.currentLevelIndex ? 'active-level' : ''}`;
      
      let starsHtml = '';
      if (!isLocked) {
        starsHtml = `<div class="level-card-stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>`;
      } else {
        starsHtml = `<div class="level-card-stars">🔒</div>`;
      }

      card.innerHTML = `
        <span class="level-card-num">${idx + 1}</span>
        ${starsHtml}
      `;

      if (!isLocked) {
        card.addEventListener('click', () => {
          this.closeModal(this.levelsModal);
          this.loadLevel(idx);
        });
      }

      gridContainer.appendChild(card);
    }

    document.getElementById('totalStarsCount').textContent = totalStars;
    document.getElementById('completedLevelsCount').textContent = completedCount;
  }

  // =========================================================================
  // LEVEL EDITOR
  // =========================================================================

  initEditorBoard() {
    const size = parseInt(this.editorGridSize.value, 10);
    this.editorGrid = Array.from({ length: size }, () => Array(size).fill(null));
    this.renderEditorBoard();
  }

  renderEditorBoard() {
    const size = this.editorGrid.length;
    this.editorBoard.style.setProperty('--grid-cols', size);
    this.editorBoard.style.setProperty('--grid-rows', size);
    this.editorBoard.innerHTML = '';

    const dirCycle = [null, 'up', 'right', 'down', 'left'];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement('div');
        cell.className = 'arrow-cell';

        const dir = this.editorGrid[r][c];
        if (dir) {
          const tile = document.createElement('div');
          tile.className = `arrow-tile dir-${dir}`;
          tile.innerHTML = `
            <svg class="arrow-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          `;
          cell.appendChild(tile);
        }

        // Left click to cycle
        cell.addEventListener('click', () => {
          const currentDir = this.editorGrid[r][c];
          const nextIdx = (dirCycle.indexOf(currentDir) + 1) % dirCycle.length;
          this.editorGrid[r][c] = dirCycle[nextIdx];
          this.renderEditorBoard();
          if (window.soundEngine) window.soundEngine.playClick();
        });

        // Right click to clear
        cell.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.editorGrid[r][c] = null;
          this.renderEditorBoard();
        });

        this.editorBoard.appendChild(cell);
      }
    }
  }

  clearEditorBoard() {
    const size = this.editorGrid.length;
    this.editorGrid = Array.from({ length: size }, () => Array(size).fill(null));
    this.renderEditorBoard();
  }

  randomizeEditorBoard() {
    const size = this.editorGrid.length;
    const puzzle = window.LevelGenerator.generateSolvablePuzzle(size, 0.85);
    this.editorGrid = puzzle.layout;
    this.renderEditorBoard();
  }

  testEditorLevel() {
    const size = this.editorGrid.length;
    // Count arrows
    let count = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (this.editorGrid[r][c]) count++;
      }
    }
    if (count === 0) {
      this.showToast("Add some arrows before testing!");
      return;
    }

    this.closeModal(this.levelsModal);
    this.mode = 'test';
    this.modeSubtitle.textContent = `TEST CUSTOM LEVEL (${size}×${size})`;
    this.hudLevel.textContent = '🛠️';
    this.setupBoard(size, this.editorGrid);
  }

  exportEditorLevel() {
    const jsonStr = JSON.stringify(this.editorGrid);
    const code = btoa(jsonStr);
    navigator.clipboard.writeText(code).then(() => {
      this.showToast("Level code copied to clipboard!");
    }).catch(() => {
      prompt("Copy your level code:", code);
    });
  }

  importEditorLevel() {
    const code = prompt("Paste your level code:");
    if (!code) return;
    try {
      const jsonStr = atob(code);
      const grid = JSON.parse(jsonStr);
      if (Array.isArray(grid) && grid.length > 0 && Array.isArray(grid[0])) {
        this.editorGrid = grid;
        this.editorGridSize.value = grid.length;
        this.renderEditorBoard();
        this.showToast("Custom level loaded!");
      }
    } catch (e) {
      alert("Invalid level code.");
    }
  }

  // =========================================================================
  // MODAL UTILITIES
  // =========================================================================

  openModal(modalEl) {
    this.isPaused = true;
    modalEl.classList.remove('hidden');
  }

  closeModal(modalEl) {
    modalEl.classList.add('hidden');
    this.isPaused = false;
  }

  openSettingsModal() {
    this.openModal(this.settingsModal);
  }
}

// Instantiate and start game once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.game = new ArrowsGame();
  
  // Login Gate Logic
  const loginGate = document.getElementById('loginGate');
  const btnLogin = document.getElementById('btnLogin');
  const loginPasscode = document.getElementById('loginPasscode');
  const loginError = document.getElementById('loginError');

  btnLogin.addEventListener('click', () => {
    if (loginPasscode.value === 'admin') {
      loginGate.classList.add('hidden');
    } else {
      loginError.classList.remove('hidden');
    }
  });
});
