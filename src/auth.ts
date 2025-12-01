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

  static async login(identifier: string, password: string) {
    const response = await fetch(`${this.BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
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

  static async createRoom(name: string) {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${this.BASE_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result.room;
  }

  static async getMyRooms() {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${this.BASE_URL}/rooms`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.rooms;
  }

  static async joinRoom(roomCode: string) {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${this.BASE_URL}/rooms/${roomCode}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.room;
  }

  static async getShapes(roomCode: string) {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${this.BASE_URL}/rooms/${roomCode}/shapes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.shapes;
  }

  static async saveShape(roomCode: string, shapeId: string, data: string) {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${this.BASE_URL}/rooms/${roomCode}/shapes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ shapeId, data })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result.shape;
  }

  static async deleteShape(roomCode: string, id: number) {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${this.BASE_URL}/rooms/${roomCode}/shapes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result;
  }

  static async deleteAllShapes(roomCode: string) {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');
    const response = await fetch(`${this.BASE_URL}/rooms/${roomCode}/shapes`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result;
  }
}
