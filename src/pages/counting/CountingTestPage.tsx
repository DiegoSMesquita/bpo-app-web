import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Package, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  expectedQuantity: number;
  unit: string;
  status: 'pending' | 'counted' | 'not_found' | 'skipped';
  countedQuantity?: number;
  observations?: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    code: 'ARZ001',
    name: 'Arroz Branco Tio João 1kg',
    description: 'Arroz branco tipo 1, grãos longos',
    expectedQuantity: 50,
    unit: 'un',
    status: 'pending'
  },
  {
    id: '2',
    code: 'FEJ001',
    name: 'Feijão Carioca Camil 1kg',
    description: 'Feijão carioca tipo 1',
    expectedQuantity: 30,
    unit: 'un',
    status: 'pending'
  },
  {
    id: '3',
    code: 'OLE001',
    name: 'Óleo de Soja Soya 900ml',
    description: 'Óleo de soja refinado',
    expectedQuantity: 25,
    unit: 'un',
    status: 'pending'
  }
];

export default function CountingTestPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countedQuantity, setCountedQuantity] = useState<string>('');
  const [observations, setObservations] = useState('');

  const currentProduct = products[currentIndex];
  const completedCount = products.filter(p => p.status !== 'pending').length;
  const progress = (completedCount / products.length) * 100;

  const handleCount = () => {
    const quantity = parseInt(countedQuantity);
    if (isNaN(quantity) || quantity < 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira uma quantidade válida.',
        variant: 'destructive'
      });
      return;
    }

    setProducts(prev => prev.map(p => 
      p.id === currentProduct.id 
        ? { 
            ...p, 
            status: 'counted', 
            countedQuantity: quantity,
            observations: observations.trim() || undefined
          }
        : p
    ));

    toast({
      title: 'Produto contado',
      description: `${currentProduct.name} - Quantidade: ${quantity}`,
    });

    // Go to next product
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCountedQuantity('');
      setObservations('');
    }
  };

  const handleNotFound = () => {
    setProducts(prev => prev.map(p => 
      p.id === currentProduct.id 
        ? { 
            ...p, 
            status: 'not_found',
            observations: observations.trim() || 'Produto não encontrado'
          }
        : p
    ));

    toast({
      title: 'Produto não encontrado',
      description: currentProduct.name,
      variant: 'destructive'
    });

    // Go to next product
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCountedQuantity('');
      setObservations('');
    }
  };

  const handleSkip = () => {
    setProducts(prev => prev.map(p => 
      p.id === currentProduct.id 
        ? { 
            ...p, 
            status: 'skipped',
            observations: observations.trim() || 'Produto pulado'
          }
        : p
    ));

    toast({
      title: 'Produto pulado',
      description: currentProduct.name,
      variant: 'destructive'
    });

    // Go to next product
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCountedQuantity('');
      setObservations('');
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const prevProduct = products[currentIndex - 1];
      setCountedQuantity(prevProduct.countedQuantity?.toString() || '');
      setObservations(prevProduct.observations || '');
    }
  };

  const goToNext = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
      const nextProduct = products[currentIndex + 1];
      setCountedQuantity(nextProduct.countedQuantity?.toString() || '');
      setObservations(nextProduct.observations || '');
    }
  };

  const getStatusIcon = (status: Product['status']) => {
    switch (status) {
      case 'counted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'not_found':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'skipped':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: Product['status']) => {
    switch (status) {
      case 'counted':
        return 'Contado';
      case 'not_found':
        return 'Não Encontrado';
      case 'skipped':
        return 'Pulado';
      default:
        return 'Pendente';
    }
  };

  const allCompleted = products.every(p => p.status !== 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Contagem - Almoxarifado Geral</CardTitle>
                <p className="text-muted-foreground">Funcionário: João Silva</p>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {currentIndex + 1} de {products.length}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{completedCount}/{products.length} produtos</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {!allCompleted ? (
          <>
            {/* Current Product */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <CardTitle className="text-lg">{currentProduct.name}</CardTitle>
                    <p className="text-muted-foreground">Código: {currentProduct.code}</p>
                    {currentProduct.description && (
                      <p className="text-sm text-muted-foreground mt-1">{currentProduct.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{currentProduct.expectedQuantity}</p>
                    <p className="text-sm text-muted-foreground">esperado ({currentProduct.unit})</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantidade Contada *</label>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setCountedQuantity(Math.max(0, parseInt(countedQuantity || '0') - 1).toString())}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min="0"
                        value={countedQuantity}
                        onChange={(e) => setCountedQuantity(e.target.value)}
                        placeholder="0"
                        className="text-center text-lg font-semibold"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setCountedQuantity((parseInt(countedQuantity || '0') + 1).toString())}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Observações</label>
                    <Textarea
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder="Comentários sobre o produto..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Button 
                    size="lg" 
                    onClick={handleCount}
                    disabled={!countedQuantity}
                    className="flex-1 min-w-32"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Contagem
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="lg"
                    onClick={handleNotFound}
                    className="flex-1 min-w-32"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Não Encontrado
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleSkip}
                    className="flex-1 min-w-32"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Pular
                  </Button>
                </div>

                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={goToNext}
                    disabled={currentIndex === products.length - 1}
                  >
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Contagem Finalizada!</h2>
              <p className="text-muted-foreground mb-6">
                Todos os produtos foram processados. Revise os resultados abaixo.
              </p>
              <Button size="lg">
                Finalizar e Enviar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    index === currentIndex ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{product.code}</span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(product.status)}
                      <Badge variant="outline" className="text-xs">
                        {getStatusLabel(product.status)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{product.name}</p>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Esp: {product.expectedQuantity}</span>
                    {product.countedQuantity !== undefined && (
                      <span>Cont: {product.countedQuantity}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}