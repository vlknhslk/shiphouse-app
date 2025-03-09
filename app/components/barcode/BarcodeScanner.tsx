import { StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ScanResult } from '@/types/package';

interface BarcodeScannerProps {
  onScan: (result: ScanResult) => void;
  enabled?: boolean;
}

export function BarcodeScanner({
  onScan,
  enabled = true,
}: BarcodeScannerProps) {
  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    onScan({
      type,
      data,
      timestamp: new Date(),
    });
  };

  return (
    <BarCodeScanner
      style={StyleSheet.absoluteFillObject}
      onBarCodeScanned={enabled ? handleBarCodeScanned : undefined}
      type={BarCodeScanner.Constants.Type.back}
      barCodeTypes={[
        BarCodeScanner.Constants.BarCodeType.code39,
        BarCodeScanner.Constants.BarCodeType.code128,
        BarCodeScanner.Constants.BarCodeType.ean13,
        BarCodeScanner.Constants.BarCodeType.ean8,
        BarCodeScanner.Constants.BarCodeType.upc_e,
      ]}
    />
  );
}
