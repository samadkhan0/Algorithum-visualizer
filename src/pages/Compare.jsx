import { useEffect, useMemo, useRef, useState } from "react";
import { allAlgorithms } from "../algorithms";
import { materializeSteps, randomArray } from "../utils";
import ArrayBars from "../components/ArrayBars";
import Legend from "../components/Legend";

const COMPARABLE_CATEGORIES = ["sorting", "searching"];

export default function Compare() {
  const [category, setCategory] = useState("sorting");
  const options = useMemo(
    () => allAlgorithms.filter((a) => a.category === category),
    [category]
  );

  const [idA, setIdA] = useState(options[0]?.id);
  const [idB, setIdB] = useState(options[1]?.id ?? options[0]?.id);

  // when category changes, reset selections to valid ones for that category
  useEffect(() => {
    setIdA(options[0]?.id);
    setIdB(options[1]?.id ?? options[0]?.id);
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  const algoA = options.find((a) => a.id === idA) || options[0];
  const algoB = options.find((a) => a.id === idB) || options[0];

  const [size, setSize] = useState(20);
  const [seed, setSeed] = useState(0);
  const [target, setTarget] = useState(null);

  const base = useMemo(() => randomArray(size), [size, seed, category]);
  const defaultTarget = useMemo(() => base[Math.floor(Math.random() * base.length)], [base]);
  const effectiveTarget = target ?? defaultTarget;

  const needsTarget = algoA?.needsTarget || algoB?.needsTarget;

  const dataA = useMemo(
    () => materializeSteps(algoA.run(base, algoA.needsTarget ? effectiveTarget : undefined)),
    [algoA, base, effectiveTarget]
  );
  const dataB = useMemo(
    () => materializeSteps(algoB.run(base, algoB.needsTarget ? effectiveTarget : undefined)),
    [algoB, base, effectiveTarget]
  );

  const maxLen = Math.max(dataA.steps.length, dataB.steps.length);
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef(null);

  useEffect(() => { setTick(0); setPlaying(false); }, [dataA, dataB]);

  useEffect(() => {
    if (!playing) { clearInterval(timerRef.current); return; }
    if (tick >= maxLen - 1) { setPlaying(false); return; }
    const intervalMs = Math.max(15, 220 / speed);
    timerRef.current = setInterval(() => {
      setTick((t) => (t >= maxLen - 1 ? (setPlaying(false), t) : t + 1));
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [playing, speed, maxLen, tick >= maxLen - 1]); // eslint-disable-line react-hooks/exhaustive-deps

  const idxA = Math.min(tick, dataA.steps.length - 1);
  const idxB = Math.min(tick, dataB.steps.length - 1);
  const doneA = idxA >= dataA.steps.length - 1;
  const doneB = idxB >= dataB.steps.length - 1;

  const randomize = () => { setSeed((s) => s + 1); setTarget(null); };

  return (
    <div>
      <div className="topbar">
        <h1>Compare</h1>
        <div className="topbar-complexity">
          <label className="field" style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <span>Category</span>
            <select className="compare-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {COMPARABLE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="content">
        <div className="controls-bar panel" style={{ marginBottom: 18 }}>
          <label className="field">
            <span>Array size ({size})</span>
            <input type="range" min={4} max={60} value={size} onChange={(e) => setSize(Number(e.target.value))} />
          </label>
          {needsTarget && (
            <label className="field">
              <span>Target value</span>
              <input type="number" value={effectiveTarget} onChange={(e) => setTarget(Number(e.target.value))} />
            </label>
          )}
          <button className="btn" onClick={randomize}>⤾ New random input (shared)</button>
          <button className="btn" onClick={() => setTick(0)}>⟲ Reset</button>
          <button className="btn btn-primary" onClick={() => setPlaying((p) => !p)} disabled={tick >= maxLen - 1 && !playing}>
            {playing ? "❚❚ Pause" : "▶ Play both"}
          </button>
          <input
            className="scrubber" type="range" min={0} max={Math.max(maxLen - 1, 0)} value={tick}
            onChange={(e) => setTick(Number(e.target.value))}
          />
          <label className="field" style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <span>Speed</span>
            <input type="range" min={0.25} max={4} step={0.25} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: 80 }} />
            <span className="mono" style={{ width: 32 }}>{speed}×</span>
          </label>
        </div>

        <div className="compare-grid">
          {[{ algo: algoA, setId: setIdA, other: idB, data: dataA, idx: idxA, done: doneA },
            { algo: algoB, setId: setIdB, other: idA, data: dataB, idx: idxB, done: doneB }].map((slot, i) => (
            <div className="panel" key={i}>
              <div className="compare-head">
                <select
                  className="compare-select"
                  value={slot.algo.id}
                  onChange={(e) => slot.setId(e.target.value)}
                >
                  {options.map((a) => <option key={a.id} value={a.id} disabled={a.id === slot.other}>{a.name}</option>)}
                </select>
                <div className="compare-complexity">
                  <span>avg <b>{slot.algo.complexity.avg}</b></span>
                  <span>worst <b>{slot.algo.complexity.worst}</b></span>
                </div>
              </div>
              <Legend category={category} />
              <div className="stage"><ArrayBars step={slot.data.steps[slot.idx]} /></div>
              <div className="stats">
                <div className="stat">
                  <div className="stat-label">Comparisons</div>
                  <div className="stat-value signal">{slot.data.comparisons[slot.idx]}</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Swaps / Writes</div>
                  <div className="stat-value">{slot.data.swaps[slot.idx]}</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Total steps to finish</div>
                  <div className="stat-value">{slot.data.steps.length}</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Status</div>
                  <div className="stat-value" style={{ fontSize: 13, color: slot.done ? "var(--signal)" : "var(--muted-2)" }}>
                    {slot.done ? "finished" : "running…"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 16, maxWidth: 640 }}>
          Both algorithms run on the identical input. Playback advances a shared step
          counter — whichever algorithm needs fewer total steps finishes first, which is
          the empirical version of the complexity numbers shown above each panel.
        </p>
      </div>
    </div>
  );
}
