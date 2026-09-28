import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeftRight } from 'lucide-react-native';
import EnergyBar from './EnergyBar';
import PrimaryButton from './PrimaryButton';
import { GRAD, NUM, THEME } from '../constants/theme';
import { Polarity } from '../game/shaft';

const { width: SCREEN_W } = Dimensions.get('window');
const PANEL_PAD = 14;
const BAR_W = SCREEN_W - 32 - PANEL_PAD * 2;

type Props = {
  polarity: Polarity;
  flipsLeft: number;
  energy: number;
  onFlip: () => void;
  disabled: boolean;
};

/**
 * Floating controls (G2). Sits above the bottom edge on purpose so the action
 * button lands in the middle-lower band rather than under the nav bar.
 */
export default function ControlPanel({
  polarity,
  flipsLeft,
  energy,
  onFlip,
  disabled,
}: Props) {
  const accent = polarity === 'BLUE' ? THEME.accent.blue : THEME.accent.violet;
  const grad = polarity === 'BLUE' ? GRAD.blue : GRAD.violet;

  return (
    <View style={styles.panel}>
      <LinearGradient
        colors={GRAD.panel}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <EnergyBar value={energy} barW={BAR_W} />

      <View style={styles.spacer} />

      <PrimaryButton
        label="FLIP"
        onPress={onFlip}
        colors={grad}
        shadowColor={accent}
        height={72}
        fontSize={22}
        disabled={disabled}
        Icon={ArrowLeftRight}
      />

      <View style={styles.footRow}>
        <Text style={[styles.foot, { color: accent }]}>POLARITY {polarity}</Text>
        <Text style={styles.foot}>FLIPS LEFT {flipsLeft}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 56,
    padding: PANEL_PAD,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(47,126,255,0.32)',
    overflow: 'hidden',
    shadowColor: '#2F7EFF',
    shadowOpacity: 0.5,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 18,
  },
  spacer: {
    height: 12,
  },
  footRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foot: {
    ...NUM,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.text.muted,
  },
});
