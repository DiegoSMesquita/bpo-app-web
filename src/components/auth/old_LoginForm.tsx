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
  userType: z.enum(['admin', 'client', 'employee']),
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

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      userType: 'admin'
    }
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const watchUserType = form.watch('userType');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const onSubmit = async (data: LoginFormData) => {
      try {
        await login({
          email: data.email,
          password: data.password,
          role: data.userType === 'admin' ? undefined : data.userType,
          companyCode: data.companyCode
        });
        const endpoint = isRegistering ? '/register' : '/login';

        const redirectTo = location.state?.from?.pathname || '/dashboard';
        navigate(redirectTo, { replace: true });

        toast({
          title: 'Login realizado com sucesso!',
          description: 'Bem-vindo ao BPO WEB! Estamos felizes em tê-lo conosco.',
        });
      } catch (error) {
        toast({
          title: 'Erro no login',
          description: 'Email ou senha incorretos',
          variant: 'destructive'
       
          const Response = await api.post(endpoint, {
            email,
            password,
          }),

          if(isRegistering) {
            alert('Usuário cadastrado com sucesso!');
          } else {
            alert('Login realizado com sucesso!');
        console.log('Token:', response.data.token),
            // Aqui você pode salvar o token no localStorage ou state global
          }
        } catch (error: any) {
          alert('Erro ao ' + (isRegistering ? 'registrar' : 'logar') + ': ' + error.response?.data?.message || error.message);
        }
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
                {/* User Type Selection */}
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
                      <SelectItem value="client">Cliente</SelectItem>
                      <SelectItem value="employee">Funcionário</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.userType && (
                    <p className="text-sm text-destructive">{form.formState.errors.userType.message}</p>
                  )}
                </div>

                {/* Company Code for Employees */}
                {watchUserType === 'employee' && (
                  <div className="space-y-2">
                    <Label htmlFor="companyCode">Código da Empresa</Label>
                    <Input
                      id="companyCode"
                      placeholder="Ex: EMP001"
                      {...form.register('companyCode')}
                    />
                    {form.formState.errors.companyCode && (
                      <p className="text-sm text-destructive">{form.formState.errors.companyCode.message}</p>
                    )}
                  </div>
                )}

                {/* Email */}
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

                {/* Password */}
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
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
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
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>

                {/* Demo credentials info */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Credenciais de Demonstração:</h4>
                  <div className="text-xs space-y-1">
                    <p><strong>Admin BPO:</strong> admin@bpo.com / 123456</p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <h2>{isRegistering ? 'Criar conta' : 'Entrar'}</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Senha:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">
                {isRegistering ? 'Cadastrar' : 'Entrar'}
              </button>
            </form>
            <p>
              {isRegistering ? 'Já tem conta?' : 'Não tem conta?'}{' '}
              <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Faça login' : 'Cadastre-se'}
              </button>
            </p>
          </div>
          );
}