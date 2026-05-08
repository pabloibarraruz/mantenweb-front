import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { Especialidad, Prioridad, UsuarioResponseDto } from '../../api/model/models';
import { OrdenTrabajoCreatePayload, OrdenTrabajoItem } from '../../models/orden-trabajo.model';
import { EspecialidadApiService } from '../../services/especialidad-api.service';
import { OrdenTrabajoApiService } from '../../services/orden-trabajo-api.service';
import { PrioridadApiService } from '../../services/prioridad-api.service';
import { UsuarioApiService } from '../../services/usuario-api.service';
import { NavComponent } from '../../shared/nav/nav.component';

@Component({
  selector: 'app-jefatura-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavComponent],
  templateUrl: './jefatura.page.html',
  styleUrl: './jefatura.page.css'
})
export class JefaturaPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly monthFormatter = new Intl.DateTimeFormat('es-CL', {
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Santiago'
  });

  readonly tecnicos = signal<UsuarioResponseDto[]>([]);
  readonly especialidades = signal<Especialidad[]>([]);
  readonly prioridades = signal<Prioridad[]>([]);
  readonly ordenes = signal<OrdenTrabajoItem[]>([]);
  readonly filtroEspecialidad = signal('');
  readonly filtroMes = signal('');
  readonly loadingCatalogos = signal(false);
  readonly loadingOrdenes = signal(false);
  readonly saving = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly successMsg = signal<string | null>(null);
  readonly ordenesFiltradas = computed(() => {
    return this.ordenes().filter((item) => {
      const coincideEspecialidad =
        !this.filtroEspecialidad() || String(item.idEspecialidad ?? '') === this.filtroEspecialidad();
      const coincideMes =
        !this.filtroMes() || this.getMonthKey(item.fechaApertura) === this.filtroMes();

      return coincideEspecialidad && coincideMes;
    });
  });
  readonly mesesDisponibles = computed(() => {
    const months = new Map<string, string>();

    for (const item of this.ordenes()) {
      const monthKey = this.getMonthKey(item.fechaApertura);
      if (!monthKey || months.has(monthKey)) {
        continue;
      }

      months.set(monthKey, this.formatMonthLabel(monthKey));
    }

    return Array.from(months.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([value, label]) => ({ value, label }));
  });
  readonly resumen = computed(() => {
    const ordenes = this.ordenesFiltradas();

    return {
      total: ordenes.length,
      enProceso: ordenes.filter((item) => this.normalize(item.estadoNombre) === 'EN PROCESO').length,
      finalizadas: ordenes.filter((item) => this.normalize(item.estadoNombre) === 'FINALIZADA').length,
      urgentes: ordenes.filter((item) => this.normalize(item.prioridadNombre) === 'URGENTE').length
    };
  });

  readonly form = this.fb.group({
    titulo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    piso: ['', [Validators.required]],
    servicio: ['', [Validators.required]],
    nombreSolicitante: ['', [Validators.required]],
    idEspecialidad: [null as number | null, [Validators.required]],
    idPrioridad: [null as number | null, [Validators.required]],
    idUsuarioAsignado: [null as number | null, [Validators.required]]
  });

  constructor(
    private readonly usuarioApi: UsuarioApiService,
    private readonly especialidadApi: EspecialidadApiService,
    private readonly prioridadApi: PrioridadApiService,
    private readonly ordenTrabajoApi: OrdenTrabajoApiService
  ) {}

  ngOnInit(): void {
    this.loadCatalogos();
    this.loadOrdenes();
  }

  loadCatalogos(): void {
    this.loadingCatalogos.set(true);
    this.errorMsg.set(null);

    forkJoin({
      usuarios: this.usuarioApi.listar(),
      especialidades: this.especialidadApi.listar(),
      prioridades: this.prioridadApi.listar()
    }).subscribe({
      next: ({ usuarios, especialidades, prioridades }) => {
        this.tecnicos.set(
          (usuarios ?? []).filter(
            (usuario) => usuario.activo && usuario.nombreRol?.toUpperCase() === 'TECNICO'
          )
        );
        this.especialidades.set(especialidades ?? []);
        this.prioridades.set(
          (prioridades ?? []).filter((prioridad) => {
            const nombre = prioridad.nombrePrioridad?.trim().toUpperCase();
            return nombre === 'URGENTE' || nombre === 'PROGRAMADO';
          })
        );
        this.loadingCatalogos.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('No se pudieron cargar los catálogos de jefatura.');
        this.loadingCatalogos.set(false);
      }
    });
  }

  loadOrdenes(): void {
    this.loadingOrdenes.set(true);
    this.errorMsg.set(null);

    this.ordenTrabajoApi.listar().subscribe({
      next: (items) => {
        this.ordenes.set(items ?? []);
        this.loadingOrdenes.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('No se pudieron cargar las órdenes de trabajo.');
        this.loadingOrdenes.set(false);
      }
    });
  }

  submit(): void {
    this.errorMsg.set(null);
    this.successMsg.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: OrdenTrabajoCreatePayload = {
      titulo: (value.titulo ?? '').trim(),
      descripcion: (value.descripcion ?? '').trim(),
      piso: (value.piso ?? '').trim(),
      servicio: (value.servicio ?? '').trim(),
      nombreSolicitante: (value.nombreSolicitante ?? '').trim(),
      idEspecialidad: Number(value.idEspecialidad),
      idPrioridad: Number(value.idPrioridad),
      idUsuarioAsignado: Number(value.idUsuarioAsignado)
    };

    this.saving.set(true);
    this.ordenTrabajoApi.crear(payload).subscribe({
      next: () => {
        this.form.reset();
        this.saving.set(false);
        this.successMsg.set('La OT fue creada y asignada correctamente.');
        this.loadOrdenes();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('No se pudo crear la OT.');
        this.saving.set(false);
      }
    });
  }

  trackById(_: number, item: OrdenTrabajoItem): number {
    return item.id;
  }

  setFiltroEspecialidad(value: string): void {
    this.filtroEspecialidad.set(value);
  }

  setFiltroMes(value: string): void {
    this.filtroMes.set(value);
  }

  limpiarFiltros(): void {
    this.filtroEspecialidad.set('');
    this.filtroMes.set('');
  }

  getEstadoClass(item: OrdenTrabajoItem): string {
    const estado = this.normalize(item.estadoNombre);
    if (estado === 'FINALIZADA') {
      return 'status done';
    }

    if (estado === 'EN PROCESO') {
      return 'status progress';
    }

    return 'status';
  }

  getPrioridadClass(item: OrdenTrabajoItem): string {
    return this.normalize(item.prioridadNombre) === 'URGENTE' ? 'pill urgent' : 'pill planned';
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

  private getMonthKey(value: string | null | undefined): string {
    if (!value || value.length < 7) {
      return '';
    }

    return value.slice(0, 7);
  }

  private formatMonthLabel(monthKey: string): string {
    const [year, month] = monthKey.split('-');
    if (!year || !month) {
      return monthKey;
    }

    const date = new Date(`${year}-${month}-01T12:00:00`);
    const label = this.monthFormatter.format(date);
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  private normalize(value: string | null | undefined): string {
    return value?.trim().toUpperCase() ?? '';
  }
}
