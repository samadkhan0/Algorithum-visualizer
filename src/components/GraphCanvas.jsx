export default function GraphCanvas({ graph, step, weighted }) {
  if (!graph) return null;
  const { nodes, edges } = graph;
  const visited = new Set(step?.visited || []);
  const current = step?.current;
  const activeEdge = step?.edge;
  const dist = step?.dist;

  const nodeColor = (id) => {
    if (id === current) return "var(--signal)";
    if (visited.has(id)) return "var(--visited)";
    return "var(--panel-alt)";
  };
  const nodeStroke = (id) => (id === current ? "var(--signal)" : visited.has(id) ? "var(--visited)" : "var(--line)");
  const nodeTextColor = (id) => (visited.has(id) || id === current ? "var(--bg)" : "var(--muted-2)");

  const isActiveEdge = (a, b) =>
    activeEdge && ((activeEdge[0] === a && activeEdge[1] === b) || (activeEdge[0] === b && activeEdge[1] === a));

  const pos = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <svg className="graph-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      {edges.map((e) => {
        const a = pos[e.source], b = pos[e.target];
        const active = isActiveEdge(e.source, e.target);
        return (
          <g key={e.id}>
            <line
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={active ? "var(--compare)" : "var(--line)"}
              strokeWidth={active ? 0.9 : 0.5}
            />
            {weighted && (
              <text
                className="graph-edge-label"
                x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 1.5}
              >
                {e.weight}
              </text>
            )}
          </g>
        );
      })}
      {nodes.map((n) => (
        <g key={n.id} className="graph-node">
          <circle cx={n.x} cy={n.y} r="4.2" fill={nodeColor(n.id)} stroke={nodeStroke(n.id)} strokeWidth="0.6" />
          <text x={n.x} y={n.y + 1.4} textAnchor="middle" fill={nodeTextColor(n.id)}>{n.id}</text>
          {weighted && dist && (
            <text x={n.x} y={n.y - 6} textAnchor="middle" className="graph-edge-label">
              {dist[n.id] === Infinity ? "\u221e" : dist[n.id]}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
