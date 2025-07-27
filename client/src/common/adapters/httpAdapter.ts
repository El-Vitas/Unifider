// src/common/adapters/httpAdapter.ts
import axios from 'axios';
import type { CustomHttpResponse } from '../types';

type HttpAdapter = {
  get<T>(url: string, options?: RequestInit): Promise<CustomHttpResponse<T>>;
  post<T>(
    url: string,
    body: unknown,
    options?: RequestInit,
  ): Promise<CustomHttpResponse<T>>;
  patch<T>(
    url: string,
    body: unknown,
    options?: RequestInit,
  ): Promise<CustomHttpResponse<T>>;
  delete<T>(url: string, options?: RequestInit): Promise<CustomHttpResponse<T>>;
  put<T>(
    url: string,
    body: unknown,
    options?: RequestInit,
  ): Promise<CustomHttpResponse<T>>;
};

const axiosHttpAdapter: HttpAdapter = {
  async get<T>(url: string, options?: RequestInit) {
    const response = await axios.get<T>(url, options);
    return { data: response.data, status: response.status };
  },
  async post<T>(url: string, body: unknown, options?: RequestInit) {
    const response = await axios.post<T>(url, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });
    return { data: response.data, status: response.status };
  },
  async patch<T>(url: string, body: unknown, options?: RequestInit) {
    const response = await axios.patch<T>(url, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });
    return { data: response.data, status: response.status };
  },
  async delete<T>(url: string, options?: RequestInit) {
    const response = await axios.delete<T>(url, options);
    return { data: response.data, status: response.status };
  },
  async put<T>(url: string, body: unknown, options?: RequestInit) {
    const response = await axios.put<T>(url, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });
    return { data: response.data, status: response.status };
  },
};

export const httpAdapter: HttpAdapter = axiosHttpAdapter;
