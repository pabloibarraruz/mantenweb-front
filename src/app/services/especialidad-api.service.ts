import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Especialidad } from '../api/model/models';

@Injectable({ providedIn: 'root' })
export class EspecialidadApiService {
  private readonly baseUrl = '/api/especialidades';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<Especialidad> {
    return this.http.get<Especialidad>(`${this.baseUrl}/${id}`);
  }
}
