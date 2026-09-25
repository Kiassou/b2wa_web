import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  RegistrationService,
  VerifyOtpRequest
} from '../../../../../services/registration.service';

import { RegistrationSessionService }
  from '../../../../../services/registration-session.service';

@Component({
  selector: 'app-verify-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './verify-account.html',
  styleUrl: './verify-account.css'
})
export class VerifyAccountComponent {

  @ViewChildren('otpInput')
  otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  currentYear = new Date().getFullYear();

  otp: string[] = ['', '', '', '', '', ''];

  email = '';

  registration_id = '';

  countdown = 300;

  isVerifying = false;
  verificationError = '';

  constructor(
    private router: Router,
    private registrationService: RegistrationService,
    private registrationSession: RegistrationSessionService
  ) {
    this.loadRegistrationData();
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
    return this.otp.every(
      (digit) => digit !== ''
    );
  }

  /**
   * Récupère les informations envoyées
   * depuis register-info.
   */
  private loadRegistrationData(): void {

    const navigation = this.router.getCurrentNavigation();

    const state = navigation?.extras?.state;

    if (state?.['registration_id']) {

      this.registration_id =
        state['registration_id'];

      this.email =
        state['email'] ?? '';

      console.log(
        '🆔 Registration ID reçu :',
        this.registration_id
      );

      console.log(
        '📧 Email reçu :',
        this.email
      );

      return;
    }

    /*
     * Si l'utilisateur recharge directement
     * la page, getCurrentNavigation() peut être null.
     *
     * On récupère donc aussi l'ID depuis history.state.
     */
    const historyState = history.state;

    if (historyState?.registration_id) {

      this.registration_id =
        historyState.registration_id;

      this.email =
        historyState.email ?? '';

      console.log(
        '🆔 Registration ID récupéré depuis history.state :',
        this.registration_id
      );

      console.log(
        '📧 Email récupéré depuis history.state :',
        this.email
      );

      return;
    }

    console.error(
      '❌ Aucun registration_id trouvé.'
    );

    this.verificationError =
      'Votre session d’inscription est introuvable. Veuillez recommencer l’inscription.';

    setTimeout(() => {
      this.router.navigate([
        '/auth/register-info'
      ]);
    }, 2500);
  }

  onOtpInput(
    event: Event,
    index: number
  ): void {

    const input =
      event.target as HTMLInputElement;

    const value =
      input.value.replace(/\D/g, '');

    this.otp[index] =
      value.slice(-1);

    input.value =
      this.otp[index];

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

      event.preventDefault();

      this.focusInput(index - 1);
    }

    if (
      event.key === 'ArrowRight' &&
      index < this.otp.length - 1
    ) {

      event.preventDefault();

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

  /**
   * Vérification réelle de l'OTP.
   */
  verify(): void {

    if (!this.registration_id) {

      this.verificationError =
        'Votre session d’inscription est invalide. Veuillez recommencer.';

      return;
    }

    if (!this.isOtpComplete) {

      this.verificationError =
        'Veuillez saisir les 6 chiffres du code.';

      return;
    }

    if (this.isVerifying) {
      return;
    }

    this.isVerifying = true;
    this.verificationError = '';

    const request: VerifyOtpRequest = {
      registration_id: this.registration_id,
      otp: this.otpCode
    };

    console.log(
      '📤 Vérification OTP :',
      request
    );

    this.registrationService
      .verifyOtp(request)
      .subscribe({

        next: (response) => {

          console.log(
            '✅ OTP vérifié :',
            response
          );

          this.isVerifying = false;

          if (
            !response?.verified ||
            !response?.registration_token
          ) {

            console.error(
              '❌ Réponse de vérification invalide :',
              response
            );

            this.verificationError =
              'La vérification a échoué. Réponse invalide du serveur.';

            return;
          }

          /*
           * On conserve la session d'inscription
           * afin que le registrationGuard puisse
           * autoriser l'accès aux documents.
           */
          this.registrationSession.setSession(
            response.registration_id,
            response.registration_token
          );

          /*
           * Le registrationToken sera nécessaire
           * pour envoyer les documents fournisseur.
           */
          this.router.navigate(
            ['/auth/documents'],
            {
              state: {
                registration_id:
                  response.registration_id,

                registration_token:
                  response.registration_token
              }
            }
          );
        },

        error: (error) => {

          console.error(
            '❌ Erreur vérification OTP'
          );

          console.error(
            'Status :',
            error?.status
          );

          console.error(
            'URL :',
            error?.url
          );

          console.error(
            'Error body :',
            error?.error
          );

          console.error(
            'Erreur complète :',
            error
          );

          this.isVerifying = false;

          this.verificationError =
            error?.error?.message ??
            error?.error?.error ??
            error?.message ??
            'Code de vérification incorrect ou expiré.';
        }
      });
  }

  resendCode(): void {

    if (this.countdown > 0) {
      return;
    }

    /*
     * Pour l'instant, on conserve ton comportement
     * visuel de réinitialisation.
     *
     * Le endpoint de renvoi OTP pourra être ajouté
     * ensuite si le backend le prévoit.
     */

    this.otp = [
      '',
      '',
      '',
      '',
      '',
      ''
    ];

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