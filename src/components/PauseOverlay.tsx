import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import { THEME } from '../constants/theme';

type Props = {
  visible: boolean;
  onResume: () => void;
  onQuit: () => void;
};

export default function PauseOverlay({ visible, onResume, onQuit }: Props) {
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>PAUSED</Text>
        <Text style={styles.hint}>THE CORE HOLDS ITS CHARGE</Text>
        <PrimaryButton label="RESUME" onPress={onResume} height={56} fontSize={17} />
        <View style={styles.gap} />
        <SecondaryButton label="QUIT RUN" onPress={onQuit} flexed={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(7,12,28,0.88)',
  },
  card: {
    width: '84%',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(47,126,255,0.35)',
    backgroundColor: 'rgba(24,34,74,0.96)',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: 5,
    color: THEME.text.primary,
  },
  hint: {
    marginTop: 8,
    marginBottom: 22,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.text.secondary,
  },
  gap: {
    height: 12,
  },
});
