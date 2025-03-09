import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Vibration } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { colors, typography } from '@/constants';
import { useBarcode } from '@/hooks/useBarcode';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Package } from '@/types/package';

interface Stats {
  scanned: number;
  processed: number;
  failed: number;
}

export default function AutoModeScreen() {
  const router = useRouter();
  const { isScanning, handleBarCodeScanned, resetScanner } = useBarcode();
  const [active, setActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [lastPackage, setLastPackage] = useState<Package | null>(null);
  const [stats, setStats] = useState<Stats>({
    scanned: 0,
    processed: 0,
    failed: 0,
  });

  useEffect(() => {
    if (!active) {
      resetScanner();
    }
  }, [active]);

  const handleScan = async ({ type, data }: { type: string; data: string }) => {
    if (!active || processing) return;

    try {
      setProcessing(true);
      Vibration.vibrate(100);

      // TODO: Process package with API
      const processedPackage: Package = {
        id: Math.random().toString(),
        trackingNumber: data,
        status: 'processed',
        timestamp: new Date(),
      };

      setLastPackage(processedPackage);
      setStats((prev) => ({
        ...prev,
        scanned: prev.scanned + 1,
        processed: prev.processed + 1,
      }));

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      resetScanner();
    } catch (error) {
      setStats((prev) => ({
        ...prev,
        scanned: prev.scanned + 1,
        failed: prev.failed + 1,
      }));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Auto Mode"
        onBack={() => router.back()}
        rightAction={
          <Button
            variant={active ? 'primary' : 'secondary'}
            onPress={() => setActive(!active)}
            style={styles.toggleButton}
          >
            {active ? 'Stop' : 'Start'}
          </Button>
        }
      />

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.scanned}</Text>
            <Text style={styles.statLabel}>Scanned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.processed}</Text>
            <Text style={styles.statLabel}>Processed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.failed}</Text>
            <Text style={styles.statLabel}>Failed</Text>
          </View>
        </View>

        {active && (
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
        )}

        {lastPackage && (
          <View style={styles.lastPackageContainer}>
            <Text style={styles.lastPackageTitle}>Last Package</Text>
            <Text style={styles.lastPackageTracking}>
              {lastPackage.trackingNumber}
            </Text>
            <Text style={styles.lastPackageTime}>
              {new Date(lastPackage.timestamp).toLocaleTimeString()}
            </Text>
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
    padding: 16,
  },
  toggleButton: {
    minWidth: 80,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: typography.bold,
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: typography.medium,
    color: colors.textSecondary,
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
  lastPackageContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  lastPackageTitle: {
    fontSize: 14,
    fontFamily: typography.medium,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  lastPackageTracking: {
    fontSize: 18,
    fontFamily: typography.semiBold,
    color: colors.text,
    marginBottom: 4,
  },
  lastPackageTime: {
    fontSize: 14,
    fontFamily: typography.regular,
    color: colors.textSecondary,
  },
});
