import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from 'react-native';
import { typography } from '@/constants';

interface TextProps extends RNTextProps {
  variant?: 'regular' | 'medium' | 'semiBold' | 'bold';
}

export function Text({ style, variant = 'regular', ...props }: TextProps) {
  return (
    <RNText
      style={[
        styles.base,
        variant === 'medium' && styles.medium,
        variant === 'semiBold' && styles.semiBold,
        variant === 'bold' && styles.bold,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: typography.regular,
  },
  medium: {
    fontFamily: typography.medium,
  },
  semiBold: {
    fontFamily: typography.semiBold,
  },
  bold: {
    fontFamily: typography.bold,
  },
});
