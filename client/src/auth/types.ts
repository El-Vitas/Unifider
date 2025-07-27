export type LoginResponse = {
  token: string;
  role: string;
  status: number;
  message?: string;
};

export type RegisterCredentials = {
  email: string;
  password: string;
};  