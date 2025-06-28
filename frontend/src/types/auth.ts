export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  created: string;
  status: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UserRole {
  id: string;
  label: string;
  permissions: string[];
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
