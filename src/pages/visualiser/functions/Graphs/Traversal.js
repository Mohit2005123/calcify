// algorithms.js
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const bfs = async (startNodeId, edges, setHighlightedNodes, setHighlightedEdges) => {
  const visited = new Set();
  const queue = [startNodeId];
  visited.add(startNodeId);

  while (queue.length > 0) {
    const currentId = queue.shift();
    setHighlightedNodes([currentId]);
    await sleep(1000);

    const connectedEdges = edges.filter(edge => 
      edge.from === currentId || edge.to === currentId
    );

    for (const edge of connectedEdges) {
      const neighborId = edge.from === currentId ? edge.to : edge.from;
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
        setHighlightedEdges(prev => [...prev, edge.id]);
        await sleep(500);
      }
    }
  }
};

export const dfs = async (startNodeId, edges, setHighlightedNodes, setHighlightedEdges, visited = new Set()) => {
  visited.add(startNodeId);
  setHighlightedNodes([startNodeId]);
  await sleep(1000);

  const connectedEdges = edges.filter(edge => 
    edge.from === startNodeId || edge.to === startNodeId
  );

  for (const edge of connectedEdges) {
    const neighborId = edge.from === startNodeId ? edge.to : edge.from;
    if (!visited.has(neighborId)) {
      setHighlightedEdges(prev => [...prev, edge.id]);
      await sleep(500);
      await dfs(neighborId, edges, setHighlightedNodes, setHighlightedEdges, visited);
    }
  }
};
