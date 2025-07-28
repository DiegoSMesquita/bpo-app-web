import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building, 
  ClipboardCheck, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: number;
  colorClass?: string;
}

function MetricCard({ title, value, description, icon, trend, colorClass = 'text-primary' }: MetricCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${colorClass} bg-current/10`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center mt-2">
            <TrendingUp className={`h-4 w-4 mr-1 ${trend >= 0 ? 'text-success' : 'text-destructive'}`} />
            <span className={`text-sm ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
              {trend >= 0 ? '+' : ''}{trend}% vs mês anterior
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardMetrics() {
  const { user } = useAuthStore();

  // Mock data - replace with real API calls
  const bpoMetrics = {
    totalClients: 24,
    activeCountings: 8,
    completedToday: 15,
    averageAccuracy: 98.5
  };

  const clientMetrics = {
    totalProducts: 1250,
    activeSectors: 12,
    lastCountAccuracy: 97.8,
    pendingItems: 45
  };

  if (user?.role === 'super_admin' || user?.role === 'bpo_admin') {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Clientes"
          value={bpoMetrics.totalClients}
          description="Empresas ativas"
          icon={<Building className="h-4 w-4" />}
          trend={12}
          colorClass="text-primary"
        />
        <MetricCard
          title="Contagens Ativas"
          value={bpoMetrics.activeCountings}
          description="Em andamento agora"
          icon={<ClipboardCheck className="h-4 w-4" />}
          colorClass="text-warning"
        />
        <MetricCard
          title="Finalizadas Hoje"
          value={bpoMetrics.completedToday}
          description="Contagens completas"
          icon={<CheckCircle className="h-4 w-4" />}
          trend={8}
          colorClass="text-success"
        />
        <MetricCard
          title="Precisão Média"
          value={`${bpoMetrics.averageAccuracy}%`}
          description="Última semana"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={2.1}
          colorClass="text-info"
        />
      </div>
    );
  }

  if (user?.role === 'client_admin') {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Produtos"
          value={clientMetrics.totalProducts}
          description="Cadastrados no sistema"
          icon={<Building className="h-4 w-4" />}
          colorClass="text-primary"
        />
        <MetricCard
          title="Setores Ativos"
          value={clientMetrics.activeSectors}
          description="Com produtos"
          icon={<Users className="h-4 w-4" />}
          colorClass="text-info"
        />
        <MetricCard
          title="Última Precisão"
          value={`${clientMetrics.lastCountAccuracy}%`}
          description="Contagem anterior"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={1.2}
          colorClass="text-success"
        />
        <MetricCard
          title="Itens Pendentes"
          value={clientMetrics.pendingItems}
          description="Para próxima contagem"
          icon={<Clock className="h-4 w-4" />}
          colorClass="text-warning"
        />
      </div>
    );
  }

  return null;
}