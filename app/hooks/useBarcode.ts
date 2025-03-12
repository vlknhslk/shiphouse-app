import { useState, useCallback, useMemo } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function useBarcode() {
  // State'leri useMemo ile optimize edelim
  const initialState = useMemo(
    () => ({
      isScanning: true,
      lastScan: null,
    }),
    []
  );

  const [state, setState] = useState(initialState);

  // Callback'leri useCallback ile optimize edelim
  const handleBarCodeScanned = useCallback(({ data }: { data: string }) => {
    setState((prev) => ({
      ...prev,
      isScanning: false,
      lastScan: data,
    }));
  }, []);

  const resetScanner = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return {
    ...state,
    handleBarCodeScanned,
    resetScanner,
  };
}
