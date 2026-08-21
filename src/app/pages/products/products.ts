import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductsService, Product } from '../../services/products.service';

type ConfirmActionType = 'TOGGLE_STATUS' | 'RESET_DATA' | null;

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  private productsSubscription?: Subscription;

  constructor(
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly productsService: ProductsService
  ) {}

  /* =====================================================
     PRODUCTS
  ====================================================== */

  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];

  categories: string[] = [
    'Électronique',
    'Alimentation',
    'Mode & Textile',
    'Maison & Déco',
    'Santé & Beauté'
  ];

  /* =====================================================
     FILTERS
  ====================================================== */

  searchQuery = '';
  selectedCategory = 'ALL';
  selectedStatus = 'ALL';

  /* =====================================================
     PAGINATION
  ====================================================== */

  currentPage = 1;
  itemsPerPage = 5;

  readonly pageSizeOptions: number[] = [
    5,
    8,
    12,
    20
  ];

  /* =====================================================
     VIEW PRODUCT MODAL
  ====================================================== */

  isViewModalOpen = false;
  selectedProduct: Product | null = null;
  selectedImageIndex = 0;

  /* =====================================================
     ACTION MENU
  ====================================================== */

  openActionMenuId: string | null = null;

  /* =====================================================
     CONFIRMATION MODAL
  ====================================================== */

  isConfirmModalOpen = false;
  confirmAction: (() => void) | null = null;
  confirmTitle = '';
  confirmMessage = '';
  confirmButtonText = 'Confirmer';
  confirmButtonClass = 'btn-primary';
  confirmActionType: ConfirmActionType = null;

  /* =====================================================
     TOAST
  ====================================================== */

  showToast = false;
  toastType: 'success' | 'warning' = 'success';
  toastTitle = '';
  toastMessage = '';
  private toastTimer?: ReturnType<typeof setTimeout>;

  /* =====================================================
     INIT & DESTROY
  ====================================================== */

  ngOnInit(): void {
    this.productsSubscription = this.productsService.products$.subscribe(products => {
      this.products = products;
      this.applyFilters(false);
    });
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  /* =====================================================
     RESET LOCALSTORAGE
  ====================================================== */

  resetLocalStorage(): void {
    this.confirmTitle = 'RÉINITIALISER LES DONNÉES';
    this.confirmMessage = 'Êtes-vous sûr de vouloir réinitialiser la liste avec les 10 produits par défaut ?';
    this.confirmButtonText = 'Oui, réinitialiser';
    this.confirmButtonClass = 'btn-warning';
    this.confirmActionType = 'RESET_DATA';

    this.confirmAction = () => {
      this.productsService.resetToDefaultProducts();
      this.clearFilters();
      this.showCustomToast('success', 'Catalogue réinitialisé', 'Les 10 produits par défaut ont été restaurés.');
    };

    this.isConfirmModalOpen = true;
    this.refreshView();
  }

  /* =====================================================
     CHANGE DETECTION
  ====================================================== */

  private refreshView(): void {
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  /* =====================================================
     STATISTICS
  ====================================================== */

  get totalProductsCount(): number {
    return this.products.length;
  }

  get activeProductsCount(): number {
    return this.products.filter(product => product.isActive).length;
  }

  get lowStockProductsCount(): number {
    return this.products.filter(
      product => product.stock > 0 && product.stock <= product.minStockThreshold
    ).length;
  }

  get outOfStockProductsCount(): number {
    return this.products.filter(product => product.stock === 0).length;
  }

  get totalInventoryValue(): number {
    return this.products.reduce(
      (total, product) => total + product.price * product.stock,
      0
    );
  }

  /* =====================================================
     FILTERS
  ====================================================== */

  applyFilters(resetPage: boolean = true): void {
    const normalizedSearch = this.searchQuery.trim().toLowerCase();

    this.filteredProducts = this.products.filter(product => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        this.selectedCategory === 'ALL' ||
        product.category.trim().toLowerCase() === this.selectedCategory.trim().toLowerCase();

      const matchesStatus =
        this.selectedStatus === 'ALL' ||
        (this.selectedStatus === 'ACTIVE' && product.isActive) ||
        (this.selectedStatus === 'INACTIVE' && !product.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (resetPage) {
      this.currentPage = 1;
    } else {
      this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    }

    this.updatePagination();
    this.refreshView();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'ALL';
    this.selectedStatus = 'ALL';
    this.applyFilters(true);
  }

  /* =====================================================
     PAGINATION
  ====================================================== */

  get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    );
  }

  get paginationPages(): Array<number | string> {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages: Array<number | string> = [1];

    if (currentPage > 4) {
      pages.push('...');
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 3) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  changePage(page: number | string): void {
    if (
      typeof page !== 'number' ||
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage
    ) {
      return;
    }

    this.currentPage = page;
    this.updatePagination();
    this.refreshView();
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
      this.refreshView();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
      this.refreshView();
    }
  }

  changeItemsPerPage(): void {
    this.currentPage = 1;
    this.updatePagination();
    this.refreshView();
  }

  get paginationStart(): number {
    if (this.filteredProducts.length === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get paginationEnd(): number {
    return Math.min(
      this.currentPage * this.itemsPerPage,
      this.filteredProducts.length
    );
  }

  /* =====================================================
     ACTION MENU
  ====================================================== */

  toggleActionMenu(productId: string): void {
    this.openActionMenuId =
      this.openActionMenuId === productId ? null : productId;
  }

  closeActionMenu(): void {
    this.openActionMenuId = null;
  }

  /* =====================================================
     VIEW PRODUCT
  ====================================================== */

  openViewModal(product: Product): void {
    this.selectedProduct = product;
    this.selectedImageIndex = 0;
    this.openActionMenuId = null;
    this.isViewModalOpen = true;
    this.refreshView();
  }

  closeViewModal(): void {
    this.isViewModalOpen = false;
    this.selectedProduct = null;
    this.selectedImageIndex = 0;
    this.refreshView();
  }

  /* =====================================================
     PRODUCT GALLERY
  ====================================================== */

  get productImages(): string[] {
    if (!this.selectedProduct) {
      return [];
    }

    const images = this.selectedProduct.images || [];

    if (images.length === 0 && this.selectedProduct.imageUrl) {
      return [this.selectedProduct.imageUrl];
    }

    return images;
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  nextImage(): void {
    const images = this.productImages;

    if (!images.length) {
      return;
    }

    this.selectedImageIndex = (this.selectedImageIndex + 1) % images.length;
  }

  previousImage(): void {
    const images = this.productImages;

    if (!images.length) {
      return;
    }

    this.selectedImageIndex =
      (this.selectedImageIndex - 1 + images.length) % images.length;
  }

  /* =====================================================
     ADD PRODUCT
  ====================================================== */

  addProduct(): void {
    this.router.navigate(['/dashboard/add-products']);
  }

  /* =====================================================
     UPDATE PRODUCT
  ====================================================== */

  updateProduct(product: Product): void {
    this.closeViewModal();
    this.router.navigate(['/dashboard/update-products', product.id]);
  }

  /* =====================================================
     TOGGLE STATUS
  ====================================================== */

  toggleStatusRequest(product: Product): void {
    const nextStatus = !product.isActive;

    this.confirmTitle = nextStatus ? 'ACTIVER LE PRODUIT' : 'DÉSACTIVER LE PRODUIT';
    this.confirmMessage = nextStatus
      ? `Êtes-vous sûr de vouloir activer "${product.name}" ? Il sera à nouveau visible dans votre catalogue.`
      : `Êtes-vous sûr de vouloir désactiver "${product.name}" ? Il ne sera plus disponible dans votre catalogue de vente.`;

    this.confirmButtonText = nextStatus ? 'Oui, activer' : 'Oui, désactiver';
    this.confirmButtonClass = nextStatus ? 'btn-success' : 'btn-danger';
    this.confirmActionType = 'TOGGLE_STATUS';

    this.confirmAction = () => {
      this.productsService.updateProductStatus(product.id, nextStatus);
      this.showStatusToast(product, nextStatus);
    };

    this.isConfirmModalOpen = true;
    this.refreshView();
  }

  /* =====================================================
     CONFIRM ACTION
  ====================================================== */

  executeConfirm(): void {
    const action = this.confirmAction;

    if (action) {
      action();
    }

    this.closeConfirmModal();
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen = false;
    this.confirmAction = null;
    this.confirmActionType = null;
    this.refreshView();
  }

  /* =====================================================
     STATUS TOAST
  ====================================================== */

  showStatusToast(product: Product, isActive: boolean): void {
    this.showCustomToast(
      isActive ? 'success' : 'warning',
      isActive ? 'Produit activé' : 'Produit désactivé',
      isActive
        ? `"${product.name}" est maintenant disponible dans votre catalogue.`
        : `"${product.name}" n'est plus visible dans votre catalogue.`
    );
  }

  private showCustomToast(type: 'success' | 'warning', title: string, message: string): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastType = type;
    this.toastTitle = title;
    this.toastMessage = message;
    this.showToast = true;
    this.refreshView();

    this.toastTimer = setTimeout(() => {
      this.showToast = false;
      this.refreshView();
    }, 3000);
  }

  /* =====================================================
     HELPERS
  ====================================================== */

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  getStockClass(product: Product): string {
    if (product.stock === 0) {
      return 'stock-out';
    }

    if (product.stock <= product.minStockThreshold) {
      return 'stock-low';
    }

    return 'stock-ok';
  }

  getStockLabel(product: Product): string {
    if (product.stock === 0) {
      return 'Rupture';
    }

    return `${product.stock} en stock`;
  }
}