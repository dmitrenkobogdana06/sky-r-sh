import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';
import ParticleField from '../components/ParticleField';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, { headerStyles } from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import TutorialStep from '../components/TutorialStep';
import { bgMenu } from '../assets';
import { GRAD, THEME } from '../constants/theme';

type Props = {
  onBack: () => void;
};

const STEPS = [
  {
    title: 'POLARITY',
    text: 'The core rides the blue left channel or the violet right channel of the shaft.',
  },
  {
    title: 'FLIP',
    text: 'One tap on FLIP inverts the polarity and throws the core into the other channel.',
  },
  {
    title: 'BEACON',
    text: 'Reach the beacon on top. Three barrier hits and the core is lost.',
  },
];

export default function TutorialScreen({ onBack }: Props) {
  const back = (
    <Pressable
      accessibilityRole="button"
      onPress={onBack}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={headerStyles.roundBtn}>
      <ChevronLeft size={24} color={THEME.text.primary} strokeWidth={2.5} />
    </Pressable>
  );

  return (
    <ScreenBackground image={bgMenu} colors={GRAD.screen} imageOpacity={0.45}>
      <ParticleField count={180} seed={5150} />
      <ScreenHeader title="HOW TO PLAY" subtitle="THREE RULES" leftSlot={back} />

      <View style={styles.body}>
        <View style={styles.list}>
          {STEPS.map((s, i) => (
            <TutorialStep key={s.title} index={i + 1} title={s.title} text={s.text} />
          ))}
        </View>

        <View style={styles.diagram}>
          <View style={styles.channel}>
            <LinearGradient
              colors={GRAD.blue}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.channelText}>BLUE</Text>
          </View>
          <View style={styles.orb} />
          <View style={styles.channel}>
            <LinearGradient
              colors={GRAD.violet}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.channelText}>VIOLET</Text>
          </View>
        </View>

        <SecondaryButton label="GOT IT" onPress={onBack} flexed={false} tint={THEME.accent.cyan} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
    justifyContent: 'space-between',
  },
  list: {
    width: '100%',
  },
  diagram: {
    width: '100%',
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  channel: {
    width: 96,
    height: 44,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 3,
    color: THEME.text.primary,
  },
  orb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginHorizontal: 18,
    backgroundColor: '#F4F6FF',
    shadowColor: '#35C5D0',
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
});
