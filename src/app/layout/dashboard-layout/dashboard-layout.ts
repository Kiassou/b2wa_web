import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './sidebar/sidebar';
import { NavbarComponent } from './navbar/navbar';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    NavbarComponent
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayoutComponent implements OnInit {
  // Capture la balise <main #contentArea> du HTML
  @ViewChild('contentArea') contentArea!: ElementRef<HTMLElement>;

  sidebarCollapsed = false;
  mobileMenuOpen = false;

  private readonly mobileBreakpoint = 991; // Aligné avec le CSS
  isMobile = false;

  private router = inject(Router);

  constructor() {
    // Écoute les événements de fin de navigation pour remettre le scroll à zéro
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.contentArea?.nativeElement) {
          this.contentArea.nativeElement.scrollTop = 0;
        }
      });
  }

  ngOnInit(): void {
    this.updateScreenState();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateScreenState();
  }

  private updateScreenState(): void {
    this.isMobile = window.innerWidth <= this.mobileBreakpoint;

    if (!this.isMobile) {
      this.mobileMenuOpen = false;
    }
  }

  /**
   * Action unifiée pour réduire/agrandir la Sidebar (Desktop)
   * ou ouvrir/fermer le tiroir mobile (Mobile)
   */
  onToggleSidebar(): void {
    if (this.isMobile) {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isMobile) {
      this.closeMobileMenu();
    }
  }
}