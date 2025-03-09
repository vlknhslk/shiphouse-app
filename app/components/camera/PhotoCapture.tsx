import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Camera as ExpoCamera,
  CameraType as ExpoCameraType,
} from 'expo-camera';
import { Camera as CameraIcon } from 'lucide-react-native';
import { colors } from '@/constants';

interface PhotoCaptureProps {
  onCapture: (uri: string) => void;
}

export function PhotoCapture({ onCapture }: PhotoCaptureProps) {
  const cameraRef = useRef<ExpoCamera>(null);

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
      <ExpoCamera
        ref={cameraRef}
        style={styles.camera}
        type={ExpoCameraType.back}
        ratio="16:9"
      >
        <View style={styles.controls}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <CameraIcon size={32} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </ExpoCamera>
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
});
