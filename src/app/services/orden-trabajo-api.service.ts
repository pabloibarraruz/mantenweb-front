import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { OrdenTrabajo } from '../api/model/models';

@Injectable({ providedIn: 'root' })
export class OrdenTrabajoApiService {
  private readonly baseUrl = '/api/ordenes-trabajo';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<OrdenTrabajo[]> {
    return this.http.get<OrdenTrabajo[]>(this.baseUrl);
  }

  listarMisAsignadas(): Observable<OrdenTrabajo[]> {
    return this.http.get<OrdenTrabajo[]>(`${this.baseUrl}/mis-asignadas`);
  }

  obtenerPorId(id: number): Observable<OrdenTrabajo> {
    return this.http.get<OrdenTrabajo>(`${this.baseUrl}/${id}`);
  }

  crear(payload: OrdenTrabajo): Observable<OrdenTrabajo> {
    return this.http.post<OrdenTrabajo>(this.baseUrl, payload);
  }

  actualizar(id: number, payload: OrdenTrabajo): Observable<OrdenTrabajo> {
    return this.http.put<OrdenTrabajo>(`${this.baseUrl}/${id}`, payload);
  }

  asignar(id: number, idUsuario: number): Observable<OrdenTrabajo> {
    return this.http.patch<OrdenTrabajo>(`${this.baseUrl}/${id}/asignar/${idUsuario}`, {});
  }

  cambiarEstado(id: number, idEstado: number): Observable<OrdenTrabajo> {
    return this.http.patch<OrdenTrabajo>(`${this.baseUrl}/${id}/estado/${idEstado}`, {});
  }

  cerrar(id: number): Observable<OrdenTrabajo> {
    return this.http.patch<OrdenTrabajo>(`${this.baseUrl}/${id}/cerrar`, {});
  }
}
