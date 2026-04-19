import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenTrabajo } from '../../api/model/models';
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
    this.api.listar().subscribe({
      next: (res) => {
        this.items = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'No se pudieron cargar las órdenes.';
        this.loading = false;
      }
    });
  }
}
