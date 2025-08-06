import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  userType: z.enum(['admin']),
  companyCode: z.string().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

const api = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true,
});

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      userType: 'admin',
      companyCode: ''
    }
  });

  const watchUserType = form.watch('userType');

  const onSubmit = async (data: LoginFormData) => {
    try {
      const endpoint = isRegistering ? '/register' : '/login';

      const response = await api.post(endpoint, {
        email: data.email,
        password: data.password,
        userType: data.userType,
        companyCode: data.companyCode
      });

      if (isRegistering) {
        toast({
          title: 'Usuário cadastrado com sucesso!',
          description: 'Você já pode fazer login.',
        });
        setIsRegistering(false);
        return;
      }

      await login({
        email: data.email,
        password: data.password,
        role: data.userType === 'admin' ? undefined : data.userType,
        companyCode: data.companyCode,
      });

      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });

      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao BPO WEB! Estamos felizes em tê-lo conosco.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro na autenticação',
        description: error.response?.data?.message || 'Verifique suas credenciais.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-5">
            <Package className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">BPO WEB</CardTitle>
          <p className="text-muted-foreground">Sistema de Contagem de Estoque</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userType">Tipo de Usuário</Label>
              <Select
                value={form.watch('userType')}
                onValueChange={(value) => form.setValue('userType', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador BPO</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.userType && (
                <p className="text-sm text-destructive">{form.formState.errors.userType.message}</p>
              )}
            </div>

            {watchUserType === 'employee' && (
              <div className="space-y-2">
                <Label htmlFor="companyCode">Código da Empresa</Label>
                <Input
                  id="companyCode"
                  placeholder="Ex: EMP001"
                  {...form.register('companyCode')}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  {...form.register('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              variant="hero"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Processando...' : isRegistering ? 'Cadastrar' : 'Entrar'}
            </Button>

            <div className="text-center">
              <p className="text-sm">
                {isRegistering ? 'Já tem conta?' : 'Não tem conta?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-primary underline"
                >
                  {isRegistering ? 'Faça login' : 'Cadastre-se 'teste''}
                </button>
              </p>
            </div>

          (teste)
             
                      </form>
        </CardContent>
      </Card>
    </div>
  );
}
