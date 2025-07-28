export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company_id?: string;
  company?: Company;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'super_admin' | 'bpo_admin' | 'client_admin' | 'employee';

export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'active' | 'inactive' | 'suspended';
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: 'client' | 'employee';
  companyCode?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface CountingSession {
  id: string;
  sector_count_id: string;
  employee_name: string;
  session_token: string;
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
  last_activity: string;
  created_at: string;
}