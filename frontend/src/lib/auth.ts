import { api } from './api';

export interface RegisterReq {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginReq {
  email: string;
  password: string;
  device: string;
}

export interface LoginRes {
  message: string;
  valid_minutes: number;
}

export interface VerifyReq {
  email: string;
  code: string | number;
}

export interface VerifyRes {
  message: string;
  token?: string;
}

export async function registerUser(body: RegisterReq) {
  return api.http<{ message: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function loginUser(body: LoginReq) {
  return api.http<LoginRes>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function verifyOtp(body: VerifyReq) {
  return api.http<VerifyRes>('/api/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// helper: guardar/leer token (si tu backend lo devuelve en verify)
export function setToken(t?: string) {
  if (!t) return;
  localStorage.setItem('token', t);
}

export function getAuthHeader() {
  const t = localStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}
export interface RequestOtpReq {
  email: string;
  device: string;
}
export interface RequestOtpRes {
  message: string;
  valid_minutes?: number;
  otp_demo?: number;
}

export async function requestOtp(body: RequestOtpReq) {
  return api.http<RequestOtpRes>('/api/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
