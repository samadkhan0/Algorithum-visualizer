<div align="center">

# ⇄ Algorithm Visualizer

**An interactive React app for visualizing algorithms step by step — built for a
Design & Analysis of Algorithms (DAA) semester project.**

[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

<!-- Replace with an actual screenshot or GIF of the app before publishing -->
<!-- ![Algorithm Visualizer screenshot](./docs/screenshot.png) -->

</div>

---

## Overview

Algorithm Visualizer renders sorting, searching, graph, and dynamic programming
algorithms as animated, step-by-step traces. Every step is synced to the exact
line of pseudocode driving it — like stepping through a debugger — with a live
readout of comparisons, swaps, and total steps so the *analysis* side of the
course is as visible as the algorithm itself.

## Features

- **12 algorithms** across four categories — sorting, searching, graphs, and
  dynamic programming (full list below)
- **Pseudocode debugger view** — the active line highlights in sync with the
  animation on screen
- **Live stats** — running comparison and swap/write counters, current step,
  and total steps for every run
- **Complexity reference** — best / average / worst-case time and space
  complexity shown for every algorithm
- **Full playback controls** — play, pause, step forward/back, scrub to any
  step, and adjustable speed
- **Compare view** — run two algorithms of the same category on an identical
  input side by side and watch their step counts diverge in real time
- **Randomizable inputs** — array size, target values, graph size/start node,
  knapsack items, and LCS strings are all adjustable
- Zero backend — a static single-page app, deployable anywhere that serves
  static files

## Algorithms covered

| Category | Algorithms | Complexity range (avg case) |
|---|---|---|
| Sorting | Bubble, Selection, Insertion, Merge, Quick | O(n²) → O(n log n) |
| Searching | Linear, Binary | O(n) → O(log n) |
| Graphs | BFS, DFS, Dijkstra's Shortest Path | O(V + E) → O(V²) |
| Dynamic Programming | Fibonacci (tabulation), 0/1 Knapsack, Longest Common Subsequence | O(n) → O(n·m) |

## Tech stack

- [React 19](https://react.dev) with [React Router](https://reactrouter.com)
- [Vite](https://vitejs.dev) for dev server and bundling
- Plain CSS (custom properties for theming, no UI framework)
- No external state library — algorithms are plain JS generator functions,
  driven by a single custom hook

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 18 or later
- npm (bundled with Node)

### Installation

```bash
git clone https://github.com/<your-username>/algorithm-visualizer.git
cd algorithm-visualizer
npm install
```

### Run locally

```bash
npm run dev
```

Open the URL Vite prints (usually [http://localhost:5173](http://localhost:5173)).

### Build for production

```bash
npm run build      # outputs static files to dist/
npm run preview    # serve the production build locally
```

### Lint

```bash
npm run lint
```

## How it works

Each algorithm in `src/algorithms/` is written as a JavaScript **generator
function** that `yield`s a small "step" object describing the array, graph, or
table's state at that instant, plus which pseudocode line produced it:

```js
function* bubbleSort(input) {
  const arr = [...input];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      yield { array: [...arr], compare: [j, j + 1], line: 2 };
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { array: [...arr], swap: [j, j + 1], line: 3 };
      }
    }
  }
}
```

A shared `useStepRunner` hook (`src/hooks/useStepRunner.js`) eagerly
materializes all steps from the generator, then drives playback — play,
pause, step, scrub, speed — and derives cumulative comparison/swap counts
along the way. The visual components (`ArrayBars`, `GraphCanvas`, `DPTable`)
are generic: they just render whatever the current step describes, with no
algorithm-specific logic.

This design means adding a new algorithm doesn't touch the UI at all — write
a generator, a pseudocode array, and a complexity object, then register it in
`src/algorithms/index.js`.

## Project structure

```
src/
├── algorithms/          # algorithm generators, pseudocode, complexity metadata
│   ├── sorting.js
│   ├── searching.js
│   ├── graphs.js
│   ├── dp.js
│   └── index.js         # registry: categories + algorithmsByCategory
├── components/           # visualizers (ArrayBars, GraphCanvas, DPTable) + shared UI
├── hooks/
│   └── useStepRunner.js  # playback engine: play/pause/scrub/speed/counters
├── pages/
│   ├── Home.jsx
│   ├── Workbench.jsx     # per-category input controls + layout
│   └── Compare.jsx       # side-by-side comparison view
├── utils.js
├── App.jsx
└── main.jsx
```

## Roadmap / ideas for extending

- [ ] Heap Sort and Radix Sort
- [ ] A* and Bellman-Ford for the graphs category
- [ ] Extend the Compare view to graphs and DP algorithms
- [ ] Chart step count vs. input size to plot empirical complexity curves
- [ ] Export a run's trace (steps, counters) as JSON or CSV for a lab report

Contributions and forks for coursework are welcome — open an issue or a pull
request if you add an algorithm or fix a bug.

## License

This project is licensed under the MIT License — see [LICENSE](./LICENSE) for
details.
 
 ## Author
   
   Abdul Samad
   
