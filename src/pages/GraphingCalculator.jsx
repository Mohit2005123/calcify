import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trash2 } from 'lucide-react';

const COLORS = [
  '#2563eb', // blue
  '#dc2626', // red
  '#16a34a', // green
  '#9333ea', // purple
  '#ea580c', // orange
  '#0891b2', // cyan
  '#4f46e5', // indigo
  '#db2777', // pink
];

const GraphingCalculator = () => {
  const [equations, setEquations] = useState([
    { id: 1, expression: 'x * x', color: COLORS[0] }
  ]);
  const [error, setError] = useState({});
  const [scale, setScale] = useState(20);
  const [graphPoints, setGraphPoints] = useState({});
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [svgDimensions, setSvgDimensions] = useState({ width: 500, height: 500 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setSvgDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const preventZoom = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', preventZoom, { passive: false });
    document.addEventListener('keydown', preventZoom, { passive: false });

    return () => {
      document.removeEventListener('wheel', preventZoom);
      document.removeEventListener('keydown', preventZoom);
    };
  }, []);

  const toSVGX = useCallback(
    (x) => {
      return svgDimensions.width / 2 + ((x - center.x) * svgDimensions.width) / scale;
    },
    [scale, center, svgDimensions.width]
  );

  const toSVGY = useCallback(
    (y) => {
      return svgDimensions.height / 2 - ((y - center.y) * svgDimensions.height) / scale;
    },
    [scale, center, svgDimensions.height]
  );

  const evaluateExpression = useCallback((x, expr) => {
    try {
      const safeExpr = expr
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/pi/g, 'Math.PI')
        .replace(/abs/g, 'Math.abs')
        .replace(/\^/g, '**');
      return new Function('x', `return ${safeExpr}`)(x);
    } catch (err) {
      return null;
    }
  }, []);

  const generatePoints = useCallback(() => {
    const newPoints = {};
    const step = scale / svgDimensions.width;

    equations.forEach(eq => {
      const points = [];
      let isValid = false;
      const startX = center.x - scale / 2;
      const endX = center.x + scale / 2;

      for (let x = startX; x <= endX; x += step) {
        try {
          const y = evaluateExpression(x, eq.expression);
          if (y !== null && !isNaN(y) && isFinite(y)) {
            points.push([toSVGX(x), toSVGY(y)]);
            isValid = true;
          }
        } catch (err) {
          // Skip invalid points
        }
      }

      if (!isValid) {
        setError(prev => ({ ...prev, [eq.id]: 'Invalid expression or no valid points' }));
      } else {
        setError(prev => {
          const newError = { ...prev };
          delete newError[eq.id];
          return newError;
        });
      }

      newPoints[eq.id] = points;
    });

    return newPoints;
  }, [scale, equations, evaluateExpression, toSVGX, toSVGY, center, svgDimensions.width]);

  useEffect(() => {
    const newPoints = generatePoints();
    setGraphPoints(newPoints);
  }, [generatePoints]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    setScale(prev => prev * zoomFactor);
  }, []);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        
        const mathDx = (dx * scale) / svgDimensions.width;
        const mathDy = (-dy * scale) / svgDimensions.height;
        
        setCenter(prev => ({
          x: prev.x - mathDx,
          y: prev.y - mathDy
        }));
        
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, dragStart, scale, svgDimensions]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const generateGridLines = useCallback(() => {
    const lines = [];
    const labels = [];
    const gridSpacing = scale / 5;
    const subGridSpacing = gridSpacing / 5;
    
    const startX = Math.floor((center.x - scale/2) / gridSpacing) * gridSpacing;
    const endX = Math.ceil((center.x + scale/2) / gridSpacing) * gridSpacing;
    const startY = Math.floor((center.y - scale/2) / gridSpacing) * gridSpacing;
    const endY = Math.ceil((center.y + scale/2) / gridSpacing) * gridSpacing;

    for (let x = startX; x <= endX; x += gridSpacing) {
      const svgX = toSVGX(x);
      lines.push(
        <line
          key={`vertical-${x}`}
          x1={svgX}
          y1={0}
          x2={svgX}
          y2={svgDimensions.height}
          stroke={Math.abs(x) < gridSpacing/10 ? '#000' : '#ddd'}
          strokeWidth={Math.abs(x) < gridSpacing/10 ? 2 : 1}
        />
      );

      for (let i = 1; i <= 4; i++) {
        const subX = x + i * subGridSpacing;
        const subSvgX = toSVGX(subX);
        lines.push(
          <line
            key={`vertical-sub-${x}-${i}`}
            x1={subSvgX}
            y1={0}
            x2={subSvgX}
            y2={svgDimensions.height}
            stroke='#eee'
            strokeWidth={0.5}
          />
        );
      }

      if (Math.abs(x) > gridSpacing/10) {
        labels.push(
          <text
            key={`label-x-${x}`}
            x={svgX}
            y={toSVGY(0) + 20}
            textAnchor="middle"
            className="text-xs"
          >
            {formatAxisLabel(x)}
          </text>
        );
      }
    }

    for (let y = startY; y <= endY; y += gridSpacing) {
      const svgY = toSVGY(y);
      lines.push(
        <line
          key={`horizontal-${y}`}
          x1={0}
          y1={svgY}
          x2={svgDimensions.width}
          y2={svgY}
          stroke={Math.abs(y) < gridSpacing/10 ? '#000' : '#ddd'}
          strokeWidth={Math.abs(y) < gridSpacing/10 ? 2 : 1}
        />
      );

      for (let i = 1; i <= 4; i++) {
        const subY = y + i * subGridSpacing;
        const subSvgY = toSVGY(subY);
        lines.push(
          <line
            key={`horizontal-sub-${y}-${i}`}
            x1={0}
            y1={subSvgY}
            x2={svgDimensions.width}
            y2={subSvgY}
            stroke="#eee"
            strokeWidth={0.5}
          />
        );
      }

      if (Math.abs(y) > gridSpacing/10) {
        labels.push(
          <text
            key={`label-y-${y}`}
            x={toSVGX(0) + 10}
            y={svgY}
            textAnchor="start"
            alignmentBaseline="middle"
            className="text-xs"
          >
            {formatAxisLabel(y)}
          </text>
        );
      }
    }

    return [...lines, ...labels];
  }, [scale, center, toSVGX, toSVGY, svgDimensions]);

  const formatAxisLabel = (value) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000 || (absValue < 0.01 && absValue !== 0)) {
      return value.toExponential(1);
    }
    return value.toFixed(1);
  };

  const addEquation = () => {
    const newId = Math.max(0, ...equations.map(eq => eq.id)) + 1;
    const colorIndex = equations.length % COLORS.length;
    setEquations([...equations, { 
      id: newId, 
      expression: '', 
      color: COLORS[colorIndex]
    }]);
  };

  const removeEquation = (id) => {
    setEquations(equations.filter(eq => eq.id !== id));
    setError(prev => {
      const newError = { ...prev };
      delete newError[id];
      return newError;
    });
  };

  const updateEquation = (id, newExpression) => {
    setEquations(equations.map(eq => 
      eq.id === id ? { ...eq, expression: newExpression } : eq
    ));
  };

  return (
    <div className="flex h-screen">
      <div className="w-80 p-4 border-r bg-gray-50 overflow-y-auto">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Graphing Calculator</h1>
        
        <div className="space-y-4">
          {equations.map((eq, index) => (
            <div key={eq.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: eq.color }}
                />
                <input
                  value={eq.expression}
                  onChange={(e) => updateEquation(eq.id, e.target.value)}
                  placeholder="e.g., x * x"
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {equations.length > 1 && (
                  <button 
                    onClick={() => removeEquation(eq.id)}
                    className="p-2 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              {error[eq.id] && (
                <div className="text-red-500 text-sm">{error[eq.id]}</div>
              )}
            </div>
          ))}
          
          {equations.length < COLORS.length && (
            <button
              onClick={addEquation}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Equation
            </button>
          )}
          
          <div className="mt-6">
            <h2 className="font-medium text-gray-700 mb-2">Instructions:</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use mouse wheel to zoom</li>
              <li>• Click and drag to pan</li>
              <li>• Use x as the variable</li>
              <li>• Supported functions: sin, cos, tan, sqrt, abs</li>
              <li>• Use ^ for exponents (e.g., x^2)</li>
              <li>• Use pi for π</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 relative"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg 
          ref={svgRef} 
          width={svgDimensions.width} 
          height={svgDimensions.height}
          className="touch-none"
        >
          {generateGridLines()}
          {equations.map(eq => (
            graphPoints[eq.id]?.length > 0 && (
              <path 
                key={eq.id}
                d={`M ${graphPoints[eq.id].map(([x, y]) => `${x},${y}`).join(' L ')}`} 
                stroke={eq.color}
                strokeWidth="2" 
                fill="none" 
              />
            )
          ))}
        </svg>
      </div>
    </div>
  );
};

export default GraphingCalculator;