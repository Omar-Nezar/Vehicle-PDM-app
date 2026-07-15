import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const loginRequest = async (data: LoginPayload) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const registerRequest = async (data: RegisterPayload) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};