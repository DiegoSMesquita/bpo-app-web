import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Building,
  ClipboardCheck,
  BarChart3,
  Package,
  MapPin,
  History,
  Users,
  Settings,
  Phone,
  LogOutIcon,
  MegaphoneIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MenubarSubTrigger } from '@radix-ui/react-menubar';
import { log } from 'node:console';

const getNavigationItems = (role: string) => {
  const baseItems = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
  ];

  switch (role) {
    case 'super_admin':
    case 'bpo_admin':
      return [
        ...baseItems,
        { title: 'Clientes', href: '/dashboard/clients', icon: Building },
        { title: 'Contagens', href: '/dashboard/counts', icon: ClipboardCheck },
        { title: 'Relatórios', href: '/dashboard/reports', icon: BarChart3 },
        { title: 'Usuários', href: '/dashboard/users', icon: Users },
        { title: 'Produtos', href: '/dashboard/products', icon: Package },
        { title: 'Setores', href: '/dashboard/sectors', icon: MapPin },
        { title: 'Histórico', href: '/dashboard/history', icon: History },
        { title: 'Configurações', href: '/dashboard/settings', icon: Settings },
        { title: 'Comunicados', href: '/dashboard/announcements', icon: MegaphoneIcon },
        { title: 'Sair', href: '/logout', icon: LogOutIcon }

      ];

    default:
      return baseItems;
  }
};

export function DashboardLayout() {
  const { user } = useAuthStore();
  const location = useLocation();

  const navigationItems = getNavigationItems(user?.role || '');

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-card border-r">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto py-6">
            <nav className="space-y-2 px-4">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}