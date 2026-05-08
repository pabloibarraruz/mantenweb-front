import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenTrabajoItem } from '../../models/orden-trabajo.model';
import { OrdenTrabajoApiService } from '../../services';
import { NavComponent } from '../../shared/nav/nav.component';

@Component({
  selector: 'app-ordenes-trabajo-page',
  standalone: true,
  imports: [CommonModule, NavComponent],
  templateUrl: './ordenes-trabajo.page.html',
  styleUrl: './ordenes-trabajo.page.css'
})
export class OrdenesTrabajoPageComponent implements OnInit {
  readonly items = signal<OrdenTrabajoItem[]>([]);
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  constructor(private api: OrdenTrabajoApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.errorMsg.set(null);
    this.loading.set(true);
    this.api.listar().subscribe({
      next: (res) => {
        this.items.set(res ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('No se pudieron cargar las órdenes.');
        this.loading.set(false);
      }
    });
  }
}
