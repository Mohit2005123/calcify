import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import GraphingCalculator from './pages/GraphingCalculator';
import Visualiser from './pages/visualiser/visualiser';
import SortingAlgo from './pages/visualiser/SortingAlgo';
import BinaryTree from './pages/visualiser/BinaryTree';
import BinarySearchTree from './pages/visualiser/BinarySearchTree';
function App() {

  return (
    <div>
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graphingCalc" element={<GraphingCalculator />} />
        <Route path="/visualiser" element={<Visualiser />} />
        <Route path="/visualiser/sorting" element={<SortingAlgo />} />
        <Route path="/visualiser/binarytree" element={<BinaryTree />} />
        <Route path="/visualiser/binarysearchtree" element={<BinarySearchTree />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

