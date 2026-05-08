import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  constructor(private auth: AuthService, private router: Router) {}

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  isTecnico(): boolean {
    return this.auth.isTecnico();
  }

  getDisplayName(): string {
    return this.auth.getDisplayName();
  }

  getRoleLabel(): string {
    if (this.auth.isAdmin()) {
      return 'Jefatura';
    }

    if (this.auth.isTecnico()) {
      return 'Técnico';
    }

    return '';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
