import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NUM, THEME } from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

/**
 * The single header used by every screen. paddingTop:44 keeps content clear of
 * the status bar; slots keep the badge/back-button styling from drifting.
 */
export default function ScreenHeader({ title, subtitle, leftSlot, rightSlot }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>{leftSlot}</View>
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

export const headerStyles = StyleSheet.create({
  roundBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,246,255,0.08)',
    borderWidth: 1,
    borderColor: THEME.border.subtle,
  },
  pill: {
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,246,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(244,246,255,0.14)',
  },
  pillText: {
    ...NUM,
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
    color: THEME.text.primary,
    letterSpacing: 1,
  },
});

const styles = StyleSheet.create({
  header: {
    height: 116,
    paddingTop: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47,126,255,0.28)',
  },
  side: {
    width: 92,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...NUM,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 3,
    color: THEME.text.primary,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: THEME.text.muted,
  },
});
