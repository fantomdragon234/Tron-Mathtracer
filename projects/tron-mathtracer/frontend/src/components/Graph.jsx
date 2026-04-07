import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line, Html, Trail } from "@react-three/drei";

export default function Graph({ func, timeRef, showAxes, loopCount }) {
  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(-1, 0, 0), -150), []);
  const tracerRef = useRef();
  const labelRef = useRef();
  
  const { scaleY, offsetY } = useMemo(() => {
    let yVals = [];
    // Compute strict scaling statistics only upon the core default viewport bounds!
    // Computing over massive extended planes would fatally crush curves like x^2 flats.
    for(let i = 0; i <= 2000; i++) {
      let x = -20.0 + i * 0.02;
      let y = func(x);
      if (isFinite(y) && !isNaN(y)) yVals.push(y);
    }
    
    if (yVals.length === 0) return { scaleY: 1, offsetY: 0 };
    yVals.sort((a,b) => a - b);
    
    let pMin = Math.floor(yVals.length * 0.05);
    let pMax = Math.floor(yVals.length * 0.95);
    if (pMax >= yVals.length) pMax = yVals.length - 1;
    
    let minY = yVals[pMin];
    let maxY = yVals[pMax];
    let range = maxY - minY;
    
    if (range < 0.001) {
      minY = yVals[0];
      maxY = yVals[yVals.length - 1];
      range = maxY - minY;
      if (range < 0.001) return { scaleY: 1, offsetY: minY };
    }
    
    let s = 14.0 / range;
    if (s > 1.5) s = 1.5; 
    if (s < 0.0001) s = 0.0001;
    let center = (maxY + minY) / 2.0;

    return { scaleY: s, offsetY: center };
  }, [func]);

  const lineSegments = useMemo(() => {
    let segments = [];
    let currentSegment = [];
    // Draw geometric segments covering a massive [-150, 150] domain mimicking infinity
    for (let i = 0; i <= 15000; i++) {
      let x = -150.0 + i * 0.02;
      let y = func(x);
      let isValidMath = isFinite(y) && !isNaN(y);
      if (!isValidMath) {
        if (currentSegment.length > 1) segments.push(currentSegment);
        currentSegment = [];
        continue;
      }
      
      let visualY = (y - offsetY) * scaleY;
      if (currentSegment.length > 0) {
        let lastVisualY = currentSegment[currentSegment.length-1][1];
        if (Math.abs(visualY - lastVisualY) > 8.0) {
          if (currentSegment.length > 1) segments.push(currentSegment);
          currentSegment = [];
        }
      }
      currentSegment.push([x, visualY, 0]);
    }
    if (currentSegment.length > 1) segments.push(currentSegment);
    return segments;
  }, [func, scaleY, offsetY]);

  useFrame(() => {
    if (!tracerRef.current) return;
    const x = timeRef.current;
    
    // Natively slice the future graph curve via GPU mathematical projection bounds
    // Only expand the clip plane mapping, ensuring the line stays fully drawn after its first pass!
    if (x > clipPlane.constant) {
      clipPlane.constant = x;
    }
    
    let y = func(x);
    if (!isFinite(y) || isNaN(y)) {
      tracerRef.current.visible = false;
    } else {
      let scaledY = (y - offsetY) * scaleY;
      tracerRef.current.position.set(x, scaledY, 0);
      tracerRef.current.visible = true;

      if (labelRef.current) {
          labelRef.current.style.opacity = '1';
          let dispX = (Math.abs(x) < 0.01 ? 0 : x).toFixed(2);
          let dispY = (Math.abs(y) < 0.01 ? 0 : y).toFixed(2);
          labelRef.current.textContent = `(${dispX}, ${dispY})`;
      }
    }
  });

  const visualZeroY = -offsetY * scaleY;

  return (
    <>
      <group>
        {showAxes && (
          <group>
            {/* X Axis spanning bounds */}
            <Line points={[[-250, visualZeroY, 0], [250, visualZeroY, 0]]} color="#ffffff" lineWidth={1.5} opacity={0.5} transparent depthWrite={false} />
            <mesh position={[140, visualZeroY, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.2, 0.8, 16]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
            
            {/* Y Axis spanning bounds */}
            <Line points={[[0, -250, 0], [0, 250, 0]]} color="#ffffff" lineWidth={1.5} opacity={0.5} transparent depthWrite={false} />
            <mesh position={[0, 95, 0]}>
              <coneGeometry args={[0.2, 0.8, 16]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
          </group>
        )}

        {lineSegments.map((pts, i) => (
          <Line
            key={i}
            points={pts}
            color="#2a9d8f" 
            lineWidth={3.0}
            depthWrite={false}
            clippingPlanes={[clipPlane]}
          />
        ))}
      </group>

      <Trail 
        key={`trail-${loopCount}`}
        width={0.8} 
        color="#2a9d8f"
        length={6} 
        decay={2}
        attenuation={(width) => width * width} 
      >
        <mesh ref={tracerRef} position={[-150, visualZeroY, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshBasicMaterial color="#2a9d8f" />
          <mesh>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshBasicMaterial color="#2a9d8f" transparent opacity={0.15} depthWrite={false} />
          </mesh>
          {/* Float absolute coordinates overlay immediately above mathematically scaling tracer sphere */}
          <Html position={[0, 0.7, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
            <div ref={labelRef} className="tracer-label"></div>
          </Html>
        </mesh>
      </Trail>
    </>
  );
}