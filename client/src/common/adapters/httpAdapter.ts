import axios from 'axios';

type HttpAdapter = {
  get<T>(url: string, options?: RequestInit): Promise<T>;
  post<T>(url: string, body: unknown, options?: RequestInit): Promise<T>;
  patch<T>(url: string, body: unknown, options?: RequestInit): Promise<T>;
  delete<T>(url: string, options?: RequestInit): Promise<T>;
  put<T>(url: string, body: unknown, options?: RequestInit): Promise<T>;
};

const axiosHttpAdapter: HttpAdapter = {
  async get<T>(url: string, options?: RequestInit) {
    const response = await axios.get<T>(url, options);
    return response.data;
  },
  async post<T>(url: string, body: unknown, options?: RequestInit) {
    const response = await axios.post<T>(url, body, {
      headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
      ...options,
    });
    return response.data;
  },
  async patch<T>(url: string, body: unknown, options?: RequestInit) {
    const response = await axios.patch<T>(url, body, {
      headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
      ...options,
    });
    return response.data;
  },
  async delete<T>(url: string, options?: RequestInit) {
    const response = await axios.delete<T>(url, options);
    return response.data;
  },
  async put<T>(url: string, body: unknown, options?: RequestInit) {
    const response = await axios.put<T>(url, body, {
      headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
      ...options,
    });
    return response.data;
  }
};

export const httpAdapter: HttpAdapter = axiosHttpAdapter;
