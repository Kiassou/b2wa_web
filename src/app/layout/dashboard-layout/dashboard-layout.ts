import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  sidebarCollapsed = false;
  mobileMenuOpen = false;

  private readonly mobileBreakpoint = 991; // Aligné avec le CSS
  isMobile = false;

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