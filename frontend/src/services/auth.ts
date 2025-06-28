import { AuthResponse, LoginCredentials, User, RegisterData } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_API_URL || 'https://tailor-next-drupal.ddev.site';

class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: process.env.DRUPAL_CLIENT_ID || 'default_consumer',
        client_secret: process.env.DRUPAL_CLIENT_SECRET || 'default_secret',
        username: credentials.username,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description || 'Login failed');
    }

    const authData: AuthResponse = await response.json();
    
    // Store token
    localStorage.setItem(this.tokenKey, authData.access_token);
    
    // Fetch user data
    const user = await this.getCurrentUser(authData.access_token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    
    return authData;
  }

  async register(data: RegisterData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/jsonapi/user/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'user--user',
          attributes: {
            name: data.name,
            mail: data.email,
            pass: data.password,
            status: true,
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.detail || 'Registration failed');
    }

    const result = await response.json();
    return this.transformUserData(result.data);
  }

  async getCurrentUser(token?: string): Promise<User> {
    const authToken = token || this.getToken();
    if (!authToken) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/jsonapi/user/user?filter[drupal_internal__uid]=1`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/vnd.api+json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const result = await response.json();
    if (!result.data || result.data.length === 0) {
      throw new Error('User not found');
    }

    return this.transformUserData(result.data[0]);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private transformUserData(userData: any): User {
    return {
      id: userData.id,
      name: userData.attributes.display_name || userData.attributes.name,
      email: userData.attributes.mail,
      roles: userData.attributes.roles || [],
      created: userData.attributes.created,
      status: userData.attributes.status,
    };
  }

  async refreshToken(): Promise<AuthResponse | null> {
    // Implementation for token refresh if needed
    return null;
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.roles.includes(role) || false;
  }

  isAdmin(): boolean {
    return this.hasRole('administrator');
  }
}

export const authService = new AuthService();
