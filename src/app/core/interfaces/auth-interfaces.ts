export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  role: string;
  // Mantener compatibilidad con versión anterior
  token?: string;
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}