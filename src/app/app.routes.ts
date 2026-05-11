import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

import { LoginPageComponent } from './pages/login/login.page';
import { ForgotPasswordPageComponent } from './pages/forgot-password/forgot-password.page';
import { ResetPasswordPageComponent } from './pages/reset-password/reset-password.page';
import { HomeRedirectPageComponent } from './pages/home-redirect/home-redirect.page';
import { JefaturaPageComponent } from './pages/jefatura/jefatura.page';
import { TecnicoPageComponent } from './pages/tecnico/tecnico.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot-password', component: ForgotPasswordPageComponent },
  { path: 'reset-password', component: ResetPasswordPageComponent },

  { path: 'dashboard', component: HomeRedirectPageComponent, canActivate: [authGuard] },
  { path: 'jefatura', component: JefaturaPageComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] } },
  { path: 'tecnico', component: TecnicoPageComponent, canActivate: [authGuard, roleGuard], data: { roles: ['TECNICO'] } },

  { path: '**', redirectTo: 'login' }
];
