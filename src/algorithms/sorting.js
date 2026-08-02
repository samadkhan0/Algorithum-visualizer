// Each sort is a generator that yields "steps".
// A step: { array, compare, swap, sorted, pivot, line, note }
// counters (comparisons/writes) are derived by the runner from compare/swap flags.

function* bubbleSort(input) {
  const arr = [...input];
  const n = arr.length;
  const sorted = [];
  for (let i = 0; i < n; i++) {
    let swappedAny = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: [...arr], compare: [j, j + 1], sorted: [...sorted], line: 2 };
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swappedAny = true;
        yield { array: [...arr], swap: [j, j + 1], sorted: [...sorted], line: 3 };
      }
    }
    sorted.unshift(n - i - 1);
    if (!swappedAny) break;
  }
  yield { array: [...arr], sorted: arr.map((_, i) => i), line: 5, note: "done" };
}

function* selectionSort(input) {
  const arr = [...input];
  const n = arr.length;
  const sorted = [];
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    yield { array: [...arr], pivot: minIdx, sorted: [...sorted], line: 2 };
    for (let j = i + 1; j < n; j++) {
      yield { array: [...arr], compare: [minIdx, j], sorted: [...sorted], line: 3 };
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        yield { array: [...arr], pivot: minIdx, sorted: [...sorted], line: 4 };
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield { array: [...arr], swap: [i, minIdx], sorted: [...sorted], line: 6 };
    }
    sorted.push(i);
  }
  yield { array: [...arr], sorted: arr.map((_, i) => i), line: 8, note: "done" };
}

function* insertionSort(input) {
  const arr = [...input];
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let j = i - 1;
    const key = arr[i];
    yield { array: [...arr], pivot: i, sorted: Array.from({ length: i }, (_, k) => k), line: 2 };
    while (j >= 0) {
      yield { array: [...arr], compare: [j, j + 1], line: 4 };
      if (arr[j] <= key) break;
      arr[j + 1] = arr[j];
      yield { array: [...arr], swap: [j, j + 1], line: 5 };
      j--;
    }
    arr[j + 1] = key;
    yield { array: [...arr], swap: [j + 1, j + 1], line: 6 };
  }
  yield { array: [...arr], sorted: arr.map((_, i) => i), line: 8, note: "done" };
}

function* mergeSort(input) {
  const arr = [...input];

  function* sortRange(lo, hi) {
    if (hi - lo <= 1) return;
    const mid = Math.floor((lo + hi) / 2);
    yield { array: [...arr], pivot: mid, line: 2, note: `split [${lo},${hi})` };
    yield* sortRange(lo, mid);
    yield* sortRange(mid, hi);

    const left = arr.slice(lo, mid);
    const right = arr.slice(mid, hi);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      yield { array: [...arr], compare: [lo + i, mid + j], line: 5 };
      if (left[i] <= right[j]) {
        arr[k] = left[i]; i++;
      } else {
        arr[k] = right[j]; j++;
      }
      yield { array: [...arr], swap: [k, k], line: 6 };
      k++;
    }
    while (i < left.length) { arr[k] = left[i]; yield { array: [...arr], swap: [k, k], line: 8 }; i++; k++; }
    while (j < right.length) { arr[k] = right[j]; yield { array: [...arr], swap: [k, k], line: 8 }; j++; k++; }
  }

  yield* sortRange(0, arr.length);
  yield { array: [...arr], sorted: arr.map((_, i) => i), line: 10, note: "done" };
}

function* quickSort(input) {
  const arr = [...input];

  function* sortRange(lo, hi) {
    if (lo >= hi) return;
    const pivotVal = arr[hi];
    yield { array: [...arr], pivot: hi, line: 2 };
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      yield { array: [...arr], compare: [j, hi], pivot: hi, line: 4 };
      if (arr[j] < pivotVal) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield { array: [...arr], swap: [i, j], pivot: hi, line: 5 };
      }
    }
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    yield { array: [...arr], swap: [i + 1, hi], line: 6 };
    const p = i + 1;
    yield* sortRange(lo, p - 1);
    yield* sortRange(p + 1, hi);
  }

  yield* sortRange(0, arr.length - 1);
  yield { array: [...arr], sorted: arr.map((_, i) => i), line: 8, note: "done" };
}

export const sortingAlgorithms = [
  {
    id: "bubble-sort", name: "Bubble Sort", category: "sorting",
    pseudocode: [
      "for i in 0..n:",
      "  for j in 0..n-i-1:",
      "    if arr[j] > arr[j+1]:",
      "      swap(arr[j], arr[j+1])",
      "  # largest bubbles to the end",
      "return arr",
    ],
    complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
    run: bubbleSort,
  },
  {
    id: "selection-sort", name: "Selection Sort", category: "sorting",
    pseudocode: [
      "for i in 0..n:",
      "  minIdx = i",
      "  for j in i+1..n:",
      "    if arr[j] < arr[minIdx]:",
      "      minIdx = j",
      "  # swap found minimum into place",
      "  swap(arr[i], arr[minIdx])",
      "return arr",
    ],
    complexity: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
    run: selectionSort,
  },
  {
    id: "insertion-sort", name: "Insertion Sort", category: "sorting",
    pseudocode: [
      "for i in 1..n:",
      "  key = arr[i]; j = i-1",
      "  while j >= 0:",
      "    if arr[j] <= key: break",
      "    arr[j+1] = arr[j]; j--",
      "  arr[j+1] = key",
      "  # [0..i] now sorted",
      "return arr",
    ],
    complexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
    run: insertionSort,
  },
  {
    id: "merge-sort", name: "Merge Sort", category: "sorting",
    pseudocode: [
      "sort(lo, hi):",
      "  mid = (lo+hi)/2",
      "  sort(lo, mid); sort(mid, hi)",
      "  merge halves:",
      "    while both remain:",
      "      pick smaller front",
      "    copy back into arr",
      "  # append leftovers",
      "  return",
      "return arr",
    ],
    complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
    run: mergeSort,
  },
  {
    id: "quick-sort", name: "Quick Sort", category: "sorting",
    pseudocode: [
      "sort(lo, hi):",
      "  pivot = arr[hi]",
      "  i = lo - 1",
      "  for j in lo..hi:",
      "    if arr[j] < pivot:",
      "      i++; swap(arr[i], arr[j])",
      "  swap(arr[i+1], arr[hi])  # place pivot",
      "  sort(lo, i); sort(i+2, hi)",
    ],
    complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
    run: quickSort,
  },
];
