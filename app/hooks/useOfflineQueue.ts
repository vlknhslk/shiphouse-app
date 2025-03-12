import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QueueItem {
  id: string;
  data: any;
  timestamp: number;
}

export default function useOfflineQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const addToQueue = useCallback(
    async (data: any) => {
      const item: QueueItem = {
        id: Math.random().toString(),
        data,
        timestamp: Date.now(),
      };

      setQueue((prev) => [...prev, item]);
      await AsyncStorage.setItem('offline_queue', JSON.stringify(queue));
    },
    [queue]
  );

  const processQueue = useCallback(async () => {
    // Queue'daki itemları işle
  }, []);

  return {
    queue,
    addToQueue,
    processQueue,
  };
}
