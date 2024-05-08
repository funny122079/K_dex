import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Landing } from "./pages/landing";

export function CustomRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  );
}
