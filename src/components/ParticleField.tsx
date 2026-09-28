import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width: W, height: H } = Dimensions.get('window');

const DUST = ['#2F7EFF', '#35C5D0', '#7C4BD2', '#F1C450'];

type Props = {
  /** How many dust points to scatter over the full canvas. */
  count?: number;
  /** Dense, fine-grained texture (loader) vs. sparse sparkle (menu/result). */
  grain?: boolean;
  seed?: number;
};

type Dot = { x: number; y: number; r: number; c: string; o: number };

/**
 * Static magnetic-dust texture. Built once per mount inside useMemo, so no
 * synchronous module-load cost. Nothing animates here — it is pure texture
 * depth behind the UI layers.
 */
export default function ParticleField({ count = 240, grain = false, seed = 777 }: Props) {
  const dots = useMemo<Dot[]>(() => {
    let s = seed >>> 0 || 1;
    const rnd = () => {
      s ^= s << 13;
      s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5;
      s >>>= 0;
      return s / 4294967296;
    };
    const out: Dot[] = [];
    for (let i = 0; i < count; i++) {
      const big = !grain && i % 11 === 0;
      out.push({
        x: rnd() * W,
        y: rnd() * H,
        r: grain ? 0.8 + rnd() * 0.8 : big ? 1.8 + rnd() * 1.4 : 0.9 + rnd() * 1.1,
        c: DUST[i % DUST.length],
        o: grain ? 0.1 + rnd() * 0.12 : 0.14 + rnd() * 0.24,
      });
    }
    return out;
  }, [count, grain, seed]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={W} height={H}>
        {dots.map((d, i) => (
          <Circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} fillOpacity={d.o} />
        ))}
      </Svg>
    </View>
  );
}
