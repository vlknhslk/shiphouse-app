import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  X,
  Camera as CameraIcon,
  Image as ImageIcon,
  Check,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { performOCR } from '../services/ocrServices';

export default function OCRCameraScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<Camera>(null);

  // İzin kontrolü
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Kamera izni alınıyor...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          OCR kullanmak için kamera iznine ihtiyacımız var
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fotoğraf çekme fonksiyonu
  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();

      // Resmi işleme (daha iyi OCR sonuçları için)
      const processedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      setCapturedImage(processedImage.uri);
    } catch (error) {
      console.error('Fotoğraf çekilirken hata oluştu:', error);
    }
  };

  // Resmi analiz etme
  const analyzeImage = async () => {
    if (!capturedImage) return;

    setIsProcessing(true);

    try {
      const text = await performOCR(capturedImage);
      setExtractedText(text);
    } catch (error) {
      console.error('Resim analiz edilirken hata oluştu:', error);
      setExtractedText('Metin çıkarılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Yeniden başlatma
  const resetCapture = () => {
    setCapturedImage(null);
    setExtractedText(null);
  };

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        // Kamera görünümü
        <Camera style={styles.camera} ref={cameraRef} ratio="16:9">
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.cameraOverlay}>
            <View style={styles.documentFrame} />
          </View>

          <View style={styles.cameraFooter}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <CameraIcon size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </Camera>
      ) : !extractedText ? (
        // Çekilen resim önizleme
        <View style={styles.previewContainer}>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.closeButton} onPress={resetCapture}>
              <X size={24} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <Image source={{ uri: capturedImage }} style={styles.previewImage} />

          <View style={styles.previewFooter}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={resetCapture}
            >
              <X size={20} color="#1a1a1a" />
              <Text style={styles.buttonTextSmall}>YENİDEN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={analyzeImage}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Check size={20} color="#ffffff" />
                  <Text style={[styles.buttonTextSmall, styles.whiteText]}>
                    ANALİZ ET
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Metin sonucu
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <X size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.resultTitle}>Çıkarılan Metin</Text>
            <TouchableOpacity
              style={styles.newScanButton}
              onPress={resetCapture}
            >
              <CameraIcon size={24} color="#0066FF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.resultScroll}>
            <Text style={styles.resultTitle}>Mistral AI OCR Sonucu:</Text>
            <View style={styles.resultCard}>
              <Text style={styles.resultText}>{extractedText}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={async () => {
                  if (extractedText) {
                    await Clipboard.setStringAsync(extractedText);
                    alert('Metin panoya kopyalandı!');
                  }
                }}
              >
                <Text style={styles.actionButtonText}>Metni Kopyala</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Figtree-SemiBold',
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentFrame: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: '#0066FF',
    borderRadius: 12,
  },
  cameraFooter: {
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
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    gap: 8,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#0066FF',
    gap: 8,
  },
  buttonTextSmall: {
    fontSize: 14,
    fontFamily: 'Figtree-SemiBold',
    color: '#1a1a1a',
  },
  whiteText: {
    color: '#ffffff',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resultTitle: {
    fontSize: 18,
    fontFamily: 'Figtree-SemiBold',
    color: '#1a1a1a',
  },
  newScanButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultScroll: {
    flex: 1,
    padding: 16,
  },
  resultText: {
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
    color: '#1a1a1a',
    lineHeight: 24,
  },
  resultCard: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: '#0066FF',
    padding: 12,
    borderRadius: 8,
    margin: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
