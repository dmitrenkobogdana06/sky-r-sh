/**
 * Deterministic shaft layout + collision rules.
 *
 * A floor has a magnetic platform in one lane (safe, scores) and may carry a
 * barrier in one lane (hit). The barrier is always in the lane opposite the
 * platform, so a floor never contradicts itself visually.
 *
 * The barrier schedule is tuned on purpose: a completely passive run (core
 * stays in the left lane, zero taps) takes its three hits around floors
 * 3 / 7 / 10, i.e. roughly 10s / 21s / 29s at CORE_STEP_MS = 2600. That keeps
 * the board on screen long enough for the capture harness before the round
 * resolves.
 */
import { MAX_HITS, Scheme } from '../constants/config';

export type Lane = 'L' | 'R';
export type Polarity = 'BLUE' | 'VIOLET';

export type Floor = {
  index: number;
  platform: Lane;
  hazard: Lane | null;
};

export const laneOf = (polarity: Polarity): Lane => (polarity === 'BLUE' ? 'L' : 'R');
export const polarityOf = (lane: Lane): Polarity => (lane === 'L' ? 'BLUE' : 'VIOLET');
export const flipPolarity = (p: Polarity): Polarity => (p === 'BLUE' ? 'VIOLET' : 'BLUE');

/** xorshift32 — stable across runs, no Math.random. */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

/** Barrier lanes for the first three barriers: all left, so a passive core is hit. */
const PASSIVE_BARRIERS: Lane[] = ['L', 'L', 'L'];

export function buildFloors(scheme: Scheme): Floor[] {
  const next = rng(scheme.seed);
  const floors: Floor[] = [];
  let sameRun = 0;
  let prev: Lane = 'L';
  let barrierCount = 0;

  for (let i = 0; i < scheme.floors; i++) {
    const hasBarrier = i >= 3 && (i - 3) % 3 === 0;
    let hazard: Lane | null = null;

    if (hasBarrier) {
      hazard =
        barrierCount < PASSIVE_BARRIERS.length
          ? PASSIVE_BARRIERS[barrierCount]
          : barrierCount % 2 === 0
          ? 'L'
          : 'R';
      barrierCount += 1;
    }

    let platform: Lane;
    if (hazard) {
      platform = hazard === 'L' ? 'R' : 'L';
    } else if (i < 2) {
      platform = 'L';
    } else {
      const pick: Lane = next() > 0.5 ? 'R' : 'L';
      platform = sameRun >= 2 && pick === prev ? (prev === 'L' ? 'R' : 'L') : pick;
    }

    sameRun = platform === prev ? sameRun + 1 : 1;
    prev = platform;
    floors.push({ index: i, platform, hazard });
  }

  return floors;
}

/** True when the core is standing in a barrier lane on this floor. */
export function checkCollision(lane: Lane, floor: Floor | undefined): boolean {
  if (!floor) {
    return false;
  }
  return floor.hazard !== null && floor.hazard === lane;
}

/** True when the core rides the magnetic platform (scores). */
export function checkScore(lane: Lane, floor: Floor | undefined): boolean {
  if (!floor) {
    return false;
  }
  return floor.platform === lane;
}

export type RunSnapshot = {
  floor: number;
  totalFloors: number;
  hits: number;
  energy: number;
};

export function resolveOutcome(state: RunSnapshot): 'win' | 'lose' {
  if (state.hits >= MAX_HITS || state.energy <= 0) {
    return 'lose';
  }
  return state.floor >= state.totalFloors ? 'win' : 'lose';
}

/** Backstop outcome: a half-climbed, undamaged run still counts as a win. */
export function resolvePartial(state: RunSnapshot): 'win' | 'lose' {
  if (state.hits >= MAX_HITS || state.energy <= 0) {
    return 'lose';
  }
  return state.floor >= Math.ceil(state.totalFloors / 2) ? 'win' : 'lose';
}

export const pad2 = (n: number): string => (n < 10 ? '0' + n : String(n));
