import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


export interface Product {

  id: string;

  name: string;

  sku: string;

  category: string;

  price: number;

  stock: number;

  minStockThreshold: number;

  isActive: boolean;

  imageUrl?: string;

  images?: string[];

  description?: string;

  updatedAt: Date;
}


type ConfirmActionType =
  'TOGGLE_STATUS' | null;


@Component({

  selector: 'app-products',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './products.html',

  styleUrls: ['./products.css']

})


export class ProductsComponent implements OnInit {
  cdr: any;


  constructor(

    private readonly router: Router,

    private readonly changeDetectorRef: ChangeDetectorRef

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

  itemsPerPage = 8;

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
     INIT
  ====================================================== */

  ngOnInit(): void {

    this.loadMockProducts();

    this.applyFilters();

  }


  /* =====================================================
     CHANGE DETECTION
  ====================================================== */

  private refreshView(): void {

    this.changeDetectorRef.markForCheck();

    this.changeDetectorRef.detectChanges();

  }


  /* =====================================================
     MOCK PRODUCTS
  ====================================================== */

  loadMockProducts(): void {

    this.products = [

      {
        id: 'PRD-001',
        name: 'Ordinateur Portable Pro',
        sku: 'LAP-102',
        category: 'Électronique',
        price: 450000,
        stock: 12,
        minStockThreshold: 3,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'Ordinateur portable professionnel performant.',
        updatedAt: new Date()
      },

      {
        id: 'PRD-002',
        name: 'Smartphone X 128GB',
        sku: 'PHN-908',
        category: 'Électronique',
        price: 210000,
        stock: 2,
        minStockThreshold: 5,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'Smartphone moderne avec stockage 128GB.',
        updatedAt: new Date()
      },

      {
        id: 'PRD-003',
        name: 'Jus d\'Orange Pur 1L',
        sku: 'BEV-001',
        category: 'Alimentation',
        price: 1200,
        stock: 0,
        minStockThreshold: 10,
        isActive: false,
        imageUrl: '',
        images: [],
        description:
          'Jus d\'orange naturel.',
        updatedAt: new Date()
      },

      {
        id: 'PRD-004',
        name: 'Casque Audio Sans Fil',
        sku: 'AUD-345',
        category: 'Électronique',
        price: 35000,
        stock: 18,
        minStockThreshold: 5,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'Casque audio sans fil haute qualité.',
        updatedAt: new Date()
      },

      {
        id: 'PRD-005',
        name: 'T-Shirt Premium B2WA',
        sku: 'TSH-221',
        category: 'Mode & Textile',
        price: 15000,
        stock: 7,
        minStockThreshold: 4,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'T-shirt premium aux couleurs B2WA.',
        updatedAt: new Date()
      },

      {
        id: 'PRD-006',
        name: 'Lampe de Bureau LED',
        sku: 'DEC-119',
        category: 'Maison & Déco',
        price: 18500,
        stock: 1,
        minStockThreshold: 5,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'Lampe LED moderne pour bureau.',
        updatedAt: new Date()
      },

      {
        id: 'PRD-007',
        name: 'Crème Hydratante Visage',
        sku: 'BEA-772',
        category: 'Santé & Beauté',
        price: 9500,
        stock: 24,
        minStockThreshold: 6,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'Crème hydratante pour le visage.',
        updatedAt: new Date()
      },

      {
        id: 'PRD-008',
        name: 'Riz Parfumé 5KG',
        sku: 'ALI-510',
        category: 'Alimentation',
        price: 8500,
        stock: 0,
        minStockThreshold: 10,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'Riz parfumé premium 5KG.',
        updatedAt: new Date()
      },

      {
        id: 'PRD-009',
        name: 'Table Basse Moderne',
        sku: 'HOM-845',
        category: 'Maison & Déco',
        price: 75000,
        stock: 4,
        minStockThreshold: 2,
        isActive: true,
        imageUrl: '',
        images: [],
        description:
          'Table basse moderne pour salon.',
        updatedAt: new Date()
      },

      {
        id: 'PRD-010',
        name: 'Montre Classique Élégante',
        sku: 'MOD-921',
        category: 'Mode & Textile',
        price: 42000,
        stock: 3,
        minStockThreshold: 5,
        isActive: false,
        imageUrl: '',
        images: [],
        description:
          'Montre élégante et intemporelle.',
        updatedAt: new Date()
      }

    ];

  }


  /* =====================================================
     STATISTICS
  ====================================================== */

  get totalProductsCount(): number {

    return this.products.length;

  }


  get activeProductsCount(): number {

    return this.products.filter(
      product => product.isActive
    ).length;

  }


  get lowStockProductsCount(): number {

    return this.products.filter(

      product =>
        product.stock > 0 &&
        product.stock <= product.minStockThreshold

    ).length;

  }


  get outOfStockProductsCount(): number {

    return this.products.filter(
      product => product.stock === 0
    ).length;

  }


  get totalInventoryValue(): number {

    return this.products.reduce(

      (total, product) =>
        total + product.price * product.stock,

      0

    );

  }


  /* =====================================================
     FILTERS
  ====================================================== */

  applyFilters(): void {

    const normalizedSearch =
      this.searchQuery
        .trim()
        .toLowerCase();


    this.filteredProducts =
      this.products.filter(product => {

        const matchesSearch =

          !normalizedSearch ||

          product.name
            .toLowerCase()
            .includes(normalizedSearch) ||

          product.sku
            .toLowerCase()
            .includes(normalizedSearch);


        const matchesCategory =

          this.selectedCategory === 'ALL' ||

          product.category ===
            this.selectedCategory;


        const matchesStatus =

          this.selectedStatus === 'ALL' ||

          (
            this.selectedStatus === 'ACTIVE' &&
            product.isActive
          ) ||

          (
            this.selectedStatus === 'INACTIVE' &&
            !product.isActive
          );


        return (

          matchesSearch &&

          matchesCategory &&

          matchesStatus

        );

      });


    this.currentPage = 1;

    this.updatePagination();

    this.refreshView();

  }


  clearFilters(): void {

    this.searchQuery = '';

    this.selectedCategory = 'ALL';

    this.selectedStatus = 'ALL';

    this.applyFilters();

  }


  /* =====================================================
     PAGINATION
  ====================================================== */

  get totalPages(): number {

    return Math.max(

      1,

      Math.ceil(

        this.filteredProducts.length /
        this.itemsPerPage

      )

    );

  }


  get paginationPages(): Array<number | string> {

    const totalPages = this.totalPages;

    const currentPage = this.currentPage;


    if (totalPages <= 7) {

      return Array.from(

        { length: totalPages },

        (_, index) => index + 1

      );

    }


    const pages: Array<number | string> = [1];


    if (currentPage > 4) {

      pages.push('...');

    }


    const startPage =
      Math.max(2, currentPage - 1);


    const endPage =
      Math.min(
        totalPages - 1,
        currentPage + 1
      );


    for (
      let page = startPage;
      page <= endPage;
      page++
    ) {

      pages.push(page);

    }


    if (currentPage < totalPages - 3) {

      pages.push('...');

    }


    pages.push(totalPages);


    return pages;

  }


  updatePagination(): void {

    const startIndex =
      (this.currentPage - 1) *
      this.itemsPerPage;


    const endIndex =
      startIndex + this.itemsPerPage;


    this.paginatedProducts =
      this.filteredProducts.slice(
        startIndex,
        endIndex
      );

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

    if (
      this.filteredProducts.length === 0
    ) {

      return 0;

    }


    return (

      (this.currentPage - 1) *
      this.itemsPerPage

    ) + 1;

  }


  get paginationEnd(): number {

    return Math.min(

      this.currentPage *
      this.itemsPerPage,

      this.filteredProducts.length

    );

  }


  /* =====================================================
     ACTION MENU
  ====================================================== */

  toggleActionMenu(productId: string): void {

    this.openActionMenuId =

      this.openActionMenuId === productId

        ? null

        : productId;

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


    const images =
      this.selectedProduct.images || [];


    if (

      images.length === 0 &&

      this.selectedProduct.imageUrl

    ) {

      return [
        this.selectedProduct.imageUrl
      ];

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


    this.selectedImageIndex =

      (this.selectedImageIndex + 1)
      % images.length;

  }


  previousImage(): void {

    const images = this.productImages;


    if (!images.length) {

      return;

    }


    this.selectedImageIndex =

      (

        this.selectedImageIndex -
        1 +
        images.length

      ) % images.length;

  }


  /* =====================================================
     ADD PRODUCT
  ====================================================== */

  addProduct(): void {

    this.router.navigate([
      '/dashboard/add-products'
    ]);

  }


  /* =====================================================
     UPDATE PRODUCT
  ====================================================== */

  updateProduct(product: Product): void {

    this.closeViewModal();

    this.router.navigate([
      '/dashboard/update-products',
      product.id
    ]);

  }


  /* =====================================================
     TOGGLE STATUS
  ====================================================== */

  toggleStatusRequest(
    product: Product
  ): void {

    const nextStatus =
      !product.isActive;


    const actionText =
      nextStatus
        ? 'activer'
        : 'désactiver';


    this.confirmTitle =
      nextStatus
        ? 'ACTIVER LE PRODUIT'
        : 'DÉSACTIVER LE PRODUIT';


    this.confirmMessage = nextStatus

      ? `Êtes-vous sûr de vouloir activer "${product.name}" ? Il sera à nouveau visible dans votre catalogue.`

      : `Êtes-vous sûr de vouloir désactiver "${product.name}" ? Il ne sera plus disponible dans votre catalogue de vente.`;


    this.confirmButtonText =
      nextStatus
        ? 'Oui, activer'
        : 'Oui, désactiver';


    this.confirmButtonClass =
      nextStatus
        ? 'btn-success'
        : 'btn-danger';


    this.confirmActionType =
      'TOGGLE_STATUS';


    this.confirmAction = () => {

      product.isActive = nextStatus;

      product.updatedAt = new Date();


      this.applyFilters();


      this.showStatusToast(
        product,
        nextStatus
      );

    };


    this.isConfirmModalOpen = true;

    this.refreshView();

  }


  /* =====================================================
     CONFIRM ACTION
  ====================================================== */

  executeConfirm(): void {

    const action =
      this.confirmAction;


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

  showStatusToast(
    product: Product,
    isActive: boolean
  ): void {

    if (this.toastTimer) {

      clearTimeout(this.toastTimer);

    }


    this.toastType =
      isActive
        ? 'success'
        : 'warning';


    this.toastTitle =
      isActive
        ? 'Produit activé'
        : 'Produit désactivé';


    this.toastMessage =
      isActive

        ? `"${product.name}" est maintenant disponible dans votre catalogue.`

        : `"${product.name}" n'est plus visible dans votre catalogue.`;


    this.showToast = true;

    this.refreshView();


    this.toastTimer =
      setTimeout(() => {

        this.showToast = false;

        this.refreshView();
        this.cdr.detectChanges();

      }, 3000);

  }


  /* =====================================================
     HELPERS
  ====================================================== */

  trackByProductId(
    index: number,
    product: Product
  ): string {

    return product.id;

  }


  getStockClass(
    product: Product
  ): string {

    if (product.stock === 0) {

      return 'stock-out';

    }


    if (
      product.stock <=
      product.minStockThreshold
    ) {

      return 'stock-low';

    }


    return 'stock-ok';

  }


  getStockLabel(
    product: Product
  ): string {

    if (product.stock === 0) {

      return 'Rupture';

    }


    return `${product.stock} en stock`;

  }

}