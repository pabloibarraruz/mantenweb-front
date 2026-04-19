import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';

import { LoginPageComponent } from './pages/login/login.page';
import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { OrdenesTrabajoPageComponent } from './pages/ordenes-trabajo/ordenes-trabajo.page';
import { MisAsignadasPageComponent } from './pages/mis-asignadas/mis-asignadas.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginPageComponent },

  { path: 'dashboard', component: DashboardPageComponent, canActivate: [authGuard] },
  { path: 'ordenes-trabajo', component: OrdenesTrabajoPageComponent, canActivate: [authGuard] },
  { path: 'mis-asignadas', component: MisAsignadasPageComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];
