import axios from "axios";
const API = '/api/contagens';

export const getContagens = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const getContagemById = async (id: string | number) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

export const updateContagem = async (id: string | number, data: any) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
};

export const deleteContagem = async (id: string | number) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};

export const updateTempoContagem = async (id: string | number, tempo: string) => {
  const res = await axios.put(`${API}/${id}/tempo`, { tempo_restante: tempo });
  return res.data;
};
export const api = axios.create({
  baseURL: "http://localhost:8081", // ✅ A porta onde o BACKEND está rodando
  withCredentials: true,
});
