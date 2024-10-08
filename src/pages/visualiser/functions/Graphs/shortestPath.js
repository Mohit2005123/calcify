export const dijkstra = async (start, end, nodes, edges) => {
    const graph = buildGraph(nodes, edges);
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();
    const visitedOrder = [];
  
    nodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
    });
  
    distances[start] = 0;
    pq.enqueue(start, 0);
  
    while (!pq.isEmpty()) {
      const current = pq.dequeue().element;
      visitedOrder.push(current);
  
      if (current === end) break;
  
      if (!graph[current]) continue;
  
      for (let neighbor in graph[current]) {
        const distance = distances[current] + graph[current][neighbor];
        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          previous[neighbor] = current;
          pq.enqueue(neighbor, distance);
        }
      }
  
      await new Promise(resolve => setTimeout(resolve, 100)); // For visualization
    }
  
    const path = [];
    let current = end;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
  
    return { path, visitedOrder };
  };
  
  const buildGraph = (nodes, edges) => {
    const graph = {};
    edges.forEach(edge => {
      if (!graph[edge.from]) graph[edge.from] = {};
      if (!graph[edge.to]) graph[edge.to] = {};
      graph[edge.from][edge.to] = edge.weight;
      graph[edge.to][edge.from] = edge.weight; // Assuming undirected graph
    });
    return graph;
  };
  
  class PriorityQueue {
    constructor() {
      this.elements = [];
    }
  
    enqueue(element, priority) {
      this.elements.push({ element, priority });
      this.elements.sort((a, b) => a.priority - b.priority);
    }
  
    dequeue() {
      return this.elements.shift();
    }
  
    isEmpty() {
      return this.elements.length === 0;
    }
  }
  export const bellmanFord = async (startNode, endNode, nodes, edges, setHighlightedNodes, setHighlightedEdges) => {
    const distances = {};
    const previousNodes = {};
    const visitedOrder = [];
  
    // Initialize distances
    nodes.forEach(node => {
      distances[node.id] = Infinity;
    });
    distances[startNode] = 0;
  
    // Relax edges |V| - 1 times
    for (let i = 0; i < nodes.length - 1; i++) {
      for (let edge of edges) {
        const u = edge.from;
        const v = edge.to;
        const weight = edge.weight;
  
        // Highlight the nodes and edges being processed
        setHighlightedNodes(prev => [...prev, u, v]);
        setHighlightedEdges(prev => [...prev, edge.id]);
        await new Promise(resolve => setTimeout(resolve, 500));
  
        if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
          distances[v] = distances[u] + weight;
          previousNodes[v] = u;
          visitedOrder.push(v);
        }
      }
    }
  
    // Check for negative weight cycles
    for (let edge of edges) {
      const u = edge.from;
      const v = edge.to;
      const weight = edge.weight;
  
      if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        throw new Error("Graph contains negative weight cycle");
      }
    }
  
    // Reconstruct path if endNode is specified
    const path = [];
    if (endNode !== null) {
      let current = endNode;
      while (current !== undefined) {
        path.unshift(current);
        current = previousNodes[current];
      }
    }
  
    return {
      distances,
      path,
      visitedOrder
    };
  };