import { useEffect, useMemo, useRef, useState } from "react";

const MAX_STEPS = 20000;

// producerFn: () => Generator<step>  (a zero-arg factory so we can rerun on input change)
export function useStepRunner(producerFn, deps) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // steps per tick multiplier
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const { steps, comparisons, swaps } = useMemo(() => {
    const collected = [];
    const cmp = [];
    const swp = [];
    let cCount = 0, sCount = 0;
    try {
      const gen = producerFn();
      for (const step of gen) {
        collected.push(step);
        if (step.compare) cCount++;
        if (step.swap) sCount++;
        cmp.push(cCount);
        swp.push(sCount);
        if (collected.length >= MAX_STEPS) break;
      }
    } catch (e) {
      // defensive: malformed input shouldn't crash the UI
      console.error(e);
    }
    if (collected.length === 0) {
      collected.push({ line: 0 });
      cmp.push(0);
      swp.push(0);
    }
    return { steps: collected, comparisons: cmp, swaps: swp };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // reset playback whenever the underlying steps change
  useEffect(() => {
    setIndex(0);
    setPlaying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps]);

  useEffect(() => {
    if (!playing) {
      clearInterval(timerRef.current);
      return;
    }
    if (index >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const intervalMs = Math.max(15, 260 / speed);
    timerRef.current = setInterval(() => {
      setIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [playing, speed, steps.length, index >= steps.length - 1]);

  const current = steps[Math.min(index, steps.length - 1)];

  return {
    steps,
    current,
    index,
    total: steps.length,
    comparisons: comparisons[index] ?? 0,
    swaps: swaps[index] ?? 0,
    playing,
    speed,
    setSpeed,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    toggle: () => setPlaying((p) => !p),
    stepForward: () => setIndex((i) => Math.min(i + 1, steps.length - 1)),
    stepBack: () => setIndex((i) => Math.max(i - 1, 0)),
    reset: () => { setIndex(0); setPlaying(false); },
    seek: (i) => setIndex(Math.max(0, Math.min(i, steps.length - 1))),
    isDone: index >= steps.length - 1,
  };
}
