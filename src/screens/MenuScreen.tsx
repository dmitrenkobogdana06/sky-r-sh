import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Info, LayoutGrid, Zap } from 'lucide-react-native';
import ParticleField from '../components/ParticleField';
import PrimaryButton from '../components/PrimaryButton';
import ScreenBackground from '../components/ScreenBackground';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import { headerStyles } from '../components/ScreenHeader';
import { bgMenu, spriteCore } from '../assets';
import { GRAD, NUM, THEME } from '../constants/theme';
import { pad2 } from '../game/shaft';

const { height: SCREEN_H } = Dimensions.get('window');

type Props = {
  bestFloor: number;
  runs: number;
  onPlay: () => void;
  onSchemes: () => void;
  onTutorial: () => void;
};

/** M2 bottom-sheet menu: full-bleed shaft art on top, frosted sheet below. */
export default function MenuScreen({
  bestFloor,
  runs,
  onPlay,
  onSchemes,
  onTutorial,
}: Props) {
  const float = useRef(new Animated.Value(0)).current;
  const sheet = useRef(new Animated.Value(120)).current;
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(sheet, {
      toValue: 0,
      tension: 50,
      friction: 9,
      useNativeDriver: true,
    }).start();
    Animated.timing(rise, { toValue: 1, duration: 340, useNativeDriver: true }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1300, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1300, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [float, rise, sheet]);

  const bob = float.interpolate({ inputRange: [0, 1], outputRange: [8, -8] });
  const showStats = bestFloor > 0 && runs > 0;

  return (
    <ScreenBackground image={bgMenu} colors={GRAD.menuTop} imageOpacity={1}>
      <ParticleField count={200} seed={4242} />

      <View style={styles.badgeRow} pointerEvents="box-none">
        <View style={headerStyles.pill}>
          <Zap size={16} color={THEME.accent.cyan} strokeWidth={2.5} />
          <Text style={headerStyles.pillText}>CORE 100</Text>
        </View>
      </View>

      <View style={styles.art} pointerEvents="none">
        <View style={styles.glowOuter}>
          <View style={styles.glowInner} />
        </View>
        <Animated.View style={{ transform: [{ translateY: bob }] }}>
          <Image source={spriteCore} style={styles.coreArt} resizeMode="contain" />
        </Animated.View>
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheet, { transform: [{ translateY: sheet }] }]}>
        <LinearGradient
          colors={GRAD.sheet}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.handle} />

        <Animated.View pointerEvents="none" style={{ opacity: rise }}>
          <Text style={styles.title}>SKY RUSH</Text>
          <Text style={styles.subtitle}>TOWER RUSH {'·'} MAGNETIC SHAFT</Text>
        </Animated.View>

        {showStats ? (
          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatCard
                Icon={Zap}
                value={pad2(bestFloor)}
                label="BEST FLOOR"
                valueColor={THEME.accent.gold}
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                Icon={Zap}
                value={pad2(runs)}
                label="RUNS"
                valueColor={THEME.accent.cyan}
              />
            </View>
          </View>
        ) : null}

        <Text style={styles.hint}>TAP FLIP TO SWITCH POLARITY</Text>

        <Animated.View pointerEvents="box-none" style={{ opacity: rise }}>
          <PrimaryButton label="PLAY NOW" onPress={onPlay} />
        </Animated.View>

        <View style={styles.secondaryRow}>
          <SecondaryButton label="SHAFTS" onPress={onSchemes} Icon={LayoutGrid} />
          <View style={styles.gap} />
          <SecondaryButton label="HOW TO" onPress={onTutorial} Icon={Info} />
        </View>
      </Animated.View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    paddingTop: 44,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  art: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: SCREEN_H * 0.16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOuter: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(47,126,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(53,197,208,0.18)',
  },
  coreArt: {
    width: 150,
    height: 150,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 16,
    paddingBottom: 34,
    paddingHorizontal: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(47,126,255,0.35)',
    overflow: 'hidden',
    shadowColor: '#2F7EFF',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
    backgroundColor: 'rgba(244,246,255,0.18)',
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 4,
    textAlign: 'center',
    color: THEME.text.primary,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
    color: THEME.accent.cyan,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 18,
  },
  statSlot: {
    flex: 1,
    paddingHorizontal: 5,
  },
  hint: {
    ...NUM,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    color: THEME.text.secondary,
  },
  secondaryRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  gap: {
    width: 12,
  },
});
