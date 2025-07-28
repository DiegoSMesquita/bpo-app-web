import { useState, useEffect } from 'react';
import { useCountingStore } from '@/store/countingStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Minus, 
  Plus, 
  Eye,
  SkipForward,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export function CountingInterface() {
  const {
    currentProduct,
    currentIndex,
    totalItems,
    progress,
    countProduct,
    skipProduct,
    markNotFound,
    goToProduct,
    canGoNext,
    canGoPrevious,
    getCurrentProduct,
    getProgress
  } = useCountingStore();

  const [quantity, setQuantity] = useState<string>('');
  const [observations, setObservations] = useState('');
  const [showProductList, setShowProductList] = useState(false);

  const product = getCurrentProduct();
  const currentProgress = getProgress();

  useEffect(() => {
    if (product) {
      setQuantity(product.counted_quantity?.toString() || '');
      setObservations(product.observations || '');
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum produto para contar</h3>
            <p className="text-muted-foreground text-center">
              Não há produtos disponíveis para contagem neste setor.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleQuantityChange = (value: string) => {
    const numValue = value.replace(/[^0-9.,]/g, '');
    setQuantity(numValue);
  };

  const handleIncrement = () => {
    const currentValue = parseFloat(quantity.replace(',', '.')) || 0;
    setQuantity((currentValue + 1).toString());
  };

  const handleDecrement = () => {
    const currentValue = parseFloat(quantity.replace(',', '.')) || 0;
    if (currentValue > 0) {
      setQuantity((currentValue - 1).toString());
    }
  };

  const handleCount = () => {
    const numQuantity = parseFloat(quantity.replace(',', '.'));
    
    if (isNaN(numQuantity) || numQuantity < 0) {
      toast({
        title: 'Quantidade inválida',
        description: 'Por favor, insira uma quantidade válida',
        variant: 'destructive'
      });
      return;
    }

    countProduct({
      productId: product.product_id,
      quantity: numQuantity,
      observations: observations.trim() || undefined,
      timestamp: new Date()
    });

    // Reset for next product
    setQuantity('');
    setObservations('');

    toast({
      title: 'Produto contado!',
      description: `${product.product?.name} - ${numQuantity} unidades`,
    });
  };

  const handleSkip = () => {
    skipProduct('Produto pulado pelo usuário');
    setQuantity('');
    setObservations('');
    
    toast({
      title: 'Produto pulado',
      description: 'Você pode voltar para contá-lo depois',
    });
  };

  const handleNotFound = () => {
    markNotFound('Produto não encontrado');
    setQuantity('');
    setObservations('');
    
    toast({
      title: 'Produto não encontrado',
      description: 'Produto marcado como não encontrado',
    });
  };

  const getDifference = () => {
    const numQuantity = parseFloat(quantity.replace(',', '.'));
    if (isNaN(numQuantity)) return null;
    return numQuantity - product.expected_quantity;
  };

  const difference = getDifference();
  const hasLargeDifference = difference !== null && Math.abs(difference) > product.expected_quantity * 0.2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-background">
      {/* Header */}
      <div className="bg-card border-b shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Contagem de Estoque</h1>
              <p className="text-muted-foreground">
                Produto {currentIndex + 1} de {totalItems}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(currentProgress.percentage)}%
              </span>
            </div>
            <Progress value={currentProgress.percentage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Contados: {currentProgress.counted}</span>
              <span>Pulados: {currentProgress.skipped}</span>
              <span>Não encontrados: {currentProgress.notFound}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Product Information */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {product.product?.name}
                  </CardTitle>
                  <Badge variant={product.is_counted ? 'default' : 'secondary'}>
                    {product.is_counted ? 'Contado' : 'Pendente'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Código:</span>
                    <span className="ml-2 font-mono">{product.product?.code}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Categoria:</span>
                    <span className="ml-2">{product.product?.category || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Unidade:</span>
                    <span className="ml-2">{product.product?.unit_measure || 'UN'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Esperado:</span>
                    <span className="ml-2 font-semibold">{product.expected_quantity}</span>
                  </div>
                </div>
                {product.product?.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {product.product.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quantity Input */}
                <div className="space-y-4">
                  <Label htmlFor="quantity" className="text-base font-semibold">
                    Quantidade Contada
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleDecrement}
                      disabled={!quantity || parseFloat(quantity.replace(',', '.')) <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="text"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="text-center text-xl font-bold h-14"
                      placeholder="0"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleIncrement}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Difference Alert */}
                  {difference !== null && (
                    <div className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border",
                      hasLargeDifference 
                        ? "bg-destructive/10 border-destructive/20 text-destructive" 
                        : Math.abs(difference) > 0
                        ? "bg-warning/10 border-warning/20 text-warning"
                        : "bg-success/10 border-success/20 text-success"
                    )}>
                      {hasLargeDifference ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <CheckCircle className="h-5 w-5" />
                      )}
                      <span className="font-medium">
                        {difference === 0 
                          ? 'Quantidade conferida!'
                          : `Diferença: ${difference > 0 ? '+' : ''}${difference}`
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* Observations */}
                <div className="space-y-2">
                  <Label htmlFor="observations">Observações (opcional)</Label>
                  <Textarea
                    id="observations"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Adicione observações sobre este produto..."
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleCount}
                    variant="counting"
                    size="counting"
                    disabled={!quantity}
                    className="w-full"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Confirmar Contagem
                  </Button>
                  <Button
                    onClick={handleNotFound}
                    variant="warning"
                    size="lg"
                    className="w-full"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Não Encontrado
                  </Button>
                </div>
                
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <SkipForward className="mr-2 h-4 w-4" />
                  Pular para Depois
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Navigation & Summary */}
          <div className="space-y-6">
            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navegação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => goToProduct(currentIndex - 1)}
                    disabled={!canGoPrevious()}
                    variant="outline"
                    className="flex-1"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    onClick={() => goToProduct(currentIndex + 1)}
                    disabled={!canGoNext()}
                    variant="outline"
                    className="flex-1"
                  >
                    Próximo
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  onClick={() => setShowProductList(!showProductList)}
                  variant="secondary"
                  className="w-full"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {showProductList ? 'Ocultar' : 'Ver'} Lista
                </Button>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total de produtos:</span>
                    <span className="font-semibold">{currentProgress.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contados:</span>
                    <span className="font-semibold text-success">{currentProgress.counted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pulados:</span>
                    <span className="font-semibold text-warning">{currentProgress.skipped}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Não encontrados:</span>
                    <span className="font-semibold text-destructive">{currentProgress.notFound}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Progresso:</span>
                    <span className="font-semibold">{Math.round(currentProgress.percentage)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}