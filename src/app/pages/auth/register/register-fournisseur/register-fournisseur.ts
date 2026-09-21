import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-fournisseur',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register-fournisseur.html',
  styleUrl: './register-fournisseur.css'
})
export class RegisterFournisseurComponent {

  currentYear = new Date().getFullYear();

  constructor(
    private router: Router
  ) {}

  goBack(): void {
    this.router.navigate(['/auth/register']);
  }

  /**
   * Lance le parcours d'inscription fournisseur.
   */
  startRegistration(): void {
    this.router.navigate(['/auth/register-info']);
  }
}
