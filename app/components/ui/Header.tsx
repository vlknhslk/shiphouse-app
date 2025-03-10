import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import Text from './Text';
import { colors, typography } from '@/constants';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function Header({ title, onBack, rightAction }: HeaderProps) {
  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: typography.semiBold,
    color: colors.text,
  },
  rightAction: {
    marginLeft: 16,
  },
});
