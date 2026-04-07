import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function UI({ onSubmit, setRunning, showGrid, setShowGrid, showAxes, setShowAxes, onReset, errorMsg }) {
  const [input, setInput] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFunc = params.get("func");
    if (urlFunc) {
      setInput(urlFunc);
    }
  }, []);

  return (
    <div className="ui-container">
      <motion.div 
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="title">MathTracer</h1>
        <p className="subtitle">Real-time mathematical function visualizer</p>
      </motion.div>

      <motion.div 
        className="controls-container"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      >
        <button onClick={onReset} className="control-btn" title="Reset View">
           ⟲ Reset
        </button>
        <button onClick={() => setShowGrid(!showGrid)} className={`control-btn ${showGrid ? 'active' : ''}`}>
           Grid
        </button>
        <button onClick={() => setShowAxes(!showAxes)} className={`control-btn ${showAxes ? 'active' : ''}`}>
           Axes
        </button>
        <button 
          onClick={() => {
            const canvas = document.querySelector("canvas");
            if (canvas) {
              const link = document.createElement("a");
              link.download = `MathTracer_${Date.now()}.png`;
              link.href = canvas.toDataURL("image/png", 1.0);
              link.click();
            }
          }} 
          className="control-btn"
          title="Download PNG Snapshot"
        >
           ↓ Export PNG
        </button>
      </motion.div>

      <motion.div 
        className="input-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit(input);
            if (e.code === "Space") {
               if (input.length === 0 || e.ctrlKey) setRunning(prev => !prev);
            }
            if (e.key === "r" && e.ctrlKey) setInput("");
          }}
          placeholder="Enter function: e.g. sin(x) / x"
        />
        {errorMsg ? (
          <div className="error-message">{errorMsg}</div>
        ) : (
          <div className="input-hint">Press Enter to plot • Ctrl+Space to pause</div>
        )}
      </motion.div>
    </div>
  );
}