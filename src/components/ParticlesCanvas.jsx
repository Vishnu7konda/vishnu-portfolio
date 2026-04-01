import { useEffect, useRef } from 'react';

export default function ParticlesCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.pulse = Math.random() * 0.02 + 0.01;
        this.pulseDirection = 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity += this.pulse * this.pulseDirection;
        if (this.opacity >= 0.4 || this.opacity <= 0.1) this.pulseDirection *= -1;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(99, 102, 241, ${this.opacity * 0.5})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const particles = Array.from({ length: 60 }, () => new Particle());
    let animId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = 0.15 * (1 - dist / 120);
            const grad = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            grad.addColorStop(0, `rgba(99,102,241,${alpha})`);
            grad.addColorStop(1, `rgba(139,92,246,${alpha})`);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="particles-container">
      <canvas ref={canvasRef} id="particles-canvas"></canvas>
    </div>
  );
}
