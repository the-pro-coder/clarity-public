"use client";

import confetti from "canvas-confetti";

export function ConfettiSideCannons(
  time: number,
  colors1: string[],
  colors2: string[]
) {
  const end = Date.now() + time * 1000; // 3 seconds
  if (!colors1 || !colors2) {
    colors1 = ["#a786ff", "#fd8bbc"];
    colors2 = ["#eca184", "#f8deb1"];
  }

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.9 },
      colors: colors1,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.9 },
      colors: colors2,
    });

    requestAnimationFrame(frame);
  };

  frame();
}
