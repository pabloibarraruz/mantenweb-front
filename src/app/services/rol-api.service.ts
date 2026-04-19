import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Rol } from '../api/model/models';

@Injectable({ providedIn: 'root' })
export class RolApiService {
  private readonly baseUrl = '/api/roles';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.baseUrl);
  }
}
