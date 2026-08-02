export default function ArrayBars({ step }) {
  if (!step?.array) return <div className="mono" style={{ color: "var(--muted)" }}>no data</div>;
  const { array, compare, swap, sorted, pivot, found, range } = step;
  const max = Math.max(...array, 1);

  const colorFor = (i) => {
    if (found === i) return "var(--signal)";
    if (swap && (i === swap[0] || i === swap[1])) return "var(--swap)";
    if (compare && (i === compare[0] || i === compare[1])) return "var(--compare)";
    if (pivot === i) return "var(--visited)";
    if (sorted && sorted.includes(i)) return "var(--visited-dim)";
    if (range && (i < range[0] || i > range[1])) return "var(--line-soft)";
    return "var(--line)";
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="bars">
        {array.map((v, i) => (
          <div
            key={i}
            className="bar"
            style={{ height: `${(v / max) * 100}%`, background: colorFor(i) }}
          >
            {array.length <= 30 && <span className="bar-label">{v}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
