export type OptionType = {
  value: string;
  label: string;
};

export interface BackendErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface HttpErrorResponse {
  message: string; 
  name: string;
  response?: {
    data?: BackendErrorBody;
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
  };
}

export interface CustomHttpResponse<T> {
  data: T;
  status: number;
}

export type DecodedToken = {
  email: string;
  role: string;
};