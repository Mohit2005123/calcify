// Instructions.js
import React from 'react';

const Instructions = () => {
  return (
    <div className="mt-6">
      <h2 className="font-medium text-gray-700 mb-2">Instructions:</h2>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>• Select a preset shape or enter a custom equation</li>
        <li>• Use mouse wheel to zoom</li>
        <li>• Click and drag to pan</li>
        <li>• Use x as the variable</li>
        <li>• Supported functions: sin, cos, tan, sqrt, abs</li>
        <li>• Use ^ for exponents (e.g., x^2)</li>
        <li>• Use pi for π</li>
      </ul>
    </div>
  );
};

export default Instructions;