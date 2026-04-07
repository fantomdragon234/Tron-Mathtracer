<h1 align="center">TRON MathTracer 🧮✨</h1>

<p align="center">
  <strong>A high-performance, real-time 3D mathematical function visualizer built with React and Three.js.</strong>
</p>

---

## 📖 About The Project

TRON MathTracer is an interactive mathematical graphing tool designed to look like it came straight out of a sci-fi interface. By leveraging **React Three Fiber** and a custom **MathJS plugin pipeline**, it converts standard text-based mathematical equations into stunning real-time visualizations directly in your browser. 

Whether you want to visualize simple quadratic equations, complex trigonometric waves, or explore asymptotic bounds, MathTracer natively and securely processes the syntax with immediate visual feedback.

---

## 🚀 Features

- **Real-Time Formula Parsing**: Safely and instantly parses plain-text algebraic expressions (e.g., `sin(x) + cos(3*x)/4`) using MathJS AST compilation.
- **Robust Graphing**: Natively handles undefined limits, complex numbers, and asymptotes without crashing. Un-renderable math limits resolve elegantly! 
- **3D Interaction**: Smooth, interactive 3D scene manipulation. Pan, rotate, zoom, and explore math like never before. 
- **Tron-Aesthetic UI**: A sleek, dark-mode, neon-lit user interface with fluid micro-animations utilizing Framer Motion. 
- **Lightning Fast**: Built on top of Vite and WebGL (Three.js), supporting massive coordinate rendering in highly performant loops.

---

## 🛠️ Technology Stack

* **Frontend Framework**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **3D Rendering**: [Three.js](https://threejs.org/) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Math Engine**: [MathJS](https://mathjs.org/)
* **Styling**: Vanilla CSS with customized glowing tokens
* *Backend Reference*: Includes a placeholder Python FastAPI setup for historical extension.

---

## 🎮 Usage Guide

Enter any valid mathematical equation into the bottom input prompt relying on the variable `x`. MathTracer will instantly map the logic to the 3D plane.

**Examples to try:**
* `x^2`
* `sin(x)`
* `cos(x) * x`
* `sin(x) + sin(3*x)/3`
* `x * sin(5*x) / (1 + x^2)`

> **Pro Tip**: Press `Enter` to instantly plot your new bounds, and hit `Ctrl + Space` to pause or play the active tracer animation!

---

## 📦 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fantomdragon234/Tron-Mathtracer.git
   cd Tron-Mathtracer
   ```

2. **Navigate to the frontend directory:**
   ```bash
   cd projects/tron-mathtracer/frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Spin up the development server:**
   ```bash
   npm run dev
   ```
   > By default, the application will be hosted at `http://localhost:5173`. Open this URL in your web browser. 

---

## 🤝 Contribution & Extension

If you're interested in expanding MathTracer:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingExt`)
3. Commit your Changes (`git commit -m 'Add some AmazingExt'`)
4. Push to the Branch (`git push origin feature/AmazingExt`)
5. Open a Pull Request

---

*Made with ❤️ for developers and math enthusiasts.*
