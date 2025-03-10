import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { Camera as CameraIcon } from 'lucide-react-native';
import { colors, typography } from '@/constants';
import { usePermissions } from '@/hooks/usePermissions';

interface PhotoCaptureProps {
  onCapture: (uri: string) => void;
}

export default function PhotoCapture({ onCapture }: PhotoCaptureProps) {
  const { hasPermissions } = usePermissions();
  const cameraRef = useRef<Camera>(null);

  if (hasPermissions === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>İzinler kontrol ediliyor...</Text>
      </View>
    );
  }

  if (hasPermissions === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Kamera kullanımı için izin gerekiyor.
        </Text>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: true,
      });
      onCapture(photo.uri);
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ratio="16:9"
      >
        <View style={styles.controls}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <CameraIcon size={32} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  message: {
    fontSize: 16,
    fontFamily: typography.medium,
    color: colors.text,
    textAlign: 'center',
    padding: 20,
  },
});
