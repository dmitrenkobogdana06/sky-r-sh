import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Pause } from 'lucide-react-native';
import ControlPanel from '../components/ControlPanel';
import CoreOrb from '../components/CoreOrb';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, { headerStyles } from '../components/ScreenHeader';
import PauseOverlay from '../components/PauseOverlay';
import Shaft, { CORE_D } from '../components/Shaft';
import { bgGame } from '../assets';
import { MAX_HITS, Scheme } from '../constants/config';
import { GRAD, NUM, THEME } from '../constants/theme';
import { pad2 } from '../game/shaft';
import { RunResult, useShaftRun } from '../hooks/useShaftRun';

type Props = {
  scheme: Scheme;
  onGameOver: (result: RunResult) => void;
  onQuit: () => void;
};

const LIVES = [0, 1, 2];

export default function GameScreen({ scheme, onGameOver, onQuit }: Props) {
  const [paused, setPaused] = useState(false);
  const { floors, run, flip } = useShaftRun(scheme, onGameOver);

  const openPause = useCallback(() => setPaused(true), []);
  const closePause = useCallback(() => setPaused(false), []);

  const shownFloor = Math.max(0, run.floor + 1);
  const flipsUsed = scheme.flips - run.flipsLeft;

  const pauseBtn = (
    <Pressable
      accessibilityRole="button"
      onPress={openPause}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={headerStyles.roundBtn}>
      <Pause size={22} color={THEME.text.primary} strokeWidth={2.5} />
    </Pressable>
  );

  const statusSlot = (
    <View style={styles.status}>
      <Text style={styles.moves}>MOVES {pad2(run.flipsLeft)}</Text>
      <View style={styles.lives}>
        {LIVES.map(i => (
          <View
            key={i}
            style={[
              styles.life,
              {
                backgroundColor:
                  i < MAX_HITS - run.hits ? THEME.accent.blue : 'rgba(244,246,255,0.18)',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <ScreenBackground image={bgGame} colors={GRAD.game} imageOpacity={0.75}>
      <ScreenHeader
        title={'FLOOR ' + pad2(shownFloor) + ' / ' + pad2(scheme.floors)}
        subtitle={scheme.name}
        leftSlot={pauseBtn}
        rightSlot={statusSlot}
      />

      <View style={styles.area}>
        <Shaft
          floors={floors}
          coreFloor={run.floor}
          coreLane={run.lane}
          flashing={run.flashing}>
          <CoreOrb
            polarity={run.polarity}
            size={CORE_D}
            hit={run.flashing}
            flipToken={flipsUsed}
          />
        </Shaft>

        <Text style={styles.target}>TARGET BEACON {'·'} COMBO {run.score}</Text>
      </View>

      <ControlPanel
        polarity={run.polarity}
        flipsLeft={run.flipsLeft}
        energy={run.energy}
        onFlip={flip}
        disabled={run.flipsLeft <= 0 || paused}
      />

      <PauseOverlay visible={paused} onResume={closePause} onQuit={onQuit} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 28,
  },
  status: {
    alignItems: 'flex-end',
  },
  moves: {
    ...NUM,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1,
    color: THEME.accent.cyan,
  },
  lives: {
    flexDirection: 'row',
    marginTop: 6,
  },
  life: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 5,
  },
  target: {
    ...NUM,
    marginTop: 18,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    color: THEME.text.secondary,
  },
});
