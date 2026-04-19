import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  UbicacionCreateDto,
  UbicacionResponseDto,
} from '../api/model/models';

@Injectable({ providedIn: 'root' })
export class UbicacionApiService {
  private readonly baseUrl = '/api/ubicaciones';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<UbicacionResponseDto[]> {
    return this.http.get<UbicacionResponseDto[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<UbicacionResponseDto> {
    return this.http.get<UbicacionResponseDto>(`${this.baseUrl}/${id}`);
  }

  crear(payload: UbicacionCreateDto): Observable<UbicacionResponseDto> {
    return this.http.post<UbicacionResponseDto>(this.baseUrl, payload);
  }

  actualizar(id: number, payload: UbicacionCreateDto): Observable<UbicacionResponseDto> {
    return this.http.put<UbicacionResponseDto>(`${this.baseUrl}/${id}`, payload);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
