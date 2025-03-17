import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { GameProvider } from "./game/state/GameContext";
import "./index.css";

// ✅ Lazy load App.jsx
const App = lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GameProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </GameProvider>
  </React.StrictMode>
);
