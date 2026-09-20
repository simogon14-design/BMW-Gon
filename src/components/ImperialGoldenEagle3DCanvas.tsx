import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCasino } from '../context/CasinoContext';
import { triggerHaptic } from '../utils/haptics';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
  spin: number;
  rot: number;
}

export const ImperialGoldenEagle3DCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { openStealthPinModal } = useCasino();

  // Stealth trigger state for 5-click Imperial Golden Eagle Crest
  const [clickCount, setClickCount] = useState<number>(0);
  const lastClickTimeRef = useRef<number>(0);

  // Mouse / Pointer parallax coordinates (smoothed)
  const targetPointerRef = useRef({ x: 0, y: 0 });
  const currentPointerRef = useRef({ x: 0, y: 0 });
  const scrollOffsetRef = useRef<number>(0);

  const handleCrestClick = useCallback(() => {
    const now = Date.now();
    const elapsed = now - lastClickTimeRef.current;
    lastClickTimeRef.current = now;

    triggerHaptic('selection');

    let nextCount = 1;
    if (elapsed < 1400) {
      nextCount = clickCount + 1;
    }
    setClickCount(nextCount);

    if (nextCount >= 5) {
      setClickCount(0);
      triggerHaptic('heavy');
      openStealthPinModal();
    }
  }, [clickCount, openStealthPinModal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle pool for metallic gold embers
    const MAX_PARTICLES = 65;
    const particles: Particle[] = [];
    const colors = ['#FFF2A3', '#FFD700', '#F59E0B', '#D97706', '#92400E'];

    const spawnParticle = (cx: number, cy: number, spreadX: number = 300) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.8 + 0.3;
      return {
        x: cx + (Math.random() - 0.5) * spreadX,
        y: cy + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.4,
        vy: -Math.abs(Math.sin(angle) * speed) - 0.3, // gently ascend
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        maxLife: Math.random() * 120 + 80,
        life: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        spin: (Math.random() - 0.5) * 0.08,
        rot: Math.random() * Math.PI * 2,
      };
    };

    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push(spawnParticle(width * 0.5, height * 0.38, 500));
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      targetPointerRef.current = {
        x: (clientX / width - 0.5) * 2, // -1 to +1
        y: (clientY / height - 0.5) * 2,
      };
    };

    const handleScroll = () => {
      scrollOffsetRef.current = window.scrollY || document.documentElement.scrollTop;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.022;

      // Smooth pointer interpolation (lerp)
      currentPointerRef.current.x += (targetPointerRef.current.x - currentPointerRef.current.x) * 0.04;
      currentPointerRef.current.y += (targetPointerRef.current.y - currentPointerRef.current.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Parallax center calculations
      const eagleBaseY = height * 0.36 + Math.sin(time * 0.8) * 14 - (scrollOffsetRef.current * 0.08);
      const eagleBaseX = width * 0.5 + currentPointerRef.current.x * 35;
      const tiltX = currentPointerRef.current.x * 0.15;
      const wingFlap = Math.sin(time * 1.4); // Natural soaring flapping loop
      const eagleScale = Math.min(width / 1100, 1.15) * 0.95;

      ctx.save();
      ctx.translate(eagleBaseX, eagleBaseY + currentPointerRef.current.y * 20);
      ctx.rotate(tiltX);
      ctx.scale(eagleScale, eagleScale);

      // 1. Radiant Imperial Amber Halo & Volumetric Nebula Glow
      const radialGlow = ctx.createRadialGradient(0, 0, 15, 0, 0, 420);
      radialGlow.addColorStop(0, 'rgba(255, 220, 110, 0.35)');
      radialGlow.addColorStop(0.2, 'rgba(255, 200, 0, 0.22)');
      radialGlow.addColorStop(0.45, 'rgba(217, 119, 6, 0.14)');
      radialGlow.addColorStop(0.75, 'rgba(146, 64, 14, 0.05)');
      radialGlow.addColorStop(1, 'rgba(8, 10, 15, 0)');

      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 420, 0, Math.PI * 2);
      ctx.fill();

      // 1b. Volumetric Light Rays (God Rays from Upper Zenith)
      ctx.save();
      for (let r = 0; r < 12; r++) {
        const rayAngle = ((r / 12) * Math.PI) - (Math.PI / 2) + Math.sin(time * 0.4 + r) * 0.08;
        const rayLength = 380 + Math.sin(time * 1.2 + r) * 40;
        const rayGrad = ctx.createLinearGradient(0, -60, Math.cos(rayAngle) * rayLength, Math.sin(rayAngle) * rayLength);
        rayGrad.addColorStop(0, 'rgba(255, 235, 150, 0.18)');
        rayGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.06)');
        rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.arc(0, -60, rayLength, rayAngle - 0.07, rayAngle + 0.07);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 2. Animated Concentric Geometric Guilloche Rings
      ctx.save();
      ctx.rotate(time * 0.05);
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.22)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, 240, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.14)';
      ctx.setLineDash([2, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, 280, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3. Render 3D Spread Eagle Wings with Anisotropic Layered Feathers (Remiges & Coverts)
      const renderWing = (direction: 1 | -1) => {
        ctx.save();
        ctx.scale(direction, 1);

        const wingLift = wingFlap * 16;
        const flexWind = Math.sin(time * 2.1 + (direction === 1 ? 0 : 0.4)) * 4;

        // Layer 1: Deep Volumetric Wing Shadow Underlay
        ctx.fillStyle = 'rgba(10, 8, 5, 0.45)';
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.bezierCurveTo(75, -70 + wingLift, 190, -100 + wingLift * 1.5, 335, -40 + wingLift * 2 + flexWind);
        ctx.bezierCurveTo(270, 40 + wingLift, 160, 80, 0, 45);
        ctx.closePath();
        ctx.fill();

        // Layer 2: Primary Flight Feathers (Remiges - Outer Edge Blades)
        const primaryFeatherGrad = ctx.createLinearGradient(0, -70, 340, 80);
        primaryFeatherGrad.addColorStop(0, 'rgba(255, 248, 180, 0.95)');
        primaryFeatherGrad.addColorStop(0.2, 'rgba(255, 215, 0, 0.82)');
        primaryFeatherGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.68)');
        primaryFeatherGrad.addColorStop(0.8, 'rgba(146, 64, 14, 0.45)');
        primaryFeatherGrad.addColorStop(1, 'rgba(69, 26, 3, 0.22)');

        ctx.fillStyle = primaryFeatherGrad;
        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.bezierCurveTo(70, -85 + wingLift, 185, -118 + wingLift * 1.5, 335, -55 + wingLift * 2 + flexWind);
        // Realistic Aerodynamic Quill Scalloping
        ctx.bezierCurveTo(318, -25 + wingLift * 1.8, 275, -5 + wingLift * 1.5, 255, 18 + wingLift + flexWind * 0.8);
        ctx.bezierCurveTo(235, 8 + wingLift, 205, 38 + wingLift * 0.8, 175, 48);
        ctx.bezierCurveTo(150, 42, 120, 68, 88, 68);
        ctx.bezierCurveTo(55, 62, 22, 48, 0, 30);
        ctx.closePath();
        ctx.fill();

        // Layer 3: Secondary Coverts (Greater & Median Plumage Tier)
        const covertGrad = ctx.createLinearGradient(15, -40, 240, 30);
        covertGrad.addColorStop(0, 'rgba(255, 250, 205, 0.88)');
        covertGrad.addColorStop(0.35, 'rgba(245, 158, 11, 0.75)');
        covertGrad.addColorStop(0.75, 'rgba(180, 83, 9, 0.52)');
        covertGrad.addColorStop(1, 'rgba(60, 25, 5, 0.2)');

        ctx.fillStyle = covertGrad;
        ctx.beginPath();
        ctx.moveTo(10, -18);
        ctx.bezierCurveTo(60, -60 + wingLift * 0.8, 140, -75 + wingLift * 1.2, 230, -28 + wingLift * 1.4);
        ctx.bezierCurveTo(205, 5 + wingLift, 140, 30 + wingLift * 0.6, 90, 35);
        ctx.bezierCurveTo(50, 32, 20, 20, 10, 0);
        ctx.closePath();
        ctx.fill();

        // Layer 4: Micro-Feather Rachis Ribs & Anisotropic Specular Highlights
        ctx.strokeStyle = 'rgba(255, 255, 230, 0.75)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(35, -15);
        ctx.quadraticCurveTo(125, -50 + wingLift, 310, -48 + wingLift * 1.95 + flexWind);
        ctx.moveTo(30, 2);
        ctx.quadraticCurveTo(115, -20 + wingLift, 235, 12 + wingLift);
        ctx.moveTo(25, 18);
        ctx.quadraticCurveTo(95, 8 + wingLift * 0.5, 160, 42);
        ctx.stroke();

        // Layer 5: Fine Feather Filaments (Individual Quill Ribs)
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
        ctx.lineWidth = 0.9;
        for (let f = 0; f < 7; f++) {
          const fx = 70 + f * 32;
          const fy = -45 + f * 10 + wingLift * (0.6 + f * 0.15);
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.lineTo(fx + 16, fy + 22);
          ctx.stroke();
        }

        ctx.restore();
      };

      renderWing(1);  // Right Wing
      renderWing(-1); // Left Wing

      // 4. Photorealistic Eagle Tail Fan with Layered Retrices
      const tailGrad = ctx.createLinearGradient(0, 30, 0, 160);
      tailGrad.addColorStop(0, 'rgba(255, 225, 120, 0.55)');
      tailGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.42)');
      tailGrad.addColorStop(0.7, 'rgba(180, 83, 9, 0.22)');
      tailGrad.addColorStop(1, 'rgba(60, 20, 0, 0.05)');

      ctx.fillStyle = tailGrad;
      ctx.beginPath();
      ctx.moveTo(-28, 40);
      ctx.lineTo(-65, 138);
      ctx.lineTo(-24, 122);
      ctx.lineTo(0, 152);
      ctx.lineTo(24, 122);
      ctx.lineTo(65, 138);
      ctx.lineTo(28, 40);
      ctx.closePath();
      ctx.fill();

      // Tail Quill Spine Highlights
      ctx.strokeStyle = 'rgba(255, 240, 160, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 45);
      ctx.lineTo(0, 148);
      ctx.moveTo(-15, 45);
      ctx.lineTo(-42, 130);
      ctx.moveTo(15, 45);
      ctx.lineTo(42, 130);
      ctx.stroke();

      // 5. Central Heraldic Sovereign Shield (Guilloche & Golden Star)
      const shieldGrad = ctx.createLinearGradient(-35, -40, 35, 60);
      shieldGrad.addColorStop(0, 'rgba(11, 18, 32, 0.95)');
      shieldGrad.addColorStop(1, 'rgba(4, 7, 13, 0.98)');

      ctx.fillStyle = shieldGrad;
      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.bezierCurveTo(35, -30, 40, -10, 40, 20);
      ctx.bezierCurveTo(40, 55, 25, 80, 0, 95);
      ctx.bezierCurveTo(-25, 80, -40, 55, -40, 20);
      ctx.bezierCurveTo(-40, -10, -35, -30, 0, -35);
      ctx.closePath();
      ctx.fill();

      // Shield Gold Border
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Guilloche Crosshatch Inside Shield
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.22)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-25, -5);
      ctx.lineTo(25, 45);
      ctx.moveTo(25, -5);
      ctx.lineTo(-25, 45);
      ctx.stroke();

      // Central Imperial Star Cipher
      ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const rad = (i * Math.PI) / 4;
        const r = i % 2 === 0 ? 14 : 6;
        const sx = Math.sin(rad) * r;
        const sy = 25 - Math.cos(rad) * r;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();

      // 6. Eagle Head Plumage, Hyper-Realistic Curved Hook Beak, and Piercing Amber Iris
      const headGrad = ctx.createLinearGradient(-18, -80, 24, -30);
      headGrad.addColorStop(0, 'rgba(255, 250, 210, 0.95)');
      headGrad.addColorStop(0.3, 'rgba(255, 215, 0, 0.85)');
      headGrad.addColorStop(0.7, 'rgba(217, 119, 6, 0.72)');
      headGrad.addColorStop(1, 'rgba(120, 53, 15, 0.55)');

      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.moveTo(-14, -45);
      ctx.bezierCurveTo(-18, -68, -8, -84, 10, -82);
      ctx.bezierCurveTo(22, -80, 30, -68, 24, -50);
      ctx.bezierCurveTo(18, -44, 6, -38, -14, -45);
      ctx.closePath();
      ctx.fill();

      // Nape & Crown Feathers (Feathery Tufts)
      ctx.strokeStyle = 'rgba(255, 240, 160, 0.6)';
      ctx.lineWidth = 1.2;
      for (let t = 0; t < 5; t++) {
        const tx = -12 + t * 5;
        const ty = -72 - (t % 2) * 4;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx - 6, ty - 5);
        ctx.stroke();
      }

      // Yellow Cere (Beak Base)
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(16, -65);
      ctx.lineTo(22, -64);
      ctx.lineTo(21, -53);
      ctx.lineTo(15, -53);
      ctx.closePath();
      ctx.fill();

      // Sharp Curved Raptor Beak
      const beakGrad = ctx.createLinearGradient(18, -64, 38, -48);
      beakGrad.addColorStop(0, '#FEF08A');
      beakGrad.addColorStop(0.5, '#F59E0B');
      beakGrad.addColorStop(1, '#B45309');

      ctx.fillStyle = beakGrad;
      ctx.beginPath();
      ctx.moveTo(20, -64);
      ctx.bezierCurveTo(28, -63, 35, -58, 36, -50); // hooked upper curve
      ctx.lineTo(31, -47); // downward sharp talon tip
      ctx.bezierCurveTo(27, -51, 23, -53, 18, -53); // lower mandibular line
      ctx.closePath();
      ctx.fill();

      // Beak Highlight Ridge
      ctx.strokeStyle = 'rgba(255, 255, 240, 0.8)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(21, -63);
      ctx.quadraticCurveTo(29, -60, 34, -51);
      ctx.stroke();

      // Piercing Sovereign Eye (Sclerotic Ring, Amber Iris, Slit Pupil & Specular Catchlight)
      // Eye Orbit Shadow
      ctx.fillStyle = 'rgba(10, 8, 5, 0.75)';
      ctx.beginPath();
      ctx.ellipse(8, -62, 5, 4, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Golden Amber Iris
      const eyeGrad = ctx.createRadialGradient(8, -62, 0.5, 8, -62, 3.5);
      eyeGrad.addColorStop(0, '#FEF08A');
      eyeGrad.addColorStop(0.6, '#F59E0B');
      eyeGrad.addColorStop(1, '#78350F');

      ctx.fillStyle = eyeGrad;
      ctx.beginPath();
      ctx.arc(8, -62, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Deep Black Pupil
      ctx.fillStyle = '#030508';
      ctx.beginPath();
      ctx.arc(8, -62, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Specular Catchlight (Sun Reflection)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(9.2, -63.2, 0.8, 0, Math.PI * 2);
      ctx.fill();

      // 7. Sovereign Imperial Crown atop Eagle Head
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(-10, -82);
      ctx.lineTo(-14, -95);
      ctx.lineTo(-4, -89);
      ctx.lineTo(5, -100); // central spire
      ctx.lineTo(14, -89);
      ctx.lineTo(24, -95);
      ctx.lineTo(20, -82);
      ctx.closePath();
      ctx.fill();

      // Jewels on Crown Spire Tips
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(5, -102, 2.5, 0, Math.PI * 2);
      ctx.arc(-14, -96, 2, 0, Math.PI * 2);
      ctx.arc(24, -96, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // Restore eagle transform

      // 8. Metallic Gold Embers & Swirling Physics Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        p.x += p.vx + currentPointerRef.current.x * 0.5;
        p.y += p.vy;
        p.rot += p.spin;

        const lifeRatio = p.life / p.maxLife;
        const currentAlpha = p.alpha * (1 - lifeRatio);

        if (lifeRatio >= 1 || p.y < 0) {
          particles[i] = spawnParticle(width * 0.5 + currentPointerRef.current.x * 80, eagleBaseY + 30, 480);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, currentAlpha);

        // Diamond / Star Sparkle
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.6, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size * 0.6, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Background 3D Spatial Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-95 select-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Covert 5-Click Golden Eagle Crest Hotspot for Master PIN Authorization */}
      <div
        id="stealth-eagle-canvas-trigger"
        onClick={handleCrestClick}
        className="fixed top-28 left-1/2 -translate-x-1/2 w-48 h-36 z-10 cursor-pointer select-none opacity-0 active:opacity-10 transition-opacity rounded-full"
        title="Imperial Golden Eagle Crest (النسر الذهبي الملكي)"
      />

      {/* Discrete Sovereign Architectural Watermark in Corner */}
      <div className="fixed bottom-3 right-4 z-20 pointer-events-none hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-amber-400/20 backdrop-blur-md text-[10px] font-mono text-amber-300/80 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        <span>ÆTHEЯIUS 3D • النسر الذهبي الملكي</span>
      </div>
    </>
  );
};
