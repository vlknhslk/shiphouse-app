import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Search, Camera, ArrowLeft, Package } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

// Mock customer data
const MOCK_CUSTOMER = {
  packageId: '393933',
  customerName: 'Volkan Haslak',
  suiteCode: 'ABD-745',
  entryDate: 'Feb 11th, 2024 - 10:15 PM',
  project: 'Forwardme.com',
};

export default function ManualEntryScreen() {
  const [packageId, setPackageId] = useState('');
  const [searchResult, setSearchResult] = useState<null | typeof MOCK_CUSTOMER>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (packageId.trim() === '') {
      setError('Please enter a Package ID');
      return;
    }

    if (!/^\d+$/.test(packageId)) {
      setError('Package ID must contain only numbers');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call with random delay between 1-3 seconds
    const delay = Math.random() * 2000 + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Mock API response
    if (packageId === '393933') {
      setSearchResult(MOCK_CUSTOMER);
    } else {
      setError('Package not found. Please check the ID and try again.');
      setSearchResult(null);
    }

    setIsLoading(false);
  };

  const handlePackageIdChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setPackageId(numericValue);
    setError('');
  };

  const handleCameraPress = () => {
    if (Platform.OS === 'web') {
      alert('Camera feature is only available on mobile devices');
      return;
    }
    router.push('/camera');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.title}>Package Lookup</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.searchSection}>
          <Package size={32} color="#6B7280" style={styles.searchIcon} />
          <Text style={styles.searchTitle}>Enter Package Details</Text>
          <Text style={styles.searchDescription}>
            Please enter the numeric package ID to retrieve customer information
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g., 393933"
              value={packageId}
              onChangeText={handlePackageIdChange}
              keyboardType="number-pad"
              maxLength={10}
              autoCorrect={false}
              editable={!isLoading}
            />
            <TouchableOpacity 
              style={[styles.searchButton, isLoading && styles.searchButtonDisabled]}
              onPress={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Search size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
          
          {error ? (
            <Animated.Text 
              entering={FadeIn}
              exiting={FadeOut}
              style={styles.errorText}
            >
              {error}
            </Animated.Text>
          ) : null}
        </View>

        {searchResult && (
          <Animated.View 
            entering={FadeIn.duration(400)}
            style={styles.resultContainer}
          >
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Package Information</Text>
              <Text style={styles.projectName}>{searchResult.project}</Text>
            </View>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Package ID</Text>
                <Text style={styles.detailValue}>{searchResult.packageId}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Customer Name</Text>
                <Text style={styles.detailValue}>{searchResult.customerName}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Suite Code</Text>
                <Text style={styles.detailValue}>{searchResult.suiteCode}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Entry Date</Text>
                <Text style={styles.detailValue}>{searchResult.entryDate}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={handleCameraPress}
            >
              <Camera size={24} color="#ffffff" />
              <Text style={styles.cameraButtonText}>Take Extra Photos</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Figtree-SemiBold',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  searchSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  searchIcon: {
    marginBottom: 16,
  },
  searchTitle: {
    fontSize: 24,
    fontFamily: 'Figtree-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  searchDescription: {
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 56,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
    color: '#1F2937',
  },
  searchButton: {
    width: 56,
    height: 56,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  errorText: {
    marginTop: 12,
    color: '#DC2626',
    fontSize: 14,
    fontFamily: 'Figtree-Medium',
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  resultHeader: {
    padding: 24,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultTitle: {
    fontSize: 20,
    fontFamily: 'Figtree-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  projectName: {
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
    color: '#6B7280',
  },
  detailsContainer: {
    padding: 24,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Figtree-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Figtree-SemiBold',
    color: '#1F2937',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    margin: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cameraButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Figtree-SemiBold',
  },
});