import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth_token';
const AUTH_RESPONSE_KEY = 'auth_response';

interface StoredAuthResponse {
  token?: string;
  idUsuario?: number;
  correo?: string;
  nombreCompleto?: string;
  rol?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthResponse(): StoredAuthResponse | null {
    const raw = localStorage.getItem(AUTH_RESPONSE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as StoredAuthResponse;
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    const role = this.getAuthResponse()?.rol;
    return typeof role === 'string' ? role.trim().toUpperCase() : null;
  }

  getUserId(): number | null {
    const id = this.getAuthResponse()?.idUsuario;
    return typeof id === 'number' ? id : null;
  }

  getDisplayName(): string {
    return this.getAuthResponse()?.nombreCompleto?.trim() || '';
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isTecnico(): boolean {
    return this.getRole() === 'TECNICO';
  }

  getHomeUrl(): string {
    if (this.isAdmin()) return '/jefatura';
    if (this.isTecnico()) return '/tecnico';
    return '/login';
  }

  saveAuthResponse(response: unknown): void {
    try {
      localStorage.setItem(AUTH_RESPONSE_KEY, JSON.stringify(response));
    } catch {
      // ignore
    }

    const token = this.extractToken(response);
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_RESPONSE_KEY);
  }

  private extractToken(response: unknown): string | null {
    if (!response) return null;
    if (typeof response === 'string') return response.trim() || null;
    if (typeof response !== 'object') return null;

    const r: any = response;
    const candidates: any[] = [r.token, r.accessToken, r.jwt, r.idToken, r.bearer];

    if (r.data) {
      candidates.push(r.data.token, r.data.accessToken, r.data.jwt);
    }

    for (const c of candidates) {
      if (typeof c === 'string' && c.trim().length > 0) {
        return c.trim();
      }
    }

    return null;
  }
}
