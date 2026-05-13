import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { AuthLoginRequestDto } from '../../api/model/models';
import { AuthService } from '../../core/auth/auth.service';
import { AuthApiService } from '../../services';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPageComponent {
  readonly form: FormGroup;

  loading = false;
  errorMsg: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: AuthApiService,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  get correoCtrl() {
    return this.form.get('correo');
  }

  get contrasenaCtrl() {
    return this.form.get('contrasena');
  }

  submit(): void {
    this.errorMsg = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const payload: AuthLoginRequestDto = {
      correo: (formValue.correo ?? '').trim().toLowerCase(),
      contrasena: formValue.contrasena ?? ''
    };

    this.loading = true;
    this.api.login(payload).subscribe({
      next: (res) => {
        this.auth.saveAuthResponse(res);
        this.loading = false;
        this.router.navigateByUrl(this.auth.getHomeUrl());
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMsg = this.resolveErrorMessage(err);
        console.error(err);
      }
    });
  }

  private resolveErrorMessage(err: HttpErrorResponse): string {
    const backendMessage =
      typeof err.error?.message === 'string' ? err.error.message : null;

    if (backendMessage) {
      return backendMessage;
    }

    if (err.status === 0) {
      return 'No se pudo conectar con el backend. Revisa que el servidor y el proxy estén activos.';
    }

    if (err.status === 401) {
      return 'Credenciales inválidas.';
    }

    if (err.status === 403) {
      return 'Tu usuario no tiene permiso para ingresar.';
    }

    return 'No se pudo iniciar sesión. Inténtalo nuevamente.';
  }
}
