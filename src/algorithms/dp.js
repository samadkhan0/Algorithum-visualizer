// All DP steps share a shape: { table (2D grid, null = unfilled),
// current: [row,col], deps: [[row,col],...], rowLabels, colLabels, line }

function* fibonacci(n) {
  const table = [Array(n + 1).fill(null)];
  table[0][0] = 0;
  if (n >= 1) table[0][1] = 1;
  yield { table: [[...table[0]]], current: [0, 0], line: 1 };
  if (n >= 1) yield { table: [[...table[0]]], current: [0, 1], line: 1 };
  for (let i = 2; i <= n; i++) {
    yield { table: [[...table[0]]], current: [0, i], deps: [[0, i - 1], [0, i - 2]], line: 3 };
    table[0][i] = table[0][i - 1] + table[0][i - 2];
    yield { table: [[...table[0]]], current: [0, i], deps: [[0, i - 1], [0, i - 2]], line: 3, note: `fib(${i})=${table[0][i]}` };
  }
  yield { table: [[...table[0]]], current: null, line: 5, note: "done" };
}

function* knapsack01(weights, values, capacity) {
  const n = weights.length;
  const table = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  const rowLabels = ["-", ...weights.map((w, i) => `item ${i + 1} (w=${w}, v=${values[i]})`)];
  const colLabels = Array.from({ length: capacity + 1 }, (_, w) => w);

  yield { table: table.map((r) => [...r]), current: [0, 0], rowLabels, colLabels, line: 1 };

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      yield { table: table.map((r) => [...r]), current: [i, w], deps: [[i - 1, w]], rowLabels, colLabels, line: 3 };
      if (weights[i - 1] > w) {
        table[i][w] = table[i - 1][w];
        yield { table: table.map((r) => [...r]), current: [i, w], deps: [[i - 1, w]], rowLabels, colLabels, line: 4 };
      } else {
        const withItem = values[i - 1] + table[i - 1][w - weights[i - 1]];
        const without = table[i - 1][w];
        table[i][w] = Math.max(withItem, without);
        yield {
          table: table.map((r) => [...r]), current: [i, w],
          deps: [[i - 1, w], [i - 1, w - weights[i - 1]]], rowLabels, colLabels, line: 6,
        };
      }
    }
  }
  yield { table: table.map((r) => [...r]), current: [n, capacity], rowLabels, colLabels, line: 8, note: `best value = ${table[n][capacity]}` };
}

function* lcs(a, b) {
  const n = a.length, m = b.length;
  const table = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  const rowLabels = ["-", ...a.split("")];
  const colLabels = ["-", ...b.split("")];

  yield { table: table.map((r) => [...r]), current: [0, 0], rowLabels, colLabels, line: 1 };

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      yield { table: table.map((r) => [...r]), current: [i, j], deps: [[i - 1, j - 1]], rowLabels, colLabels, line: 3 };
      if (a[i - 1] === b[j - 1]) {
        table[i][j] = table[i - 1][j - 1] + 1;
        yield { table: table.map((r) => [...r]), current: [i, j], deps: [[i - 1, j - 1]], rowLabels, colLabels, line: 4, note: "match" };
      } else {
        table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
        yield {
          table: table.map((r) => [...r]), current: [i, j],
          deps: [[i - 1, j], [i, j - 1]], rowLabels, colLabels, line: 6,
        };
      }
    }
  }
  yield { table: table.map((r) => [...r]), current: [n, m], rowLabels, colLabels, line: 8, note: `LCS length = ${table[n][m]}` };
}

export const dpAlgorithms = [
  {
    id: "fibonacci", name: "Fibonacci (Tabulation)", category: "dp",
    pseudocode: [
      "dp[0]=0; dp[1]=1",
      "for i in 2..n:",
      "  dp[i] = dp[i-1] + dp[i-2]",
      "  # overlapping subproblems solved once",
      "return dp[n]",
    ],
    complexity: { best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(n)" },
    run: fibonacci,
  },
  {
    id: "knapsack", name: "0/1 Knapsack", category: "dp",
    pseudocode: [
      "dp[0][w] = 0 for all w",
      "for i in 1..n:",
      "  for w in 0..W:",
      "    if weight[i] > w: dp[i][w] = dp[i-1][w]",
      "    else:",
      "      dp[i][w] = max(",
      "        dp[i-1][w], value[i]+dp[i-1][w-weight[i]])",
      "return dp[n][W]",
    ],
    complexity: { best: "O(nW)", avg: "O(nW)", worst: "O(nW)", space: "O(nW)" },
    run: knapsack01,
  },
  {
    id: "lcs", name: "Longest Common Subsequence", category: "dp",
    pseudocode: [
      "dp[0][*] = dp[*][0] = 0",
      "for i in 1..n:",
      "  for j in 1..m:",
      "    if a[i]==b[j]: dp[i][j]=dp[i-1][j-1]+1",
      "    else:",
      "      dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
      "return dp[n][m]",
    ],
    complexity: { best: "O(nm)", avg: "O(nm)", worst: "O(nm)", space: "O(nm)" },
    run: lcs,
  },
];
