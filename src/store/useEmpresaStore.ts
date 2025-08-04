import { create } from 'zustand'

interface EmpresaStore {
  empresaAtual: string | null
  setEmpresaAtual: (codigo: string) => void
}

export const useEmpresaStore = create<EmpresaStore>((set) => ({
  empresaAtual: null,
  setEmpresaAtual: (codigo) => set({ empresaAtual: codigo }),
}))
