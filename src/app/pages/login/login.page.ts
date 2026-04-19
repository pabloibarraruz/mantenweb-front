import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthControllerService, AuthLoginRequestDto } from '../../api';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPageComponent {
  readonly form: FormGroup;

  loading = false;
  errorMsg: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: AuthControllerService,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  // Getters para usar en el HTML (evita TS4111)
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

    const payload: AuthLoginRequestDto = {
      correo: this.form.value.correo!,
      contrasena: this.form.value.contrasena!
    };

    this.loading = true;
    this.api.login(payload).subscribe({
      next: (res) => {
        this.auth.saveAuthResponse(res);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'No se pudo iniciar sesión. Verifica correo y contraseña.';
        console.error(err);
      }
    });
  }
}
