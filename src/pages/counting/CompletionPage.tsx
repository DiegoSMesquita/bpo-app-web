import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCountingStore } from '@/store/countingStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  Package, 
  AlertTriangle,
  Download,
  ArrowLeft,
  TrendingUp
} from 'lucide-react';

export default function CompletionPage() {
  const navigate = useNavigate();
  const { summary, reset, getDiscrepancies } = useCountingStore();

  useEffect(() => {
    if (!summary) {
      navigate('/dashboard');
    }
  }, [summary, navigate]);

  if (!summary) {
    return null;
  }

  const discrepancies = getDiscrepancies();
  const accuracy = summary.totalProducts > 0 
    ? ((summary.countedProducts / summary.totalProducts) * 100).toFixed(1)
    : '0';

  const totalTime = summary.endTime && summary.startTime
    ? Math.round((summary.endTime.getTime() - summary.startTime.getTime()) / (1000 * 60))
    : 0;

  const handleFinish = () => {
    reset();
    navigate('/dashboard');
  };

  const handleDownloadReport = () => {
    // TODO: Implement report generation
    console.log('Generating report...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-success-light to-background">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-success rounded-full">
                <CheckCircle className="h-12 w-12 text-success-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Contagem Concluída!</h1>
            <p className="text-muted-foreground">
              Parabéns! A contagem do setor <strong>{summary.sectorName}</strong> foi finalizada com sucesso.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Summary Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5" />
                  Produtos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total:</span>
                    <span className="font-semibold">{summary.totalProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Contados:</span>
                    <span className="font-semibold text-success">{summary.countedProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pulados:</span>
                    <span className="font-semibold text-warning">{summary.skippedProducts}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm">Precisão:</span>
                    <span className="font-bold text-success">{accuracy}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Tempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Início:</span>
                    <span className="font-semibold">
                      {summary.startTime.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Fim:</span>
                    <span className="font-semibold">
                      {summary.endTime?.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm">Duração:</span>
                    <span className="font-bold">{totalTime} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Ritmo:</span>
                    <span className="font-semibold">
                      {totalTime > 0 ? (summary.countedProducts / totalTime).toFixed(1) : '0'} itens/min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Discrepâncias:</span>
                    <span className="font-semibold">
                      {discrepancies.length}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm">Funcionário:</span>
                    <span className="font-semibold text-primary">{summary.employeeName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Discrepancies */}
          {discrepancies.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Discrepâncias Encontradas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {discrepancies.slice(0, 5).map((discrepancy, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-warning-light rounded-lg">
                      <div>
                        <span className="font-medium">{discrepancy.productName}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({discrepancy.productCode})
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Esperado:</span> {discrepancy.expected} |{' '}
                          <span className="text-muted-foreground">Contado:</span> {discrepancy.counted}
                        </div>
                        <Badge variant={Math.abs(discrepancy.percentageDiff) > 20 ? 'destructive' : 'secondary'}>
                          {discrepancy.difference > 0 ? '+' : ''}{discrepancy.difference}
                          {' '}({discrepancy.percentageDiff.toFixed(1)}%)
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {discrepancies.length > 5 && (
                    <p className="text-center text-sm text-muted-foreground">
                      + {discrepancies.length - 5} discrepâncias adicionais no relatório completo
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDownloadReport}
              variant="default"
              size="lg"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar Relatório
            </Button>
            
            <Button
              onClick={handleFinish}
              variant="hero"
              size="lg"
              className="gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Finalizar e Sair
            </Button>
            
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>

          {/* Thank you message */}
          <div className="text-center mt-8 p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Obrigado pelo seu trabalho!</h3>
            <p className="text-muted-foreground">
              Sua contagem foi registrada com sucesso e será processada pela equipe BPO. 
              Os dados coletados ajudarão na gestão eficiente do estoque.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}