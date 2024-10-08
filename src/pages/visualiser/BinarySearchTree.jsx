import React, { useState, useRef } from 'react';
import { Plus, Play, Trash2, Minus } from 'lucide-react';
import Node from './functions/BinarySearchTree/Node';
import Line from './functions/BinarySearchTree/Line';
import Button from './functions/BinarySearchTree/Button';
import Select from './functions/BinarySearchTree/Select';
import TreeNode from './functions/BinarySearchTree/TreeNode';
import { inorderTraversal, postorderTraversal, preorderTraversal , levelOrderTraversal} from './functions/BinarySearchTree/TraversalAlgo.js';
const BinarySearchTree = () => {
  const [root, setRoot] = useState(null);
  const [inputNumber, setInputNumber] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('inorder');
  const [error, setError] = useState('');
  const [nextId, setNextId] = useState(0);
  const canvasRef = useRef(null);
  const [deleteNumber, setDeleteNumber]= useState('');
  // Calculate node positions for visualization
  const updateNodePositions = (node, depth = 0, positions = [], leftBound = 0, rightBound = 1, depthFactor = 2) => {
    if (!node) return positions;
    const x = leftBound + (rightBound - leftBound) / 2;
    const y = depth * 80 + 50;
    node.x = x * 800; // Scale x to fit within 800px width
    node.y = y;
  
    positions.push({
      id: node.id,
      value: node.value,
      position: { x: node.x, y: node.y }
    });
  
    updateNodePositions(node.left, depth + 1, positions, leftBound, x, depthFactor);
    updateNodePositions(node.right, depth + 1, positions, x, rightBound, depthFactor);
  
    return positions;
  };
  

  const findMin = (node) => {
    let current = node;
    while (current && current.left) {
      current = current.left;
    }
    return current;
  };
    // Delete a node from the BST
    // Delete a node from the BST
const deleteNode = (node, value) => {
  if (!node) return { newNode: null, found: false };

  let found = false;

  if (value < node.value) {
    const result = deleteNode(node.left, value);
    node.left = result.newNode;
    found = result.found;
  } else if (value > node.value) {
    const result = deleteNode(node.right, value);
    node.right = result.newNode;
    found = result.found;
  } else {
    found = true; // Found the node to delete
    // Node with only one child or no child
    if (!node.left) {
      return { newNode: node.right, found };
    } else if (!node.right) {
      return { newNode: node.left, found };
    }

    // Node with two children
    const minNode = findMin(node.right);
    node.value = minNode.value;
    const result = deleteNode(node.right, minNode.value);
    node.right = result.newNode;
  }
  return { newNode: node, found };
};

const handleDelete = () => {
  if (deleteNumber && !isNaN(deleteNumber)) {
    const value = parseInt(deleteNumber);
    setError('');

    const result = deleteNode(root, value);
    
    if (!result.found) {
      setError(`Value ${value} not found in the tree`);
    } else {
      setRoot(result.newNode);
      setDeleteNumber('');
    }
  }
};

  // Insert a new node following BST rules
  const insertNode = (value) => {
    const newNode = new TreeNode(value, nextId, 0, 0);
    setNextId(nextId + 1);

    if (!root) {
      setRoot(newNode);
      return true;
    }

    let current = root;
    let parent = null;
    while (current) {
      parent = current;
      if (value === current.value) {
        setError('Duplicate values are not allowed in BST');
        return false;
      }
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    if (value < parent.value) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
    return true;
  };

  const addNumber = () => {
    if (inputNumber && !isNaN(inputNumber)) {
      const value = parseInt(inputNumber);
      setError('');
      
      if (insertNode(value)) {
        setInputNumber('');
      }
    }
  };

  const clearTree = () => {
    setRoot(null);
    setHighlightedNodes([]);
    setNextId(0);
    setError('');
  };

const startVisualization = async () => {
    setIsAnimating(true);
    setHighlightedNodes([]);

    if (root) {
      switch (selectedAlgorithm) {
        case 'inorder':
          await inorderTraversal(root, setHighlightedNodes);
          break;
        case 'preorder':
          await preorderTraversal(root, setHighlightedNodes);
          break;
        case 'postorder':
          await postorderTraversal(root, setHighlightedNodes);
          break;
        case 'levelorder':
          await levelOrderTraversal(root, setHighlightedNodes);
          break;
        default:
          break;
      }
    }

    setHighlightedNodes([]);
    setIsAnimating(false);
  };

  // Prepare data for visualization
  const getNodesAndLines = () => {
    if (!root) return { nodes: [], lines: [] };

    const nodes = updateNodePositions(root);
    const lines = [];

    const addLines = (node) => {
      if (!node) return;
      
      if (node.left) {
        lines.push({
          start: { x: node.x, y: node.y },
          end: { x: node.left.x, y: node.left.y }
        });
        addLines(node.left);
      }
      if (node.right) {
        lines.push({
          start: { x: node.x, y: node.y },
          end: { x: node.right.x, y: node.right.y }
        });
        addLines(node.right);
      }
    };

    addLines(root);
    return { nodes, lines };
  };

  const { nodes, lines } = getNodesAndLines();

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
        <div className="flex gap-4 items-center">
          <input
            type="number"
            value={deleteNumber}
            onChange={(e) => setDeleteNumber(e.target.value)}
            placeholder="Delete a number"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={handleDelete} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600">
            <Minus size={20} /> Delete Number
          </Button>
        </div>
        <Button onClick={clearTree} className="bg-red-500 hover:bg-red-600 flex items-center gap-2">
          <Trash2 size={20} /> Clear Tree
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

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
          disabled={isAnimating || !root}
          className="flex items-center gap-2"
        >
          <Play size={20} /> Visualize
        </Button>
      </div>

      <div
        ref={canvasRef}
        className="relative w-full h-[600px] border-2 border-gray-200 rounded-lg bg-gray-50"
      >
        <svg className="absolute top-0 left-0 w-full h-full">
          {lines.map((line, index) => (
            <Line key={index} start={line.start} end={line.end} />
          ))}
        </svg>
        {nodes.map((node) => (
          <Node
            key={node.id}
            id={node.id}
            value={node.value}
            position={node.position}
            isHighlighted={highlightedNodes.includes(node.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default BinarySearchTree;