import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HealthApiService } from '../../services';
import { NavComponent } from '../../shared/nav/nav.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, NavComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css'
})
export class DashboardPageComponent implements OnInit {
  readonly status = signal<Record<string, unknown> | null>(null);
  readonly loading = signal(false);

  constructor(private healthApi: HealthApiService) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.healthApi.obtenerEstado().subscribe({
      next: (res) => {
        this.status.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.status.set({ ok: false });
        this.loading.set(false);
      }
    });
  }
}
