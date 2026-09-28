import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GRAD, NUM, THEME } from '../constants/theme';

type Props = {
  value: number;
  barW: number;
};

/**
 * The fill is a full-width gradient slid behind an overflow:hidden track with
 * translateX — transform only, so the native driver stays on and no layout
 * property is ever animated.
 */
export default function EnergyBar({ value, barW }: Props) {
  const pct = Math.max(0, Math.min(100, value)) / 100;
  const shift = useRef(new Animated.Value(-barW * (1 - pct))).current;

  useEffect(() => {
    Animated.timing(shift, {
      toValue: -barW * (1 - pct),
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [pct, shift, barW]);

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>ENERGY</Text>
        <Text style={styles.pct}>{Math.round(value)}%</Text>
      </View>
      <View style={[styles.track, { width: barW }]}>
        <Animated.View style={[styles.fillWrap, { width: barW, transform: [{ translateX: shift }] }]}>
          <LinearGradient
            colors={GRAD.energy}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: THEME.text.muted,
  },
  pct: {
    ...NUM,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: THEME.accent.cyan,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(244,246,255,0.1)',
  },
  fillWrap: {
    height: 8,
  },
  fill: {
    width: '100%',
    height: 8,
    borderRadius: 4,
  },
});
