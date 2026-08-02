// Generates a random connected graph laid out in a circle-ish scatter,
// spanning tree first (guarantees connectivity) then a few extra edges.
export function generateGraph(nodeCount = 8, extraEdgeChance = 0.25) {
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (2 * Math.PI * i) / nodeCount;
    const jitter = 0.75 + Math.random() * 0.25;
    return {
      id: i,
      x: 50 + 42 * jitter * Math.cos(angle),
      y: 50 + 42 * jitter * Math.sin(angle),
    };
  });

  const edges = [];
  const edgeKey = (a, b) => `${Math.min(a, b)}-${Math.max(a, b)}`;
  const existing = new Set();

  // random spanning tree so the graph is always connected
  const shuffled = [...Array(nodeCount).keys()].sort(() => Math.random() - 0.5);
  for (let i = 1; i < shuffled.length; i++) {
    const a = shuffled[i];
    const b = shuffled[Math.floor(Math.random() * i)];
    const w = 1 + Math.floor(Math.random() * 9);
    edges.push({ id: edgeKey(a, b), source: a, target: b, weight: w });
    existing.add(edgeKey(a, b));
  }

  // sprinkle a few extra edges for interesting traversals
  for (let a = 0; a < nodeCount; a++) {
    for (let b = a + 1; b < nodeCount; b++) {
      if (!existing.has(edgeKey(a, b)) && Math.random() < extraEdgeChance) {
        const w = 1 + Math.floor(Math.random() * 9);
        edges.push({ id: edgeKey(a, b), source: a, target: b, weight: w });
        existing.add(edgeKey(a, b));
      }
    }
  }

  const adjacency = Object.fromEntries(nodes.map((n) => [n.id, []]));
  edges.forEach(({ source, target, weight }) => {
    adjacency[source].push({ to: target, weight });
    adjacency[target].push({ to: source, weight });
  });

  return { nodes, edges, adjacency };
}

function* bfs({ adjacency }, start) {
  const visited = new Set([start]);
  const queue = [start];
  yield { visited: [...visited], frontier: [...queue], current: null, line: 1 };
  while (queue.length) {
    const u = queue.shift();
    yield { visited: [...visited], frontier: [...queue], current: u, line: 3 };
    for (const { to: v } of adjacency[u]) {
      yield { visited: [...visited], frontier: [...queue], current: u, edge: [u, v], line: 4 };
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
        yield { visited: [...visited], frontier: [...queue], current: u, edge: [u, v], line: 5, note: `visit ${v}` };
      }
    }
  }
  yield { visited: [...visited], frontier: [], current: null, line: 7, note: "done" };
}

function* dfs({ adjacency }, start) {
  const visited = new Set();
  function* walk(u, path) {
    visited.add(u);
    yield { visited: [...visited], frontier: [...path], current: u, line: 2, note: `visit ${u}` };
    for (const { to: v } of adjacency[u]) {
      yield { visited: [...visited], frontier: [...path], current: u, edge: [u, v], line: 3 };
      if (!visited.has(v)) {
        yield* walk(v, [...path, v]);
      }
    }
  }
  yield* walk(start, [start]);
  yield { visited: [...visited], frontier: [], current: null, line: 5, note: "done" };
}

function* dijkstra({ adjacency, nodes }, start) {
  const dist = Object.fromEntries(nodes.map((n) => [n.id, Infinity]));
  dist[start] = 0;
  const visited = new Set();
  const remaining = new Set(nodes.map((n) => n.id));

  yield { visited: [], dist: { ...dist }, current: null, line: 1 };

  while (remaining.size) {
    let u = null;
    for (const id of remaining) {
      if (u === null || dist[id] < dist[u]) u = id;
    }
    if (dist[u] === Infinity) break;
    remaining.delete(u);
    visited.add(u);
    yield { visited: [...visited], dist: { ...dist }, current: u, line: 3, note: `settle ${u}` };

    for (const { to: v, weight } of adjacency[u]) {
      yield { visited: [...visited], dist: { ...dist }, current: u, edge: [u, v], line: 5 };
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        yield { visited: [...visited], dist: { ...dist }, current: u, edge: [u, v], line: 6, note: `relax ${v} -> ${dist[v]}` };
      }
    }
  }
  yield { visited: [...visited], dist: { ...dist }, current: null, line: 8, note: "done" };
}

export const graphAlgorithms = [
  {
    id: "bfs", name: "Breadth-First Search", category: "graphs",
    pseudocode: [
      "queue = [start]; visited = {start}",
      "while queue not empty:",
      "  u = queue.pop_front()",
      "  for v in adjacency[u]:",
      "    if v not visited:",
      "      visited.add(v); queue.push(v)",
      "  # explores level by level",
      "return visited",
    ],
    complexity: { best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
    run: bfs,
  },
  {
    id: "dfs", name: "Depth-First Search", category: "graphs",
    pseudocode: [
      "visit(u):",
      "  visited.add(u)",
      "  for v in adjacency[u]:",
      "    if v not visited: visit(v)",
      "  # backtrack",
      "return visited",
    ],
    complexity: { best: "O(V+E)", avg: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
    run: dfs,
  },
  {
    id: "dijkstra", name: "Dijkstra's Shortest Path", category: "graphs",
    pseudocode: [
      "dist[start] = 0, else Infinity",
      "while unvisited remains:",
      "  u = unvisited node with min dist",
      "  mark u visited",
      "  for (v, w) in adjacency[u]:",
      "    if dist[u]+w < dist[v]: relax",
      "  # repeat until all settled",
      "return dist",
    ],
    complexity: { best: "O(V²)", avg: "O(V² or E log V)", worst: "O(V²)", space: "O(V)" },
    run: dijkstra,
  },
];
