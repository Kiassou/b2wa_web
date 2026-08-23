import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashSale, FlashSaleStatus, FlashSaleStoreService } from '../../services/flash-sale-store.service';

@Component({
  selector: 'app-flash-sales',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './flash-sales.html',
  styleUrl: './flash-sales.css'
})
export class FlashSalesComponent implements OnInit, OnDestroy {
  // Injection moderne des services
  private flashSaleStore = inject(FlashSaleStoreService);
  private router = inject(Router);

  /* =====================================================
     DONNÉES & FILTRES
  ====================================================== */
  flashSales: FlashSale[] = [];
  activeFilter: 'all' | FlashSaleStatus = 'all';
  searchTerm = '';

  /* =====================================================
     MODALES ET MENUS
  ====================================================== */
  openActionMenuId: number | null = null;
  selectedSale: FlashSale | null = null;
  showDetailModal = false;
  showDeleteModal = false;
  saleToDelete: FlashSale | null = null;

  /* =====================================================
     STATISTIQUES
  ====================================================== */
  stats = {
    activeCount: 0,
    soldQuantity: 0,
    revenue: 0,
    endingSoonCount: 0
  };

  /* =====================================================
     HORLOGE
  ====================================================== */
  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.loadData();

    // Actualisation automatique du statut et du compte à rebours
    this.timer = setInterval(() => {
      this.flashSaleStore.refreshStatuses();
      this.loadData();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  loadData(): void {
    this.flashSales = this.flashSaleStore.getAll();
    this.stats = this.flashSaleStore.getStats();
  }

  /* =====================================================
     LISTE FILTRÉE ET TRIÉE
  ====================================================== */
  get filteredSales(): FlashSale[] {
    let sales = [...this.flashSales];

    if (this.activeFilter !== 'all') {
      sales = sales.filter(sale => sale.status === this.activeFilter);
    }

    const search = this.searchTerm.trim().toLowerCase();
    if (search) {
      sales = sales.filter(
        sale =>
          sale.productName.toLowerCase().includes(search) ||
          sale.communityName.toLowerCase().includes(search) ||
          sale.productId.toLowerCase().includes(search)
      );
    }

    const priority: Record<FlashSaleStatus, number> = {
      active: 1,
      scheduled: 2,
      ended: 3,
      cancelled: 4
    };

    return sales.sort((a, b) => priority[a.status] - priority[b.status]);
  }

  setFilter(filter: 'all' | FlashSaleStatus): void {
    this.activeFilter = filter;
  }

  getCount(status: FlashSaleStatus): number {
    return this.flashSales.filter(sale => sale.status === status).length;
  }

  /* =====================================================
     ACTIONS MENUS & MODALES
  ====================================================== */
  toggleActionMenu(id: number): void {
    this.openActionMenuId = this.openActionMenuId === id ? null : id;
  }

  closeActionMenu(): void {
    this.openActionMenuId = null;
  }

  viewSale(sale: FlashSale): void {
    this.closeActionMenu();
    this.selectedSale = sale;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedSale = null;
  }

  createFlashSale(): void {
    this.router.navigate(['/dashboard/create-flash-sale']);
  }

  editSale(sale: FlashSale): void {
    this.closeActionMenu();
    this.router.navigate(['/dashboard/update-flash-sale', sale.id]);
  }

  cancelSale(sale: FlashSale): void {
    this.closeActionMenu();
    if (sale.status === 'ended') return;

    if (window.confirm(`Voulez-vous vraiment annuler la vente flash "${sale.productName}" ?`)) {
      this.flashSaleStore.cancel(sale.id);
      this.loadData();
    }
  }

  confirmDelete(sale: FlashSale): void {
    this.closeActionMenu();
    this.saleToDelete = sale;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.saleToDelete = null;
  }

  deleteSale(): void {
    if (!this.saleToDelete) return;

    this.flashSaleStore.delete(this.saleToDelete.id);
    this.closeDeleteModal();
    this.loadData();
  }

  /* =====================================================
     HELPERS / FORMATTEURS
  ====================================================== */
  getStatusLabel(status: FlashSaleStatus): string {
    const labels: Record<FlashSaleStatus, string> = {
      active: 'Active',
      scheduled: 'Programmée',
      ended: 'Terminée',
      cancelled: 'Annulée'
    };
    return labels[status] || 'Inconnue';
  }

  getStatusClass(status: FlashSaleStatus): string {
    return `status-${status}`;
  }

  getDiscount(sale: FlashSale): number {
    return this.flashSaleStore.getDiscountPercentage(sale);
  }

  getSoldPercentage(sale: FlashSale): number {
    return this.flashSaleStore.getSoldPercentage(sale);
  }

  getRemaining(sale: FlashSale): number {
    return this.flashSaleStore.getRemainingQuantity(sale);
  }

  getCountdown(sale: FlashSale): string {
    const now = Date.now();
    const target =
      sale.status === 'scheduled'
        ? new Date(sale.startDate).getTime()
        : new Date(sale.endDate).getTime();

    const difference = target - now;

    if (difference <= 0) {
      return sale.status === 'scheduled' ? 'Démarrage imminent' : 'Terminée';
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}j ${this.pad(hours)}h ${this.pad(minutes)}m`;
    }

    return `${this.pad(hours)}h ${this.pad(minutes)}m ${this.pad(seconds)}s`;
  }

  private pad(value: number): string {
    return String(value).padStart(2, '0');
  }

  formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatPrice(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value);
  }

  getProgressWidth(sale: FlashSale): number {
    return Math.min(100, Math.max(0, this.getSoldPercentage(sale)));
  }

  trackBySale(index: number, sale: FlashSale): number {
    return sale.id;
  }
}