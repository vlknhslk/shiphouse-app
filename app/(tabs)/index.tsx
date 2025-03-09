import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import {
  Barcode,
  SquarePen as PenSquare,
  CirclePlay as PlayCircle,
  ClipboardList,
  Camera as CameraIcon,
} from 'lucide-react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome! Choose an option below to begin scanning your packages.
      </Text>

      <View style={styles.buttonContainer}>
        <View style={styles.scanningSection}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/camera')}
          >
            <Barcode size={24} color="#1a1a1a" />
            <Text style={styles.buttonText}>Scan Barcode</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/manual-entry')}
          >
            <PenSquare size={24} color="#1a1a1a" />
            <Text style={styles.buttonText}>Enter Barcode Manually</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <PlayCircle size={24} color="#1a1a1a" />
            <Text style={styles.buttonText}>
              Auto Mode (Waiting for Package)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/ocr-camera')}
          >
            <CameraIcon size={24} color="#1a1a1a" />
            <Text style={styles.buttonText}>OCR - Fotoğraftan Metin Çıkar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>or</Text>
          <View style={styles.separatorLine} />
        </View>

        <TouchableOpacity
          style={styles.logButton}
          onPress={() => router.push('/(tabs)/receiving')}
        >
          <ClipboardList size={24} color="#ffffff" />
          <Text style={styles.logButtonText}>Log Received Packages</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
  },
  buttonContainer: {
    flex: 1,
  },
  scanningSection: {
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
    }),
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginLeft: 16,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  separatorText: {
    paddingHorizontal: 16,
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  logButtonText: {
    fontSize: 16,
    fontFamily: 'Figtree-SemiBold',
    color: '#ffffff',
    marginLeft: 16,
  },
});
