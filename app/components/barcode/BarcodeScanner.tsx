import React from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StyleSheet, View } from 'react-native';
import { ScanOverlay } from './ScanOverlay';

interface BarcodeScannerProps {
  onScan: (data: string) => void;
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    onScan(data);
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <ScanOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
