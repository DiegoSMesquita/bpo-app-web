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
import { Plus, Search, Edit, Download, Upload, MoreHorizontal, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const productSchema = z.object({
  code: z.string().min(1, 'Código obrigatório'),
  name: z.string().min(1, 'Nome obrigatório'),
  description: z.string().optional(),
  category: z.string().min(1, 'Categoria obrigatória'),
  unitMeasure: z.string().min(1, 'Unidade de medida obrigatória'),
  minStock: z.number().min(0, 'Estoque mínimo deve ser positivo'),
  costPrice: z.number().min(0, 'Preço deve ser positivo'),
  isActive: z.boolean()
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product extends ProductFormData {
  id: string;
  created_at: string;
  updated_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      code: 'ARZ001',
      name: 'Arroz Branco Tio João 1kg',
      description: 'Arroz branco tipo 1, grãos longos',
      category: 'Grãos',
      unitMeasure: 'kg',
      minStock: 50,
      costPrice: 3.50,
      isActive: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      code: 'FEJ001',
      name: 'Feijão Carioca Camil 1kg',
      description: 'Feijão carioca tipo 1',
      category: 'Grãos',
      unitMeasure: 'kg',
      minStock: 30,
      costPrice: 5.20,
      isActive: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '3',
      code: 'OLE001',
      name: 'Óleo de Soja Soya 900ml',
      description: 'Óleo de soja refinado',
      category: 'Óleos',
      unitMeasure: 'un',
      minStock: 25,
      costPrice: 4.80,
      isActive: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = ['Grãos', 'Óleos', 'Carnes', 'Laticínios', 'Bebidas', 'Limpeza', 'Higiene'];

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      category: '',
      unitMeasure: '',
      minStock: 0,
      costPrice: 0,
      isActive: true
    }
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.isActive) ||
                         (statusFilter === 'inactive' && !product.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSubmit = (data: ProductFormData) => {
    // Check for duplicate code
    const existingProduct = products.find(p => 
      p.code.toLowerCase() === data.code.toLowerCase() && 
      (!editingProduct || p.id !== editingProduct.id)
    );
    
    if (existingProduct) {
      toast({
        title: 'Erro',
        description: 'Já existe um produto com este código.',
        variant: 'destructive'
      });
      return;
    }

    if (editingProduct) {
      setProducts(prev => prev.map(product => 
        product.id === editingProduct.id 
          ? { ...product, ...data, updated_at: new Date().toISOString() }
          : product
      ));
      toast({
        title: 'Produto atualizado',
        description: 'As informações do produto foram atualizadas com sucesso.',
      });
    } else {
      const newProduct: Product = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProducts(prev => [...prev, newProduct]);
      toast({
        title: 'Produto criado',
        description: 'O novo produto foi criado com sucesso.',
      });
    }
    
    setIsDialogOpen(false);
    setEditingProduct(null);
    form.reset();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset(product);
    setIsDialogOpen(true);
  };

  const handleToggleStatus = (productId: string) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, isActive: !product.isActive, updated_at: new Date().toISOString() }
        : product
    ));
    toast({
      title: 'Status atualizado',
      description: 'O status do produto foi alterado.',
    });
  };

  const handleExport = () => {
    const csvContent = [
      ['Código', 'Nome', 'Descrição', 'Categoria', 'Unidade', 'Estoque Mín', 'Preço', 'Status'],
      ...filteredProducts.map(product => [
        product.code,
        product.name,
        product.description || '',
        product.category,
        product.unitMeasure,
        product.minStock.toString(),
        product.costPrice.toString(),
        product.isActive ? 'Ativo' : 'Inativo'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'produtos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: 'Exportação concluída',
      description: 'Os produtos foram exportados com sucesso.',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Produtos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de produtos da empresa</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" onClick={() => { setEditingProduct(null); form.reset(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Código *</Label>
                    <Input
                      id="code"
                      placeholder="Ex: ARZ001"
                      {...form.register('code')}
                    />
                    {form.formState.errors.code && (
                      <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select 
                      value={form.watch('category')} 
                      onValueChange={(value) => form.setValue('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.category && (
                      <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    placeholder="Nome completo do produto"
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
                    placeholder="Descrição detalhada do produto"
                    {...form.register('description')}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unitMeasure">Unidade *</Label>
                    <Select 
                      value={form.watch('unitMeasure')} 
                      onValueChange={(value) => form.setValue('unitMeasure', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="un">Unidade</SelectItem>
                        <SelectItem value="kg">Quilograma</SelectItem>
                        <SelectItem value="g">Grama</SelectItem>
                        <SelectItem value="l">Litro</SelectItem>
                        <SelectItem value="ml">Mililitro</SelectItem>
                        <SelectItem value="m">Metro</SelectItem>
                        <SelectItem value="cm">Centímetro</SelectItem>
                        <SelectItem value="cx">Caixa</SelectItem>
                        <SelectItem value="pct">Pacote</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.unitMeasure && (
                      <p className="text-sm text-destructive">{form.formState.errors.unitMeasure.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Estoque Mínimo</Label>
                    <Input
                      id="minStock"
                      type="number"
                      min="0"
                      step="0.01"
                      {...form.register('minStock', { valueAsNumber: true })}
                    />
                    {form.formState.errors.minStock && (
                      <p className="text-sm text-destructive">{form.formState.errors.minStock.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Preço de Custo</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      {...form.register('costPrice', { valueAsNumber: true })}
                    />
                    {form.formState.errors.costPrice && (
                      <p className="text-sm text-destructive">{form.formState.errors.costPrice.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    {...form.register('isActive')}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isActive">Produto ativo</Label>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, código ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="text-right">Est. Mín</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground font-mono">{product.code}</div>
                        {product.description && (
                          <div className="text-sm text-muted-foreground mt-1">{product.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>{product.unitMeasure}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {product.minStock}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatPrice(product.costPrice)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? 'default' : 'secondary'}>
                        {product.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(product.id)}>
                            {product.isActive ? 'Desativar' : 'Ativar'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}