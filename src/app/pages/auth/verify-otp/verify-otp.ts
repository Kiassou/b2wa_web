import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './verify-otp.html',
  styleUrls: ['./verify-otp.css']
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  otpForm!: FormGroup;
  otpControls = ['digit1', 'digit2', 'digit3', 'digit4', 'digit5', 'digit6'];
  isLoading = false;
  isResending = false;
  submitted = false;

  countdown = 60;
  private timerInterval: any;
  private resendTimeout: any;
  private submitTimeout: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const group: any = {};
    this.otpControls.forEach(control => {
      group[control] = ['', [Validators.required, Validators.pattern('^[0-9]$')]];
    });
    this.otpForm = this.fb.group(group);

    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.clearCountdown();
    if (this.resendTimeout) clearTimeout(this.resendTimeout);
    if (this.submitTimeout) clearTimeout(this.submitTimeout);
  }

  startCountdown(): void {
    this.countdown = 60;
    this.clearCountdown();
    
    this.timerInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.clearCountdown();
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  clearCountdown(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && index < this.otpControls.length - 1) {
      const inputsArray = this.otpInputs.toArray();
      inputsArray[index + 1].nativeElement.focus();
    }
  }

  onKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      const currentControl = this.otpForm.get(this.otpControls[index]);
      if (!currentControl?.value && index > 0) {
        const inputsArray = this.otpInputs.toArray();
        inputsArray[index - 1].nativeElement.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text')?.trim() || '';

    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      this.otpControls.forEach((controlName, i) => {
        this.otpForm.get(controlName)?.setValue(digits[i]);
      });
      const inputsArray = this.otpInputs.toArray();
      inputsArray[5].nativeElement.focus();
      this.cdr.detectChanges();
    }
  }

  resendCode(): void {
    this.isResending = true;
    this.cdr.detectChanges();

    this.resendTimeout = setTimeout(() => {
      this.isResending = false;
      this.otpForm.reset();
      this.startCountdown();
      this.cdr.detectChanges();
    }, 1200);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.otpForm.invalid) return;

    const otpCode = Object.values(this.otpForm.value).join('');
    this.isLoading = true;
    this.cdr.detectChanges();

    this.submitTimeout = setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
      
      // Redirection vers la réinitialisation de mot de passe
      this.router.navigate(['/auth/reset-password']);
    }, 1200);
  }
}