import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, AlertTriangle, HelpCircle, MessageCircle, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const communicationSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
  type: z.enum(['question', 'issue', 'feedback', 'urgent']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  countingId: z.string().optional()
});

type CommunicationFormData = z.infer<typeof communicationSchema>;

interface Communication extends CommunicationFormData {
  id: string;
  created_at: string;
  is_read: boolean;
  response?: string;
  responded_at?: string;
}

const typeIcons = {
  question: HelpCircle,
  issue: AlertTriangle,
  feedback: MessageCircle,
  urgent: Zap
};

const typeLabels = {
  question: 'Dúvida',
  issue: 'Problema',
  feedback: 'Feedback',
  urgent: 'Urgente'
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente'
};

const priorityColors = {
  low: 'secondary',
  medium: 'outline',
  high: 'destructive',
  urgent: 'destructive'
} as const;

interface CommunicationModalProps {
  trigger?: React.ReactNode;
  onSend?: (communication: Communication) => void;
}

export function CommunicationModal({ trigger, onSend }: CommunicationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const form = useForm<CommunicationFormData>({
    resolver: zodResolver(communicationSchema),
    defaultValues: {
      title: '',
      message: '',
      type: 'question',
      priority: 'medium',
      countingId: ''
    }
  });

  const handleSubmit = (data: CommunicationFormData) => {
    const newCommunication: Communication = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      is_read: false
    };

    // Call the onSend callback if provided
    if (onSend) {
      onSend(newCommunication);
    }

    toast({
      title: 'Comunicado enviado',
      description: 'Seu comunicado foi enviado para o BPO e será respondido em breve.',
    });

    setIsOpen(false);
    form.reset();
  };

  const currentType = form.watch('type');
  const TypeIcon = typeIcons[currentType];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Novo Comunicado
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Novo Comunicado
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Comunicado *</Label>
              <Select 
                value={form.watch('type')} 
                onValueChange={(value) => form.setValue('type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabels).map(([key, label]) => {
                    const Icon = typeIcons[key as keyof typeof typeIcons];
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade *</Label>
              <Select 
                value={form.watch('priority')} 
                onValueChange={(value) => form.setValue('priority', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Badge variant={priorityColors[key as keyof typeof priorityColors]} className="text-xs">
                          {label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.priority && (
                <p className="text-sm text-destructive">{form.formState.errors.priority.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Título do comunicado"
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="countingId">Relacionar à Contagem (Opcional)</Label>
            <Select 
              value={form.watch('countingId')} 
              onValueChange={(value) => form.setValue('countingId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma contagem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhuma contagem específica</SelectItem>
                <SelectItem value="count-001">Contagem #001 - Estoque Geral</SelectItem>
                <SelectItem value="count-002">Contagem #002 - Almoxarifado</SelectItem>
                <SelectItem value="count-003">Contagem #003 - Cozinha</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem *</Label>
            <Textarea
              id="message"
              placeholder="Descreva detalhadamente sua questão, problema ou feedback..."
              rows={6}
              {...form.register('message')}
            />
            {form.formState.errors.message && (
              <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
            )}
          </div>

          {/* Preview */}
          <div className="p-4 border rounded-lg bg-muted/30">
            <h4 className="text-sm font-medium mb-2">Preview do Comunicado:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TypeIcon className="h-4 w-4" />
                <span className="font-medium">{form.watch('title') || 'Título do comunicado'}</span>
                <Badge variant={priorityColors[form.watch('priority')]}>
                  {priorityLabels[form.watch('priority')]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {form.watch('message') || 'Mensagem do comunicado...'}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Enviar Comunicado
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Communications List Component
interface CommunicationsListProps {
  communications: Communication[];
  onMarkAsRead?: (id: string) => void;
  onRespond?: (id: string, response: string) => void;
  showActions?: boolean;
}

export function CommunicationsList({ 
  communications, 
  onMarkAsRead, 
  onRespond, 
  showActions = false 
}: CommunicationsListProps) {
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [response, setResponse] = useState('');

  const handleRespond = (id: string) => {
    if (onRespond && response.trim()) {
      onRespond(id, response);
      setRespondingTo(null);
      setResponse('');
      toast({
        title: 'Resposta enviada',
        description: 'Sua resposta foi enviada com sucesso.',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {communications.map((comm) => {
        const TypeIcon = typeIcons[comm.type];
        
        return (
          <div key={comm.id} className={`p-4 border rounded-lg ${!comm.is_read ? 'bg-blue-50 border-blue-200' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <TypeIcon className="h-4 w-4" />
                <h3 className="font-medium">{comm.title}</h3>
                <Badge variant={priorityColors[comm.priority]}>
                  {priorityLabels[comm.priority]}
                </Badge>
                {!comm.is_read && (
                  <Badge variant="default" className="text-xs">
                    Novo
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(comm.created_at)}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {comm.message}
            </p>

            {comm.response && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <h4 className="text-sm font-medium text-green-800 mb-1">Resposta do BPO:</h4>
                <p className="text-sm text-green-700">{comm.response}</p>
                {comm.responded_at && (
                  <p className="text-xs text-green-600 mt-1">
                    Respondido em {formatDate(comm.responded_at)}
                  </p>
                )}
              </div>
            )}

            {showActions && (
              <div className="flex gap-2 mt-3">
                {!comm.is_read && onMarkAsRead && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMarkAsRead(comm.id)}
                  >
                    Marcar como Lido
                  </Button>
                )}
                
                {!comm.response && onRespond && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRespondingTo(comm.id)}
                  >
                    Responder
                  </Button>
                )}
              </div>
            )}

            {respondingTo === comm.id && (
              <div className="mt-3 space-y-2">
                <Textarea
                  placeholder="Digite sua resposta..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleRespond(comm.id)}>
                    Enviar Resposta
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setRespondingTo(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      {communications.length === 0 && (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum comunicado encontrado</p>
        </div>
      )}
    </div>
  );
}