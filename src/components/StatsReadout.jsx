export default function StatsReadout({ comparisons, swaps, index, total }) {
  return (
    <div className="stats">
      <div className="stat">
        <div className="stat-label">Comparisons</div>
        <div className="stat-value signal">{comparisons}</div>
      </div>
      <div className="stat">
        <div className="stat-label">Swaps / Writes</div>
        <div className="stat-value">{swaps}</div>
      </div>
      <div className="stat">
        <div className="stat-label">Step</div>
        <div className="stat-value">{index + 1}<span style={{ color: "var(--muted)", fontSize: 13 }}> / {total}</span></div>
      </div>
      <div className="stat">
        <div className="stat-label">Elapsed (≈ time)</div>
        <div className="stat-value">{index + 1}<span style={{ color: "var(--muted)", fontSize: 13 }}> ops</span></div>
      </div>
    </div>
  );
}
