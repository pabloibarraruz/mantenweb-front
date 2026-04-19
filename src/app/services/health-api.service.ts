import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HealthApiService {
  private readonly baseUrl = '/api/health';

  constructor(private readonly http: HttpClient) {}

  obtenerEstado(): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(this.baseUrl);
  }
}
