import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axios from 'axios';

export default function ContagensDashboard() {
  const [contagens, setContagens] = useState<any[]>([]);
  const [descricao, setDescricao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [data, setData] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8081/contagens').then(res => setContagens(res.data));
  }, [refresh]);

  const criarContagem = () => {
    axios.post('http://localhost:8081/contagens', {
      descricao,
      responsavel,
      data,
      status: 'aberta'
    }).then(() => {
      setDescricao('');
      setResponsavel('');
      setData('');
      setRefresh(!refresh);
    });
  };

  const gerarLink = async (id: number) => {
    const res = await axios.post(`http://localhost:8081/contagens/${id}/token`);
    navigator.clipboard.writeText(res.data.link);
    alert('Link copiado: ' + res.data.link);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Contagens</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Criar nova contagem</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Contagem</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
              <Input placeholder="Responsável" value={responsavel} onChange={e => setResponsavel(e.target.value)} />
              <Input type="date" value={data} onChange={e => setData(e.target.value)} />
              <Button onClick={criarContagem}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {contagens.map(c => (
          <div key={c.id} className="border p-4 rounded shadow-sm">
            <p className="font-semibold">{c.descricao}</p>
            <p className="text-sm text-gray-600">Data: {c.data} - Responsável: {c.responsavel}</p>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={() => gerarLink(c.id)}>Gerar Link</Button>
              <Button variant="secondary">Ver Detalhes</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
