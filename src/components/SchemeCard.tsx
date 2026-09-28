import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { NUM, THEME } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  name: string;
  floors: number;
  flips: number;
  accent: string;
  best: number;
  active: boolean;
  onPress: () => void;
};

export default function SchemeCard({
  name,
  floors,
  flips,
  accent,
  best,
  active,
  onPress,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[
        styles.press,
        {
          borderColor: active ? accent : 'rgba(244,246,255,0.12)',
          shadowColor: active ? accent : '#000',
          shadowRadius: active ? 20 : 10,
          transform: [{ translateY: active ? -4 : 0 }],
        },
      ]}>
      <Animated.View style={[styles.inner, { transform: [{ scale }] }]}>
        <View style={[styles.accentBar, { backgroundColor: accent }]} />
        <View style={styles.body}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.meta}>
            {floors} FLOORS {'·'} {flips} FLIPS
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.bestLabel}>BEST</Text>
          <Text style={[styles.bestValue, { color: THEME.accent.gold }]}>
            {best < 10 ? '0' + best : best}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 104,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
    backgroundColor: 'rgba(24,34,74,0.9)',
    overflow: 'hidden',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  inner: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  accentBar: {
    width: 6,
    height: '100%',
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.text.primary,
  },
  meta: {
    ...NUM,
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.text.secondary,
  },
  right: {
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 3,
    color: THEME.text.muted,
  },
  bestValue: {
    ...NUM,
    marginTop: 4,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
