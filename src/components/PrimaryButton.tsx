import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GRAD, THEME } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  label: string;
  onPress: () => void;
  colors?: string[];
  shadowColor?: string;
  height?: number;
  fontSize?: number;
  disabled?: boolean;
  Icon?: React.ComponentType<any>;
};

/**
 * Pressable is the PARENT; the Animated.View lives inside it, so the native
 * transform never races the touch target. Explicit height on the Pressable.
 */
export default function PrimaryButton({
  label,
  onPress,
  colors = GRAD.primary,
  shadowColor = THEME.accent.blue,
  height = 60,
  fontSize = 19,
  disabled = false,
  Icon,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, { height, shadowColor, opacity: disabled ? 0.45 : 1 }]}>
      <Animated.View style={[styles.fill, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.grad, { height }]}>
          <View style={styles.row}>
            {Icon ? <Icon size={24} color={THEME.text.primary} strokeWidth={2.5} /> : null}
            <Text style={[styles.label, { fontSize }]}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    borderRadius: 18,
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    overflow: 'hidden',
  },
  grad: {
    width: '100%',
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
    fontWeight: '900',
    letterSpacing: 3,
    color: THEME.text.primary,
  },
});
