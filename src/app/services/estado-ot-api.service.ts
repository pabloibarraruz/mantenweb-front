import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EstadoOt } from '../api/model/models';

@Injectable({ providedIn: 'root' })
export class EstadoOtApiService {
  private readonly baseUrl = '/api/estados-ot';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<EstadoOt[]> {
    return this.http.get<EstadoOt[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<EstadoOt> {
    return this.http.get<EstadoOt>(`${this.baseUrl}/${id}`);
  }
}
