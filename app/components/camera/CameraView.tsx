import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { colors, typography } from '@/constants';
import { PhotoCapture } from './PhotoCapture';

interface CameraViewProps {
  onCapture: (uri: string) => void;
  onClose: () => void;
}

export function CameraView({ onCapture, onClose }: CameraViewProps) {
  const [photo, setPhoto] = useState<string | null>(null);

  const handleCapture = (uri: string) => {
    setPhoto(uri);
  };

  const handleConfirm = () => {
    if (photo) {
      onCapture(photo);
    }
  };

  const handleRetake = () => {
    setPhoto(null);
  };

  return (
    <View style={styles.container}>
      {!photo ? (
        <PhotoCapture onCapture={handleCapture} />
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleRetake}
            >
              <X size={24} color={colors.primary} />
              <Text style={styles.actionButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Check size={24} color="#ffffff" />
              <Text style={[styles.actionButtonText, styles.confirmButtonText]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <X size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  previewContainer: {
    flex: 1,
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.background,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: typography.semiBold,
    color: colors.primary,
  },
  confirmButtonText: {
    color: colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
