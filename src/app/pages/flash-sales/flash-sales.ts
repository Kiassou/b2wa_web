import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FlashSale,
  FlashSaleStatus,
  FlashSaleStoreService
} from '../../services/flash-sale-store.service';
import { CommunityService } from '../../services/community.service';

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
  private communityService = inject(CommunityService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  /* =====================================================
     DONNÉES & FILTRES
  ====================================================== */

  flashSales: FlashSale[] = [];

  // Filtre global (all / active / scheduled / etc.)
  activeFilter: 'all' | FlashSaleStatus = 'all';

  // Filtre par communauté (optionnel)
  selectedCommunityId: string | 'all' = 'all';

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
    // Si tu veux filtrer par communauté via l'URL (ex: /flash-sales?community=comm-1)
    const communityId = this.route.snapshot.queryParamMap.get('community');
    if (communityId) {
      this.selectedCommunityId = communityId;
    }

    this.loadData();

    // Actualisation automatique du statut et du compte à rebours
    this.timer = setInterval(() => {
      this.flashSaleStore.refreshStatuses();
      this.loadData();

      // Force le rafraîchissement de l'affichage
      this.cdr.detectChanges();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  loadData(): void {
    // Tu peux charger toutes les ventes, ou filtrer par communauté ici
    if (this.selectedCommunityId === 'all') {
      this.flashSales = this.flashSaleStore.getAll();
    } else {
      this.flashSales =
        this.flashSaleStore.getAllByCommunity(this.selectedCommunityId);
    }

    this.stats = this.flashSaleStore.getStats();
  }

  /* =====================================================
     LISTE FILTRÉE ET TRIÉE
  ====================================================== */

  get filteredSales(): FlashSale[] {
    let sales = [...this.flashSales];

    if (this.activeFilter !== 'all') {
      sales = sales.filter(
        sale => sale.status === this.activeFilter
      );
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

    return sales.sort(
      (a, b) => priority[a.status] - priority[b.status]
    );
  }

  setFilter(filter: 'all' | FlashSaleStatus): void {
    this.activeFilter = filter;
  }

  getCount(status: FlashSaleStatus): number {
    return this.flashSales.filter(
      sale => sale.status === status
    ).length;
  }

  /* =====================================================
     ACTIONS MENUS & MODALES
  ====================================================== */

  toggleActionMenu(id: number): void {
    this.openActionMenuId =
      this.openActionMenuId === id ? null : id;
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
    this.router.navigate([
      '/dashboard/create-flash-sale'
    ]);
  }

  editSale(sale: FlashSale): void {
    this.closeActionMenu();

    this.router.navigate([
      '/dashboard/update-flash-sale',
      sale.id
    ]);
  }

  cancelSale(sale: FlashSale): void {
    this.closeActionMenu();

    if (sale.status === 'ended') return;

    if (
      window.confirm(
        `Voulez-vous vraiment annuler la vente flash "${sale.productName}" ?`
      )
    ) {
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

    this.flashSaleStore.delete(
      this.saleToDelete.id
    );

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
      return sale.status === 'scheduled'
        ? 'Démarrage imminent'
        : 'Terminée';
    }

    const totalSeconds = Math.floor(
      difference / 1000
    );

    const days = Math.floor(
      totalSeconds / 86400
    );

    const hours = Math.floor(
      (totalSeconds % 86400) / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

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

    if (Number.isNaN(date.getTime())) {
      return value;
    }

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
    return Math.min(
      100,
      Math.max(
        0,
        this.getSoldPercentage(sale)
      )
    );
  }

  trackBySale(
    index: number,
    sale: FlashSale
  ): number {
    return sale.id;
  }

  // Optionnel : pour changer la communauté filtrée depuis l'UI
  setCommunityFilter(communityId: string | 'all'): void {
    this.selectedCommunityId = communityId;
    this.loadData();
  }
}