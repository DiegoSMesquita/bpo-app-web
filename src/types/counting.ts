import type { SectorCount, CountItem, SectorCountStatus } from './database';
import type { CountingSession } from './auth';

export interface CountingState {
  currentSectorCount: SectorCount | null;
  currentProduct: CountItem | null;
  currentIndex: number;
  totalItems: number;
  session: CountingSession | null;
  isActive: boolean;
  startTime?: Date;
}

export interface CountingProgress {
  total: number;
  counted: number;
  skipped: number;
  notFound: number;
  percentage: number;
  estimatedTimeRemaining?: number;
}

export interface ProductCountData {
  productId: string;
  quantity: number;
  observations?: string;
  timestamp: Date;
}

export interface CountingValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CountingSummary {
  sectorName: string;
  employeeName: string;
  startTime: Date;
  endTime?: Date;
  totalProducts: number;
  countedProducts: number;
  skippedProducts: number;
  discrepancies: CountDiscrepancy[];
  observations: string[];
}

export interface CountDiscrepancy {
  productCode: string;
  productName: string;
  expected: number;
  counted: number;
  difference: number;
  percentageDiff: number;
  observations?: string;
}

export interface CountingFilters {
  status?: SectorCountStatus;
  companyId?: string;
  sectorId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Re-export from database types
export type { SectorCount, CountItem } from './database';