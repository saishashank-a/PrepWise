"use client";

import { useRef, useEffect } from "react";

// Icosahedron geometry — 12 vertices, 30 edges
const PHI = (1 + Math.sqrt(5)) / 2;
const NORM = Math.sqrt(1 + PHI * PHI);

const VERTS: [number, number, number][] = [
  [-1 / NORM, PHI / NORM, 0],
  [1 / NORM, PHI / NORM, 0],
  [-1 / NORM, -PHI / NORM, 0],
  [1 / NORM, -PHI / NORM, 0],
  [0, -1 / NORM, PHI / NORM],
  [0, 1 / NORM, PHI / NORM],
  [0, -1 / NORM, -PHI / NORM],
  [0, 1 / NORM, -PHI / NORM],
  [PHI / NORM, 0, -1 / NORM],
  [PHI / NORM, 0, 1 / NORM],
  [-PHI / NORM, 0, -1 / NORM],
  [-PHI / NORM, 0, 1 / NORM],
];

const EDGES: [number, number][] = [
  [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
  [1, 5], [1, 7], [1, 8], [1, 9],
  [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
  [3, 4], [3, 6], [3, 8], [3, 9],
  [4, 5], [4, 9], [4, 11],
  [5, 9], [5, 11],
  [6, 7], [6, 8], [6, 10],
  [7, 8], [7, 10],
  [8, 9],
  [10, 11],
];

function rotateY(v: [number, number, number], a: number): [number, number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
}

function project(v: [number, number, number], cx: number, cy: number, scale: number): [number, number] {
  const z = v[2] + 2.5;
  const f = scale / z;
  return [cx + v[0] * f, cy + v[1] * f];
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    mouseX: 0, mouseY: 0,
    targetX: 0, targetY: 0,
    rotation: 0,
    grainFrame: 0,
    grainCanvas: null as HTMLCanvasElement | null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = stateRef.current;
    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      state.grainCanvas = null;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.targetX = (e.clientX - rect.left) / rect.width - 0.5;
      state.targetY = (e.clientY - rect.top) / rect.height - 0.5;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) {
        animId = requestAnimationFrame(draw);
        return;
      }

      // Smooth mouse lerp
      state.mouseX += (state.targetX - state.mouseX) * 0.05;
      state.mouseY += (state.targetY - state.mouseY) * 0.05;

      ctx.clearRect(0, 0, w, h);

      // Layer 1 — Dot grid with parallax
      const spacing = 40;
      const px = state.mouseX * w * 0.02;
      const py = state.mouseY * h * 0.02;
      const sx = ((px % spacing) + spacing) % spacing;
      const sy = ((py % spacing) + spacing) % spacing;
      ctx.fillStyle = "rgba(198, 198, 198, 0.4)";
      for (let x = sx - spacing; x < w + spacing; x += spacing) {
        for (let y = sy - spacing; y < h + spacing; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Layer 2 — Wireframe icosahedron
      state.rotation += 0.001;
      const scale = Math.min(w, h) * 0.3;
      const cx = w / 2;
      const cy = h / 2;
      const rotated = VERTS.map(v => rotateY(v, state.rotation));
      const pts = rotated.map(v => project(v, cx, cy, scale));

      ctx.strokeStyle = "rgba(25, 28, 28, 0.09)";
      ctx.lineWidth = 0.8;
      for (const [a, b] of EDGES) {
        ctx.beginPath();
        ctx.moveTo(pts[a][0], pts[a][1]);
        ctx.lineTo(pts[b][0], pts[b][1]);
        ctx.stroke();
      }

      // Layer 3 — Film grain (refresh every 3 frames)
      state.grainFrame++;
      if (!state.grainCanvas || state.grainCanvas.width !== w || state.grainCanvas.height !== h) {
        const g = document.createElement("canvas");
        g.width = w;
        g.height = h;
        state.grainCanvas = g;
      }
      if (state.grainFrame % 3 === 0) {
        const gctx = state.grainCanvas.getContext("2d")!;
        gctx.clearRect(0, 0, w, h);
        gctx.fillStyle = "rgba(255,255,255,0.04)";
        for (let i = 0; i < 1200; i++) {
          gctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
        }
        gctx.fillStyle = "rgba(0,0,0,0.025)";
        for (let i = 0; i < 800; i++) {
          gctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
        }
      }
      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      ctx.drawImage(state.grainCanvas, 0, 0);
      ctx.restore();

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
    />
  );
}
