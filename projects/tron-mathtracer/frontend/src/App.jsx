import React, { useState, useEffect } from "react";
import Scene from "./components/Scene";
import UI from "./components/UI";
import { parse } from "mathjs";

export default function App() {
  const [exprStr, setExprStr] = useState("sin(x)");
  const [func, setFunc] = useState(() => (x) => Math.sin(x));
  const [running, setRunning] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  const handleSubmit = async (input) => {
    if (!input.trim()) {
      setErrorMsg("Please enter a function");
      return;
    }
    
    try {
      let cleanInput = input.trim();
      cleanInput = cleanInput.replace(/^\s*(y|f\(x\))\s*=\s*/, "");
      
      const node = parse(cleanInput);
      const code = node.compile();
      
      const f = (x) => {
        try {
          const val = code.evaluate({ x });
          if (typeof val === 'number') {
            return isNaN(val) ? NaN : val;
          }
          if (val && val.isComplex) {
            return NaN; // Handle complex numbers nicely by simply not rendering them
          }
          return Number(val);
        } catch (e) {
          return NaN;
        }
      };
      
      // Syntax validation sandbox evaluating bounds to strictly prevent JS engine crashes natively!
      try {
        f(1);
        f(-1);
      } catch (mathErr) {
        throw new Error("Math parsing failed!");
      }
      
      // Update shareable URL instantly seamlessly without causing dom-reloads
      const url = new URL(window.location);
      url.searchParams.set("func", input);
      window.history.pushState({}, "", url);
      
      setFunc(() => f);
      setExprStr(input);
      setErrorMsg("");
      setRunning(true);
    } catch (e) {
      setErrorMsg("Invalid mathematical expression. Try: sin(x) or x^2");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFunc = params.get("func");
    if (urlFunc) {
      handleSubmit(urlFunc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Scene 
        key={`${exprStr}-${resetKey}`} 
        func={func} 
        running={running} 
        showGrid={showGrid} 
        showAxes={showAxes} 
      />
      <UI 
        onSubmit={handleSubmit} 
        setRunning={setRunning} 
        showGrid={showGrid} 
        setShowGrid={setShowGrid}
        showAxes={showAxes}
        setShowAxes={setShowAxes}
        onReset={() => setResetKey(k => k + 1)}
        errorMsg={errorMsg}
      />
    </>
  );
}