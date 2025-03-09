import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors, typography } from '@/constants';

interface FormData {
  trackingNumber: string;
  weight: string;
  notes: string;
}

export default function ManualEntryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    trackingNumber: '',
    weight: '',
    notes: '',
  });

  const handleSubmit = async () => {
    if (!formData.trackingNumber) {
      setError('Tracking number is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Process manual entry
      router.push({
        pathname: '/package-details',
        params: { trackingNumber: formData.trackingNumber },
      });
    } catch (err) {
      setError('Failed to process package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Manual Entry" onBack={() => router.back()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tracking Number</Text>
            <TextInput
              style={styles.input}
              value={formData.trackingNumber}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, trackingNumber: text }))
              }
              placeholder="Enter tracking number"
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={formData.weight}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, weight: text }))
              }
              placeholder="Enter package weight"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, notes: text }))
              }
              placeholder="Add any additional notes"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={styles.footer}>
          <Button
            variant="primary"
            onPress={handleSubmit}
            loading={loading}
            disabled={!formData.trackingNumber}
          >
            Submit
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: typography.medium,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: typography.regular,
    color: colors.text,
    backgroundColor: colors.background,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  error: {
    color: colors.error,
    fontSize: 14,
    fontFamily: typography.medium,
    marginTop: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
