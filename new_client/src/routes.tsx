import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Landing } from "./pages";

export function Routes() {
  return (
    <>
      <Router>
          <Routes>
            <Route path="/" element={<Landing />} />            
          </Routes>
        </Router>
    </>
  );
}
