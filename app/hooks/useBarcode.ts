import { useState, useCallback } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function useBarcode() {
  const [isScanning, setIsScanning] = useState(true);
  const [lastScan, setLastScan] = useState<string | null>(null);

  const handleBarCodeScanned = useCallback(({ data }: { data: string }) => {
    setIsScanning(false);
    setLastScan(data);
  }, []);

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
