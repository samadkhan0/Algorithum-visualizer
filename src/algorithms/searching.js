function* linearSearch(input, target) {
  const arr = [...input];
  for (let i = 0; i < arr.length; i++) {
    yield { array: [...arr], compare: [i, i], line: 1 };
    if (arr[i] === target) {
      yield { array: [...arr], found: i, line: 2, note: "found" };
      return;
    }
  }
  yield { array: [...arr], line: 4, note: "not found" };
}

function* binarySearch(input, target) {
  const arr = [...input].sort((a, b) => a - b);
  let lo = 0, hi = arr.length - 1;
  yield { array: [...arr], line: 1, note: "array must be sorted" };
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    yield { array: [...arr], compare: [mid, mid], range: [lo, hi], pivot: mid, line: 3 };
    if (arr[mid] === target) {
      yield { array: [...arr], found: mid, line: 4, note: "found" };
      return;
    } else if (arr[mid] < target) {
      lo = mid + 1;
      yield { array: [...arr], range: [lo, hi], line: 6 };
    } else {
      hi = mid - 1;
      yield { array: [...arr], range: [lo, hi], line: 8 };
    }
  }
  yield { array: [...arr], line: 9, note: "not found" };
}

export const searchingAlgorithms = [
  {
    id: "linear-search", name: "Linear Search", category: "searching",
    pseudocode: [
      "for i in 0..n:",
      "  if arr[i] == target: return i",
      "  # keep scanning",
      "return -1",
    ],
    complexity: { best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
    needsTarget: true,
    run: linearSearch,
  },
  {
    id: "binary-search", name: "Binary Search", category: "searching",
    pseudocode: [
      "sort(arr); lo=0; hi=n-1",
      "while lo <= hi:",
      "  mid = (lo+hi)/2",
      "  if arr[mid] == target: return mid",
      "  elif arr[mid] < target:",
      "    lo = mid + 1",
      "  else:",
      "    hi = mid - 1",
      "return -1",
    ],
    complexity: { best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(1)" },
    needsTarget: true,
    run: binarySearch,
  },
];
