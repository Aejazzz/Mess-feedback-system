export const springComfort = {
  type: "spring" as const,
  stiffness: 280,
  damping: 26,
};

export const fadeBlur = {
  initial: { opacity: 0, filter: "blur(8px)" as const },
  animate: { opacity: 1, filter: "blur(0px)" as const },
};
