import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Line, Polygon } from 'react-native-svg';
import {
  FLIP_SLIDE,
  ROW_H,
  SHAFT_BORDER,
  SHAFT_COLS,
  SHAFT_FRAME,
  VISIBLE_ROWS,
} from '../constants/geometry';
import { GRAD, THEME } from '../constants/theme';
import { Floor, Lane } from '../game/shaft';

const { width: SCREEN_W } = Dimensions.get('window');

/** Frame-aware geometry: the content box never exceeds the border box. */
export const SHAFT_MAX_W = Math.min(SCREEN_W - 32, 380);
export const LANE = Math.floor((SHAFT_MAX_W - 2 * SHAFT_FRAME) / SHAFT_COLS);
export const SHAFT_W = LANE * SHAFT_COLS + 2 * SHAFT_FRAME;
export const SHAFT_H = ROW_H * VISIBLE_ROWS + 2 * SHAFT_FRAME;
export const CORE_ROW = 3;
export const CORE_D = Math.min(48, LANE - 28);

const BEACON_H = Math.round(2.2 * ROW_H);
const HATCH = [0, 1, 2, 3, 4, 5, 6, 7];

const laneX = (lane: Lane) => (lane === 'L' ? 0 : LANE);

type Props = {
  floors: Floor[];
  coreFloor: number;
  coreLane: Lane;
  flashing: boolean;
  children?: React.ReactNode;
};

/**
 * The shaft window. Rows live in one absolutely-positioned stack that slides
 * with translateY, so the camera appears to climb while the core stays put on
 * visible row CORE_ROW.
 */
export default function Shaft({ floors, coreFloor, coreLane, flashing, children }: Props) {
  const total = floors.length;
  const slide = useRef(new Animated.Value((CORE_ROW - total + 1 + coreFloor) * ROW_H)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: (CORE_ROW - total + 1 + coreFloor) * ROW_H,
      duration: FLIP_SLIDE,
      useNativeDriver: true,
    }).start();
  }, [coreFloor, slide, total]);

  const beaconPoints =
    LANE + ',' + BEACON_H + ' ' + Math.round(LANE * 0.1) + ',0 ' + Math.round(LANE * 1.9) + ',0';

  return (
    <View
      style={[
        styles.frame,
        {
          borderColor: flashing ? THEME.accent.gold : 'rgba(47,126,255,0.45)',
          shadowColor: flashing ? THEME.accent.gold : THEME.accent.blue,
        },
      ]}>
      <LinearGradient
        colors={['rgba(10,14,34,0.55)', 'rgba(16,23,47,0.75)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.divider} pointerEvents="none">
        <Svg width={2} height={SHAFT_H}>
          <Line
            x1={1}
            y1={0}
            x2={1}
            y2={SHAFT_H}
            stroke="rgba(244,246,255,0.16)"
            strokeWidth={2}
            strokeDasharray="6 8"
          />
        </Svg>
      </View>

      <Animated.View
        pointerEvents="none"
        style={[styles.rows, { height: total * ROW_H, transform: [{ translateY: slide }] }]}>
        <View style={styles.beacon}>
          <LinearGradient
            colors={['rgba(241,196,80,0.04)', 'rgba(241,196,80,0.26)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Svg width={LANE * SHAFT_COLS} height={BEACON_H} style={StyleSheet.absoluteFill}>
            <Polygon points={beaconPoints} fill={THEME.accent.gold} fillOpacity={0.18} />
          </Svg>
          <View style={styles.beaconBar} />
        </View>

        {floors.map(f => (
          <View key={f.index} style={[styles.row, { top: (total - 1 - f.index) * ROW_H }]}>
            <LinearGradient
              colors={f.platform === 'L' ? GRAD.blue : GRAD.violet}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.platform, { left: laneX(f.platform) + 6 }]}>
              <View style={styles.innerLight} />
            </LinearGradient>

            {f.hazard ? (
              <View style={[styles.hazard, { left: laneX(f.hazard) + 6 }]}>
                <Svg width={LANE - 12} height={14}>
                  {HATCH.map(i => (
                    <Line
                      key={i}
                      x1={i * 14 - 6}
                      y1={14}
                      x2={i * 14 + 8}
                      y2={0}
                      stroke={THEME.accent.gold}
                      strokeWidth={4}
                      strokeOpacity={0.9}
                    />
                  ))}
                </Svg>
              </View>
            ) : null}
          </View>
        ))}

        <View style={[styles.base, { top: total * ROW_H }]}>
          <LinearGradient
            colors={['rgba(47,126,255,0.24)', 'rgba(10,14,34,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </Animated.View>

      <LinearGradient
        colors={['rgba(7,12,28,0.85)', 'rgba(7,12,28,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.vignetteTop}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(7,12,28,0)', 'rgba(7,12,28,0.85)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.vignetteBottom}
        pointerEvents="none"
      />

      <View
        pointerEvents="none"
        style={[
          styles.coreSlot,
          { left: SHAFT_FRAME + laneX(coreLane), top: SHAFT_FRAME + CORE_ROW * ROW_H },
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: SHAFT_W,
    height: SHAFT_H,
    borderRadius: 22,
    borderWidth: SHAFT_BORDER,
    overflow: 'hidden',
    backgroundColor: 'rgba(10,14,34,0.6)',
    shadowOpacity: 0.55,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 18,
  },
  divider: {
    position: 'absolute',
    left: SHAFT_FRAME + LANE - 1,
    top: 0,
  },
  rows: {
    position: 'absolute',
    left: SHAFT_FRAME,
    top: SHAFT_FRAME,
    width: LANE * SHAFT_COLS,
  },
  row: {
    position: 'absolute',
    left: 0,
    width: LANE * SHAFT_COLS,
    height: ROW_H,
  },
  platform: {
    position: 'absolute',
    top: ROW_H / 2 - 11,
    width: LANE - 12,
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
  },
  innerLight: {
    position: 'absolute',
    top: 3,
    left: 10,
    right: 10,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(244,246,255,0.35)',
  },
  hazard: {
    position: 'absolute',
    top: ROW_H / 2 - 30,
    width: LANE - 12,
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: 'rgba(16,23,47,0.9)',
    shadowColor: '#F1C450',
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  beacon: {
    position: 'absolute',
    left: 0,
    top: -BEACON_H,
    width: LANE * SHAFT_COLS,
    height: BEACON_H,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  beaconBar: {
    marginBottom: 10,
    width: Math.round(LANE * 1.2),
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F1C450',
    shadowColor: '#F1C450',
    shadowOpacity: 0.9,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  base: {
    position: 'absolute',
    left: 0,
    width: LANE * SHAFT_COLS,
    height: ROW_H * 3,
  },
  vignetteTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 44,
  },
  vignetteBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 44,
  },
  coreSlot: {
    position: 'absolute',
    width: LANE,
    height: ROW_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
