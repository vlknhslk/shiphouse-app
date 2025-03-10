import { useState, useCallback } from 'react';
import { Camera, PermissionResponse } from 'expo-camera';

export default function useCamera() {
  const [permission, setPermission] = useState<PermissionResponse | null>(null);
  const [isReady, setIsReady] = useState(false);

  const requestPermission = useCallback(async () => {
    const permissionResponse = await Camera.requestCameraPermissionsAsync();
    setPermission(permissionResponse);
    return permissionResponse;
  }, []);

  const initialize = useCallback(async () => {
    const { status } = await requestPermission();
    setIsReady(status === 'granted');
  }, [requestPermission]);

  return {
    permission,
    isReady,
    initialize,
  };
}
