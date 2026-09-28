/**
 * Tunables for the SkyRSh magnetic-shaft run.
 * LOADER_DURATION_MS is pinned to 8000 by the pipeline invariants.
 */
export const LOADER_DURATION_MS = 8000;

/** Core climbs one floor every CORE_STEP_MS. */
export const CORE_STEP_MS = 2600;
/** Row slide animation length. */
export const FLOOR_SLIDE_MS = 520;
/** Core lane flip animation length. */
export const FLIP_MS = 260;

/** No tap at all for this long -> resolve the round with the current outcome. */
export const IDLE_RESULT_MS = 40000;
/** Armed once, on the FIRST tap only (never re-armed) -> resolve the round. */
export const ENGAGED_RESULT_MS = 9000;

export const MAX_HITS = 3;
export const START_ENERGY = 100;
export const FLIP_COST = 6;
export const HIT_COST = 14;
export const FLOOR_SCORE = 10;

export type Scheme = {
  id: string;
  name: string;
  floors: number;
  flips: number;
  accent: string;
  seed: number;
};

export const SCHEMES: Scheme[] = [
  { id: 'short', name: 'SHORT SHAFT', floors: 10, flips: 16, accent: '#35C5D0', seed: 1301 },
  { id: 'sky', name: 'SKY RUSH', floors: 12, flips: 14, accent: '#2F7EFF', seed: 2411 },
  { id: 'deep', name: 'DEEP TOWER', floors: 14, flips: 12, accent: '#7C4BD2', seed: 3517 },
];

export const DEFAULT_SCHEME = 1;

/** Shaft geometry. Frame = padding + border, so tiles never overflow. */
export const SHAFT_PAD = 6;
export const SHAFT_BORDER = 2;
export const SHAFT_FRAME = SHAFT_PAD + SHAFT_BORDER;
export const SHAFT_COLS = 2;
export const ROW_H = 74;
export const VISIBLE_ROWS = 5;
