import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-info.html',
  styleUrl: './register-info.css'
})
export class RegisterInfoComponent {

  currentYear = new Date().getFullYear();

  showPassword = false;
  showConfirmPassword = false;

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

  constructor(private router: Router) {}

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
      this.passwordsMatch
    );
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  continue(): void {
    if (!this.isFormValid) {
      return;
    }

    /*
     * IMPORTANT :
     * Le mot de passe ne sera pas enregistré dans localStorage.
     * Lorsque le backend sera branché, ces données seront envoyées
     * directement à l'API d'inscription.
     */

    this.router.navigate(['/auth/verify-account']);
  }

  goBack(): void {
    this.router.navigate(['/auth/register-fournisseur']);
  }
}
