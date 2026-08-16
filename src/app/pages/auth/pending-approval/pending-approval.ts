import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-approval.html',
  styleUrls: ['./pending-approval.css']
})
export class PendingApprovalComponent {
  isChecking = false;

  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  checkStatus(): void {
    this.isChecking = true;
    this.cdr.detectChanges();

    // Simulation d'une vérification de l'état du compte auprès de l'API
    setTimeout(() => {
      this.isChecking = false;
      this.cdr.detectChanges();
      
      /*
        Exemple de logique une fois connecté à l'API :
        if (user.status === 'APPROVED') {
          this.router.navigate(['/dashboard']);
        }
      */
    }, 1200);
  }

  logout(): void {
    // Nettoyer la session et rediriger vers le login
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}