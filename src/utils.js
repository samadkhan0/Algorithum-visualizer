const MAX_STEPS = 20000;

// Eagerly turns a generator into a steps array plus cumulative comparison/swap counts.
export function materializeSteps(gen) {
  const steps = [];
  const cmp = [];
  const swp = [];
  let c = 0, s = 0;
  try {
    for (const step of gen) {
      steps.push(step);
      if (step.compare) c++;
      if (step.swap) s++;
      cmp.push(c);
      swp.push(s);
      if (steps.length >= MAX_STEPS) break;
    }
  } catch (e) {
    console.error(e);
  }
  if (steps.length === 0) { steps.push({ line: 0 }); cmp.push(0); swp.push(0); }
  return { steps, comparisons: cmp, swaps: swp };
}

export function randomArray(size, max = 99) {
  return Array.from({ length: size }, () => 1 + Math.floor(Math.random() * max));
}

export function randomWord(len) {
  const letters = "ABCDEFGH";
  return Array.from({ length: len }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
}
