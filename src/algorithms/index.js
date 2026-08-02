import { sortingAlgorithms } from "./sorting";
import { searchingAlgorithms } from "./searching";
import { graphAlgorithms } from "./graphs";
import { dpAlgorithms } from "./dp";

export const categories = [
  { id: "sorting", label: "Sorting", blurb: "Reorder an array in place, step by step." },
  { id: "searching", label: "Searching", blurb: "Locate a target value within an array." },
  { id: "graphs", label: "Graphs", blurb: "Traverse or find shortest paths on a graph." },
  { id: "dp", label: "Dynamic Programming", blurb: "Build a solution table from subproblems." },
];

export const allAlgorithms = [
  ...sortingAlgorithms,
  ...searchingAlgorithms,
  ...graphAlgorithms,
  ...dpAlgorithms,
];

export const algorithmsByCategory = Object.fromEntries(
  categories.map((c) => [c.id, allAlgorithms.filter((a) => a.category === c.id)])
);
