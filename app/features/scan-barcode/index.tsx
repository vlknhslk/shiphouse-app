import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { colors, typography } from '@/constants';
import { useBarcode } from '@/hooks/useBarcode';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ScanResult } from '@/types/package';
import { usePermissions } from '@/hooks/usePermissions';
import { Linking } from 'react-native';

export default function ScanBarcodeScreen() {
  const router = useRouter();
  const { isScanning, lastScan, handleBarCodeScanned, resetScanner } =
    useBarcode();
  const [error, setError] = useState<string | null>(null);
  const { hasPermissions } = usePermissions();

  const handleScan = async (scan: ScanResult) => {
    try {
      // TODO: Process scan result
      router.push({
        pathname: '/package-details',
        params: { barcode: scan.data },
      });
    } catch (err) {
      setError('Failed to process barcode');
      resetScanner();
    }
  };

  if (hasPermissions === null) {
    return (
      <View style={styles.container}>
        <Header title="Scan Barcode" onBack={() => router.back()} />
        <View style={styles.content}>
          <Text style={styles.message}>İzinler kontrol ediliyor...</Text>
        </View>
      </View>
    );
  }

  if (hasPermissions === false) {
    return (
      <View style={styles.container}>
        <Header title="Scan Barcode" onBack={() => router.back()} />
        <View style={styles.content}>
          <Text style={styles.message}>
            Barkod tarayıcı için izin gerekiyor.
          </Text>
          <Button
            variant="primary"
            onPress={() => Linking.openSettings()}
            style={styles.settingsButton}
          >
            Ayarları Aç
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Scan Barcode" onBack={() => router.back()} />
      <View style={styles.content}>
        {isScanning ? (
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={styles.scanner}
          />
        ) : (
          <View style={styles.resultContainer}>
            {error ? (
              <>
                <Text style={styles.error}>{error}</Text>
                <Button variant="primary" onPress={resetScanner}>
                  Try Again
                </Button>
              </>
            ) : (
              <Text style={styles.scanComplete}>Scan Complete!</Text>
            )}
          </View>
        )}
      </View>
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
  scanner: {
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  error: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  scanComplete: {
    fontSize: 24,
    color: colors.success,
    fontFamily: typography.bold,
  },
  message: {
    fontSize: 16,
    fontFamily: typography.medium,
    color: colors.text,
    textAlign: 'center',
    padding: 20,
  },
  settingsButton: {
    marginTop: 20,
  },
});
