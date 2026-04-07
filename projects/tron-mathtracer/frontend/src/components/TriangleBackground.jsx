import { useEffect, useRef } from "react";

const COLS = 22;
const ROWS = 14;
const ORANGE_GLOW = [255, 100, 20];
const BASE_DARK = [14, 17, 22];
const EDGE_DARK = [8, 10, 13];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(c1, c2, t) {
  t = Math.max(0, Math.min(1, t));
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ];
}

function toRgb(c, alpha = 1) {
  return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
}

export default function TriangleBackground() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onMouseMove(e) {
      mouse.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", onMouseMove);

    function draw(ts) {
      timeRef.current = ts * 0.001;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Solid base fill
      ctx.fillStyle = "#05080c";
      ctx.fillRect(0, 0, W, H);

      const cellW = W / COLS;
      const cellH = H / ROWS;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const glowRadius = Math.max(W, H) * 0.28;

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const x0 = col * cellW;
          const y0 = row * cellH;
          const x1 = x0 + cellW;
          const y1 = y0 + cellH;

          // Each cell gets 2 triangles: upper-left (pointing up) and lower-right (pointing down)
          // Upper triangle: (x0,y0), (x1,y0), (x0,y1) — top-left corner
          // Lower triangle: (x1,y1), (x0,y1), (x1,y0) — bottom-right corner

          const triangles = [
            // upper-left triangle — slightly lighter face
            {
              pts: [[x0, y0], [x1, y0], [x0, y1]],
              cx: (x0 + x1 + x0) / 3,
              cy: (y0 + y0 + y1) / 3,
              lightBias: 0.12,
            },
            // lower-right triangle — slightly darker face  
            {
              pts: [[x1, y1], [x0, y1], [x1, y0]],
              cx: (x1 + x0 + x1) / 3,
              cy: (y1 + y1 + y0) / 3,
              lightBias: 0,
            },
          ];

          for (const tri of triangles) {
            const dx = tri.cx - mx;
            const dy = tri.cy - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Glow heat: 1 at center, 0 at glowRadius
            const heat = Math.max(0, 1 - dist / glowRadius);
            // Make it more punchy / non-linear
            const glow = Math.pow(heat, 2.2);

            // Subtle ambient pulse (very subtle, just makes it feel alive)
            const pulse = Math.sin(timeRef.current * 0.6 + col * 0.3 + row * 0.5) * 0.04;

            // Face color: blend from dark base → orange glow
            const faceColor = lerpColor(
              BASE_DARK.map((v) => Math.round(v * (1 + tri.lightBias + pulse))),
              ORANGE_GLOW,
              glow * 0.9
            );

            // Edge/secondary highlight color — deeper for the non-hovered side
            const edgeColor = lerpColor(EDGE_DARK, [200, 60, 10], glow * 0.5);

            // Draw main face
            ctx.beginPath();
            ctx.moveTo(tri.pts[0][0], tri.pts[0][1]);
            ctx.lineTo(tri.pts[1][0], tri.pts[1][1]);
            ctx.lineTo(tri.pts[2][0], tri.pts[2][1]);
            ctx.closePath();
            ctx.fillStyle = toRgb(faceColor);
            ctx.fill();

            // "Extrusion" illusion: draw a thin bottom/right shadow edge
            ctx.strokeStyle = toRgb(edgeColor, 0.9 + glow * 0.1);
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Inner gloss highlight — tiny bright wedge near top-left of each hot triangle
            if (glow > 0.05) {
              const [px, py] = tri.pts[0];
              const [qx, qy] = tri.pts[1];
              const glossX = lerp(px, qx, 0.15);
              const glossY = lerp(py, qy, 0.15);
              const glossX2 = lerp(px, tri.pts[2][0], 0.15);
              const glossY2 = lerp(py, tri.pts[2][1], 0.15);

              const glossGrad = ctx.createLinearGradient(px, py, glossX2, glossY2);
              glossGrad.addColorStop(0, `rgba(255,200,120,${glow * 0.18})`);
              glossGrad.addColorStop(1, `rgba(255,200,120,0)`);

              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(glossX, glossY);
              ctx.lineTo(glossX2, glossY2);
              ctx.closePath();
              ctx.fillStyle = glossGrad;
              ctx.fill();
            }

            // Orange halo radial glow at triangle center when very hot
            if (glow > 0.25) {
              const rad = Math.max(cellW, cellH) * 0.8;
              const halo = ctx.createRadialGradient(tri.cx, tri.cy, 0, tri.cx, tri.cy, rad);
              halo.addColorStop(0, `rgba(255,95,15,${glow * 0.22})`);
              halo.addColorStop(1, `rgba(255,95,15,0)`);
              ctx.beginPath();
              ctx.moveTo(tri.pts[0][0], tri.pts[0][1]);
              ctx.lineTo(tri.pts[1][0], tri.pts[1][1]);
              ctx.lineTo(tri.pts[2][0], tri.pts[2][1]);
              ctx.closePath();
              ctx.fillStyle = halo;
              ctx.fill();
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
