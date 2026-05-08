import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  OrdenTrabajoCreatePayload,
  OrdenTrabajoFinalizarPayload,
  OrdenTrabajoItem,
} from '../models/orden-trabajo.model';

@Injectable({ providedIn: 'root' })
export class OrdenTrabajoApiService {
  private readonly baseUrl = '/api/ordenes-trabajo';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<OrdenTrabajoItem[]> {
    return this.http.get<OrdenTrabajoItem[]>(this.baseUrl);
  }

  listarMisAsignadas(): Observable<OrdenTrabajoItem[]> {
    return this.http.get<OrdenTrabajoItem[]>(`${this.baseUrl}/mis-asignadas`);
  }

  obtenerPorId(id: number): Observable<OrdenTrabajoItem> {
    return this.http.get<OrdenTrabajoItem>(`${this.baseUrl}/${id}`);
  }

  crear(payload: OrdenTrabajoCreatePayload): Observable<OrdenTrabajoItem> {
    return this.http.post<OrdenTrabajoItem>(this.baseUrl, payload);
  }

  finalizar(id: number, payload: OrdenTrabajoFinalizarPayload): Observable<OrdenTrabajoItem> {
    return this.http.patch<OrdenTrabajoItem>(`${this.baseUrl}/${id}/finalizar`, payload);
  }
}
