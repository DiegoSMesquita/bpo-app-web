import { useEffect, useState } from 'react'
import axios from 'axios'
import { useEmpresaStore } from '@/store/useEmpresaStore'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

export default function HeaderEmpresaSelect() {
  const [empresas, setEmpresas] = useState<{ nome: string; codigo: string }[]>([])
  const { empresaAtual, setEmpresaAtual } = useEmpresaStore()

  useEffect(() => {
    axios.get('http://localhost:8081/empresas')
      .then((res) => setEmpresas(res.data))
      .catch(() => setEmpresas([]))
  }, [])

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Empresa:</span>
      <Select value={empresaAtual || ''} onValueChange={setEmpresaAtual}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecionar empresa" />
        </SelectTrigger>
        <SelectContent>
          {empresas.map((empresa) => (
            <SelectItem key={empresa.codigo} value={empresa.codigo}>
              {empresa.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
