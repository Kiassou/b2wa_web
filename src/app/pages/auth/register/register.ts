import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  constructor(private readonly router: Router) {}

  goToSupplierRegister(): void {
    this.router.navigate(['/auth/register-fournisseur']);
  }

  goToMerchantRegister(): void {
    this.router.navigate(['/auth/register-commercant']);
  }
}