import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;

  isLoading = false;

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8)
          ]
        ],
        confirmPassword: [
          '',
          [
            Validators.required
          ]
        ]
      },
      {
        validators: this.passwordMatchValidator
      }
    );

    /*
     * Met à jour automatiquement l’état de confirmation
     * et l’affichage des règles lorsque le mot de passe change.
     */
    this.resetForm.get('password')?.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });

    this.resetForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  get f() {
    return this.resetForm.controls;
  }

  get passwordValue(): string {
    return this.f['password']?.value ?? '';
  }

  get confirmPasswordValue(): string {
    return this.f['confirmPassword']?.value ?? '';
  }

  get hasConfirmPassword(): boolean {
    return this.confirmPasswordValue.length > 0;
  }

  get passwordsMatch(): boolean {
    return (
      this.hasConfirmPassword &&
      this.passwordValue === this.confirmPasswordValue
    );
  }

  get passwordHasMinLength(): boolean {
    return this.passwordValue.length >= 8;
  }

  get passwordHasUppercase(): boolean {
    return /[A-Z]/.test(this.passwordValue);
  }

  get passwordHasLowercase(): boolean {
    return /[a-z]/.test(this.passwordValue);
  }

  get passwordHasNumber(): boolean {
    return /\d/.test(this.passwordValue);
  }

  get passwordHasSpecial(): boolean {
    return /[^A-Za-z0-9]/.test(this.passwordValue);
  }

  /*
   * Score de 0 à 5.
   * Chaque condition validée ajoute un segment à la jauge.
   */
  get passwordStrength(): number {
    let strength = 0;

    if (this.passwordHasMinLength) {
      strength++;
    }

    if (this.passwordHasUppercase) {
      strength++;
    }

    if (this.passwordHasLowercase) {
      strength++;
    }

    if (this.passwordHasNumber) {
      strength++;
    }

    if (this.passwordHasSpecial) {
      strength++;
    }

    return strength;
  }

  get passwordStrengthLabel(): string {
    const strength = this.passwordStrength;

    if (!this.passwordValue) {
      return 'Non défini';
    }

    if (strength <= 2) {
      return 'Faible';
    }

    if (strength === 3) {
      return 'Moyen';
    }

    if (strength === 4) {
      return 'Bon';
    }

    return 'Excellent';
  }

  get isFormValid(): boolean {
    return (
      this.resetForm.valid &&
      this.passwordStrength === 5 &&
      this.passwordsMatch
    );
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password')?.value ?? '';
    const confirmPassword = control.get('confirmPassword')?.value ?? '';

    if (
      password &&
      confirmPassword &&
      password !== confirmPassword
    ) {
      return {
        mismatch: true
      };
    }

    return null;
  }

  onSubmit(): void {
    if (!this.isFormValid || this.isLoading) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    /*
     * Simulation temporaire.
     *
     * Plus tard, tu remplaceras ce setTimeout par un appel
     * vers ton backend :
     *
     * this.authService.resetPassword({
     *   password: this.passwordValue,
     *   confirmPassword: this.confirmPasswordValue
     * }).subscribe(...)
     */
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();

      this.router.navigate(['/auth/login']);
    }, 1500);
  }
}