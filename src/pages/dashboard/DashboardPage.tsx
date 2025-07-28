import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { CommunicationModal } from '@/components/shared/CommunicationModal';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Package,
  Plus,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import heroWarehouse from '@/assets/hero-warehouse.jpg';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const recentActivities = [
    {
      id: 1,
      type: 'count_started',
      message: 'Contagem iniciada no Setor Almoxarifado',
      time: '2 minutos atrás',
      icon: <Clock className="h-4 w-4 text-warning" />
    },
    {
      id: 2,
      type: 'count_completed',
      message: 'Contagem finalizada - Cozinha Principal',
      time: '15 minutos atrás',
      icon: <CheckCircle className="h-4 w-4 text-success" />
    },
    {
      id: 3,
      type: 'discrepancy',
      message: 'Discrepância encontrada - Produto ABC123',
      time: '1 hora atrás',
      icon: <AlertCircle className="h-4 w-4 text-destructive" />
    },
    {
      id: 4,
      type: 'new_client',
      message: 'Nova empresa cadastrada: TechCorp',
      time: '3 horas atrás',
      icon: <Plus className="h-4 w-4 text-primary" />
    }
  ];

  const quickActions = () => {
    if (user?.role === 'super_admin' || user?.role === 'bpo_admin') {
      return [
        { label: 'Gerenciar Clientes', href: '/dashboard/clients', variant: 'default' as const },
        { label: 'Ver Contagens', href: '/dashboard/counts', variant: 'secondary' as const },
        { label: 'Relatórios', href: '/dashboard/reports', variant: 'outline' as const }
      ];
    }
    
    if (user?.role === 'client_admin') {
      return [
        { label: 'Gerenciar Produtos', href: '/dashboard/products', variant: 'default' as const },
        { label: 'Gerenciar Setores', href: '/dashboard/sectors', variant: 'secondary' as const },
        { label: 'Ver Histórico', href: '/dashboard/history', variant: 'outline' as const }
      ];
    }
    
    return [];
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-hero">
        <div className="absolute inset-0 bg-black/20" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroWarehouse})` }}
        />
        <div className="relative px-6 py-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-lg opacity-90 mb-4">
            {user?.role === 'super_admin' || user?.role === 'bpo_admin' 
              ? 'Gerencie contagens e clientes com eficiência'
              : 'Acompanhe seus produtos e contagens'
            }
          </p>
          <div className="flex flex-wrap gap-3">
            {quickActions().map((action, index) => (
              <Button 
                key={index}
                variant={action.variant}
                size="lg"
                className="shadow-lg"
                onClick={() => window.location.href = action.href}
              >
                {action.label}
              </Button>
            ))}
            {user?.role === 'client_admin' && (
              <CommunicationModal 
                trigger={
                  <Button variant="outline" size="lg" className="shadow-lg">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Novo Comunicado
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <DashboardMetrics />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                    <div className="mt-0.5">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Estatísticas Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Precisão Média</span>
                <span className="text-2xl font-bold text-success">98.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tempo Médio</span>
                <span className="text-lg font-semibold">2.5h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Eficiência</span>
                <span className="text-lg font-semibold text-primary">+15%</span>
              </div>
            </CardContent>
          </Card>

          {user?.role === 'client_admin' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Próxima Contagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Data prevista</span>
                    <span className="text-sm font-medium">15/12/2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Setores</span>
                    <span className="text-sm font-medium">8 setores</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Produtos</span>
                    <span className="text-sm font-medium">1.250 itens</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}