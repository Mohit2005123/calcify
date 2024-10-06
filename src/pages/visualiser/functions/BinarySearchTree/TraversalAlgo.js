// traversals.js
export const inorderTraversal = async (node, setHighlightedNodes, visited = new Set()) => {
    if (!node) return;
  
    await inorderTraversal(node.left, setHighlightedNodes, visited);
    if (!visited.has(node.id)) {
      setHighlightedNodes([node.id]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      visited.add(node.id);
    }
    await inorderTraversal(node.right, setHighlightedNodes, visited);
  };
  
  export const preorderTraversal = async (node, setHighlightedNodes, visited = new Set()) => {
    if (!node) return;
  
    if (!visited.has(node.id)) {
      setHighlightedNodes([node.id]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      visited.add(node.id);
    }
    await preorderTraversal(node.left, setHighlightedNodes, visited);
    await preorderTraversal(node.right, setHighlightedNodes, visited);
  };
  
  export const postorderTraversal = async (node, setHighlightedNodes, visited = new Set()) => {
    if (!node) return;
  
    await postorderTraversal(node.left, setHighlightedNodes, visited);
    await postorderTraversal(node.right, setHighlightedNodes, visited);
    if (!visited.has(node.id)) {
      setHighlightedNodes([node.id]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      visited.add(node.id);
    }
  };
  
  export const levelOrderTraversal = async (root, setHighlightedNodes) => {
    if (!root) return;
  
    const queue = [root];
    const visited = new Set();
  
    while (queue.length > 0) {
      const node = queue.shift();
      if (!visited.has(node.id)) {
        setHighlightedNodes([node.id]);
        await new Promise(resolve => setTimeout(resolve, 1000));
        visited.add(node.id);
      }
  
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  };
  