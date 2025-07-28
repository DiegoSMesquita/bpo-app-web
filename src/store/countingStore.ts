import { create } from 'zustand';
import type { 
  CountingState, 
  CountingProgress, 
  ProductCountData,
  CountingSummary,
  CountDiscrepancy
} from '@/types/counting';
import type { SectorCount, CountItem } from '@/types/database';

interface CountingStore extends CountingState {
  progress: CountingProgress;
  summary: CountingSummary | null;
  
  // Actions
  initializeSession: (sectorCount: SectorCount, items: CountItem[]) => void;
  setCurrentProduct: (index: number) => void;
  countProduct: (data: ProductCountData) => void;
  skipProduct: (reason: string) => void;
  markNotFound: (reason: string) => void;
  goToProduct: (index: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => void;
  reset: () => void;
  
  // Getters
  getCurrentProduct: () => CountItem | null;
  getProgress: () => CountingProgress;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
  hasDiscrepancies: () => boolean;
  getDiscrepancies: () => CountDiscrepancy[];
}

const initialState: CountingState = {
  currentSectorCount: null,
  currentProduct: null,
  currentIndex: 0,
  totalItems: 0,
  session: null,
  isActive: false,
  startTime: undefined
};

const initialProgress: CountingProgress = {
  total: 0,
  counted: 0,
  skipped: 0,
  notFound: 0,
  percentage: 0
};

export const useCountingStore = create<CountingStore>((set, get) => ({
  ...initialState,
  progress: initialProgress,
  summary: null,

  initializeSession: (sectorCount: SectorCount, items: CountItem[]) => {
    set({
      currentSectorCount: sectorCount,
      currentProduct: items[0] || null,
      currentIndex: 0,
      totalItems: items.length,
      isActive: true,
      startTime: new Date(),
      progress: {
        total: items.length,
        counted: 0,
        skipped: 0,
        notFound: 0,
        percentage: 0
      }
    });
  },

  setCurrentProduct: (index: number) => {
    const { currentSectorCount } = get();
    const items = currentSectorCount?.count_items || [];
    const product = items[index] || null;
    
    set({
      currentProduct: product,
      currentIndex: index
    });
  },

  countProduct: (data: ProductCountData) => {
    const { currentSectorCount, currentIndex, progress } = get();
    if (!currentSectorCount || !currentSectorCount.count_items) return;

    // Update the item
    const items = [...currentSectorCount.count_items];
    if (items[currentIndex]) {
      items[currentIndex] = {
        ...items[currentIndex],
        counted_quantity: data.quantity,
        observations: data.observations,
        is_counted: true,
        counted_at: new Date().toISOString(),
        difference: data.quantity - items[currentIndex].expected_quantity
      };
    }

    // Update progress
    const newProgress = {
      ...progress,
      counted: progress.counted + 1,
      percentage: ((progress.counted + 1) / progress.total) * 100
    };

    set({
      currentSectorCount: {
        ...currentSectorCount,
        count_items: items,
        counted_products: newProgress.counted
      },
      progress: newProgress
    });

    // Auto-advance to next product
    const nextIndex = currentIndex + 1;
    if (nextIndex < items.length) {
      get().setCurrentProduct(nextIndex);
    }
  },

  skipProduct: (reason: string) => {
    const { currentIndex, progress } = get();
    
    const newProgress = {
      ...progress,
      skipped: progress.skipped + 1,
      percentage: ((progress.counted + progress.skipped + 1) / progress.total) * 100
    };

    set({ progress: newProgress });

    // Auto-advance to next product
    const nextIndex = currentIndex + 1;
    if (nextIndex < get().totalItems) {
      get().setCurrentProduct(nextIndex);
    }
  },

  markNotFound: (reason: string) => {
    const { currentIndex, progress } = get();
    
    const newProgress = {
      ...progress,
      notFound: progress.notFound + 1,
      percentage: ((progress.counted + progress.skipped + progress.notFound + 1) / progress.total) * 100
    };

    set({ progress: newProgress });

    // Auto-advance to next product
    const nextIndex = currentIndex + 1;
    if (nextIndex < get().totalItems) {
      get().setCurrentProduct(nextIndex);
    }
  },

  goToProduct: (index: number) => {
    get().setCurrentProduct(index);
  },

  pauseSession: () => {
    set({ isActive: false });
  },

  resumeSession: () => {
    set({ isActive: true });
  },

  completeSession: () => {
    const { currentSectorCount, startTime, progress } = get();
    
    if (currentSectorCount && startTime) {
      const summary: CountingSummary = {
        sectorName: currentSectorCount.sector?.name || 'Unknown',
        employeeName: currentSectorCount.employee_name || 'Unknown',
        startTime,
        endTime: new Date(),
        totalProducts: progress.total,
        countedProducts: progress.counted,
        skippedProducts: progress.skipped + progress.notFound,
        discrepancies: get().getDiscrepancies(),
        observations: []
      };

      set({
        isActive: false,
        summary
      });
    }
  },

  reset: () => {
    set({
      ...initialState,
      progress: initialProgress,
      summary: null
    });
  },

  getCurrentProduct: () => {
    return get().currentProduct;
  },

  getProgress: () => {
    return get().progress;
  },

  canGoNext: () => {
    const { currentIndex, totalItems } = get();
    return currentIndex < totalItems - 1;
  },

  canGoPrevious: () => {
    const { currentIndex } = get();
    return currentIndex > 0;
  },

  hasDiscrepancies: () => {
    return get().getDiscrepancies().length > 0;
  },

  getDiscrepancies: () => {
    const { currentSectorCount } = get();
    if (!currentSectorCount?.count_items) return [];

    return currentSectorCount.count_items
      .filter(item => 
        item.is_counted && 
        item.counted_quantity !== undefined &&
        item.difference !== undefined &&
        Math.abs(item.difference) > 0
      )
      .map(item => ({
        productCode: item.product?.code || '',
        productName: item.product?.name || '',
        expected: item.expected_quantity,
        counted: item.counted_quantity!,
        difference: item.difference!,
        percentageDiff: (item.difference! / item.expected_quantity) * 100,
        observations: item.observations
      }));
  }
}));