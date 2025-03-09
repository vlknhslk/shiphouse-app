import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors, typography } from '@/constants';
import { useBarcode } from '@/hooks/useBarcode';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Package, PackageGateLog } from '@/types/package';

type ScanMode = 'in' | 'out';

export default function GateScanScreen() {
  const router = useRouter();
  const { isScanning, handleBarCodeScanned, resetScanner } = useBarcode();
  const [mode, setMode] = useState<ScanMode>('in');
  const [processing, setProcessing] = useState(false);
  const [lastLog, setLastLog] = useState<PackageGateLog | null>(null);

  const handleScan = async ({ type, data }: { type: string; data: string }) => {
    if (processing) return;

    try {
      setProcessing(true);

      // TODO: Implement API call to process gate scan
      const log: PackageGateLog = {
        id: Math.random().toString(),
        packageId: data,
        trackingNumber: data,
        direction: mode,
        timestamp: new Date(),
        location: 'Main Gate',
        operator: 'John Doe', // TODO: Get from auth context
      };

      setLastLog(log);
      Alert.alert(
        'Success',
        `Package ${mode === 'in' ? 'received' : 'shipped'} successfully`
      );
      resetScanner();
    } catch (error) {
      Alert.alert('Error', 'Failed to process package');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Gate Scan"
        onBack={() => router.back()}
        rightAction={
          <View style={styles.modeContainer}>
            <Button
              variant={mode === 'in' ? 'primary' : 'secondary'}
              onPress={() => setMode('in')}
              style={styles.modeButton}
            >
              In
            </Button>
            <Button
              variant={mode === 'out' ? 'primary' : 'secondary'}
              onPress={() => setMode('out')}
              style={styles.modeButton}
            >
              Out
            </Button>
          </View>
        }
      />

      <View style={styles.content}>
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={handleScan}
            style={styles.scanner}
          />
          {processing && (
            <View style={styles.processingOverlay}>
              <Text style={styles.processingText}>Processing...</Text>
            </View>
          )}
        </View>

        {lastLog && (
          <View style={styles.logContainer}>
            <Text style={styles.logTitle}>Last Scan</Text>
            <Text style={styles.logTracking}>{lastLog.trackingNumber}</Text>
            <View style={styles.logDetails}>
              <Text style={styles.logDirection}>
                {lastLog.direction === 'in' ? '📥 Received' : '📤 Shipped'}
              </Text>
              <Text style={styles.logTime}>
                {new Date(lastLog.timestamp).toLocaleTimeString()}
              </Text>
            </View>
            <Text style={styles.logLocation}>{lastLog.location}</Text>
          </View>
        )}

        <View style={styles.instructions}>
          <Text style={styles.instructionsText}>
            {mode === 'in'
              ? 'Scan package barcode to record arrival'
              : 'Scan package barcode to record departure'}
          </Text>
        </View>
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
    padding: 16,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    minWidth: 60,
  },
  scannerContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 24,
  },
  scanner: {
    flex: 1,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: colors.background,
    fontSize: 18,
    fontFamily: typography.semiBold,
  },
  logContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  logTitle: {
    fontSize: 14,
    fontFamily: typography.medium,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  logTracking: {
    fontSize: 18,
    fontFamily: typography.semiBold,
    color: colors.text,
    marginBottom: 8,
  },
  logDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logDirection: {
    fontSize: 16,
    fontFamily: typography.medium,
    color: colors.primary,
  },
  logTime: {
    fontSize: 14,
    fontFamily: typography.regular,
    color: colors.textSecondary,
  },
  logLocation: {
    fontSize: 14,
    fontFamily: typography.regular,
    color: colors.textSecondary,
  },
  instructions: {
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  instructionsText: {
    fontSize: 16,
    fontFamily: typography.medium,
    color: colors.text,
    textAlign: 'center',
  },
});
