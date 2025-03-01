import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GameProvider } from "./game/state/GameContext"; // ✅ Import GameProvider
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GameProvider> {/* ✅ Wrap everything inside GameProvider */}
      <App />
    </GameProvider>
  </React.StrictMode>
);
