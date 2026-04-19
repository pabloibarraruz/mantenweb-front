import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Area } from '../api/model/models';

@Injectable({ providedIn: 'root' })
export class AreaApiService {
  private readonly baseUrl = '/api/areas';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Area[]> {
    return this.http.get<Area[]>(this.baseUrl);
  }
}
