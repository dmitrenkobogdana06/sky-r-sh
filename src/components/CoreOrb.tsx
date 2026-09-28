import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { THEME } from '../constants/theme';
import { Polarity } from '../game/shaft';

type Props = {
  polarity: Polarity;
  size: number;
  hit: boolean;
  flipToken: number;
};

/**
 * Three stacked layers (halo / ring / core) plus a one-shot shockwave that
 * replays whenever flipToken changes. Only scale + opacity are animated.
 */
export default function CoreOrb({ polarity, size, hit, flipToken }: Props) {
  const accent = polarity === 'BLUE' ? THEME.accent.blue : THEME.accent.violet;
  const pop = useRef(new Animated.Value(0.6)).current;
  const wave = useRef(new Animated.Value(0)).current;
  const firstRun = useRef(true);

  useEffect(() => {
    Animated.spring(pop, {
      toValue: 1,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [pop]);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    wave.setValue(0);
    Animated.timing(wave, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [flipToken, wave]);

  const waveScale = wave.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.8] });
  const waveOpacity = wave.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] });

  const halo = size + 28;
  const ring = size + 10;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.root, { width: halo, height: halo, transform: [{ scale: pop }] }]}>
      <Animated.View
        style={[
          styles.abs,
          {
            width: halo,
            height: halo,
            borderRadius: halo / 2,
            borderWidth: 2,
            borderColor: accent,
            opacity: waveOpacity,
            transform: [{ scale: waveScale }],
          },
        ]}
      />
      <View
        style={[
          styles.abs,
          {
            width: halo,
            height: halo,
            borderRadius: halo / 2,
            backgroundColor: accent + '38',
          },
        ]}
      />
      <View
        style={[
          styles.abs,
          {
            width: ring,
            height: ring,
            borderRadius: ring / 2,
            borderWidth: 2,
            borderColor: THEME.accent.cyan,
            backgroundColor: 'rgba(53,197,208,0.28)',
          },
        ]}
      />
      <View
        style={[
          styles.abs,
          styles.core,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: hit ? THEME.accent.gold : '#F4F6FF',
            shadowColor: hit ? THEME.accent.gold : accent,
            opacity: hit ? 0.55 : 1,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  abs: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    shadowOpacity: 0.95,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 16,
  },
});
