// Authentication API service
export class AuthService {
  private static BASE_URL = '/api';

  static async register(email: string, username: string, password: string) {
    const response = await fetch(`${this.BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  }

  static async login(email: string, password: string) {
    const response = await fetch(`${this.BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  }

  static async verifyToken(token: string) {
    const response = await fetch(`${this.BASE_URL}/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { valid: false };
    }

    return data;
  }

  static async getProfile(token: string) {
    const response = await fetch(`${this.BASE_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get profile');
    }

    return data;
  }

  static setToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  static removeToken() {
    localStorage.removeItem('auth_token');
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
