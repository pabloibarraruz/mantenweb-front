import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OrdenTrabajoItem } from '../../models/orden-trabajo.model';
import { OrdenTrabajoApiService } from '../../services/orden-trabajo-api.service';
import { NavComponent } from '../../shared/nav/nav.component';

@Component({
  selector: 'app-tecnico-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent],
  templateUrl: './tecnico.page.html',
  styleUrl: './tecnico.page.css'
})
export class TecnicoPageComponent implements OnInit {
  readonly items = signal<OrdenTrabajoItem[]>([]);
  readonly drafts = signal<Record<number, string>>({});
  readonly loading = signal(false);
  readonly savingId = signal<number | null>(null);
  readonly errorMsg = signal<string | null>(null);
  readonly successMsg = signal<string | null>(null);
  readonly resumen = computed(() => {
    const items = this.items();

    return {
      total: items.length,
      pendientes: items.filter((item) => !this.isFinalizada(item)).length,
      finalizadas: items.filter((item) => this.isFinalizada(item)).length,
      urgentes: items.filter((item) => this.normalize(item.prioridadNombre) === 'URGENTE').length
    };
  });

  constructor(private readonly ordenTrabajoApi: OrdenTrabajoApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.ordenTrabajoApi.listarMisAsignadas().subscribe({
      next: (items) => {
        this.items.set(items ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('No se pudieron cargar tus trabajos asignados.');
        this.loading.set(false);
      }
    });
  }

  updateDraft(id: number, value: string): void {
    this.drafts.set({
      ...this.drafts(),
      [id]: value
    });
  }

  finalize(item: OrdenTrabajoItem): void {
    const detalle = (this.drafts()[item.id] ?? '').trim();
    if (!detalle) {
      this.errorMsg.set('Debes describir el trabajo realizado antes de finalizar.');
      return;
    }

    this.savingId.set(item.id);
    this.errorMsg.set(null);
    this.successMsg.set(null);

    this.ordenTrabajoApi.finalizar(item.id, { detalleTrabajoRealizado: detalle }).subscribe({
      next: () => {
        this.savingId.set(null);
        this.successMsg.set(`La orden ${item.codigoOt} fue finalizada.`);
        this.updateDraft(item.id, '');
        this.load();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('No se pudo finalizar la orden.');
        this.savingId.set(null);
      }
    });
  }

  isFinalizada(item: OrdenTrabajoItem): boolean {
    return this.normalize(item.estadoNombre) === 'FINALIZADA';
  }

  trackById(_: number, item: OrdenTrabajoItem): number {
    return item.id;
  }

  getEstadoClass(item: OrdenTrabajoItem): string {
    return this.isFinalizada(item) ? 'badge done' : 'badge progress';
  }

  getPrioridadClass(item: OrdenTrabajoItem): string {
    return this.normalize(item.prioridadNombre) === 'URGENTE' ? 'meta-chip urgent' : 'meta-chip planned';
  }

  formatFechaHora(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    const [datePart = '', timePart = ''] = value.split('T');
    const [year = '', month = '', day = ''] = datePart.split('-');
    const [hour = '00', minute = '00'] = timePart.split(':');

    if (!year || !month || !day) {
      return value;
    }

    return `${day}/${month}/${year} ${hour}:${minute}`;
  }

  private normalize(value: string | null | undefined): string {
    return value?.trim().toUpperCase() ?? '';
  }
}
