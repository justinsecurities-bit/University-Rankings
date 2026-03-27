const GAME_DURATION_MS = 30_000;
const ESCAPE_MARGIN = 40;

const INSECT_TYPES = {
  fly: { points: 25, radius: 16, speed: 120, color: "#a8dadc", bonusFactor: 1.3 },
  mosquito: { points: 40, radius: 13, speed: 180, color: "#f1fa8c", bonusFactor: 1.6 },
  ant: { points: 15, radius: 14, speed: 90, color: "#f4a261", bonusFactor: 1.15 },
};

const MOVEMENT_PATTERNS = ["straight", "zigzag", "jitter"];

class AudioManager {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.musicGain = null;
    this.musicTimer = null;
  }

  ensureContext() {
    if (this.context) return;
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 0.06;
    this.masterGain.connect(this.context.destination);
  }

  playTone(freq, duration, type = "sine", volume = 0.6) {
    this.ensureContext();
    const now = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  startMusic() {
    this.ensureContext();
    if (this.musicTimer) return;
    const notes = [220, 262, 294, 330, 294, 262];
    let idx = 0;
    this.musicTimer = window.setInterval(() => {
      this.playTone(notes[idx % notes.length], 0.2, "triangle", 0.12);
      idx += 1;
    }, 420);
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  hit() {
    this.playTone(440, 0.08, "square", 0.4);
  }

  miss() {
    this.playTone(170, 0.13, "sawtooth", 0.35);
  }

  gameOver() {
    this.playTone(280, 0.12, "sine", 0.35);
    this.playTone(230, 0.25, "sine", 0.3);
  }
}

class Insect {
  constructor(type, width, height, difficulty) {
    this.type = type;
    this.stats = INSECT_TYPES[type];
    this.radius = this.stats.radius;
    this.x = Math.random() * (width - this.radius * 2) + this.radius;
    this.y = Math.random() * (height - this.radius * 2) + this.radius;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = this.stats.speed * difficulty;
    this.pattern = MOVEMENT_PATTERNS[Math.floor(Math.random() * MOVEMENT_PATTERNS.length)];
    this.spawnTime = performance.now();
    this.wiggleOffset = Math.random() * Math.PI * 2;
  }

  update(dtSec) {
    const baseVx = Math.cos(this.angle) * this.speed;
    const baseVy = Math.sin(this.angle) * this.speed;
    let vx = baseVx;
    let vy = baseVy;

    if (this.pattern === "zigzag") {
      const wave = Math.sin(performance.now() * 0.01 + this.wiggleOffset) * 60;
      vx += Math.cos(this.angle + Math.PI / 2) * wave;
      vy += Math.sin(this.angle + Math.PI / 2) * wave;
    } else if (this.pattern === "jitter") {
      vx += (Math.random() - 0.5) * 160;
      vy += (Math.random() - 0.5) * 160;
    }

    this.x += vx * dtSec;
    this.y += vy * dtSec;
  }

  isEscaped(width, height) {
    return (
      this.x < -ESCAPE_MARGIN ||
      this.y < -ESCAPE_MARGIN ||
      this.x > width + ESCAPE_MARGIN ||
      this.y > height + ESCAPE_MARGIN
    );
  }

  containsPoint(px, py) {
    const dx = this.x - px;
    const dy = this.y - py;
    return Math.hypot(dx, dy) <= this.radius;
  }
}

class Game {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");

    this.scoreEl = document.getElementById("score");
    this.comboEl = document.getElementById("combo");
    this.highScoreEl = document.getElementById("high-score");
    this.timeLeftEl = document.getElementById("time-left");
    this.livesEl = document.getElementById("lives");
    this.finalScoreEl = document.getElementById("final-score");
    this.bestScoreEl = document.getElementById("best-score");

    this.startScreen = document.getElementById("start-screen");
    this.gameScreen = document.getElementById("game-screen");
    this.gameOverScreen = document.getElementById("game-over-screen");
    this.startBtn = document.getElementById("start-btn");
    this.playAgainBtn = document.getElementById("play-again-btn");

    this.audio = new AudioManager();

    this.insects = [];
    this.effects = [];
    this.particles = [];

    this.score = 0;
    this.combo = 1;
    this.misses = 0;
    this.lastHitTime = 0;
    this.startTime = 0;
    this.lastFrame = 0;
    this.spawnAccumulator = 0;
    this.running = false;

    this.highScore = Number(localStorage.getItem("insectSmashHighScore")) || 0;
    this.highScoreEl.textContent = String(this.highScore);
    this.bestScoreEl.textContent = String(this.highScore);

    this.bindEvents();
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  bindEvents() {
    this.startBtn.addEventListener("click", () => this.start());
    this.playAgainBtn.addEventListener("click", () => this.start());

    this.canvas.addEventListener("pointerdown", (event) => {
      if (!this.running) return;
      const rect = this.canvas.getBoundingClientRect();
      // Map pointer to game world coordinates (CSS pixels), not device pixels.
      const x = ((event.clientX - rect.left) / rect.width) * this.viewWidth();
      const y = ((event.clientY - rect.top) / rect.height) * this.viewHeight();
      this.handleHit(x, y);
    });
  }

  resizeCanvas() {
    const wrap = this.canvas.parentElement;
    const desiredWidth = wrap.clientWidth;
    const desiredHeight = wrap.clientHeight;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    this.canvas.width = Math.floor(desiredWidth * dpr);
    this.canvas.height = Math.floor(desiredHeight * dpr);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.render();
  }

  start() {
    this.startScreen.classList.add("hidden");
    this.gameOverScreen.classList.add("hidden");
    this.gameScreen.classList.remove("hidden");
    // Canvas can be 0x0 if measured while hidden; resize after reveal.
    this.resizeCanvas();

    this.score = 0;
    this.combo = 1;
    this.misses = 0;
    this.lastHitTime = 0;
    this.startTime = performance.now();
    this.lastFrame = this.startTime;
    this.spawnAccumulator = 0;
    this.insects = [];
    this.effects = [];
    this.particles = [];
    this.running = true;

    this.updateHud();
    this.audio.startMusic();
    requestAnimationFrame((t) => this.loop(t));
  }

  difficultyFactor(elapsedMs) {
    const progress = Math.min(1, elapsedMs / GAME_DURATION_MS);
    return 1 + progress * 0.85;
  }

  spawnRatePerSecond(elapsedMs) {
    const progress = Math.min(1, elapsedMs / GAME_DURATION_MS);
    return 1.2 + progress * 2.4;
  }

  spawnInsect(elapsedMs) {
    if (this.viewWidth() < 100 || this.viewHeight() < 100) return;
    const roll = Math.random();
    let type = "fly";
    if (roll < 0.25) type = "mosquito";
    else if (roll > 0.74) type = "ant";
    const insect = new Insect(type, this.viewWidth(), this.viewHeight(), this.difficultyFactor(elapsedMs));
    this.insects.push(insect);
  }

  loop(timestamp) {
    if (!this.running) return;
    const dt = Math.min(50, timestamp - this.lastFrame);
    this.lastFrame = timestamp;
    const elapsed = timestamp - this.startTime;
    const dtSec = dt / 1000;

    this.spawnAccumulator += dtSec * this.spawnRatePerSecond(elapsed);
    while (this.spawnAccumulator >= 1) {
      this.spawnAccumulator -= 1;
      this.spawnInsect(elapsed);
      if (Math.random() < Math.min(0.35, elapsed / GAME_DURATION_MS)) {
        this.spawnInsect(elapsed);
      }
    }

    this.updateInsects(dtSec);
    this.updateEffects(dtSec);
    this.updateParticles(dtSec);

    const timeLeft = Math.max(0, Math.ceil((GAME_DURATION_MS - elapsed) / 1000));
    this.timeLeftEl.textContent = String(timeLeft);

    if (timeLeft <= 0) {
      this.endGame();
      return;
    }

    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  updateInsects(dtSec) {
    const width = this.viewWidth();
    const height = this.viewHeight();
    const survivors = [];
    for (const insect of this.insects) {
      insect.update(dtSec);
      if (insect.isEscaped(width, height)) {
        this.registerMiss(false, insect.x, insect.y);
      } else {
        survivors.push(insect);
      }
    }
    this.insects = survivors;
  }

  handleHit(x, y) {
    let hitIndex = -1;
    for (let i = this.insects.length - 1; i >= 0; i -= 1) {
      if (this.insects[i].containsPoint(x, y)) {
        hitIndex = i;
        break;
      }
    }

    if (hitIndex >= 0) {
      const insect = this.insects.splice(hitIndex, 1)[0];
      this.registerKill(insect, x, y);
    } else {
      this.combo = 1;
      this.registerMiss(true, x, y);
      this.updateHud();
    }
  }

  registerKill(insect, x, y) {
    const now = performance.now();

    if (now - this.lastHitTime < 900) {
      this.combo = Math.min(6, this.combo + 0.25);
    } else {
      this.combo = 1;
    }
    this.lastHitTime = now;

    this.score += 1;
    this.audio.hit();

    this.effects.push({
      x,
      y,
      text: "+1",
      color: "#b7f59e",
      ttl: 0.8,
      vy: -35,
    });
    this.emitParticles(x, y, insect.stats.color);
    this.updateHud();
  }

  emitParticles(x, y, color) {
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.5;
      const speed = 40 + Math.random() * 80;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ttl: 0.45 + Math.random() * 0.35,
        color,
      });
    }
  }

  updateEffects(dtSec) {
    this.effects = this.effects
      .map((e) => ({ ...e, ttl: e.ttl - dtSec, y: e.y + e.vy * dtSec }))
      .filter((e) => e.ttl > 0);
  }

  updateParticles(dtSec) {
    this.particles = this.particles
      .map((p) => ({
        ...p,
        ttl: p.ttl - dtSec,
        x: p.x + p.vx * dtSec,
        y: p.y + p.vy * dtSec,
        vy: p.vy + 120 * dtSec,
      }))
      .filter((p) => p.ttl > 0);
  }

  registerMiss(playSound, x, y) {
    this.misses += 1;
    this.combo = 1;
    if (playSound) this.audio.miss();
    this.effects.push({
      x,
      y,
      text: "Miss!",
      color: "#ff6b6b",
      ttl: 0.55,
      vy: -24,
    });
    this.updateHud();
  }

  updateHud() {
    this.scoreEl.textContent = String(this.score);
    this.comboEl.textContent = `x${this.combo.toFixed(1)}`;
    this.livesEl.textContent = `Misses: ${this.misses}`;
  }

  viewWidth() {
    return this.canvas.width / (window.devicePixelRatio || 1);
  }

  viewHeight() {
    return this.canvas.height / (window.devicePixelRatio || 1);
  }

  endGame() {
    this.running = false;
    this.audio.stopMusic();
    this.audio.gameOver();

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("insectSmashHighScore", String(this.highScore));
    }
    this.highScoreEl.textContent = String(this.highScore);
    this.finalScoreEl.textContent = String(this.score);
    this.bestScoreEl.textContent = String(this.highScore);

    this.gameScreen.classList.add("hidden");
    this.gameOverScreen.classList.remove("hidden");
  }

  render() {
    const ctx = this.ctx;
    const width = this.viewWidth();
    const height = this.viewHeight();

    ctx.clearRect(0, 0, width, height);
    this.drawBackground(ctx, width, height);

    for (const insect of this.insects) {
      this.drawInsect(ctx, insect);
    }

    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.ttl * 1.8);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    for (const effect of this.effects) {
      ctx.globalAlpha = Math.min(1, effect.ttl * 1.4);
      ctx.fillStyle = effect.color;
      ctx.font = "700 20px Segoe UI, sans-serif";
      ctx.fillText(effect.text, effect.x + 8, effect.y - 8);
      ctx.globalAlpha = 1;
    }
  }

  drawBackground(ctx, width, height) {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#264653");
    grad.addColorStop(1, "#1d3557");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    for (let i = 0; i < 7; i += 1) {
      const y = (i + 1) * (height / 8);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + Math.sin(performance.now() * 0.001 + i) * 8);
      ctx.stroke();
    }
  }

  drawInsect(ctx, insect) {
    const { x, y, radius } = insect;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = insect.stats.color;
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.ellipse(-radius * 0.45, -radius * 0.25, radius * 0.35, radius * 0.2, -0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.moveTo(-radius * 0.8, 0);
    ctx.lineTo(-radius * 1.4, -radius * 0.6);
    ctx.moveTo(radius * 0.8, 0);
    ctx.lineTo(radius * 1.4, -radius * 0.6);
    ctx.stroke();
    ctx.restore();
  }
}

new Game();
