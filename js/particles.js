/**
 * Game Developer Portfolio - Interactive Cyber Matrix & Particle Canvas
 * Features glowing node networks, geometric floating polys, and mouse interactivity.
 */

class CyberParticleCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.shapes = [];
    this.mouse = { x: -1000, y: -1000, radius: 140 };
    this.particleCount = 55;
    this.animationFrameId = null;

    // Theme color presets
    this.primaryRgb = '0, 240, 255';
    this.secondaryRgb = '168, 85, 247';
    this.shadowColor = '#00f0ff';

    this.init();
    window.cyberCanvasInstance = this;
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    this.createParticles();
    this.createFloatingShapes();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.particleCount = Math.min(Math.floor(this.width / 22), 65);
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        isPrimary: Math.random() > 0.4,
        baseAlpha: Math.random() * 0.4 + 0.2
      });
    }
  }

  setThemeColors(primaryRgb, secondaryRgb, shadowHex) {
    this.primaryRgb = primaryRgb;
    this.secondaryRgb = secondaryRgb;
    this.shadowColor = shadowHex;
  }

  createFloatingShapes() {
    this.shapes = [];
    const shapeCount = 6;
    for (let i = 0; i < shapeCount; i++) {
      this.shapes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 30 + 20,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        sides: Math.random() > 0.5 ? 6 : 4
      });
    }
  }

  drawPolygon(x, y, radius, sides, rotation) {
    this.ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = rotation + (i * 2 * Math.PI) / sides;
      const px = x + radius * Math.cos(angle);
      const py = y + radius * Math.sin(angle);
      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render floating background wireframe shapes
    this.shapes.forEach(shape => {
      shape.rotation += shape.rotSpeed;
      shape.x += shape.vx;
      shape.y += shape.vy;

      if (shape.x < -50) shape.x = this.width + 50;
      if (shape.x > this.width + 50) shape.x = -50;
      if (shape.y < -50) shape.y = this.height + 50;
      if (shape.y > this.height + 50) shape.y = -50;

      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      this.ctx.lineWidth = 1;
      this.drawPolygon(shape.x, shape.y, shape.size, shape.sides, shape.rotation);
      this.ctx.stroke();
      this.ctx.restore();
    });

    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Mouse repulsion
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        p.x -= Math.cos(angle) * force * 2;
        p.y -= Math.sin(angle) * force * 2;
      }

      // Draw particle dot
      const rgb = p.isPrimary ? this.primaryRgb : this.secondaryRgb;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${rgb}, ${p.baseAlpha})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = this.shadowColor;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Connect with neighboring particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);

        if (dist2 < 120) {
          const alpha = (1 - dist2 / 120) * 0.16;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(${this.primaryRgb}, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

window.CyberParticleCanvas = CyberParticleCanvas;
