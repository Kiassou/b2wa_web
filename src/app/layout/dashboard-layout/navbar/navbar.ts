import {
  Component,
  EventEmitter,
  Output,
  HostListener,
  ElementRef,
  computed,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CurrentUserService } from '../../../services/current-user.service';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() openSearch = new EventEmitter<void>();

  isDropdownOpen = false;

  // =========================================================
  // SERVICES
  // =========================================================

  private readonly elementRef = inject(ElementRef);
  private readonly router = inject(Router);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);

  // =========================================================
  // UTILISATEUR CONNECTÉ
  // =========================================================

  user = this.currentUserService.user;

  // =========================================================
  // INITIALES DE L'UTILISATEUR
  // =========================================================

  initials = computed(() => {
    const user = this.user();

    if (!user) {
      return '?';
    }

    const prenomInitiale = user.prenom?.charAt(0) ?? '';
    const nomInitiale = user.nom?.charAt(0) ?? '';

    return `${prenomInitiale}${nomInitiale}`.toUpperCase();
  });

  // =========================================================
  // NOM COMPLET
  // =========================================================

  fullName = computed(() => {
    const user = this.user();

    if (!user) {
      return 'Utilisateur';
    }

    return `${user.prenom} ${user.nom}`;
  });

  // =========================================================
  // DROPDOWN
  // =========================================================

  toggleDropdown(event: Event): void {
    event.stopPropagation();

    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  // =========================================================
  // CLIC EN DEHORS DU DROPDOWN
  // =========================================================

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {

    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  // =========================================================
  // DÉCONNEXION
  // =========================================================

  onLogout(): void {

    console.log('🚪 Déconnexion demandée...');

    this.closeDropdown();

    this.authService.logout().subscribe({
      next: () => {

        console.log('✅ Déconnexion backend réussie.');

        // Nettoyage de l'utilisateur courant
        this.currentUserService.clearUser();

        // AuthService.logout() appelle déjà clearTokens(),
        // mais on garde cette sécurité supplémentaire.
        this.tokenService.clearTokens();

        // Redirection
        this.router.navigate(['/auth/login']);
      },

      error: (error) => {

        console.error(
          '❌ Erreur lors de la déconnexion backend :',
          error
        );

        /*
         * Même si le backend rencontre une erreur,
         * on détruit la session locale.
         */

        this.tokenService.clearTokens();
        this.currentUserService.clearUser();

        this.router.navigate(['/auth/login']);
      }
    });
  }
}
