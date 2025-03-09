import { useState, useCallback } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';

interface UseCameraOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export function useCamera(options: UseCameraOptions = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(
    async (uri: string) => {
      setIsProcessing(true);
      setError(null);

      try {
        const processed = await ImageManipulator.manipulateAsync(
          uri,
          [
            {
              resize: {
                width: options.maxWidth || 1200,
                height: options.maxHeight || 1200,
              },
            },
          ],
          {
            compress: options.quality || 0.7,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );

        return processed.uri;
      } catch (err) {
        setError('Failed to process image');
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [options]
  );

  return {
    processImage,
    isProcessing,
    error,
  };
}
