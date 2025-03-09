import { useState, useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

export function usePermissions() {
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const [cameraStatus, barcodeStatus] = await Promise.all([
        Camera.requestCameraPermissionsAsync(),
        BarCodeScanner.requestPermissionsAsync(),
      ]);

      const hasAllPermissions = cameraStatus.granted && barcodeStatus.granted;
      setHasPermissions(hasAllPermissions);

      if (!hasAllPermissions) {
        Alert.alert(
          'İzin Gerekli',
          'Kamera ve barkod tarayıcı özelliklerini kullanmak için izin vermeniz gerekiyor.',
          [
            { text: 'İptal', style: 'cancel' },
            {
              text: 'Ayarlar',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Permission check failed:', error);
      setHasPermissions(false);
    }
  };

  return {
    hasPermissions,
    checkPermissions,
  };
}
