
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const traverseInOrder = async (root, setHighlightedNodes) => {
  if (!root) return [];
  const result = [];
  const stack = [];
  let current = root;

  while (current || stack.length) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();
    result.push(current.id);
    setHighlightedNodes([current.id]);
    await sleep(1000);
    current = current.right;
  }
  return result;
};

export const traversePreOrder = async (root, setHighlightedNodes) => {
  if (!root) return [];
  const result = [];
  const stack = [root];

  while (stack.length) {
    const node = stack.pop();
    result.push(node.id);
    setHighlightedNodes([node.id]);
    await sleep(1000);
    
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return result;
};

export const traversePostOrder = async (root, setHighlightedNodes) => {
  if (!root) return [];
  const result = [];
  const stack1 = [root];
  const stack2 = [];

  while (stack1.length) {
    const node = stack1.pop();
    stack2.push(node);
    
    if (node.left) stack1.push(node.left);
    if (node.right) stack1.push(node.right);
  }

  while (stack2.length) {
    const node = stack2.pop();
    result.push(node.id);
    setHighlightedNodes([node.id]);
    await sleep(1000);
  }
  return result;
};

export const traverseLevelOrder = async (root, setHighlightedNodes) => {
    if (!root) return;
    
    const queue = [root];
    const highlighted = [];
    
    while (queue.length > 0) {
      const currentNode = queue.shift();  // Dequeue the front of the queue
      highlighted.push(currentNode.id);   // Highlight the current node
      setHighlightedNodes([...highlighted]);
  
      // Simulate animation delay
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      if (currentNode.left) queue.push(currentNode.left);  // Enqueue the left child
      if (currentNode.right) queue.push(currentNode.right); // Enqueue the right child
    }
  };
  