import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, Modal } from 'react-native';
import { CircleAlert, CircleCheck, Clock, ArrowRight, RefreshCcw } from 'lucide-react-native';

// Updated mock data with success items
const PROCESSING_ITEMS = [
  {
    id: 'PKG005',
    customerName: 'David Chen',
    status: 'completed',
    timestamp: '2024-02-21 10:30:00',
    photos: [
      {
        id: 'photo6',
        url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=200&h=200&fit=crop&q=80',
        status: 'success'
      },
      {
        id: 'photo7',
        url: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=200&h=200&fit=crop&q=80',
        status: 'success'
      },
      {
        id: 'photo8',
        url: 'https://images.unsplash.com/photo-1505253304499-671c55fb57fe?w=200&h=200&fit=crop&q=80',
        status: 'success'
      }
    ]
  },
  {
    id: 'PKG006',
    customerName: 'Lisa Anderson',
    status: 'completed',
    timestamp: '2024-02-21 10:15:00',
    photos: [
      {
        id: 'photo9',
        url: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=200&h=200&fit=crop&q=80',
        status: 'success'
      },
      {
        id: 'photo10',
        url: 'https://images.unsplash.com/photo-1505253304499-671c55fb57fe?w=200&h=200&fit=crop&q=80',
        status: 'success'
      },
      {
        id: 'photo11',
        url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=200&h=200&fit=crop&q=80',
        status: 'success'
      }
    ]
  },
  {
    id: 'PKG001',
    customerName: 'John Smith',
    status: 'queue',
    timestamp: '2024-02-21 09:30:00',
    progress: 0,
  },
  {
    id: 'PKG002',
    customerName: 'Emma Johnson',
    status: 'failed',
    timestamp: '2024-02-21 09:25:00',
    photos: [
      {
        id: 'photo1',
        url: 'https://images.unsplash.com/photo-1666919643134-d97687c1826c?w=200&h=200&fit=crop&q=80',
        status: 'failed',
        retryCount: 2
      },
      {
        id: 'photo2',
        url: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=200&h=200&fit=crop&q=80',
        status: 'success'
      }
    ]
  },
  {
    id: 'PKG003',
    customerName: 'Michael Brown',
    status: 'failed',
    timestamp: '2024-02-21 09:15:00',
    photos: [
      {
        id: 'photo3',
        url: 'https://images.unsplash.com/photo-1505253304499-671c55fb57fe?w=200&h=200&fit=crop&q=80',
        status: 'failed',
        retryCount: 1
      }
    ]
  },
  {
    id: 'PKG004',
    customerName: 'Sarah Wilson',
    status: 'failed',
    timestamp: '2024-02-21 09:10:00',
    photos: [
      {
        id: 'photo4',
        url: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=200&h=200&fit=crop&q=80',
        status: 'failed',
        retryCount: 3
      },
      {
        id: 'photo5',
        url: 'https://images.unsplash.com/photo-1505253304499-671c55fb57fe?w=200&h=200&fit=crop&q=80',
        status: 'failed',
        retryCount: 1
      }
    ]
  }
];

type ProcessingStatus = 'all' | 'failed';
type PhotoStatus = 'success' | 'failed';

interface Photo {
  id: string;
  url: string;
  status: PhotoStatus;
  retryCount?: number;
}

interface ProcessingItem {
  id: string;
  customerName: string;
  status: string;
  timestamp: string;
  progress?: number;
  photos?: Photo[];
}

