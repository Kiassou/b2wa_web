import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration-success.html',
  styleUrl: './registration-success.css'
})
export class RegistrationSuccessComponent {

  currentYear = new Date().getFullYear();

  constructor(private router: Router) {}

  goToDashboard(): void {
    this.router.navigate([
      '/dashboard'
    ]);
  }

  goToHome(): void {
    this.router.navigate([
      '/'
    ]);
  }
}
