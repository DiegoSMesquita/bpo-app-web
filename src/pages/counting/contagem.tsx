import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Download, Filter, Trash2, Clock, Eye, MessageSquare } from 'lucide-react';
import { getContagens } from '@/services/contagemService';

const Contagem = () => {
  const [statusFilter, setStatusFilter] = useState('ativos');
  const [agendamentoFilter, setAgendamentoFilter] = useState('todas');
  const [searchId, setSearchId] = useState('');
  const [periodo, setPeriodo] = useState<'7' | '14' | '30'>('7');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [contagens, setContagens] = useState([]);

  useEffect(() => {
    const fetchContagens = async () => {
      try {
        const data = await getContagens();
        setContagens(data);
      } catch (error) {
        console.error('Erro ao buscar contagens:', error);
      }
    };
    fetchContagens();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-end">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">Status</SelectTrigger>
          <SelectContent>
            <SelectItem value="ativos">Ativos</SelectItem>
            <SelectItem value="inativos">Inativos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={agendamentoFilter} onValueChange={setAgendamentoFilter}>
          <SelectTrigger className="w-40">Agendamento</SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="7">7 dias</SelectItem>
            <SelectItem value="14">14 dias</SelectItem>
            <SelectItem value="30">30 dias</SelectItem>
          </SelectContent>
        </Select>

        <Input
          className="w-40"
          placeholder="ID da contagem"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        <Calendar selected={selectedDate} onSelect={setSelectedDate} className="border rounded-md" />

        <Button variant="default" className="flex items-center gap-2">
          <Filter size={16} /> Filtrar
        </Button>

        <Button variant="secondary" className="flex items-center gap-2">
          <Download size={16} /> Exportar K2
        </Button>

        <Button variant="secondary" className="flex items-center gap-2">
          <Download size={16} /> Planilha personalizada
        </Button>
      </div>

      {/* Tabela */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead>Tempo Restante</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contagens.map((item: any, index) => (
            <TableRow key={index}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.descricao}</TableCell>
              <TableCell>{new Date(item.data).toLocaleDateString()}</TableCell>
              <TableCell>{item.progresso}</TableCell>
              <TableCell>{item.tempo_restante}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.responsavel}</TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" variant="outline"><Eye size={16} /></Button>
                <Button size="sm" variant="outline"><MessageSquare size={16} /></Button>
                <Button size="sm" variant="outline"><Clock size={16} /></Button>
                <Button size="sm" variant="destructive"><Trash2 size={16} /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="text-right text-sm text-muted-foreground">
        Total de contagens exibidas: {contagens.length}
      </div>
    </div>
  );
};

export default Contagem;