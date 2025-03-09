import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

interface PermissionStatus {
  camera: boolean;
  barcode: boolean;
  loading: boolean;
  error: string | null;
}

export function usePermissions() {
  const [status, setStatus] = useState<PermissionStatus>({
    camera: false,
    barcode: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const [cameraPermission, barcodePermission] = await Promise.all([
        Camera.requestCameraPermissionsAsync(),
        BarCodeScanner.requestPermissionsAsync(),
      ]);

      setStatus({
        camera: cameraPermission.granted,
        barcode: barcodePermission.granted,
        loading: false,
        error: null,
      });
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to check permissions',
      }));
    }
  };

  return status;
}
