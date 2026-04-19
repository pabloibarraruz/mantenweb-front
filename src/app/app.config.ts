import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

// IMPORTS del cliente generado
import { ApiModule, Configuration } from './api';

import { AuthInterceptor } from './core/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),

    // Interceptor: agrega Authorization: Bearer <token> en cada request
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    importProvidersFrom(
      ApiModule.forRoot(() => new Configuration({ basePath: '' }))
    )
  ]
};
