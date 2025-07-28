import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, Edit, MapPin, Package2, MoreHorizontal } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const sectorSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  description: z.string().optional(),
  isActive: z.boolean(),
  productIds: z.array(z.string())
});

type SectorFormData = z.infer<typeof sectorSchema>;

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
}

interface Sector extends SectorFormData {
  id: string;
  created_at: string;
  updated_at: string;
}

// Mock products data
const mockProducts: Product[] = [
  { id: '1', code: 'ARZ001', name: 'Arroz Branco Tio João 1kg', category: 'Grãos' },
  { id: '2', code: 'FEJ001', name: 'Feijão Carioca Camil 1kg', category: 'Grãos' },
  { id: '3', code: 'OLE001', name: 'Óleo de Soja Soya 900ml', category: 'Óleos' },
  { id: '4', code: 'CAR001', name: 'Carne Bovina Alcatra 1kg', category: 'Carnes' },
  { id: '5', code: 'LEI001', name: 'Leite Integral Piracanjuba 1L', category: 'Laticínios' }
];

export default function SectorsPage() {
  const [sectors, setSectors] = useState<Sector[]>([
    {
      id: '1',
      name: 'Cozinha Principal',
      description: 'Área de preparo das refeições principais',
      isActive: true,
      productIds: ['1', '2', '3', '4'],
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Almoxarifado Geral',
      description: 'Estoque principal de produtos secos',
      isActive: true,
      productIds: ['1', '2', '3'],
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '3',
      name: 'Câmara Fria',
      description: 'Armazenamento de produtos refrigerados',
      isActive: true,
      productIds: ['4', '5'],
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);

  const form = useForm<SectorFormData>({
    resolver: zodResolver(sectorSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
      productIds: []
    }
  });

  const filteredSectors = sectors.filter(sector =>
    sector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sector.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (data: SectorFormData) => {
    if (editingSector) {
      setSectors(prev => prev.map(sector => 
        sector.id === editingSector.id 
          ? { ...sector, ...data, updated_at: new Date().toISOString() }
          : sector
      ));
      toast({
        title: 'Setor atualizado',
        description: 'As informações do setor foram atualizadas com sucesso.',
      });
    } else {
      const newSector: Sector = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setSectors(prev => [...prev, newSector]);
      toast({
        title: 'Setor criado',
        description: 'O novo setor foi criado com sucesso.',
      });
    }
    
    setIsDialogOpen(false);
    setEditingSector(null);
    form.reset();
  };

  const handleEdit = (sector: Sector) => {
    setEditingSector(sector);
    form.reset(sector);
    setIsDialogOpen(true);
  };

  const handleToggleStatus = (sectorId: string) => {
    setSectors(prev => prev.map(sector =>
      sector.id === sectorId
        ? { ...sector, isActive: !sector.isActive, updated_at: new Date().toISOString() }
        : sector
    ));
    toast({
      title: 'Status atualizado',
      description: 'O status do setor foi alterado.',
    });
  };

  const getProductsBySector = (productIds: string[]) => {
    return mockProducts.filter(product => productIds.includes(product.id));
  };

  const handleProductToggle = (productId: string, checked: boolean) => {
    const currentIds = form.watch('productIds') || [];
    if (checked) {
      form.setValue('productIds', [...currentIds, productId]);
    } else {
      form.setValue('productIds', currentIds.filter(id => id !== productId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Setores</h1>
          <p className="text-muted-foreground">Organize produtos por áreas da empresa</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" onClick={() => { setEditingSector(null); form.reset(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Setor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSector ? 'Editar Setor' : 'Novo Setor'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Setor *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Cozinha Principal"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição detalhada do setor"
                  {...form.register('description')}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={form.watch('isActive')}
                  onCheckedChange={(checked) => form.setValue('isActive', !!checked)}
                />
                <Label htmlFor="isActive">Setor ativo</Label>
              </div>
              
              <div className="space-y-3">
                <Label>Produtos Associados</Label>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-3">
                    {mockProducts.map((product) => (
                      <div key={product.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`product-${product.id}`}
                          checked={(form.watch('productIds') || []).includes(product.id)}
                          onCheckedChange={(checked) => handleProductToggle(product.id, !!checked)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {product.code} • {product.category}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Selecione os produtos que estarão disponíveis neste setor
                </p>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingSector ? 'Salvar Alterações' : 'Criar Setor'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar setores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSectors.map((sector) => {
          const sectorProducts = getProductsBySector(sector.productIds);
          
          return (
            <Card key={sector.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{sector.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(sector)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(sector.id)}>
                        {sector.isActive ? 'Desativar' : 'Ativar'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={sector.isActive ? 'default' : 'secondary'}>
                    {sector.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Package2 className="h-3 w-3" />
                    {sectorProducts.length} produtos
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                {sector.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {sector.description}
                  </p>
                )}
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Produtos:</h4>
                  {sectorProducts.length > 0 ? (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {sectorProducts.map((product) => (
                        <div key={product.id} className="text-sm text-muted-foreground flex items-center justify-between">
                          <span className="truncate">{product.name}</span>
                          <span className="text-xs font-mono shrink-0 ml-2">{product.code}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Nenhum produto associado
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredSectors.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum setor encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}