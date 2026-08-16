import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';

  showDocModal = false;
  selectedRole: 'FOURNISSEUR' | 'COMMERCANT' | null = null;

  removeFile(type: 'rccm' | 'nif' | 'identity'): void {
    this.documents[type] = null;
  }

  documents: { rccm: File | null; nif: File | null; identity: File | null } = {
    rccm: null,
    nif: null,
    identity: null
  };

  registerForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        role: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        acceptTerms: [false, [Validators.requiredTrue]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRoleChange(role: 'FOURNISSEUR' | 'COMMERCANT'): void {
    this.selectedRole = role;
    this.showDocModal = true;
  }

  onFileSelected(event: Event, type: 'rccm' | 'nif' | 'identity'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.documents[type] = input.files[0];
    }
  }

  skipDocuments(): void {
    this.showDocModal = false;
  }

  saveDocuments(): void {
    this.showDocModal = false;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Vérification stricte si Fournisseur
    if (this.f['role'].value === 'FOURNISSEUR' && (!this.documents.rccm || !this.documents.nif || !this.documents.identity)) {
      this.selectedRole = 'FOURNISSEUR';
      this.showDocModal = true;
      return;
    }

    this.loading = true;

    // Simulation de la sauvegarde avant OTP
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/auth/account-verify']);
    }, 3200);
  }

  get f() {
    return this.registerForm.controls;
  }
}