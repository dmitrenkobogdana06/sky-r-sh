import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

/**
 * Shared press feedback. The Pressable stays the PARENT and drives this from
 * onPressIn/onPressOut; the Animated.View lives INSIDE it. Only transform is
 * animated, so useNativeDriver stays on.
 */
export function usePressScale(to: number = 0.95) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}
