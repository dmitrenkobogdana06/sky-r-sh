/**
 * SkyRSh — Sky Rush / Tower Rush.
 * Plain state-machine navigation (no react-navigation): one screen is mounted
 * at a time and the switch happens immediately, never behind a fade callback.
 */
import React, { useCallback, useRef, useState } from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import SchemesScreen from './src/screens/SchemesScreen';
import TutorialScreen from './src/screens/TutorialScreen';
import GameScreen from './src/screens/GameScreen';
import ResultScreen from './src/screens/ResultScreen';
import { DEFAULT_SCHEME, SCHEMES } from './src/constants/config';
import { THEME } from './src/constants/theme';
import { RunResult } from './src/hooks/useShaftRun';

type Screen = 'loader' | 'menu' | 'schemes' | 'tutorial' | 'game' | 'result';

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [schemeIndex, setSchemeIndex] = useState(DEFAULT_SCHEME);
  const [bestFloor, setBestFloor] = useState(0);
  const [runs, setRuns] = useState(0);
  const [lastRun, setLastRun] = useState<RunResult | null>(null);
  const [runKey, setRunKey] = useState(0);

  const fade = useRef(new Animated.Value(1)).current;

  const go = useCallback(
    (next: Screen) => {
      setScreen(next);
      fade.setValue(0);
      Animated.timing(fade, { toValue: 1, duration: 240, useNativeDriver: true }).start();
    },
    [fade],
  );

  const launchRun = useCallback(() => {
    setRunKey(k => k + 1);
    go('game');
  }, [go]);

  const handleGameOver = useCallback(
    (result: RunResult) => {
      setLastRun(result);
      setRuns(n => n + 1);
      setBestFloor(b => (result.floor > b ? result.floor : b));
      setScreen('result');
      fade.setValue(0);
      Animated.timing(fade, { toValue: 1, duration: 240, useNativeDriver: true }).start();
    },
    [fade],
  );

  const scheme = SCHEMES[schemeIndex] ?? SCHEMES[DEFAULT_SCHEME];

  const selectScheme = useCallback((index: number) => setSchemeIndex(index), []);
  const goMenu = useCallback(() => go('menu'), [go]);
  const goSchemes = useCallback(() => go('schemes'), [go]);
  const goTutorial = useCallback(() => go('tutorial'), [go]);

  let content: React.ReactNode = null;
  if (screen === 'loader') {
    content = <LoaderScreen onReady={goMenu} />;
  } else if (screen === 'menu') {
    content = (
      <MenuScreen
        bestFloor={bestFloor}
        runs={runs}
        onPlay={launchRun}
        onSchemes={goSchemes}
        onTutorial={goTutorial}
      />
    );
  } else if (screen === 'schemes') {
    content = (
      <SchemesScreen
        schemeIndex={schemeIndex}
        bestFloor={bestFloor}
        onSelect={selectScheme}
        onBack={goMenu}
        onLaunch={launchRun}
      />
    );
  } else if (screen === 'tutorial') {
    content = <TutorialScreen onBack={goMenu} />;
  } else if (screen === 'game') {
    content = (
      <GameScreen
        key={runKey}
        scheme={scheme}
        onGameOver={handleGameOver}
        onQuit={goMenu}
      />
    );
  } else if (lastRun) {
    content = (
      <ResultScreen
        result={lastRun}
        onPlayAgain={launchRun}
        onSchemes={goSchemes}
        onMenu={goMenu}
      />
    );
  } else {
    content = <MenuScreen bestFloor={bestFloor} runs={runs} onPlay={launchRun} onSchemes={goSchemes} onTutorial={goTutorial} />;
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Animated.View pointerEvents="box-none" style={[styles.layer, { opacity: fade }]}>
        {content}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.bg.base,
  },
  layer: {
    flex: 1,
  },
});
