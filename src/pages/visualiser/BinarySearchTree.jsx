import { useState, useRef, useEffect } from 'react';
import { inorderTraversal, preorderTraversal, postorderTraversal } from './functions/BinarySearchTree/TraversalAlgo';
const BinarySearchTree = () => {
  const [nodes, setNodes] = useState([]);
  const [nodeValue, setNodeValue] = useState('');
  const [lines, setLines] = useState([]);
  const [draggingNode, setDraggingNode] = useState(null);
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [currentTraversalIndex, setCurrentTraversalIndex] = useState(null);
  const svgRef = useRef(null);

  // Helper functions
  const findParentNode = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.parent) return null;
    return nodes.find(n => n.id === node.parent);
  };

  const isLeftChild = (node) => {
    const parent = findParentNode(node.id);
    if (!parent) return null;
    return node.x < parent.x;
  };

  const calculateLineMetrics = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return { length, angle };
  };

  const findNodePosition = (value) => {
    if (nodes.length === 0) {
      return { x: 400, y: 50, parent: null };
    }

    let current = nodes.find(n => n.parent === null); // root
    let x = 400;
    let y = 50;
    let parent = null;
    let horizontalSpacing = 150;

    while (current) {
      parent = current;
      y += 100;
      
      if (value < parseInt(current.value)) {
        x -= horizontalSpacing;
        current = nodes.find(n => n.parent === current.id && n.isLeft);
      } else {
        x += horizontalSpacing;
        current = nodes.find(n => n.parent === current.id && !n.isLeft);
      }
      
      horizontalSpacing = Math.max(50, horizontalSpacing * 0.8);
    }

    return { x, y, parent: parent.id, isLeft: value < parseInt(parent.value) };
  };

  const addNode = () => {
    if (!nodeValue.trim() || isNaN(parseInt(nodeValue))) {
      alert("Please enter a valid number");
      return;
    }

    const value = parseInt(nodeValue);
    
    // Check if value already exists
    if (nodes.some(node => parseInt(node.value) === value)) {
      alert("This value already exists in the tree");
      return;
    }

    const position = findNodePosition(value);
    const newNode = {
      id: Date.now(),
      value: nodeValue,
      x: position.x,
      y: position.y,
      parent: position.parent,
      isLeft: position.isLeft
    };

    if (position.parent !== null) {
      const parentNode = nodes.find(n => n.id === position.parent);
      const { length, angle } = calculateLineMetrics(
        parentNode.x,
        parentNode.y,
        newNode.x,
        newNode.y
      );

      const newLine = {
        id: `${parentNode.id}-${newNode.id}`,
        startNode: parentNode.id,
        endNode: newNode.id,
        startX: parentNode.x,
        startY: parentNode.y,
        endX: newNode.x,
        endY: newNode.y,
        angle,
        length
      };
      setLines([...lines, newLine]);
    }

    setNodes([...nodes, newNode]);
    setNodeValue('');
  };

  const constrainNodePosition = (node, newX, newY) => {
    const parent = findParentNode(node.id);
    if (!parent) return { x: newX, y: newY }; // Root node can move freely

    const isLeft = isLeftChild(node);
    const minDistance = 50;
    const maxDistance = 250;

    let constrainedX = newX;
    if (isLeft) {
      constrainedX = Math.min(parent.x - minDistance, Math.max(parent.x - maxDistance, newX));
    } else {
      constrainedX = Math.max(parent.x + minDistance, Math.min(parent.x + maxDistance, newX));
    }

    return { x: constrainedX, y: newY };
  };

  const handleDrag = (e) => {
    if (!svgRef.current) return;

    if (draggingNode) {
      const rect = svgRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      const { x, y } = constrainNodePosition(draggingNode, rawX, rawY);

      const updatedNodes = nodes.map(node =>
        node.id === draggingNode.id ? { ...node, x, y } : node
      );
      setNodes(updatedNodes);

      const updatedLines = lines.map(line => {
        if (line.startNode === draggingNode.id) {
          const { length, angle } = calculateLineMetrics(x, y, line.endX, line.endY);
          return { ...line, startX: x, startY: y, length, angle };
        }
        if (line.endNode === draggingNode.id) {
          const { length, angle } = calculateLineMetrics(line.startX, line.startY, x, y);
          return { ...line, endX: x, endY: y, length, angle };
        }
        return line;
      });
      setLines(updatedLines);
    }
  };

  const handleNodeDragStart = (node, e) => {
    e.stopPropagation();
    setDraggingNode(node);
  };

  const handleDragEnd = () => {
    setDraggingNode(null);
  };

  // Traversal algorithms
  // const inorderTraversal = (nodeId, order = []) => {
  //   if (!nodeId) return order;

  //   const node = nodes.find((n) => n.id === nodeId);
  //   if (!node) return order;

  //   const leftChild = nodes.find((n) => n.parent === node.id && n.isLeft);
  //   const rightChild = nodes.find((n) => n.parent === node.id && !n.isLeft);

  //   if (leftChild) inorderTraversal(leftChild.id, order);
  //   order.push(nodeId);
  //   if (rightChild) inorderTraversal(rightChild.id, order);

  //   return order;
  // };

  // const preorderTraversal = (nodeId, order = []) => {
  //   if (!nodeId) return order;

  //   const node = nodes.find((n) => n.id === nodeId);
  //   if (!node) return order;

  //   order.push(nodeId);

  //   const leftChild = nodes.find((n) => n.parent === node.id && n.isLeft);
  //   const rightChild = nodes.find((n) => n.parent === node.id && !n.isLeft);

  //   if (leftChild) preorderTraversal(leftChild.id, order);
  //   if (rightChild) preorderTraversal(rightChild.id, order);

  //   return order;
  // };

  // const postorderTraversal = (nodeId, order = []) => {
  //   if (!nodeId) return order;

  //   const node = nodes.find((n) => n.id === nodeId);
  //   if (!node) return order;

  //   const leftChild = nodes.find((n) => n.parent === node.id && n.isLeft);
  //   const rightChild = nodes.find((n) => n.parent === node.id && !n.isLeft);

  //   if (leftChild) postorderTraversal(leftChild.id, order);
  //   if (rightChild) postorderTraversal(rightChild.id, order);

  //   order.push(nodeId);

  //   return order;
  // };

  // Visualization logic
  const startTraversal = (type) => {
    let order = [];
    const root = nodes.find((n) => n.parent === null);
    if (root) {
      if (type === 'inorder') {
        order = inorderTraversal(root.id, nodes);
      } else if (type === 'preorder') {
        order = preorderTraversal(root.id, nodes);
      } else if (type === 'postorder') {
        order = postorderTraversal(root.id, nodes);
      }
    }
    setTraversalOrder(order);
    setCurrentTraversalIndex(0);
  };

  // Automatically update traversal visualization
  useEffect(() => {
    if (currentTraversalIndex !== null && currentTraversalIndex < traversalOrder.length) {
      const timeout = setTimeout(() => {
        setCurrentTraversalIndex((index) => index + 1);
      }, 1000); // 1-second delay between each step

      return () => clearTimeout(timeout);
    }
  }, [currentTraversalIndex, traversalOrder]);

  return (
    <div className="w-full h-screen bg-gray-100 p-4">
      {/* Control Panel */}
      <div className="mb-4 flex gap-4 items-center bg-white p-4 rounded-lg shadow">
        <input
          type="number"
          value={nodeValue}
          onChange={(e) => setNodeValue(e.target.value)}
          placeholder="Enter number"
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addNode}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Add Node
        </button>
        <button
          onClick={() => startTraversal('inorder')}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
        >
          Visualize Inorder Traversal
        </button>
        <button
          onClick={() => startTraversal('preorder')}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
        >
          Visualize Preorder Traversal
        </button>
        <button
          onClick={() => startTraversal('postorder')}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md"
        >
          Visualize Postorder Traversal
        </button>
      </div>

      {/* Tree Visualization */}
      <div className="bg-white rounded-lg shadow p-4 h-[calc(100vh-120px)]">
        <svg
          ref={svgRef}
          className="w-full h-full"
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {/* Lines */}
          {lines.map((line) => (
            <g key={line.id}>
              <line
                x1={line.startX}
                y1={line.startY}
                x2={line.endX}
                y2={line.endY}
                stroke="black"
                strokeWidth="2"
                className="cursor-move"
              />
            </g>
          ))}

          {/* Nodes */}
          {nodes.map((node, index) => (
            <g
              key={node.id}
              transform={`translate(${node.x},${node.y})`}
              onMouseDown={(e) => handleNodeDragStart(node, e)}
              className="cursor-move"
            >
              <circle
                r="25"
                fill={traversalOrder[currentTraversalIndex] === node.id ? '#34D399' : '#fff'}
                stroke="#2563EB"
                strokeWidth="2"
              />
              <text
                textAnchor="middle"
                dy=".3em"
                className="select-none pointer-events-none"
              >
                {node.value}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default BinarySearchTree;
