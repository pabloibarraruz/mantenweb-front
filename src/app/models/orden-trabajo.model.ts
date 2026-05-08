export interface OrdenTrabajoItem {
  id: number;
  codigoOt: string;
  titulo: string;
  descripcion: string;
  piso?: string | null;
  servicio?: string | null;
  nombreSolicitante?: string | null;
  detalleTrabajoRealizado?: string | null;
  fechaApertura?: string | null;
  fechaActualizacion?: string | null;
  fechaCierre?: string | null;
  idEspecialidad?: number | null;
  especialidadNombre?: string | null;
  idEstado?: number | null;
  estadoNombre?: string | null;
  idPrioridad?: number | null;
  prioridadNombre?: string | null;
  idUsuarioAsignado?: number | null;
  tecnicoAsignadoNombre?: string | null;
  idUsuarioCreador?: number | null;
  creadorNombre?: string | null;
}

export interface OrdenTrabajoCreatePayload {
  titulo: string;
  descripcion: string;
  piso: string;
  servicio: string;
  nombreSolicitante: string;
  idEspecialidad: number;
  idPrioridad: number;
  idUsuarioAsignado: number;
}

export interface OrdenTrabajoFinalizarPayload {
  detalleTrabajoRealizado: string;
}
