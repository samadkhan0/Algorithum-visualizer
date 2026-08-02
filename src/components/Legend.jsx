const ITEMS = {
  sorting: [
    ["var(--compare)", "comparing"],
    ["var(--swap)", "swapping"],
    ["var(--visited)", "pivot / min"],
    ["var(--visited-dim)", "sorted"],
  ],
  searching: [
    ["var(--compare)", "checking"],
    ["var(--signal)", "found"],
    ["var(--line-soft)", "eliminated range"],
  ],
  graphs: [
    ["var(--signal)", "current"],
    ["var(--visited)", "visited / settled"],
    ["var(--compare)", "edge examined"],
  ],
  dp: [
    ["var(--signal)", "current cell"],
    ["var(--compare)", "dependency cell"],
  ],
};

export default function Legend({ category }) {
  const items = ITEMS[category] || [];
  return (
    <div className="legend">
      {items.map(([color, label]) => (
        <span className="legend-item" key={label}>
          <span className="legend-dot" style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}
