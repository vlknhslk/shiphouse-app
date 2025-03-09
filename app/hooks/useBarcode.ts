import { useState, useCallback } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ScanResult } from '@/types/package';

export function useBarcode() {
  const [isScanning, setIsScanning] = useState(true);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);

  const handleBarCodeScanned = useCallback(
    ({ type, data }: { type: string; data: string }) => {
      setIsScanning(false);
      setLastScan({
        type,
        data,
        timestamp: new Date(),
      });
    },
    []
  );

  const resetScanner = useCallback(() => {
    setIsScanning(true);
    setLastScan(null);
  }, []);

  return {
    isScanning,
    lastScan,
    handleBarCodeScanned,
    resetScanner,
  };
}
