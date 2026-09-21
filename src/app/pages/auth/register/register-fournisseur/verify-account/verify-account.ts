import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-account.html',
  styleUrl: './verify-account.css'
})
export class VerifyAccountComponent {

  @ViewChildren('otpInput')
  otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  currentYear = new Date().getFullYear();

  otp: string[] = ['', '', '', '', '', ''];

  email = '';

  countdown = 300;

  isVerifying = false;
  verificationError = '';

  constructor(private router: Router) {
    this.loadEmail();
  }

  get formattedCountdown(): string {
    const minutes = Math.floor(this.countdown / 60)
      .toString()
      .padStart(2, '0');

    const seconds = (this.countdown % 60)
      .toString()
      .padStart(2, '0');

    return `${minutes}:${seconds}`;
  }

  get otpCode(): string {
    return this.otp.join('');
  }

  get isOtpComplete(): boolean {
    return this.otp.every((digit) => digit !== '');
  }

  private loadEmail(): void {
    /*
     * Plus tard, l'email pourra venir du service
     * d'inscription ou du backend.
     */

    this.email = 'votre-adresse@email.com';
  }

  onOtpInput(
    event: Event,
    index: number
  ): void {

    const input =
      event.target as HTMLInputElement;

    const value = input.value.replace(/\D/g, '');

    this.otp[index] = value.slice(-1);

    input.value = this.otp[index];

    this.verificationError = '';

    if (
      this.otp[index] &&
      index < this.otp.length - 1
    ) {
      this.focusInput(index + 1);
    }
  }

  onOtpKeydown(
    event: KeyboardEvent,
    index: number
  ): void {

    if (
      event.key === 'Backspace' &&
      !this.otp[index] &&
      index > 0
    ) {
      this.otp[index - 1] = '';
      this.focusInput(index - 1);
    }

    if (
      event.key === 'ArrowLeft' &&
      index > 0
    ) {
      this.focusInput(index - 1);
    }

    if (
      event.key === 'ArrowRight' &&
      index < this.otp.length - 1
    ) {
      this.focusInput(index + 1);
    }
  }

  private focusInput(index: number): void {
    setTimeout(() => {
      const input =
        this.otpInputs?.get(index);

      input?.nativeElement.focus();
      input?.nativeElement.select();
    });
  }

  verify(): void {

    if (!this.isOtpComplete) {
      this.verificationError =
        'Veuillez saisir les 6 chiffres du code.';
      return;
    }

    this.isVerifying = true;
    this.verificationError = '';

    /*
     * Simulation temporaire.
     *
     * Plus tard :
     * POST /api/auth/verify-account
     */

    setTimeout(() => {

      this.isVerifying = false;

      this.router.navigate([
        '/auth/supplier-documents'
      ]);

    }, 700);
  }

  resendCode(): void {

    if (this.countdown > 0) {
      return;
    }

    this.otp = ['', '', '', '', '', ''];

    this.countdown = 300;

    this.verificationError = '';

    setTimeout(() => {
      this.focusInput(0);
    });
  }

  editEmail(): void {
    this.router.navigate([
      '/auth/register-info'
    ]);
  }

  goBack(): void {
    this.router.navigate([
      '/auth/register-info'
    ]);
  }
}
