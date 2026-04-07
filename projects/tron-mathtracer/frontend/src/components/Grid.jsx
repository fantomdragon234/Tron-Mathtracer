import React from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec3 vWorldPos;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  varying vec3 vWorldPos;
  void main() {
    // Generate native world-mapped cartesian grid boundaries cleanly
    vec2 grid = abs(fract(vWorldPos.xy * 0.5 - 0.5) - 0.5);
    float line = min(grid.x, grid.y);
    float alpha = smoothstep(0.02, 0.01, line);
    
    // Very faint, thin, professional backdrop lines
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.05);
  }
`;

export default function Grid() {
  return (
    <mesh position={[0, 0, -50]}>
      <planeGeometry args={[1000, 1000]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}
