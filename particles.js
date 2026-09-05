/**
 * High-Performance HTML5 Canvas Particle Engine for ARROWS: Puzzle Escape
 * Handles ambient motes, arrow escape trails, collision sparks, and victory confetti.
 */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.ambientMotes = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.enabled = true;
    this.mouse = { x: this.width / 2, y: this.height / 2 };

    this.initCanvas();
    this.createAmbientMotes(35);
    this.bindEvents();
    this.loop();
  }

  initCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.initCanvas());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  setEnabled(val) {
    this.enabled = val;
    if (!val) {
      this.particles = [];
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  createAmbientMotes(count) {
    this.ambientMotes = [];
    for (let i = 0; i < count; i++) {
      this.ambientMotes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.2,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        baseAlpha: Math.random() * 0.4 + 0.1
      });
    }
  }

  /**
   * Spawns sparkling trail along an escaping arrow's trajectory
   */
  createArrowTrail(startX, startY, dir, color = '#00f2fe') {
    if (!this.enabled) return;

    let dirVx = 0, dirVy = 0;
    if (dir === 'up') dirVy = -1;
    if (dir === 'down') dirVy = 1;
    if (dir === 'left') dirVx = -1;
    if (dir === 'right') dirVx = 1;

    const count = 24;
    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 16;
      const speed = Math.random() * 8 + 4;
      const perpX = dirVy * spread;
      const perpY = dirVx * spread;

      this.particles.push({
        type: 'spark',
        x: startX + perpX,
        y: startY + perpY,
        vx: dirVx * speed + (Math.random() - 0.5) * 2,
        vy: dirVy * speed + (Math.random() - 0.5) * 2,
        size: Math.random() * 3.5 + 1.5,
        color: color,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02,
        gravity: 0.05
      });
    }
  }

  /**
   * Spawns collision sparks when an arrow bumps an obstacle
   */
  createBumpSparks(x, y, dir, color = '#f43f5e') {
    if (!this.enabled) return;

    let baseAngle = 0;
    if (dir === 'up') baseAngle = -Math.PI / 2;
    if (dir === 'down') baseAngle = Math.PI / 2;
    if (dir === 'left') baseAngle = Math.PI;
    if (dir === 'right') baseAngle = 0;

    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * 1.6;
      const speed = Math.random() * 6 + 2;

      this.particles.push({
        type: 'spark',
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        color: color,
        alpha: 1,
        decay: Math.random() * 0.05 + 0.03,
        gravity: 0.1
      });
    }
  }

  /**
   * Victory Confetti Celebration
   */
  createVictoryConfetti() {
    if (!this.enabled) return;

    const colors = ['#00f2fe', '#4facfe', '#f43f5e', '#fbbf24', '#10b981', '#a855f7'];
    const count = 90;

    // Launch from both bottom corners
    const origins = [
      { x: this.width * 0.15, y: this.height * 0.9, angleRange: [-Math.PI * 0.45, -Math.PI * 0.2] },
      { x: this.width * 0.85, y: this.height * 0.9, angleRange: [-Math.PI * 0.8, -Math.PI * 0.55] }
    ];

    origins.forEach(origin => {
      for (let i = 0; i < count / 2; i++) {
        const angle = origin.angleRange[0] + Math.random() * (origin.angleRange[1] - origin.angleRange[0]);
        const speed = Math.random() * 16 + 10;
        const color = colors[Math.floor(Math.random() * colors.length)];

        this.particles.push({
          type: 'confetti',
          x: origin.x,
          y: origin.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          w: Math.random() * 8 + 6,
          h: Math.random() * 5 + 4,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.25,
          color: color,
          alpha: 1,
          decay: Math.random() * 0.008 + 0.006,
          gravity: 0.28,
          drag: 0.985
        });
      }
    });
  }

  loop() {
    requestAnimationFrame(() => this.loop());
    if (!this.enabled) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render & Update Ambient Motes
    for (let i = 0; i < this.ambientMotes.length; i++) {
      const m = this.ambientMotes[i];
      m.x += m.vx;
      m.y += m.vy;

      // Wrap edges
      if (m.x < 0) m.x = this.width;
      if (m.x > this.width) m.x = 0;
      if (m.y < 0) m.y = this.height;
      if (m.y > this.height) m.y = 0;

      // Mouse subtle repulsion
      const dx = m.x - this.mouse.x;
      const dy = m.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        m.x += (dx / dist) * 1.2;
        m.y += (dy / dist) * 1.2;
      }

      this.ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Render & Update Particles (Sparks & Confetti)
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity || 0;
      if (p.drag) {
        p.vx *= p.drag;
        p.vy *= p.drag;
      }
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > this.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.type === 'spark') {
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 6;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'confetti') {
        p.rotation += p.rotSpeed;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }

      this.ctx.restore();
    }
  }
}

// Global Particle Instance
window.particleEngine = new ParticleEngine('particleCanvas');
