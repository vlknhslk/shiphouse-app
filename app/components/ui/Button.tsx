import React, { ReactNode } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from './Text';
import { colors, typography } from '@/constants';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onPress: () => void;
  style?: any;
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  onPress,
  style,
  loading = false,
  disabled = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#ffffff' : colors.primary}
        />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'primary' ? styles.textPrimary : styles.textSecondary,
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontFamily: typography.semiBold,
  },
  textPrimary: {
    color: colors.background,
  },
  textSecondary: {
    color: colors.primary,
  },
});
