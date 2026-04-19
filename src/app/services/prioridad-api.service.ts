import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Prioridad } from '../api/model/models';

@Injectable({ providedIn: 'root' })
export class PrioridadApiService {
  private readonly baseUrl = '/api/prioridades';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Prioridad[]> {
    return this.http.get<Prioridad[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<Prioridad> {
    return this.http.get<Prioridad>(`${this.baseUrl}/${id}`);
  }
}
