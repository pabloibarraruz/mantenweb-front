import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HealthControllerService } from '../../api';
import { NavComponent } from '../../shared/nav/nav.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, NavComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css'
})
export class DashboardPageComponent implements OnInit {
  status: any = null;
  loading = false;

  constructor(private healthApi: HealthControllerService) {}

  ngOnInit(): void {
    this.loading = true;
    this.healthApi.health().subscribe({
      next: (res) => {
        this.status = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.status = { ok: false };
        this.loading = false;
      }
    });
  }
}
