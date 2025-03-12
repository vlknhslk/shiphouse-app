import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Hata loglama servisi eklenebilir
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Bir şeyler yanlış gitti</Text>
          <Button
            onPress={() => this.setState({ hasError: false })}
            style={styles.button}
          >
            Tekrar Dene
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    minWidth: 120,
  },
});
