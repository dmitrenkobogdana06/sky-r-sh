import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NUM, THEME } from '../constants/theme';

type Props = {
  value: string;
  label: string;
  valueColor: string;
  Icon?: React.ComponentType<any>;
};

/**
 * One pill shape, one icon glyph, colour carries the meaning. Identical on
 * Menu and Result. width:'100%' (never flex:1) so the parent flex slot cannot
 * collapse the card's intrinsic height.
 */
export default function StatCard({ value, label, valueColor, Icon }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      {Icon ? (
        <View style={[styles.iconWrap, { backgroundColor: valueColor + '22' }]}>
          <Icon size={22} color={valueColor} strokeWidth={2.5} />
        </View>
      ) : (
        <View style={[styles.dot, { backgroundColor: valueColor }]} />
      )}
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(24,34,74,0.88)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  value: {
    ...NUM,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
    letterSpacing: 1,
  },
  label: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: THEME.text.muted,
  },
});