export default function ProcessingScreen() {
  const [statusFilter, setStatusFilter] = useState<ProcessingStatus>('all');
  const [selectedItem, setSelectedItem] = useState<ProcessingItem | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const failedItems = PROCESSING_ITEMS.filter(item => item.status === 'failed');

  const filteredItems = statusFilter === 'all' 
    ? PROCESSING_ITEMS 
    : PROCESSING_ITEMS.filter(item => item.status === 'failed');

  const handleRetrySelected = () => {
    // Implement retry logic here
    console.log('Retrying selected photos:', selectedPhotos);
    setSelectedPhotos([]);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'queue':
        return (
          <View style={[styles.badge, styles.queueBadge]}>
            <Clock size={14} color="#6366F1" />
            <Text style={[styles.badgeText, styles.queueText]}>Waiting in Queue</Text>
          </View>
        );
      case 'failed':
        return (
          <View style={[styles.badge, styles.failedBadge]}>
            <CircleAlert size={14} color="#DC2626" />
            <Text style={[styles.badgeText, styles.failedText]}>Failed</Text>
          </View>
        );
      case 'completed':
        return (
          <View style={[styles.badge, styles.completedBadge]}>
            <CircleCheck size={14} color="#10B981" />
            <Text style={[styles.badgeText, styles.completedText]}>Completed</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, statusFilter === 'all' && styles.toggleButtonActive]}
            onPress={() => setStatusFilter('all')}
          >
            <Text
              style={[styles.toggleButtonText, statusFilter === 'all' && styles.toggleButtonTextActive]}
            >
              List All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, statusFilter === 'failed' && styles.toggleButtonActive]}
            onPress={() => setStatusFilter('failed')}
          >
            <Text
              style={[
                styles.toggleButtonText,
                statusFilter === 'failed' && styles.toggleButtonTextActive,
              ]}
            >
              List Failed ({failedItems.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {filteredItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.card}
            onPress={() => setSelectedItem(item)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.packageId}>{item.id}</Text>
              {renderStatusBadge(item.status)}
            </View>
            <Text style={styles.customerName}>{item.customerName}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            
            {item.status === 'failed' && item.photos && (
              <View style={styles.photoPreview}>
                <Text style={styles.photoCount}>
                  {item.photos.filter(p => p.status === 'failed').length} failed photos
                </Text>
                <ArrowRight size={16} color="#6B7280" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={selectedItem !== null}
        animationType="slide"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalContainer}>
          <View style={[
            styles.modalHeader,
            Platform.OS === 'ios' && styles.modalHeaderIOS
          ]}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedItem(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedItem?.id}</Text>
            {selectedPhotos.length > 0 && (
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={handleRetrySelected}
              >
                <RefreshCcw size={16} color="#ffffff" />
                <Text style={styles.retryButtonText}>Retry Selected</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedItem?.photos?.map((photo) => (
              <View key={photo.id} style={styles.photoItem}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    selectedPhotos.includes(photo.id) && styles.checkboxSelected
                  ]}
                  onPress={() => {
                    if (photo.status === 'failed') {
                      setSelectedPhotos(prev => 
                        prev.includes(photo.id)
                          ? prev.filter(id => id !== photo.id)
                          : [...prev, photo.id]
                      );
                    }
                  }}
                >
                  {selectedPhotos.includes(photo.id) && (
                    <CircleCheck size={16} color="#ffffff" />
                  )}
                </TouchableOpacity>
                
                <Image
                  source={{ uri: photo.url }}
                  style={styles.photoThumbnail}
                />
                
                <View style={styles.photoDetails}>
                  <View style={[
                    styles.statusIndicator,
                    photo.status === 'success' ? styles.successIndicator : styles.failedIndicator
                  ]}>
                    {photo.status === 'success' ? (
                      <CircleCheck size={14} color="#10B981" />
                    ) : (
                      <CircleAlert size={14} color="#DC2626" />
                    )}
                    <Text style={[
                      styles.statusText,
                      photo.status === 'success' ? styles.successText : styles.failedText
                    ]}>
                      {photo.status === 'success' ? 'Success' : 'Failed'}
                    </Text>
                  </View>
                  {photo.status === 'failed' && photo.retryCount && (
                    <Text style={styles.retryCount}>
                      Retry count: {photo.retryCount}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
    }),
  },
  toggleButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  toggleButtonTextActive: {
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageId: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  customerName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  queueBadge: {
    backgroundColor: '#EEF2FF',
  },
  failedBadge: {
    backgroundColor: '#FEE2E2',
  },
  completedBadge: {
    backgroundColor: '#D1FAE5',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  queueText: {
    color: '#6366F1',
  },
  failedText: {
    color: '#DC2626',
  },
  completedText: {
    color: '#10B981',
  },
  photoPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  photoCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalHeaderIOS: {
    paddingTop: 60,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  photoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  photoDetails: {
    flex: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  successIndicator: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  failedIndicator: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  successText: {
    color: '#10B981',
  },
  failedText: {
    color: '#DC2626',
  },
  retryCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
});