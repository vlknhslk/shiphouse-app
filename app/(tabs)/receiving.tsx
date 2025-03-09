import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { X, Flashlight, Camera } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate,
  Extrapolate
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

export default function ReceivingScreen() {
  const [permission, requestPermission] = Platform.OS === 'web' ? [null, () => {}] : BarCodeScanner.usePermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>(INITIAL_SCANNED_ITEMS);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const scrollRef = useRef(null);

  // Web platform alternative UI
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <Text style={styles.webTitle}>Barcode Scanner</Text>
        <Text style={styles.webDescription}>
          The barcode scanner feature is only available on mobile devices. 
          Please use the Expo Go app on your mobile device to access this feature.
        </Text>
      </View>
    );
  }

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(MAX_TRANSLATE_Y, Math.min(translateY.value, 0));
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 3) {
        translateY.value = withSpring(0, { damping: 50 });
      } else {
        translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP
    );

    return {
      borderRadius,
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    const newItem: ScannedItem = {
      id: Math.random().toString(),
      code: data,
      type: type,
      timestamp: new Date(),
    };
    setScannedItems([newItem, ...scannedItems]);
  };

  const resumeScanning = () => {
    setScanned(false);
    translateY.value = withSpring(0, { damping: 50 });
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeTypes={[
          BarCodeScanner.Constants.BarCodeType.code39,
          BarCodeScanner.Constants.BarCodeType.code128,
          BarCodeScanner.Constants.BarCodeType.ean13,
          BarCodeScanner.Constants.BarCodeType.ean8,
          BarCodeScanner.Constants.BarCodeType.upc_e,
        ]}
        torchMode={torch ? 'on' : 'off'}
      >
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.middleContainer}>
            <View style={styles.unfocusedContainer}></View>
            <View style={styles.focusedContainer}>
              <View style={[styles.cornerMarker, styles.topLeft]} />
              <View style={[styles.cornerMarker, styles.topRight]} />
              <View style={[styles.cornerMarker, styles.bottomLeft]} />
              <View style={[styles.cornerMarker, styles.bottomRight]} />
            </View>
            <View style={styles.unfocusedContainer}></View>
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.controlButton, torch && styles.activeButton]}
            onPress={() => setTorch(!torch)}
          >
            <Flashlight size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.bottomSheet, rBottomSheetStyle]}>
            <View style={styles.bottomSheetHeader}>
              <View style={styles.bottomSheetHandle} />
              <Text style={styles.scannedCount}>{scannedItems.length} Items Scanned</Text>
            </View>

            {scannedItems.length > 0 && (
              <>
                <View style={styles.lastScannedItem}>
                  <Text style={styles.lastScannedCode}>{scannedItems[0]?.code}</Text>
                  <View style={styles.lastScannedDetails}>
                    <Text style={styles.codeType}>{scannedItems[0]?.type}</Text>
                    <Text style={styles.timestamp}>{formatTimestamp(scannedItems[0]?.timestamp)}</Text>
                  </View>
                </View>

                <ScrollView
                  ref={scrollRef}
                  style={styles.scannedList}
                  showsVerticalScrollIndicator={false}
                >
                  {scannedItems.map((item) => (
                    <View key={item.id} style={styles.scannedItem}>
                      <View style={styles.scannedItemContent}>
                        <Text style={styles.scannedCode}>{item.code}</Text>
                        <View style={styles.scannedItemDetails}>
                          <Text style={styles.scannedType}>{item.type}</Text>
                          <Text style={styles.scannedTimestamp}>
                            {formatTimestamp(item.timestamp)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.resumeButton}
                  onPress={resumeScanning}
                >
                  <Camera size={20} color="#ffffff" style={styles.resumeButtonIcon} />
                  <Text style={styles.resumeButtonText}>RESUME SCANNING</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </GestureDetector>
      </BarCodeScanner>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  webTitle: {
    fontSize: 24,
    fontFamily: 'Figtree-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  webDescription: {
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 400,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Figtree-Regular',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0066FF',
    padding: 16,
    borderRadius: 12,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Figtree-SemiBold',
  },
  overlay: {
    flex: 1,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  middleContainer: {
    flexDirection: 'row',
    height: SCAN_AREA_SIZE,
  },
  focusedContainer: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
  },
  cornerMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#ffffff',
    backgroundColor: 'transparent',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderBottomRightRadius: 12,
  },
  controls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 24,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#0066FF',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingTop: 12,
    minHeight: 200,
  },
  bottomSheetHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 12,
  },
  scannedCount: {
    fontSize: 18,
    fontFamily: 'Figtree-SemiBold',
    color: '#1F2937',
  },
  lastScannedItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  lastScannedCode: {
    fontSize: 24,
    fontFamily: 'Figtree-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  lastScannedDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeType: {
    fontSize: 14,
    fontFamily: 'Figtree-Medium',
    color: '#6B7280',
  },
  timestamp: {
    fontSize: 14,
    fontFamily: 'Figtree-Regular',
    color: '#6B7280',
  },
  scannedList: {
    maxHeight: SCREEN_HEIGHT - 300,
  },
  scannedItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  scannedItemContent: {
    flex: 1,
  },
  scannedCode: {
    fontSize: 16,
    fontFamily: 'Figtree-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  scannedItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scannedType: {
    fontSize: 14,
    fontFamily: 'Figtree-Regular',
    color: '#6B7280',
  },
  scannedTimestamp: {
    fontSize: 14,
    fontFamily: 'Figtree-Regular',
    color: '#6B7280',
  },
  resumeButton: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resumeButtonIcon: {
    marginRight: 8,
  },
  resumeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Figtree-SemiBold',
  },
});