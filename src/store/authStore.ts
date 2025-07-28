import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState, LoginCredentials } from '@/types/auth';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      isAuthenticated: false,

      login: async (credentials: LoginCredentials) => {
        set({ loading: true });
        try {
          console.log('Login attempt:', credentials);
          
          // Mock user data based on credentials
          let mockUser: User;
          
          // BPO Admin
          if (credentials.email === 'admin@bpo.com') {
            mockUser = {
              id: '1',
              email: credentials.email,
              name: 'Admin BPO',
              role: 'bpo_admin',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }
          // Client Admin
          else if (credentials.email === 'cliente@empresa.com') {
            mockUser = {
              id: '2',
              email: credentials.email,
              name: 'Admin Cliente',
              role: 'client_admin',
              company_id: '1',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }
          // Employee
          else if (credentials.email === 'funcionario@empresa.com' && credentials.companyCode === 'EMP001') {
            mockUser = {
              id: '3',
              email: credentials.email,
              name: 'Funcionário Teste',
              role: 'employee',
              company_id: '1',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }
          // Default BPO Admin for other cases
          else {
            mockUser = {
              id: '1',
              email: credentials.email,
              name: 'Usuário Demo',
              role: credentials.role === 'employee' ? 'employee' : 'bpo_admin',
              company_id: credentials.companyCode ? '1' : undefined,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            loading: false 
          });
        } catch (error) {
          console.error('Login error:', error);
          set({ loading: false });
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          loading: false 
        });
      },

      setUser: (user: User | null) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      hasRole: (role: string) => {
        const { user } = get();
        return user?.role === role;
      },

      hasPermission: (permission: string) => {
        const { user } = get();
        if (!user) return false;
        
        // Basic permission logic
        const rolePermissions = {
          super_admin: ['all'],
          bpo_admin: ['manage_clients', 'view_counts', 'generate_reports'],
          client_admin: ['manage_products', 'manage_sectors', 'view_own_counts'],
          employee: ['count_items']
        };
        
        const userPermissions = rolePermissions[user.role] || [];
        return userPermissions.includes('all') || userPermissions.includes(permission);
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);