/** Motion shared by the course tracker, so its pieces move as one. */

/** Ease-out curve: quick start, gentle settle. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Every progress fill (bars, rings, counting numbers) uses this, so they move together. */
export const PROGRESS_TRANSITION = { duration: 0.8, ease: EASE } as const;
