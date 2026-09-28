import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Zap } from 'lucide-react-native';
import ParticleField from '../components/ParticleField';
import PrimaryButton from '../components/PrimaryButton';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import { bgResult, spriteBeacon, spriteCore } from '../assets';
import { GRAD, THEME } from '../constants/theme';
import { pad2 } from '../game/shaft';
import { RunResult } from '../hooks/useShaftRun';

type Props = {
  result: RunResult;
  onPlayAgain: () => void;
  onSchemes: () => void;
  onMenu: () => void;
};

const SPARK_COUNT = 24;

export default function ResultScreen({ result, onPlayAgain, onSchemes, onMenu }: Props) {
  const win = result.outcome === 'win';
  const pop = useRef(new Animated.Value(0.7)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const spark = useRef(new Animated.Value(0)).current;

  const sparks = useMemo(
    () =>
      Array.from({ length: SPARK_COUNT }, (_, i) => ({
        x: (i % 8) * 44 - 154 + (i % 3) * 9,
        delay: (i % 6) * 60,
        size: 4 + (i % 3) * 2,
      })),
    [],
  );

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, tension: 45, friction: 6, useNativeDriver: true }).start();
    Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }).start();
    if (win) {
      Animated.timing(spark, { toValue: 1, duration: 1400, useNativeDriver: true }).start();
    }
  }, [fade, pop, spark, win]);

  const sparkRise = spark.interpolate({ inputRange: [0, 1], outputRange: [40, -190] });
  const sparkFade = spark.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.9, 0] });

  const gold = THEME.accent.gold;
  const blue = THEME.accent.blue;
  const cyan = THEME.accent.cyan;
  const energyText = result.energy + '%';

  return (
    <ScreenBackground image={bgResult} colors={GRAD.result} imageOpacity={0.3}>
      <ParticleField count={220} seed={6660} />
      <ScreenHeader title={win ? 'BEACON ONLINE' : 'CORE LOST'} subtitle="RUN REPORT" />

      <View style={styles.body}>
        <View style={styles.heroBlock}>
          {win ? (
            <Animated.View pointerEvents="none" style={[styles.sparkLayer, { opacity: sparkFade }]}>
              {sparks.map((s, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.spark,
                    {
                      width: s.size,
                      height: s.size,
                      borderRadius: s.size / 2,
                      marginLeft: s.x,
                      transform: [{ translateY: sparkRise }],
                    },
                  ]}
                />
              ))}
            </Animated.View>
          ) : null}

          <Image
            source={win ? spriteBeacon : spriteCore}
            style={[styles.hero, win ? null : styles.heroDim]}
            resizeMode="contain"
          />

          <Animated.View pointerEvents="none" style={{ transform: [{ scale: pop }] }}>
            <Text style={[styles.title, { color: win ? THEME.accent.gold : THEME.accent.blue }]}>
              {win ? 'YOU WON!' : 'NO LUCK!'}
            </Text>
          </Animated.View>
          <Text style={styles.tagline}>
            {win ? 'THE SHAFT IS YOURS' : 'THE SHAFT KEEPS ITS SECRET'}
          </Text>
        </View>

        <Animated.View pointerEvents="none" style={[styles.statsRow, { opacity: fade }]}>
          <View style={styles.statSlot}>
            <StatCard Icon={Zap} value={pad2(result.floor)} label="FLOOR" valueColor={gold} />
          </View>
          <View style={styles.statSlot}>
            <StatCard Icon={Zap} value={pad2(result.flipsUsed)} label="FLIPS" valueColor={blue} />
          </View>
          <View style={styles.statSlot}>
            <StatCard Icon={Zap} value={energyText} label="ENERGY" valueColor={cyan} />
          </View>
        </Animated.View>

        <View style={styles.actions}>
          <PrimaryButton label="PLAY AGAIN" onPress={onPlayAgain} colors={GRAD.primary} />
          <View style={styles.secondaryRow}>
            <SecondaryButton label="NEW SHAFT" onPress={onSchemes} />
            <View style={styles.gap} />
            <SecondaryButton label="MENU" onPress={onMenu} />
          </View>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    justifyContent: 'space-between',
  },
  heroBlock: {
    alignItems: 'center',
    paddingTop: 10,
  },
  sparkLayer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  spark: {
    backgroundColor: '#F1C450',
  },
  hero: {
    width: 132,
    height: 132,
    marginBottom: 14,
  },
  heroDim: {
    opacity: 0.45,
  },
  title: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
    textShadowColor: 'rgba(241,196,80,0.55)',
    textShadowRadius: 22,
    textShadowOffset: { width: 0, height: 0 },
  },
  tagline: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
    color: THEME.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    marginVertical: 18,
  },
  statSlot: {
    flex: 1,
    paddingHorizontal: 5,
  },
  actions: {
    width: '100%',
  },
  secondaryRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  gap: {
    width: 12,
  },
});
