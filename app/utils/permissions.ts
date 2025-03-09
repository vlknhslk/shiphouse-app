import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

export async function requestCameraPermissions() {
  const [cameraPermission, barcodePermission] = await Promise.all([
    Camera.requestCameraPermissionsAsync(),
    BarCodeScanner.requestPermissionsAsync(),
  ]);

  return {
    camera: cameraPermission.granted,
    barcode: barcodePermission.granted,
  };
}
