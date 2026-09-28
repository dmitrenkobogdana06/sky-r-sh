import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GRAD, NUM, THEME } from '../constants/theme';

type Props = {
  index: number;
  title: string;
  text: string;
};

export default function TutorialStep({ index, title, text }: Props) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={GRAD.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.badge}>
        <Text style={styles.badgeText}>{index}</Text>
      </LinearGradient>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginBottom: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(47,126,255,0.22)',
    backgroundColor: 'rgba(24,34,74,0.85)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...NUM,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    color: THEME.text.primary,
  },
  body: {
    flex: 1,
    paddingLeft: 14,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.text.primary,
  },
  text: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
});
