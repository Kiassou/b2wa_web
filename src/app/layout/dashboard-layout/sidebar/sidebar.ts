import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface SidebarItem {
  label: string;
  icon: string;
  route: string;
  badge?: string | number;
  badgeType?: 'danger' | 'warning' | 'success' | 'info';
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {

  @Input() collapsed = false;
  @Input() mobileOpen = false;

  @Output() closeSidebar = new EventEmitter<void>();
  @Output() toggleCollapse = new EventEmitter<void>();

  // Navigation Principale Commerçant
  mainItems: SidebarItem[] = [
    { label: 'Tableau de bord', icon: 'dashboard', route: '/dashboard' },
    { label: 'Mes Produits', icon: 'inventory_2', route: '/dashboard/products' },
    { label: 'Commandes', icon: 'shopping_bag', route: '/dashboard/orders', badge: 5, badgeType: 'warning' },
    { label: 'Ventes Flash', icon: 'bolt', route: '/dashboard/flash-sales' }
  ];

  // Section Réseau, Marketing & Engagement
  socialItems: SidebarItem[] = [
    { label: 'Stories B2WA', icon: 'auto_stories', route: '/dashboard/stories', badge: 'New', badgeType: 'info' },
    { label: 'Communauté', icon: 'groups', route: '/dashboard/community', badge: 12, badgeType: 'success' }
  ];

  // Section Logistique & Finance
  logisticsItems: SidebarItem[] = [
    { label: 'Expéditions', icon: 'local_shipping', route: '/dashboard/shipping' },
    { label: 'Finances & Recettes', icon: 'payments', route: '/dashboard/finances' }
  ];

  // Bas de page
  bottomItems: SidebarItem[] = [
    { label: 'Profil Boutique', icon: 'storefront', route: '/dashboard/profile' },
    { label: 'Paramètres', icon: 'settings', route: '/dashboard/settings' }
  ];

  onNavigationClick(): void {
    if (this.mobileOpen) {
      this.closeSidebar.emit();
    }
  }

  onToggleCollapse(): void {
    this.toggleCollapse.emit();
  }
}