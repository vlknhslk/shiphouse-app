import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/constants';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
}

export default function LoadingIndicator({
  size = 'large',
  color = colors.primary,
}: LoadingIndicatorProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
