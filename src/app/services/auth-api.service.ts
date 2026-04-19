import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  AuthLoginRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
} from '../api/model/models';

export interface AuthLoginResponse {
  token: string;
  tipo: string;
  idUsuario: number;
  correo: string;
  nombreCompleto: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly baseUrl = '/api/auth';

  constructor(private readonly http: HttpClient) {}

  login(payload: AuthLoginRequestDto): Observable<AuthLoginResponse> {
    return this.http.post<AuthLoginResponse>(`${this.baseUrl}/login`, payload);
  }

  recuperarContrasena(payload: ForgotPasswordRequestDto): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(`${this.baseUrl}/forgot-password`, payload);
  }

  resetearContrasena(payload: ResetPasswordRequestDto): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(`${this.baseUrl}/reset-password`, payload);
  }
}
