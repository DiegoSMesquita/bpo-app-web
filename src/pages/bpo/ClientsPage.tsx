import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Eye, Package, MoreHorizontal } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const clientSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  cnpj: z.string().min(14, 'CNPJ deve ter 14 dígitos').max(18, 'CNPJ inválido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  address: z.string().min(1, 'Endereço obrigatório'),
  status: z.enum(['active', 'inactive'])
});

type ClientFormData = z.infer<typeof clientSchema>;

interface Client extends ClientFormData {
  id: string;
  created_at: string;
  counts_total: number;
  last_count: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'TechCorp Sistemas',
      cnpj: '12.345.678/0001-90',
      email: 'contato@techcorp.com',
      phone: '(11) 98765-4321',
      address: 'Av. Paulista, 1000 - São Paulo/SP',
      status: 'active',
      created_at: '2024-01-15T10:30:00Z',
      counts_total: 15,
      last_count: '2024-11-20T14:30:00Z'
    },
    {
      id: '2',
      name: 'Logística Express',
      cnpj: '98.765.432/0001-10',
      email: 'admin@logexpress.com',
      phone: '(11) 91234-5678',
      address: 'Rua das Indústrias, 500 - São Paulo/SP',
      status: 'active',
      created_at: '2024-02-10T09:15:00Z',
      counts_total: 8,
      last_count: '2024-11-18T16:45:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      cnpj: '',
      email: '',
      phone: '',
      address: '',
      status: 'active'
    }
  });

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.cnpj.includes(searchTerm) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (data: ClientFormData) => {
    if (editingClient) {
      setClients(prev => prev.map(client => 
        client.id === editingClient.id 
          ? { ...client, ...data }
          : client
      ));
      toast({
        title: 'Cliente atualizado',
        description: 'As informações do cliente foram atualizadas com sucesso.',
      });
    } else {
      const newClient: Client = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        counts_total: 0,
        last_count: ''
      };
      setClients(prev => [...prev, newClient]);
      toast({
        title: 'Cliente criado',
        description: 'O novo cliente foi criado com sucesso.',
      });
    }
    
    setIsDialogOpen(false);
    setEditingClient(null);
    form.reset();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    form.reset(client);
    setIsDialogOpen(true);
  };

  const handleToggleStatus = (clientId: string) => {
    setClients(prev => prev.map(client =>
      client.id === clientId
        ? { ...client, status: client.status === 'active' ? 'inactive' as const : 'active' as const }
        : client
    ));
    toast({
      title: 'Status atualizado',
      description: 'O status do cliente foi alterado.',
    });
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
          <p className="text-muted-foreground">Gerencie empresas e suas contagens</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" onClick={() => { setEditingClient(null); form.reset(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa *</Label>
                  <Input
                    id="name"
                    placeholder="Nome da empresa"
                    {...form.register('name')}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    placeholder="12.345.678/0001-90"
                    {...form.register('cnpj')}
                  />
                  {form.formState.errors.cnpj && (
                    <p className="text-sm text-destructive">{form.formState.errors.cnpj.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contato@empresa.com"
                    {...form.register('email')}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 98765-4321"
                    {...form.register('phone')}
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço *</Label>
                <Textarea
                  id="address"
                  placeholder="Endereço completo"
                  {...form.register('address')}
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select 
                  value={form.watch('status')} 
                  onValueChange={(value) => form.setValue('status', value as 'active' | 'inactive')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingClient ? 'Salvar Alterações' : 'Criar Cliente'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CNPJ ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Contagens</TableHead>
                  <TableHead>Última Contagem</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatCNPJ(client.cnpj)}
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                        {client.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold">{client.counts_total}</span>
                    </TableCell>
                    <TableCell>{formatDate(client.last_count)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(client)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Package className="h-4 w-4 mr-2" />
                            Nova Contagem
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(client.id)}>
                            {client.status === 'active' ? 'Desativar' : 'Ativar'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredClients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum cliente encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}