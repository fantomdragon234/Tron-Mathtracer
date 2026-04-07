import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function AudioEngine({ func, timeRef, running }) {
  const oscRef = useRef(null);
  const gainRef = useRef(null);
  const filterRef = useRef(null);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    
    // Core smooth sine synth
    const osc = ctx.createOscillator();
    osc.type = "sine";
    
    // Sub/layer triangle detuned slightly
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.0; // Mute immediately upon mount until play
    
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(filter);
    filter.connect(ctx.destination);
    
    osc.start();
    osc2.start();
    
    oscRef.current = { o1: osc, o2: osc2 };
    gainRef.current = gain;
    filterRef.current = filter;

    return () => {
      osc.stop();
      osc2.stop();
      ctx.close();
    };
  }, []);

  useFrame(() => {
    if (!audioCtxRef.current || !oscRef.current || !gainRef.current) return;
    
    // Resume context smoothly upon interaction
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (!running) {
      gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
      return;
    }
    
    const x = timeRef.current;
    let y = func(x);
    if (!isFinite(y) || isNaN(y)) y = 0;
    
    // Mathematically lock parameters
    let clampedY = Math.max(-10, Math.min(10, y));
    
    const baseFreq = 180;
    const modulatedFreq = baseFreq + clampedY * 40; 
    const clampedFreq = Math.max(50, Math.min(900, modulatedFreq));
    
    // Fluidly drift synthesizer tones safely capturing values
    oscRef.current.o1.frequency.setTargetAtTime(clampedFreq, audioCtxRef.current.currentTime, 0.05);
    oscRef.current.o2.frequency.setTargetAtTime(clampedFreq * 1.02, audioCtxRef.current.currentTime, 0.05);
    
    // Gentle volume bounds protecting ears
    const vol = 0.10 + Math.abs(clampedY) * 0.015;
    gainRef.current.gain.setTargetAtTime(vol, audioCtxRef.current.currentTime, 0.08);
    
    // TRON sweeping effects tied onto height 
    filterRef.current.frequency.setTargetAtTime(300 + Math.abs(clampedY) * 150, audioCtxRef.current.currentTime, 0.1);
  });

  return null;
}