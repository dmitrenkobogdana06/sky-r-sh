import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import ParticleField from '../components/ParticleField';
import PrimaryButton from '../components/PrimaryButton';
import SchemeCard from '../components/SchemeCard';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, { headerStyles } from '../components/ScreenHeader';
import { bgMenu } from '../assets';
import { SCHEMES } from '../constants/config';
import { GRAD, THEME } from '../constants/theme';

type Props = {
  schemeIndex: number;
  bestFloor: number;
  onSelect: (index: number) => void;
  onBack: () => void;
  onLaunch: () => void;
};

export default function SchemesScreen({
  schemeIndex,
  bestFloor,
  onSelect,
  onBack,
  onLaunch,
}: Props) {
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
    <ScreenBackground image={bgMenu} colors={GRAD.screen} imageOpacity={0.5}>
      <ParticleField count={180} seed={9091} />
      <ScreenHeader title="SELECT SHAFT" subtitle="PICK YOUR CLIMB" leftSlot={back} />

      <View style={styles.body}>
        <View style={styles.list}>
          {SCHEMES.map((s, i) => (
            <SchemeCard
              key={s.id}
              name={s.name}
              floors={s.floors}
              flips={s.flips}
              accent={s.accent}
              best={bestFloor}
              active={i === schemeIndex}
              onPress={() => onSelect(i)}
            />
          ))}
        </View>

        <PrimaryButton label="START RUN" onPress={onLaunch} height={56} fontSize={18} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 34,
    justifyContent: 'space-between',
  },
  list: {
    width: '100%',
  },
});
