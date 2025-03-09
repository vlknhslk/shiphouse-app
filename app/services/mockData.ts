import { Package, PackageGateLog } from '@/types/package';

const projects = ['Forwardme.com', 'Ship7.com', 'Store2Door.com'] as const;
const locations = [
  'Main Gate',
  'Side Gate',
  'Warehouse A',
  'Warehouse B',
] as const;
const operators = ['John Doe', 'Jane Smith', 'Mike Johnson'] as const;

export const mockPackages: Package[] = Array.from({ length: 50 }, (_, i) => ({
  id: `pkg_${i + 1}`,
  trackingNumber: `TR${Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase()}`,
  customerName: `Customer ${i + 1}`,
  suiteCode: `SUITE${Math.floor(Math.random() * 1000)}`,
  projectName: projects[Math.floor(Math.random() * projects.length)],
  entryDate: new Date(
    Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
  ),
  status: ['received', 'processing', 'completed'][
    Math.floor(Math.random() * 3)
  ] as Package['status'],
  weight: `${(Math.random() * 20).toFixed(2)}`,
  notes: Math.random() > 0.7 ? `Test note for package ${i + 1}` : undefined,
  photos:
    Math.random() > 0.5
      ? ['https://picsum.photos/200', 'https://picsum.photos/200']
      : undefined,
}));

export const mockGateLogs: PackageGateLog[] = mockPackages.flatMap((pkg) => {
  const logsCount = Math.floor(Math.random() * 3) + 1;
  return Array.from({ length: logsCount }, (_, i) => ({
    id: `log_${pkg.id}_${i}`,
    packageId: pkg.id,
    trackingNumber: pkg.trackingNumber,
    direction: i % 2 === 0 ? 'in' : 'out',
    timestamp: new Date(pkg.entryDate.getTime() + i * 24 * 60 * 60 * 1000),
    location: locations[Math.floor(Math.random() * locations.length)],
    operator: operators[Math.floor(Math.random() * operators.length)],
  }));
});

export const mockDashboardStats = {
  pending: mockPackages.filter((p) => p.status === 'received').length,
  processing: mockPackages.filter((p) => p.status === 'processing').length,
  completed: mockPackages.filter((p) => p.status === 'completed').length,
  totalToday: mockPackages.filter(
    (p) => p.entryDate.toDateString() === new Date().toDateString()
  ).length,
};

// Helper fonksiyonlar
export const getMockPackage = (id: string) =>
  mockPackages.find((p) => p.id === id || p.trackingNumber === id);

export const getMockPackageLogs = (packageId: string) =>
  mockGateLogs.filter((l) => l.packageId === packageId);

export const searchMockPackages = (query: string) =>
  mockPackages.filter(
    (p) =>
      p.trackingNumber.toLowerCase().includes(query.toLowerCase()) ||
      p.customerName.toLowerCase().includes(query.toLowerCase()) ||
      p.suiteCode.toLowerCase().includes(query.toLowerCase())
  );
