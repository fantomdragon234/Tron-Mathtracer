import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Graph from "./Graph";
import Grid from "./Grid";
import { OrthographicCamera, OrbitControls } from "@react-three/drei";

function Animator({ func, running, showAxes }) {
  const t = useRef(-150);
  const [loop, setLoop] = useState(0);

  useFrame((state, delta) => {
    if (running) {
      // Map consistently across the entire functional domain using a smooth, continuous linear velocity
      t.current += delta * 45.0;

      if (t.current > 150) {
        t.current = -150;
        setLoop(l => l + 1);
      }
    }
  });

  return <Graph func={func} timeRef={t} loopCount={loop} showAxes={showAxes} />;
}

export default function Scene({ func, running, showGrid, showAxes }) {
  return (
    <Canvas
      gl={{ localClippingEnabled: true, preserveDrawingBuffer: true, alpha: true }}
      style={{ background: "transparent", position: "relative", zIndex: 1 }}
    >
      <OrthographicCamera makeDefault position={[0, 0, 20]} zoom={35} near={0.1} far={100} />
      <OrbitControls
        makeDefault
        enableRotate={false}
        enableDamping
        minZoom={5}
        maxZoom={200}
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN
        }}
        touches={{
          ONE: THREE.TOUCH.PAN,
          TWO: THREE.TOUCH.DOLLY_PAN
        }}
      />
      {showGrid && <Grid />}
      <Animator func={func} running={running} showAxes={showAxes} />
    </Canvas>
  );
}