import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Text from '@/components/ui/Text';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Button';
import { colors, typography } from '@/constants';
import { useRouter } from 'expo-router';
import { mockDashboardStats, mockPackages } from '@/services/mockData';

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const recentPackages = mockPackages
    .sort((a, b) => b.entryDate.getTime() - a.entryDate.getTime())
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{mockDashboardStats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {mockDashboardStats.processing}
            </Text>
            <Text style={styles.statLabel}>Processing</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{mockDashboardStats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Packages</Text>
          {recentPackages.map((pkg) => (
            <View key={pkg.id} style={styles.packageItem}>
              <View>
                <Text style={styles.trackingNumber}>{pkg.trackingNumber}</Text>
                <Text style={styles.packageInfo}>
                  {pkg.customerName} • {pkg.projectName}
                </Text>
              </View>
              <Text
                style={[
                  styles.status,
                  pkg.status === 'completed' && styles.statusCompleted,
                  pkg.status === 'processing' && styles.statusProcessing,
                ]}
              >
                {pkg.status}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsContainer}>
          <Button
            variant="primary"
            onPress={() => router.push('/scan-barcode')}
            style={styles.actionButton}
          >
            Scan Barcode
          </Button>
          <Button
            variant="secondary"
            onPress={() => router.push('/manual-entry')}
            style={styles.actionButton}
          >
            Manual Entry
          </Button>
          <Button
            variant="secondary"
            onPress={() => router.push('/auto-mode')}
            style={styles.actionButton}
          >
            Auto Mode
          </Button>
          <Button
            variant="secondary"
            onPress={() => router.push('/gate-scan')}
            style={styles.actionButton}
          >
            Gate Scan
          </Button>
        </View>
      </ScrollView>
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
  contentContainer: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: typography.bold,
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: typography.medium,
    color: colors.textSecondary,
  },
  recentContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.semiBold,
    color: colors.text,
    marginBottom: 12,
  },
  packageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
  },
  trackingNumber: {
    fontSize: 16,
    fontFamily: typography.semiBold,
    color: colors.text,
    marginBottom: 4,
  },
  packageInfo: {
    fontSize: 14,
    fontFamily: typography.regular,
    color: colors.textSecondary,
  },
  status: {
    fontSize: 14,
    fontFamily: typography.medium,
    color: colors.text,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  statusCompleted: {
    backgroundColor: colors.success + '20',
    color: colors.success,
  },
  statusProcessing: {
    backgroundColor: colors.primary + '20',
    color: colors.primary,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 12,
  },
});
