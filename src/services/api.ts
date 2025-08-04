import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8081", // ✅ A porta onde o BACKEND está rodando
  withCredentials: true,
});
