import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ResetPasswordRequestDto } from '../../api/model/models';
import { AuthApiService } from '../../services';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.page.html',
  styleUrl: './reset-password.page.css'
})
export class ResetPasswordPageComponent {
  readonly token: string;
  readonly form: FormGroup;

  loading = false;
  message: string | null = null;
  errorMsg: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: AuthApiService,
    private readonly route: ActivatedRoute
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.form = this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]]
    });
  }

  get nuevaCtrl() {
    return this.form.get('nuevaContrasena');
  }

  get confirmarCtrl() {
    return this.form.get('confirmarContrasena');
  }

  get passwordsDoNotMatch(): boolean {
    const value = this.form.value;
    return Boolean(
      value.nuevaContrasena &&
        value.confirmarContrasena &&
        value.nuevaContrasena !== value.confirmarContrasena
    );
  }

  submit(): void {
    this.message = null;
    this.errorMsg = null;

    if (!this.token) {
      this.errorMsg = 'El enlace no contiene token de recuperación.';
      return;
    }

    if (this.form.invalid || this.passwordsDoNotMatch) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ResetPasswordRequestDto = {
      token: this.token,
      nuevaContrasena: this.form.value.nuevaContrasena ?? ''
    };

    this.loading = true;
    this.api.resetearContrasena(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = res['message'] ?? 'Contraseña actualizada correctamente.';
        this.form.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMsg = this.resolveError(err);
      }
    });
  }

  private resolveError(err: HttpErrorResponse): string {
    if (typeof err.error?.message === 'string') return err.error.message;
    if (err.status === 0) return 'No se pudo conectar con el backend.';
    return 'No se pudo actualizar la contraseña. Revisa el enlace e inténtalo nuevamente.';
  }
}
