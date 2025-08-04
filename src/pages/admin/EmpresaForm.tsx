import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  nome: z.string().min(2, 'O nome é obrigatório'),
  codigo: z.string().min(2, 'O código é obrigatório'),
})

type EmpresaFormData = z.infer<typeof schema>

export default function EmpresaForm() {
  const form = useForm<EmpresaFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      codigo: '',
    },
  })

  const onSubmit = async (data: EmpresaFormData) => {
    try {
      await axios.post('http://localhost:8081/empresas', data)
      toast({
        title: 'Empresa criada!',
        description: `A empresa "${data.nome}" foi registrada com sucesso.`,
      })
      form.reset()
    } catch (error: any) {
      toast({
        title: 'Erro ao criar empresa',
        description: error.response?.data?.error || 'Erro desconhecido',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Cadastrar Nova Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome da Empresa</Label>
              <Input id="nome" {...form.register('nome')} />
              {form.formState.errors.nome && (
                <p className="text-sm text-destructive">{form.formState.errors.nome.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="codigo">Código da Empresa</Label>
              <Input id="codigo" {...form.register('codigo')} />
              {form.formState.errors.codigo && (
                <p className="text-sm text-destructive">{form.formState.errors.codigo.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Cadastrar Empresa
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
