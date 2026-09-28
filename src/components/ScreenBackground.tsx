import React from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { THEME } from '../constants/theme';

type Props = {
  image: number;
  colors: string[];
  imageOpacity?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
};

/**
 * Layer 1 (AI background) + layer 2 (gradient scrim). Every screen builds on
 * this so depth is consistent across the app.
 */
export default function ScreenBackground({
  image,
  colors,
  imageOpacity = 1,
  style,
  children,
}: Props) {
  return (
    <View style={[styles.root, style]}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
        imageStyle={{ opacity: imageOpacity }}
      />
      <LinearGradient
        colors={colors}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.bg.base,
  },
});
