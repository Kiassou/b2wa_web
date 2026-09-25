import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  RegistrationService,
  SupplierRegistrationStartRequest
} from '../../../../../services/registration.service';

@Component({
  selector: 'app-register-info',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-info.html',
  styleUrl: './register-info.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterInfoComponent {

  currentYear = new Date().getFullYear();

  showPassword = false;
  showConfirmPassword = false;

  isLoading = false;
  errorMessage = '';

  termsAccepted = false;

  supplier = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    companyName: '',
    category: '',
    country: 'Mali',
    city: '',
    address: '',

    password: '',
    confirmPassword: ''
  };

  categories = [
    'Agriculture & Agroalimentaire',
    'Commerce & Distribution',
    'Mode & Textile',
    'Électronique & Technologie',
    'Beauté & Cosmétique',
    'Maison & Décoration',
    'Matériaux & Construction',
    'Transport & Logistique',
    'Services professionnels',
    'Autre'
  ];

  constructor(
    private router: Router,
    private registrationService: RegistrationService
  ) {}

  get passwordHasMinLength(): boolean {
    return this.supplier.password.length >= 8;
  }

  get passwordHasUppercase(): boolean {
    return /[A-Z]/.test(this.supplier.password);
  }

  get passwordHasLowercase(): boolean {
    return /[a-z]/.test(this.supplier.password);
  }

  get passwordHasNumber(): boolean {
    return /[0-9]/.test(this.supplier.password);
  }

  get passwordHasSpecial(): boolean {
    return /[^A-Za-z0-9]/.test(this.supplier.password);
  }

  get passwordStrength(): number {
    let score = 0;

    if (this.passwordHasMinLength) score++;
    if (this.passwordHasUppercase) score++;
    if (this.passwordHasLowercase) score++;
    if (this.passwordHasNumber) score++;
    if (this.passwordHasSpecial) score++;

    return score;
  }

  get passwordStrengthLabel(): string {
    switch (this.passwordStrength) {
      case 0:
        return 'Aucune';
      case 1:
        return 'Très faible';
      case 2:
        return 'Faible';
      case 3:
        return 'Moyenne';
      case 4:
        return 'Bonne';
      case 5:
        return 'Excellente';
      default:
        return 'Aucune';
    }
  }

  get passwordsMatch(): boolean {
    return (
      this.supplier.confirmPassword.length > 0 &&
      this.supplier.password === this.supplier.confirmPassword
    );
  }

  get isFormValid(): boolean {
    return !!(
      this.supplier.firstName.trim() &&
      this.supplier.lastName.trim() &&
      this.supplier.email.trim() &&
      this.supplier.phone.trim() &&
      this.supplier.companyName.trim() &&
      this.supplier.category &&
      this.supplier.country &&
      this.supplier.city.trim() &&
      this.supplier.address.trim() &&
      this.passwordStrength === 5 &&
      this.passwordsMatch &&
      this.termsAccepted
    );
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  continue(): void {
    if (!this.isFormValid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const request: SupplierRegistrationStartRequest = {
      nom: this.supplier.lastName.trim(),
      prenom: this.supplier.firstName.trim(),
      email: this.supplier.email.trim(),
      telephone: this.supplier.phone.trim(),
      password: this.supplier.password,
      nom_entreprise: this.supplier.companyName.trim(),

      /*
       * Mapping temporaire de la catégorie.
       * On remplacera cela plus tard par les vrais IDs
       * venant du backend.
       */
      categorie_id: this.getCategory_id(this.supplier.category),

      adresse: this.supplier.address.trim(),
      ville: this.supplier.city.trim(),
      pays: this.supplier.country,

      terms_accepted: this.termsAccepted,
      terms_version: '1.0'
    };

    // 🔎 TEST
    console.log('CHECKBOX =', this.termsAccepted);
    console.log('REQUEST =', request.terms_accepted);
    console.log('TYPE =', typeof request.terms_accepted);

    console.log('📤 Données envoyées pour inscription fournisseur :', {
      ...request,
      password: '********'
    });

    this.registrationService
      .startSupplierRegistration(request)
      .subscribe({
        next: (response) => {
          console.log(
            '✅ Inscription fournisseur démarrée :',
            response
          );

          /*
           * Le backend doit nous retourner un registrationId.
           */
          if (!response?.registration_id) {
            console.error(
              '❌ Le backend n’a pas retourné de registrationId.',
              response
            );

            this.isLoading = false;

            this.errorMessage =
              'La réponse du serveur est invalide. Aucun identifiant d’inscription reçu.';

            return;
          }

          /*
           * Passage à l'étape de vérification OTP.
           */
          this.router.navigate(
            ['/auth/verify-account'],
            {
              state: {
                registration_id: response.registration_id,
                email: this.supplier.email.trim()
              }
            }
          );
        },

        error: (error) => {
          console.error(
            '❌ Erreur démarrage inscription fournisseur'
          );

          console.error(
            'Status :',
            error?.status
          );

          console.error(
            'Status Text :',
            error?.statusText
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
            'Message :',
            error?.message
          );

          console.error(
            'Erreur complète :',
            error
          );

          this.isLoading = false;

          /*
           * On essaie de récupérer le message fourni
           * directement par le backend.
           */
          const backendMessage =
            error?.error?.message ??
            error?.error?.error ??
            error?.message;

          this.errorMessage =
            backendMessage ??
            'Impossible de démarrer l’inscription. Veuillez réessayer.';

          /*
           * Masquage automatique du message après 3 secondes.
           */
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
  }

  /**
   * Mapping temporaire entre le libellé affiché
   * dans le formulaire et l'ID attendu par le backend.
   *
   * Ces IDs seront remplacés plus tard par les vrais IDs
   * venant de la table categories du backend.
   */
  private getCategory_id(category: string): number {
    const categoryMap: Record<string, number> = {
      'Agriculture & Agroalimentaire': 1,
      'Commerce & Distribution': 2,
      'Mode & Textile': 3,
      'Électronique & Technologie': 4,
      'Beauté & Cosmétique': 5,
      'Maison & Décoration': 6,
      'Matériaux & Construction': 7,
      'Transport & Logistique': 8,
      'Services professionnels': 9,
      'Autre': 10
    };

    return categoryMap[category] ?? 10;
  }

  goBack(): void {
    this.router.navigate(['/auth/register-fournisseur']);
  }
}