import { BarCodeScanner } from 'expo-barcode-scanner';
// ... diğer importlar

export function BarcodeScanner({ onScan, ...props }) {
  return (
    <BarCodeScanner
      onBarCodeScanned={onScan}
      type={BarCodeScanner.Constants.Type.back}
      {...props}
    />
  );
}
