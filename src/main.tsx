import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { Rules } from "./rules.tsx";
import { Players } from "./players.tsx";
import Game from "./game.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/howtowin" element={<Rules />} />
        <Route path="/players" element={<Players />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
