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