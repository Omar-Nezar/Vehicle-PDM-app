import API from "./base";

export interface LoginPayload {
  type: string;
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export const loginRequest = async (data: LoginPayload) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const registerRequest = async (data: RegisterPayload) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const updUserRequest = async (data: { name: string }) => {
  const res = await API.post(`/auth/update`, data)
  return res.data
}

export const logoutRequest = async () => {
  const res = await API.post(`/auth/logout`)
  return res.data
}

export const forgotPasswordRequest = async (data: { email: string }) => {
  const res = await API.post(`/auth/forgotpassword`, data)
  return res.data
}

export const resetPasswordRequest = async (data: { id: string; token: string; password: string; confirmPassword: string }) => {
  const res = await API.post(`/auth/resetpassword/${data.id}/${data.token}`, { password: data.password, confirmPassword: data.confirmPassword });
  return res.data
}

export const changePasswordRequest = async (data: ChangePasswordPayload) => {
  const res = await API.post(`/auth/changepassword`, data);
  return res.data;
}