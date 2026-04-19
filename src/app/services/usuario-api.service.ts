import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UsuarioCreateDto, UsuarioResponseDto } from '../api/model/models';

export interface UsuarioUpdateDto {
  idRol: number;
  nombreCompleto: string;
  correo: string;
  activo?: boolean | null;
}

@Injectable({ providedIn: 'root' })
export class UsuarioApiService {
  private readonly baseUrl = '/api/usuarios';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<UsuarioResponseDto[]> {
    return this.http.get<UsuarioResponseDto[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<UsuarioResponseDto> {
    return this.http.get<UsuarioResponseDto>(`${this.baseUrl}/${id}`);
  }

  crear(payload: UsuarioCreateDto): Observable<UsuarioResponseDto> {
    return this.http.post<UsuarioResponseDto>(this.baseUrl, payload);
  }

  actualizar(id: number, payload: UsuarioUpdateDto): Observable<UsuarioResponseDto> {
    return this.http.put<UsuarioResponseDto>(`${this.baseUrl}/${id}`, payload);
  }

  activar(id: number, valor: boolean): Observable<UsuarioResponseDto> {
    const params = new HttpParams().set('valor', valor);
    return this.http.patch<UsuarioResponseDto>(`${this.baseUrl}/${id}/activar`, {}, { params });
  }
}
