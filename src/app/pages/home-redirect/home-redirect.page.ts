import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home-redirect-page',
  standalone: true,
  template: ''
})
export class HomeRedirectPageComponent implements OnInit {
  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  ngOnInit(): void {
    this.router.navigateByUrl(this.auth.getHomeUrl());
  }
}
