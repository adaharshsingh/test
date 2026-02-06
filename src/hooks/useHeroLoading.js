import { useProgress } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';

export function useSmoothedProgress() {
  const { progress } = useProgress();
  const [smoothProgress, setSmoothProgress] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    const update = () => {
      setSmoothProgress((prev) => {
        // Ease toward real progress
        const diff = progress - prev;
        if (Math.abs(diff) < 0.1) return progress;
        return prev + diff * 0.08; // Smoothing factor
      });

      rafRef.current = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(rafRef.current);
  }, [progress]);

  return smoothProgress;
}

