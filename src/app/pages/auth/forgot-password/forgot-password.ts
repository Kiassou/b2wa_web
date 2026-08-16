import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotForm!: FormGroup;
  isLoading = false;
  private submitTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get emailControl() {
    return this.forgotForm.get('email');
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges(); // Force la mise à jour visuelle

    // Simulation de l'envoi du code OTP et redirection
    this.submitTimeout = setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
      
      // Redirection automatique vers la saisie de l'OTP
      this.router.navigate(['/auth/verify-otp'], {
        queryParams: { email: this.forgotForm.value.email }
      });
    }, 3500);
  }

  ngOnDestroy(): void {
    if (this.submitTimeout) {
      clearTimeout(this.submitTimeout);
    }
  }
}