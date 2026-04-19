import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth_token';
const AUTH_RESPONSE_KEY = 'auth_response';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
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
