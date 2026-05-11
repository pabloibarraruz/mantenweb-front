import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ForgotPasswordRequestDto } from '../../api/model/models';
import { AuthApiService } from '../../services';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.css'
})
export class ForgotPasswordPageComponent {
  readonly form: FormGroup;

  loading = false;
  message: string | null = null;
  errorMsg: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: AuthApiService
  ) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  get correoCtrl() {
    return this.form.get('correo');
  }

  submit(): void {
    this.message = null;
    this.errorMsg = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ForgotPasswordRequestDto = {
      correo: (this.form.value.correo ?? '').trim().toLowerCase()
    };

    this.loading = true;
    this.api.recuperarContrasena(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.message =
          res['message'] ??
          'Si el correo existe, se generará un enlace de recuperación.';
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
    return 'No se pudo solicitar la recuperación. Inténtalo nuevamente.';
  }
}
