export interface Package {
  id: string;
  trackingNumber: string;
  customerName: string;
  suiteCode: string;
  projectName: string; // 'Forwardme.com' | 'Ship7.com' | 'Store2Door.com'
  entryDate: Date;
  status: 'received' | 'processing' | 'completed';
  photos?: string[];
  weight?: string;
  notes?: string;
}

export interface ScanResult {
  type: string;
  data: string;
  timestamp: Date;
}

export interface PackageGateLog {
  id: string;
  packageId: string;
  trackingNumber: string;
  direction: 'in' | 'out';
  timestamp: Date;
  location: string;
  operator: string;
}
