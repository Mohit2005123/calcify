import React, { useState, useRef } from 'react';
import { Plus, Play, Trash2, GitBranch, ToggleLeft, ToggleRight } from 'lucide-react';
import {bfs, dfs} from './functions/Graphs/Traversal.js';
import { dijkstra } from './functions/Graphs/shortestPath.js';
const Graph = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [draggingId, setDraggingId] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bfs');
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [lineStart, setLineStart] = useState(null);
  const [tempLine, setTempLine] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [highlightedEdges, setHighlightedEdges] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef(null);
  const [nextId, setNextId] = useState(0);
  const [startNode, setStartNode]= useState(null);
  const [endNode, setEndNode]= useState(null);
  const [isWeighted, setIsWeighted]= useState(false);
  const addNode = () => {
    if (inputValue.trim()) {
      // Define constants for layout
      const maxNodesPerRow = 8; // Adjust as needed for spacing
      const nodeSpacingX = 80; // Horizontal spacing between nodes
      const nodeSpacingY = 80; // Vertical spacing between rows
  
      // Calculate the row and column for the new node
      const row = Math.floor(nextId / maxNodesPerRow);
      const col = nextId % maxNodesPerRow;
  
      const newNode = {
        id: nextId,
        value: inputValue,
        position: {
          x: 50 + col * nodeSpacingX, // Start with an offset and adjust spacing
          y: 50 + row * nodeSpacingY, // Start with an offset and adjust row spacing
        },
      };
  
      setNodes([...nodes, newNode]);
      setInputValue('');
      setNextId(nextId + 1);
    }
  };
  

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setHighlightedNodes([]);
    setHighlightedEdges([]);
    setNextId(0);
    setIsDrawingLine(false);
    setLineStart(null);
    setTempLine(null);
  };

  const handleDragStart = (e, id) => {
    if (!isDrawingLine) {
      setDraggingId(id);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggingId !== null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setNodes(nodes.map(node =>
        node.id === draggingId
          ? { ...node, position: { x, y } }
          : node
      ));
      setDraggingId(null);
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (isDrawingLine && lineStart !== null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setTempLine({
        x1: nodes.find(n => n.id === lineStart)?.position.x + 25,
        y1: nodes.find(n => n.id === lineStart)?.position.y + 25,
        x2: x,
        y2: y
      });
    }
  };
  const handleNodeClick = (nodeId) => {
    if (!isDrawingLine) {
      if (!startNode) {
        setStartNode(nodeId);
      } else if (!endNode && nodeId !== startNode) {
        setEndNode(nodeId);
      } else {
        setStartNode(nodeId);
        setEndNode(null);
      }
      return;
    }

    if (lineStart === null) {
      setLineStart(nodeId);
    } else if (lineStart !== nodeId) {
      let weight = 1;
      if (isWeighted) {
        const inputWeight = prompt("Enter edge weight:", "1");
        weight = parseInt(inputWeight, 10) || 1;
      }
      const newEdge = {
        id: `${lineStart}-${nodeId}`,
        from: lineStart,
        to: nodeId,
        weight: weight
      };
      
      if (!edges.some(edge => 
        (edge.from === lineStart && edge.to === nodeId) ||
        (edge.from === nodeId && edge.to === lineStart)
      )) {
        setEdges([...edges, newEdge]);
      }
      
      setLineStart(null);
      setTempLine(null);
    }
  };
  const toggleWeighted = () => {
    setIsWeighted(!isWeighted);
    if (selectedAlgorithm === 'dijkstra' && !isWeighted) {
      setSelectedAlgorithm('bfs');
    }
    // Reset edge weights to 1 when switching to unweighted
    if (isWeighted) {
      setEdges(edges.map(edge => ({ ...edge, weight: 1 })));
    }
  };


  const toggleLineDrawing = () => {
    setIsDrawingLine(!isDrawingLine);
    if (isDrawingLine) {
      setLineStart(null);
      setTempLine(null);
    }
  };
  const startVisualization = async () => {
    if (nodes.length === 0 || !startNode || (selectedAlgorithm === 'dijkstra' && !endNode)) return;
    setIsAnimating(true);
    setHighlightedNodes([]);
    setHighlightedEdges([]);
  
    if (selectedAlgorithm === 'dijkstra' && isWeighted) {
      const { path, visitedOrder } = await dijkstra(startNode, endNode, nodes, edges);
      
      for (let node of visitedOrder) {
        setHighlightedNodes(prev => [...prev, node]);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      for (let i = 0; i < path.length - 1; i++) {
        const edgeId = `${path[i]}-${path[i+1]}`;
        setHighlightedEdges(prev => [...prev, edgeId]);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } else if (selectedAlgorithm === 'bfs') {
      await bfs(startNode, edges, setHighlightedNodes, setHighlightedEdges);
    } else if (selectedAlgorithm === 'dfs') {
      await dfs(startNode, edges, setHighlightedNodes, setHighlightedEdges);
    }
  
    setIsAnimating(false);
  };
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6 flex gap-4 items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter node value"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addNode}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={20} /> Add Node
        </button>
        <button
          onClick={toggleLineDrawing}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            isDrawingLine 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          <GitBranch size={20} /> {isDrawingLine ? 'Cancel Line' : 'Add Line'}
        </button>
        <button
          onClick={clearGraph}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2"
        >
          <Trash2 size={20} /> Clear Graph
        </button>
        <button
          onClick={toggleWeighted}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            isWeighted
              ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          {isWeighted ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
          {isWeighted ? 'Weighted' : 'Unweighted'}
        </button>
      </div>

      <div className="mb-6 flex gap-4 items-center">
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="bfs">Breadth-First Search</option>
          <option value="dfs">Depth-First Search</option>
          <option value='dijkstra' disabled={!isWeighted}>Dijkstra's Algorithm</option>
        </select>
        <button
          onClick={startVisualization}
          disabled={isAnimating || nodes.length === 0 || !startNode || (selectedAlgorithm === 'dijkstra' && !endNode)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={20} /> Visualize
        </button>
      </div>

      {isDrawingLine && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
          Click on two nodes to connect them with a line. {isWeighted && "You'll be prompted to enter the edge weight."} Click "Cancel Line" to exit line drawing mode.
        </div>
      )}

      <div
        ref={canvasRef}
        className="relative w-full h-[600px] border-2 border-gray-200 rounded-lg bg-gray-50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseMove={handleCanvasMouseMove}
      >
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {edges.map((edge) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const midX = (fromNode.position.x + toNode.position.x) / 2 + 25;
            const midY = (fromNode.position.y + toNode.position.y) / 2 + 25;

            return (
              <g key={edge.id}>
                <line
                  x1={fromNode.position.x + 25}
                  y1={fromNode.position.y + 25}
                  x2={toNode.position.x + 25}
                  y2={toNode.position.y + 25}
                  stroke={highlightedEdges.includes(edge.id) ? "#22c55e" : "#94a3b8"}
                  strokeWidth="2"
                />
                {isWeighted && (
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    dy=".3em"
                    fill="#4b5563"
                    fontSize="12"
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}
          {tempLine && (
            <line
              x1={tempLine.x1}
              y1={tempLine.y1}
              x2={tempLine.x2}
              y2={tempLine.y2}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
        </svg>
        {nodes.map((node) => (
          <div
            key={node.id}
            draggable={!isDrawingLine}
            onDragStart={(e) => handleDragStart(e, node.id)}
            onClick={() => handleNodeClick(node.id)}
            className={`absolute cursor-${isDrawingLine ? 'pointer' : 'move'} w-[50px] h-[50px] rounded-full 
              flex items-center justify-center
              ${highlightedNodes.includes(node.id) ? 'bg-green-500' : 
                node.id === startNode ? 'bg-blue-500' :
                node.id === endNode ? 'bg-purple-500' : 'bg-gray-400'}
              ${isDrawingLine && lineStart === node.id ? 'ring-2 ring-yellow-400' : ''}
              text-white font-semibold transition-colors`}
            style={{
              left: node.position.x,
              top: node.position.y,
            }}
          >
            {node.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Graph;