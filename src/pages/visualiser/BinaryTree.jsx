import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Plus, Play, Trash2 } from 'lucide-react';
import Node from './functions/BinaryTree/Node';
import Button from './functions/BinaryTree/Button';
import Select from './functions/BinaryTree/Select';
import Line from './functions/BinaryTree/Line';
import { traverseInOrder, traversePostOrder, traversePreOrder, traverseLevelOrder } from './functions/BinaryTree/TraversalAlgo';
const BinaryTree = () => {
  const [nodes, setNodes] = useState([]);
  const [inputNumber, setInputNumber] = useState('');
  const [draggingId, setDraggingId] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('inorder');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef(null);
  const [nextId, setNextId] = useState(0);

  const addNumber = () => {
    if (inputNumber && !isNaN(inputNumber)) {
      const newNumber = parseInt(inputNumber);
      const newNode = {
        id: nextId,
        value: newNumber,
        position: { x: nodes.length * 60 + 50, y: 50 }
      };
      setNodes([...nodes, newNode]);
      setInputNumber('');
      setNextId(nextId + 1);
    }
  };

  const clearTree = () => {
    setNodes([]);
    setHighlightedNodes([]);
    setNextId(0);
  };

  const handleDragStart = (e, id) => {
    setDraggingId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetPosition) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const updatedNodes = nodes.map(node =>
      node.id === draggingId
        ? { ...node, position: { x, y } }
        : node
    );
    setNodes(updatedNodes);
    setDraggingId(null);
  }

  const startVisualization = async () => {
    setIsAnimating(true);
    const root = buildTree();

    if (root) {
      switch (selectedAlgorithm) {
        case 'inorder':
          await traverseInOrder(root, setHighlightedNodes);
          break;
        case 'preorder':
          await traversePreOrder(root, setHighlightedNodes);
          break;
        case 'postorder':
          await traversePostOrder(root, setHighlightedNodes);
          break;
        case 'levelorder':
          await traverseLevelOrder(root, setHighlightedNodes);
          break;
        default:
          break;
      }
    }

    setHighlightedNodes([]);
    setIsAnimating(false);
  };

  const buildTree = () => {
    const nodesByY = {};
    nodes.forEach(node => {
      const y = Math.round(node.position.y / 50) * 50;
      if (!nodesByY[y]) nodesByY[y] = [];
      nodesByY[y].push(node);
    });

    const levels = Object.keys(nodesByY).sort((a, b) => a - b);
    if (levels.length === 0) return null;

    const rootLevel = nodesByY[levels[0]];
    if (rootLevel.length === 0) return null;

    const root = {
      id: rootLevel[0].id,
      value: rootLevel[0].value,
      left: null,
      right: null,
      x: rootLevel[0].position.x,
      y: rootLevel[0].position.y
    };

    const buildSubtree = (node, level, minX, maxX) => {
      if (level >= levels.length) return;

      const nextLevelNodes = nodesByY[levels[level]] || [];

      const leftNodes = nextLevelNodes.filter(n =>
        n.position.x < node.x && n.position.x >= minX
      );
      if (leftNodes.length > 0) {
        const leftChild = leftNodes.reduce((prev, curr) =>
          Math.abs(curr.position.x - node.x) < Math.abs(prev.position.x - node.x) ? curr : prev
        );
        node.left = {
          id: leftChild.id,
          value: leftChild.value,
          left: null,
          right: null,
          x: leftChild.position.x,
          y: leftChild.position.y
        };
        buildSubtree(node.left, level + 1, minX, node.x);
      }

      const rightNodes = nextLevelNodes.filter(n =>
        n.position.x > node.x && n.position.x <= maxX
      );
      if (rightNodes.length > 0) {
        const rightChild = rightNodes.reduce((prev, curr) =>
          Math.abs(curr.position.x - node.x) < Math.abs(prev.position.x - node.x) ? curr : prev
        );
        node.right = {
          id: rightChild.id,
          value: rightChild.value,
          left: null,
          right: null,
          x: rightChild.position.x,
          y: rightChild.position.y
        };
        buildSubtree(node.right, level + 1, node.x, maxX);
      }
    };

    buildSubtree(root, 1, -Infinity, Infinity);
    return root;
  };

  const renderLines = () => {
    const tree = buildTree();
    if (!tree) return null;

    const lines = [];

    const addLines = (node) => {
      if (node.left) {
        lines.push(
          <Line
            key={`${node.id}-${node.left.id}`}
            start={{ x: node.x + 24, y: node.y + 24 }}
            end={{ x: node.left.x + 24, y: node.left.y + 24 }}
          />
        );
        addLines(node.left);
      }
      if (node.right) {
        lines.push(
          <Line
            key={`${node.id}-${node.right.id}`}
            start={{ x: node.x + 24, y: node.y + 24 }}
            end={{ x: node.right.x + 24, y: node.right.y + 24 }}
          />
        );
        addLines(node.right);
      }
    };

    addLines(tree);
    return lines;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6 flex gap-4 items-center">
        <input
          type="number"
          value={inputNumber}
          onChange={(e) => setInputNumber(e.target.value)}
          placeholder="Enter a number"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={addNumber} className="flex items-center gap-2">
          <Plus size={20} /> Add Number
        </Button>
        <Button onClick={clearTree} className="bg-red-500 hover:bg-red-600 flex items-center gap-2">
          <Trash2 size={20} /> Clear Tree
        </Button>
      </div>

      <div className="mb-6 flex gap-4 items-center">
        <Select
          value={selectedAlgorithm}
          onChange={setSelectedAlgorithm}
          options={[
            { value: 'inorder', label: 'In-order Traversal' },
            { value: 'preorder', label: 'Pre-order Traversal' },
            { value: 'postorder', label: 'Post-order Traversal' },
            { value: 'levelorder', label: 'Level-order Traversal' }
          ]}
        />
        <Button
          onClick={startVisualization}
          disabled={isAnimating || nodes.length === 0}
          className="flex items-center gap-2"
        >
          <Play size={20} /> Visualize
        </Button>
      </div>

      <div
        ref={canvasRef}
        className="relative w-full h-[600px] border-2 border-gray-200 rounded-lg bg-gray-50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <svg className="absolute top-0 left-0 w-full h-full">
          {renderLines()}
        </svg>
        {nodes.map((node) => (
          <Node
            key={node.id}
            id={node.id}
            value={node.value}
            position={node.position}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isHighlighted={highlightedNodes.includes(node.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default BinaryTree;