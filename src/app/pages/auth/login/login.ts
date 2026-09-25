import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  loading = false;
  showPassword = false;
  errorMessage = '';

  loginForm!: FormGroup;

  private errorTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }

    if (this.loginForm) {
      this.loginForm.reset();
    }
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      identifier: [
        '',
        [Validators.required]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],

      rememberMe: [false]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = undefined;
    }

    this.cdr.detectChanges();

    const request = {
      identifier: this.loginForm.value.identifier.trim(),
      password: this.loginForm.value.password
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        this.loading = false;

        console.log('Connexion réussie :', response);

        this.loginForm.reset();

        this.cdr.detectChanges();

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        this.loading = false;

        console.error('Erreur de connexion :', error);

        if (error?.error?.message) {
          this.showErrorMessage(error.error.message);
        } else {
          this.showErrorMessage(
            'Identifiant ou mot de passe incorrect.'
          );
        }
      }
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  private showErrorMessage(message: string): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }

    this.errorMessage = message;

    /* Force l’affichage immédiat de l’erreur dans le HTML */
    this.cdr.detectChanges();

    this.errorTimeout = setTimeout(() => {
      this.errorMessage = '';
      this.errorTimeout = undefined;

      /* Force la disparition du message après 3 secondes */
      this.cdr.detectChanges();
    }, 3000);
  }
}