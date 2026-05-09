import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable()
export class ApiBaseUrlInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!environment.apiBaseUrl || !this.isApiRequest(req.url)) {
      return next.handle(req);
    }

    const normalizedBaseUrl = environment.apiBaseUrl.replace(/\/+$/, '');
    const normalizedPath = req.url.replace(/^\/+/, '');

    return next.handle(
      req.clone({
        url: `${normalizedBaseUrl}/${normalizedPath}`
      })
    );
  }

  private isApiRequest(url: string): boolean {
    return url.startsWith('/api/') || url === '/api' || url.startsWith('/v3/');
  }
}
