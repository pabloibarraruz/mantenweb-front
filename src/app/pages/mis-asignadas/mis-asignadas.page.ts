import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenTrabajo } from '../../api/model/models';
import { OrdenTrabajoApiService } from '../../services';
import { NavComponent } from '../../shared/nav/nav.component';

@Component({
  selector: 'app-mis-asignadas-page',
  standalone: true,
  imports: [CommonModule, NavComponent],
  templateUrl: './mis-asignadas.page.html',
  styleUrl: './mis-asignadas.page.css'
})
export class MisAsignadasPageComponent implements OnInit {
  items: OrdenTrabajo[] = [];
  loading = false;
  errorMsg: string | null = null;

  constructor(private api: OrdenTrabajoApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.errorMsg = null;
    this.loading = true;
    this.api.listarMisAsignadas().subscribe({
      next: (res) => {
        this.items = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'No se pudieron cargar tus órdenes asignadas.';
        this.loading = false;
      }
    });
  }
}
