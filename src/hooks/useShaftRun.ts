import { useCallback, useEffect, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import {
  CORE_STEP_MS,
  ENGAGED_RESULT_MS,
  FLIP_COST,
  FLOOR_SCORE,
  HIT_COST,
  IDLE_RESULT_MS,
  MAX_HITS,
  START_ENERGY,
  Scheme,
} from '../constants/config';
import {
  Floor,
  Lane,
  Polarity,
  buildFloors,
  checkCollision,
  checkScore,
  laneOf,
  polarityOf,
  resolveOutcome,
  resolvePartial,
} from '../game/shaft';

export type RunOutcome = 'win' | 'lose';

export type RunResult = {
  outcome: RunOutcome;
  floor: number;
  totalFloors: number;
  flipsUsed: number;
  energy: number;
  hits: number;
  score: number;
};

export type RunView = {
  floor: number;
  lane: Lane;
  polarity: Polarity;
  hits: number;
  energy: number;
  flipsLeft: number;
  score: number;
  flashing: boolean;
  started: boolean;
};

type RunState = {
  floor: number;
  lane: Lane;
  hits: number;
  energy: number;
  flipsLeft: number;
  score: number;
  flashing: boolean;
  started: boolean;
};

/**
 * Owns every timer of a run. All values read inside timer callbacks come from
 * refs, never from render-scope state (stale-closure safety).
 */
export function useShaftRun(scheme: Scheme, onFinish: (r: RunResult) => void) {
  const floorsRef = useRef<Floor[]>(buildFloors(scheme));
  const initial: RunState = {
    floor: -1,
    lane: 'L',
    hits: 0,
    energy: START_ENERGY,
    flipsLeft: scheme.flips,
    score: 0,
    flashing: false,
    started: false,
  };

  const stateRef = useRef<RunState>(initial);
  const [view, setView] = useState<RunState>(initial);

  const doneRef = useRef(false);
  const engagedRef = useRef(false);
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const engagedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const commit = useCallback(() => {
    setView({ ...stateRef.current });
  }, []);

  const clearAll = useCallback(() => {
    if (stepTimer.current) {
      clearInterval(stepTimer.current);
      stepTimer.current = null;
    }
    [idleTimer, engagedTimer, flashTimer, endTimer].forEach(t => {
      if (t.current) {
        clearTimeout(t.current);
        t.current = null;
      }
    });
  }, []);

  const finish = useCallback(
    (outcome: RunOutcome) => {
      if (doneRef.current) {
        return;
      }
      doneRef.current = true;
      clearAll();
      const s = stateRef.current;
      const payload: RunResult = {
        outcome,
        floor: Math.max(0, Math.min(s.floor + 1, scheme.floors)),
        totalFloors: scheme.floors,
        flipsUsed: scheme.flips - s.flipsLeft,
        energy: Math.max(0, s.energy),
        hits: s.hits,
        score: s.score,
      };
      endTimer.current = setTimeout(() => finishRef.current(payload), 520);
    },
    [clearAll, scheme.flips, scheme.floors],
  );

  const flash = useCallback(() => {
    stateRef.current.flashing = true;
    commit();
    if (flashTimer.current) {
      clearTimeout(flashTimer.current);
    }
    flashTimer.current = setTimeout(() => {
      stateRef.current.flashing = false;
      commit();
    }, 260);
  }, [commit]);

  const step = useCallback(() => {
    if (doneRef.current) {
      return;
    }
    const s = stateRef.current;
    const nextFloor = s.floor + 1;

    if (nextFloor >= scheme.floors) {
      s.floor = scheme.floors - 1;
      commit();
      finish(
        resolveOutcome({
          floor: scheme.floors,
          totalFloors: scheme.floors,
          hits: s.hits,
          energy: s.energy,
        }),
      );
      return;
    }

    s.floor = nextFloor;
    s.started = true;
    const floor = floorsRef.current[nextFloor];

    if (checkCollision(s.lane, floor)) {
      s.hits += 1;
      s.energy = Math.max(0, s.energy - HIT_COST);
      flash();
      try {
        Vibration.vibrate(40);
      } catch (e) {
        // vibration is cosmetic — never break the run for it
      }
    } else if (checkScore(s.lane, floor)) {
      s.score += FLOOR_SCORE;
    }

    commit();

    if (s.hits >= MAX_HITS || s.energy <= 0) {
      finish('lose');
    }
  }, [commit, finish, flash, scheme.floors]);

  const flip = useCallback(() => {
    const s = stateRef.current;
    if (doneRef.current || s.flipsLeft <= 0) {
      return;
    }
    s.lane = s.lane === 'L' ? 'R' : 'L';
    s.flipsLeft -= 1;
    s.energy = Math.max(0, s.energy - FLIP_COST);
    s.started = true;
    commit();

    // Armed once, on the very first interaction. Re-arming on every tap would
    // let a fast harness postpone the result forever.
    if (!engagedRef.current) {
      engagedRef.current = true;
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
        idleTimer.current = null;
      }
      engagedTimer.current = setTimeout(() => {
        const cur = stateRef.current;
        finish(
          resolvePartial({
            floor: cur.floor + 1,
            totalFloors: scheme.floors,
            hits: cur.hits,
            energy: cur.energy,
          }),
        );
      }, ENGAGED_RESULT_MS);
    }

    if (s.energy <= 0) {
      finish('lose');
    }
  }, [commit, finish, scheme.floors]);

  useEffect(() => {
    doneRef.current = false;
    engagedRef.current = false;
    stepTimer.current = setInterval(step, CORE_STEP_MS);
    idleTimer.current = setTimeout(() => {
      const cur = stateRef.current;
      finish(
        resolvePartial({
          floor: cur.floor + 1,
          totalFloors: scheme.floors,
          hits: cur.hits,
          energy: cur.energy,
        }),
      );
    }, IDLE_RESULT_MS);
    return clearAll;
  }, [clearAll, finish, step, scheme.floors]);

  const runView: RunView = {
    floor: view.floor,
    lane: view.lane,
    polarity: polarityOf(view.lane) as Polarity,
    hits: view.hits,
    energy: view.energy,
    flipsLeft: view.flipsLeft,
    score: view.score,
    flashing: view.flashing,
    started: view.started,
  };

  return { floors: floorsRef.current, run: runView, flip, laneOf };
}
