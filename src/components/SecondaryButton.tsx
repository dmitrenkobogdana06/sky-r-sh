import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { THEME } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: React.ComponentType<any>;
  tint?: string;
  flexed?: boolean;
};

export default function SecondaryButton({
  label,
  onPress,
  Icon,
  tint = THEME.text.primary,
  flexed = true,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, flexed ? styles.flexed : styles.fixed]}>
      <Animated.View style={[styles.inner, { transform: [{ scale }] }]}>
        <View style={styles.row}>
          {Icon ? <Icon size={24} color={tint} strokeWidth={2.2} /> : null}
          <Text style={[styles.label, { color: tint }]}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(244,246,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(244,246,255,0.14)',
    overflow: 'hidden',
  },
  flexed: {
    flex: 1,
  },
  fixed: {
    width: '100%',
  },
  inner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    lineHeight: 24,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
