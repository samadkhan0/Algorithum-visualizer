import { useMemo, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { allAlgorithms } from "../algorithms";
import { generateGraph } from "../algorithms/graphs";
import { useStepRunner } from "../hooks/useStepRunner";
import { randomArray, randomWord } from "../utils";
import ArrayBars from "../components/ArrayBars";
import GraphCanvas from "../components/GraphCanvas";
import DPTable from "../components/DPTable";
import PseudocodePanel from "../components/PseudocodePanel";
import StatsReadout from "../components/StatsReadout";
import TransportControls from "../components/TransportControls";
import Legend from "../components/Legend";

export default function Workbench() {
  const { algoId } = useParams();
  const algo = allAlgorithms.find((a) => a.id === algoId);
  if (!algo) return <Navigate to="/" replace />;

  switch (algo.category) {
    case "sorting":
      return <ArrayWorkbench algo={algo} mode="sort" />;
    case "searching":
      return <ArrayWorkbench algo={algo} mode="search" />;
    case "graphs":
      return <GraphWorkbench algo={algo} />;
    case "dp":
      return <DPWorkbench algo={algo} />;
    default:
      return null;
  }
}

// ---------------- Sorting / Searching ----------------
function ArrayWorkbench({ algo, mode }) {
  const [size, setSize] = useState(16);
  const [seed, setSeed] = useState(0);
  const [target, setTarget] = useState(null);

  const base = useMemo(() => randomArray(size), [size, seed, algo.id]);
  const defaultTarget = useMemo(() => base[Math.floor(Math.random() * base.length)], [base]);
  const effectiveTarget = target ?? defaultTarget;

  const runner = useStepRunner(
    () => algo.run(base, algo.needsTarget ? effectiveTarget : undefined),
    [algo.id, base, effectiveTarget]
  );

  const randomize = () => { setSeed((s) => s + 1); setTarget(null); };

  return (
    <div>
      <div className="topbar">
        <h1>{algo.name}</h1>
        <div className="topbar-complexity">
          <span>best <b>{algo.complexity.best}</b></span>
          <span>avg <b>{algo.complexity.avg}</b></span>
          <span>worst <b>{algo.complexity.worst}</b></span>
          <span>space <b>{algo.complexity.space}</b></span>
        </div>
      </div>

      <div className="content">
        <div className="workbench-grid">
          <div className="panel">
            <div className="panel-header"><span>Visualization</span></div>
            <Legend category={algo.category} />
            <div className="stage"><ArrayBars step={runner.current} /></div>
            <div className="controls-bar">
              <label className="field">
                <span>Array size ({size})</span>
                <input type="range" min={4} max={60} value={size} onChange={(e) => setSize(Number(e.target.value))} />
              </label>
              {algo.needsTarget && (
                <label className="field">
                  <span>Target value</span>
                  <input
                    type="number" value={effectiveTarget}
                    onChange={(e) => setTarget(Number(e.target.value))}
                  />
                </label>
              )}
              <button className="btn" onClick={randomize}>⤾ New random input</button>
            </div>
            <TransportControls runner={runner} />
          </div>

          <div>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-header"><span>Pseudocode</span></div>
              <PseudocodePanel pseudocode={algo.pseudocode} activeLine={runner.current?.line} />
            </div>
            <div className="panel">
              <div className="panel-header"><span>Live Stats</span></div>
              <StatsReadout {...runner} />
              <div className="note-line mono">{runner.current?.note || ""}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- Graphs ----------------
function GraphWorkbench({ algo }) {
  const [nodeCount, setNodeCount] = useState(8);
  const [seed, setSeed] = useState(0);
  const [start, setStart] = useState(0);

  const graph = useMemo(() => generateGraph(nodeCount), [nodeCount, seed]);
  const weighted = algo.id === "dijkstra";
  const startNode = Math.min(start, nodeCount - 1);

  const runner = useStepRunner(() => algo.run(graph, startNode), [algo.id, graph, startNode]);

  return (
    <div>
      <div className="topbar">
        <h1>{algo.name}</h1>
        <div className="topbar-complexity">
          <span>best <b>{algo.complexity.best}</b></span>
          <span>avg <b>{algo.complexity.avg}</b></span>
          <span>worst <b>{algo.complexity.worst}</b></span>
          <span>space <b>{algo.complexity.space}</b></span>
        </div>
      </div>

      <div className="content">
        <div className="workbench-grid">
          <div className="panel">
            <div className="panel-header"><span>Visualization</span></div>
            <Legend category={algo.category} />
            <div className="stage"><GraphCanvas graph={graph} step={runner.current} weighted={weighted} /></div>
            <div className="controls-bar">
              <label className="field">
                <span>Nodes ({nodeCount})</span>
                <input type="range" min={5} max={14} value={nodeCount} onChange={(e) => setNodeCount(Number(e.target.value))} />
              </label>
              <label className="field">
                <span>Start node</span>
                <input
                  type="number" min={0} max={nodeCount - 1} value={startNode}
                  onChange={(e) => setStart(Number(e.target.value))}
                />
              </label>
              <button className="btn" onClick={() => setSeed((s) => s + 1)}>⤾ New random graph</button>
            </div>
            <TransportControls runner={runner} />
          </div>

          <div>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-header"><span>Pseudocode</span></div>
              <PseudocodePanel pseudocode={algo.pseudocode} activeLine={runner.current?.line} />
            </div>
            <div className="panel">
              <div className="panel-header"><span>Live Stats</span></div>
              <StatsReadout {...runner} />
              <div className="note-line mono">{runner.current?.note || ""}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- Dynamic Programming ----------------
function DPWorkbench({ algo }) {
  const [n, setN] = useState(10);
  const [capacity, setCapacity] = useState(12);
  const [itemCount, setItemCount] = useState(5);
  const [seedA, setSeedA] = useState("ABCBDAB");
  const [seedB, setSeedB] = useState("BDCABA");
  const [seed, setSeed] = useState(0);

  const items = useMemo(
    () => ({
      weights: Array.from({ length: itemCount }, () => 1 + Math.floor(Math.random() * 8)),
      values: Array.from({ length: itemCount }, () => 1 + Math.floor(Math.random() * 20)),
    }),
    [itemCount, seed]
  );

  let runnerArgs;
  if (algo.id === "fibonacci") runnerArgs = [n];
  else if (algo.id === "knapsack") runnerArgs = [items.weights, items.values, capacity];
  else runnerArgs = [seedA, seedB];

  const runner = useStepRunner(() => algo.run(...runnerArgs), [algo.id, ...runnerArgs]);

  return (
    <div>
      <div className="topbar">
        <h1>{algo.name}</h1>
        <div className="topbar-complexity">
          <span>best <b>{algo.complexity.best}</b></span>
          <span>avg <b>{algo.complexity.avg}</b></span>
          <span>worst <b>{algo.complexity.worst}</b></span>
          <span>space <b>{algo.complexity.space}</b></span>
        </div>
      </div>

      <div className="content">
        <div className="workbench-grid">
          <div className="panel">
            <div className="panel-header"><span>Visualization</span></div>
            <Legend category={algo.category} />
            <div className="stage"><DPTable step={runner.current} /></div>
            <div className="controls-bar">
              {algo.id === "fibonacci" && (
                <label className="field">
                  <span>n ({n})</span>
                  <input type="range" min={2} max={20} value={n} onChange={(e) => setN(Number(e.target.value))} />
                </label>
              )}
              {algo.id === "knapsack" && (
                <>
                  <label className="field">
                    <span>Items ({itemCount})</span>
                    <input type="range" min={2} max={8} value={itemCount} onChange={(e) => setItemCount(Number(e.target.value))} />
                  </label>
                  <label className="field">
                    <span>Capacity ({capacity})</span>
                    <input type="range" min={5} max={25} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
                  </label>
                  <button className="btn" onClick={() => setSeed((s) => s + 1)}>⤾ New random items</button>
                </>
              )}
              {algo.id === "lcs" && (
                <>
                  <label className="field">
                    <span>String A</span>
                    <input type="text" value={seedA} onChange={(e) => setSeedA(e.target.value.toUpperCase().slice(0, 10))} />
                  </label>
                  <label className="field">
                    <span>String B</span>
                    <input type="text" value={seedB} onChange={(e) => setSeedB(e.target.value.toUpperCase().slice(0, 10))} />
                  </label>
                  <button className="btn" onClick={() => { setSeedA(randomWord(6)); setSeedB(randomWord(6)); }}>⤾ Randomize</button>
                </>
              )}
            </div>
            <TransportControls runner={runner} />
          </div>

          <div>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-header"><span>Pseudocode</span></div>
              <PseudocodePanel pseudocode={algo.pseudocode} activeLine={runner.current?.line} />
            </div>
            <div className="panel">
              <div className="panel-header"><span>Live Stats</span></div>
              <StatsReadout {...runner} />
              <div className="note-line mono">{runner.current?.note || ""}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
