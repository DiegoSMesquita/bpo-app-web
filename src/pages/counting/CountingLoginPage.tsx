import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, User, MapPin, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import workerCounting from '@/assets/worker-counting.jpg';

const countingLoginSchema = z.object({
  employeeName: z.string().min(1, 'Nome é obrigatório'),
  employeeId: z.string().optional(),
  sectorId: z.string().min(1, 'Setor é obrigatório')
});

type CountingLoginData = z.infer<typeof countingLoginSchema>;

export default function CountingLoginPage() {
  const navigate = useNavigate();
  const { countingId } = useParams();
  const [loading, setLoading] = useState(false);

  // Mock data - replace with real API calls
  const countingInfo = {
    id: countingId,
    title: 'Contagem Mensal - Dezembro 2024',
    company: 'Restaurant ABC Ltda',
    deadline: '2024-12-15',
    sectors: [
      { id: '1', name: 'Cozinha Principal', productCount: 45 },
      { id: '2', name: 'Cozinha Secundária', productCount: 32 },
      { id: '3', name: 'Bar 1', productCount: 28 },
      { id: '4', name: 'Bar 2', productCount: 25 },
      { id: '5', name: 'Almoxarifado', productCount: 180 }
    ]
  };

  const form = useForm<CountingLoginData>({
    resolver: zodResolver(countingLoginSchema),
    defaultValues: {
      employeeName: '',
      employeeId: '',
      sectorId: ''
    }
  });

  const selectedSector = countingInfo.sectors.find(s => s.id === form.watch('sectorId'));

  const onSubmit = async (data: CountingLoginData) => {
    setLoading(true);
    try {
      // TODO: Initialize counting session with API
      console.log('Starting counting session:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Sessão iniciada com sucesso!',
        description: `Iniciando contagem no setor ${selectedSector?.name}`,
      });

      navigate(`/counting/${countingId}/sector/${data.sectorId}`);
    } catch (error) {
      toast({
        title: 'Erro ao iniciar sessão',
        description: 'Tente novamente em alguns instantes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-background">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Package className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Sistema de Contagem</h1>
            <p className="text-muted-foreground">
              Identifique-se para iniciar a contagem de estoque
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Counting Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Informações da Contagem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{countingInfo.title}</h3>
                  <p className="text-muted-foreground">{countingInfo.company}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Prazo:</span>
                    <span className="text-sm">{new Date(countingInfo.deadline).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Total de setores:</span>
                    <span className="text-sm">{countingInfo.sectors.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Total de produtos:</span>
                    <span className="text-sm">
                      {countingInfo.sectors.reduce((acc, sector) => acc + sector.productCount, 0)}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <img 
                    src={workerCounting} 
                    alt="Funcionário realizando contagem" 
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Login Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Identificação do Funcionário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Employee Name */}
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">Nome Completo *</Label>
                    <Input
                      id="employeeName"
                      placeholder="Digite seu nome completo"
                      {...form.register('employeeName')}
                    />
                    {form.formState.errors.employeeName && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.employeeName.message}
                      </p>
                    )}
                  </div>

                  {/* Employee ID */}
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Matrícula (opcional)</Label>
                    <Input
                      id="employeeId"
                      placeholder="Ex: 12345"
                      {...form.register('employeeId')}
                    />
                  </div>

                  {/* Sector Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="sectorId">Setor para Contagem *</Label>
                    <Select 
                      value={form.watch('sectorId')} 
                      onValueChange={(value) => form.setValue('sectorId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        {countingInfo.sectors.map((sector) => (
                          <SelectItem key={sector.id} value={sector.id}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{sector.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({sector.productCount} produtos)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.sectorId && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.sectorId.message}
                      </p>
                    )}
                  </div>

                  {/* Selected Sector Info */}
                  {selectedSector && (
                    <div className="p-4 bg-primary-light rounded-lg border">
                      <h4 className="font-medium mb-2">Setor Selecionado:</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{selectedSector.name}</span>
                        <span className="text-muted-foreground">
                          {selectedSector.productCount} produtos para contar
                        </span>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="hero"
                    size="xl"
                    disabled={loading || !form.watch('employeeName') || !form.watch('sectorId')}
                  >
                    {loading ? 'Iniciando...' : 'Iniciar Contagem'}
                  </Button>

                  <div className="text-center text-xs text-muted-foreground">
                    Ao clicar em "Iniciar Contagem", você confirma que está pronto para começar
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}