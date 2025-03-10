import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import { colors, typography } from '@/constants';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { X, Flashlight, Camera } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCAN_AREA_SIZE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.7;
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 120;

// Dummy data for initial scanned items
const INITIAL_SCANNED_ITEMS = [
  {
    id: '1',
    code: 'JJD014600009194013770',
    type: 'CODE 128',
    timestamp: new Date(2024, 1, 21, 9, 30),
  },
  {
    id: '2',
    code: '420197139400116901612391406599',
    type: 'GS1 CODE 128',
    timestamp: new Date(2024, 1, 21, 9, 25),
  },
];

type ScannedItem = {
  id: string;
  code: string;
  type: string;
  timestamp: Date;
};

// Event tipini tanımlayalım
type PanGestureEvent = {
  translationY: number;
};

export default function ReceivingScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedItems, setScannedItems] = useState<
    Array<{ code: string; timestamp: Date }>
  >([]);
  const [torch, setTorch] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScannedItems((prev) => [
      {
        code: data,
        timestamp: new Date(),
      },
      ...prev,
    ]);
    Alert.alert('Başarılı', `Barkod başarıyla tarandı: ${data}`);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Header title="Receiving" />
        <View style={styles.content}>
          <Text>İzinler kontrol ediliyor...</Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Header title="Receiving" />
        <View style={styles.content}>
          <Text>Kamera izni reddedildi</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Receiving"
        rightAction={
          <Button variant="secondary" onPress={() => setTorch(!torch)}>
            {torch ? '🔦 Off' : '🔦 On'}
          </Button>
        }
      />

      <View style={styles.content}>
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFill}
            type={BarCodeScanner.Constants.Type.back}
            barCodeTypes={[
              BarCodeScanner.Constants.BarCodeType.qr,
              BarCodeScanner.Constants.BarCodeType.code128,
              BarCodeScanner.Constants.BarCodeType.code39,
              BarCodeScanner.Constants.BarCodeType.ean13,
              BarCodeScanner.Constants.BarCodeType.ean8,
            ]}
          >
            <View style={styles.overlay}>
              <View style={styles.unfocusedContainer}></View>
              <View style={styles.focusedContainer}>
                <View style={styles.focusedBorder} />
              </View>
              <View style={styles.unfocusedContainer}></View>
            </View>
          </BarCodeScanner>
        </View>

        <View style={styles.scannedItemsContainer}>
          <Text style={styles.scannedItemsTitle}>Son Taranan Barkodlar</Text>
          {scannedItems.length > 0 ? (
            scannedItems.map((item, index) => (
              <View key={index} style={styles.scannedItem}>
                <Text style={styles.scannedCode}>{item.code}</Text>
                <Text style={styles.scannedTime}>
                  {item.timestamp.toLocaleTimeString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noItemsText}>Henüz barkod taranmadı</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scannerContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  unfocusedContainer: {
    flex: 1,
  },
  focusedContainer: {
    height: 200,
    width: '80%',
    alignSelf: 'center',
  },
  focusedBorder: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  scannedItemsContainer: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  scannedItemsTitle: {
    fontSize: 16,
    fontFamily: typography.semiBold,
    color: colors.text,
    marginBottom: 12,
  },
  scannedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scannedCode: {
    fontSize: 14,
    fontFamily: typography.medium,
    color: colors.text,
  },
  scannedTime: {
    fontSize: 12,
    fontFamily: typography.regular,
    color: colors.textSecondary,
  },
  noItemsText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontFamily: typography.regular,
    fontSize: 14,
  },
});
