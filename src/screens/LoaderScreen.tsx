import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ParticleField from '../components/ParticleField';
import ScreenBackground from '../components/ScreenBackground';
import { bgLoader } from '../assets';
import { LOADER_DURATION_MS } from '../constants/config';
import { GRAD, THEME } from '../constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');
const BAR_W = 220;

type Props = {
  onReady: () => void;
};

/**
 * Brand card. No interactive elements at all — it is a non-interactive splash
 * that hands over to the menu on a wall-clock timer, never on an animation
 * callback. Its palette is deliberately much darker than the menu's.
 */
export default function LoaderScreen({ onReady }: Props) {
  const pop = useRef(new Animated.Value(0.6)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(-BAR_W)).current;
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }).start();
    Animated.timing(fade, { toValue: 1, duration: 480, useNativeDriver: true }).start();
    Animated.timing(bar, {
      toValue: 0,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();

    const t = setTimeout(() => readyRef.current(), LOADER_DURATION_MS);
    return () => {
      clearTimeout(t);
      loop.stop();
    };
  }, [bar, fade, pop, pulse]);

  const breathe = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const glow = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.85] });

  return (
    <ScreenBackground image={bgLoader} colors={GRAD.loader} imageOpacity={0.55}>
      <ParticleField count={1500} grain seed={777} />

      <View style={styles.body}>
        <View style={styles.stage}>
          <View style={[styles.wall, styles.wallLeft]}>
            <LinearGradient
              colors={GRAD.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <View style={[styles.wall, styles.wallRight]}>
            <LinearGradient
              colors={GRAD.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>

          <Animated.View
            pointerEvents="none"
            style={[styles.orbOuter, { opacity: glow, transform: [{ scale: breathe }] }]}>
            <View style={styles.orbMid}>
              <View style={styles.orbCore} />
            </View>
          </Animated.View>
        </View>

        <Animated.View pointerEvents="none" style={{ opacity: fade }}>
          <Text style={styles.brand}>SKY RUSH</Text>
          <Text style={styles.brandSub}>TOWER RUSH</Text>
          <Text style={styles.tagline}>FLIP THE POLARITY. REACH THE BEACON.</Text>
        </Animated.View>

        <View style={styles.track}>
          <Animated.View style={[styles.fillWrap, { transform: [{ translateX: bar }] }]}>
            <LinearGradient
              colors={GRAD.progress}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING...</Text>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stage: {
    width: Math.min(SCREEN_W - 64, 300),
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 46,
  },
  wall: {
    position: 'absolute',
    top: 10,
    bottom: 10,
    width: 14,
    borderRadius: 7,
    overflow: 'hidden',
    opacity: 0.5,
  },
  wallLeft: {
    left: 6,
  },
  wallRight: {
    right: 6,
  },
  orbOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(47,126,255,0.18)',
    shadowColor: '#2F7EFF',
    shadowOpacity: 0.9,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
    elevation: 18,
  },
  orbMid: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(53,197,208,0.35)',
  },
  orbCore: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F6FF',
  },
  brand: {
    fontSize: 44,
    lineHeight: 52,
    fontWeight: '900',
    letterSpacing: 6,
    textAlign: 'center',
    color: THEME.text.primary,
    textShadowColor: '#2F7EFF',
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 0 },
  },
  brandSub: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 8,
    textAlign: 'center',
    color: THEME.accent.cyan,
  },
  tagline: {
    marginTop: 18,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    color: THEME.text.secondary,
  },
  track: {
    marginTop: 42,
    width: BAR_W,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(244,246,255,0.12)',
  },
  fillWrap: {
    width: BAR_W,
    height: 4,
  },
  fill: {
    width: '100%',
    height: 4,
    borderRadius: 2,
  },
  loading: {
    marginTop: 14,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 4,
    color: THEME.text.muted,
  },
});
