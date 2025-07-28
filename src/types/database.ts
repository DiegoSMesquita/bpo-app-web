export interface Sector {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  code: string;
  name: string;
  description?: string;
  unit_measure?: string;
  category?: string;
  min_stock: number;
  max_stock: number;
  cost_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectorProduct {
  id: string;
  sector_id: string;
  product_id: string;
  expected_stock: number;
  created_at: string;
  product?: Product;
}

export interface InventoryCount {
  id: string;
  company_id: string;
  count_number: string;
  title: string;
  description?: string;
  status: CountStatus;
  type: CountType;
  deadline?: string;
  started_by?: string;
  completed_by?: string;
  started_at?: string;
  completed_at?: string;
  total_products: number;
  counted_products: number;
  created_at: string;
  updated_at: string;
  company?: any;
  sector_counts?: SectorCount[];
}

export type CountStatus = 'draft' | 'sent' | 'in_progress' | 'completed' | 'cancelled';
export type CountType = 'full' | 'partial' | 'cycle';

export interface SectorCount {
  id: string;
  inventory_count_id: string;
  sector_id: string;
  employee_name?: string;
  employee_id?: string;
  status: SectorCountStatus;
  started_at?: string;
  completed_at?: string;
  total_products: number;
  counted_products: number;
  created_at: string;
  sector?: Sector;
  count_items?: CountItem[];
}

export type SectorCountStatus = 'pending' | 'in_progress' | 'completed';

export interface CountItem {
  id: string;
  sector_count_id: string;
  product_id: string;
  expected_quantity: number;
  counted_quantity?: number;
  difference?: number;
  observations?: string;
  is_counted: boolean;
  counted_at?: string;
  created_at: string;
  product?: Product;
}

export interface Communication {
  id: string;
  company_id?: string;
  inventory_count_id?: string;
  sender_id?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  read_at?: string;
  created_at: string;
}