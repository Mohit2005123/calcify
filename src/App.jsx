import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import GraphingCalculator from './pages/GraphingCalculator';
function App() {

  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graphingCalc" element={<GraphingCalculator />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

