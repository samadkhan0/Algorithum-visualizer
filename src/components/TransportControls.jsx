export default function TransportControls({ runner }) {
  const { playing, toggle, stepBack, stepForward, reset, index, total, seek, speed, setSpeed, isDone } = runner;
  return (
    <div className="controls-bar">
      <button className="btn" onClick={reset} aria-label="Reset to start">⟲ Reset</button>
      <button className="btn" onClick={stepBack} disabled={index === 0} aria-label="Step back">◂ Step</button>
      <button className="btn btn-primary" onClick={toggle} disabled={isDone && !playing}>
        {playing ? "❚❚ Pause" : "▶ Play"}
      </button>
      <button className="btn" onClick={stepForward} disabled={isDone} aria-label="Step forward">Step ▸</button>
      <input
        className="scrubber"
        type="range"
        min={0}
        max={Math.max(total - 1, 0)}
        value={index}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label="Scrub through steps"
      />
      <label className="field" style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <span>Speed</span>
        <input
          type="range" min={0.25} max={4} step={0.25}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          style={{ width: 80, accentColor: "var(--signal)" }}
        />
        <span className="mono" style={{ width: 32 }}>{speed}×</span>
      </label>
    </div>
  );
}
