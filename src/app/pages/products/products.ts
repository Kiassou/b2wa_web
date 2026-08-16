import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

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
  updatedAt: Date;
}

type ProductModalMode = 'CREATE' | 'EDIT';
type ConfirmActionType = 'TOGGLE_STATUS' | 'SAVE_PRODUCT' | null;

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  categories: string[] = ['Électronique','Alimentation','Mode & Textile','Maison & Déco','Santé & Beauté'];
  searchQuery = '';
  selectedCategory = 'ALL';
  selectedStatus = 'ALL';
  currentPage = 1;
  itemsPerPage = 8;
  readonly pageSizeOptions: number[] = [5, 8, 12, 20];


  isProductModalOpen = false;
  modalMode: ProductModalMode = 'CREATE';
  selectedProduct: Product | null = null;
  productForm!: FormGroup;
  isConfirmModalOpen = false;
  confirmAction: (() => void) | null = null;
  confirmTitle = '';
  confirmMessage = '';
  confirmButtonText = 'Confirmer';
  confirmButtonClass = 'btn-primary';
  confirmActionType: ConfirmActionType = null;

  ngOnInit(): void {
    this.initForm();
    this.loadMockProducts();
    this.applyFilters();
  }

  private refreshView(): void {
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      id: [''],
      name: [ '', [ Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      sku: [ '', [ Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      category: ['', Validators.required],
      price: [ 0, [ Validators.required, Validators.min(0)]],
      stock: [ 0, [ Validators.required, Validators.min(0)]],
      minStockThreshold: [ 5, [ Validators.required, Validators.min(0)]],
      imageUrl: [ '',],
      isActive: [ true]
    });
  }


  loadMockProducts(): void {
    this.products = [
      { id: 'PRD-001', name: 'Ordinateur Portable Pro', sku: 'LAP-102', category: 'Électronique', price: 450000, stock: 12, minStockThreshold: 3, isActive: true, imageUrl: '', updatedAt: new Date()},
      { id: 'PRD-002', name: 'Smartphone X 128GB', sku: 'PHN-908', category: 'Électronique', price: 210000, stock: 2, minStockThreshold: 5, isActive: true, imageUrl: '', updatedAt: new Date()},
      { id: 'PRD-003', name: 'Jus d\'Orange Pur 1L', sku: 'BEV-001', category: 'Alimentation', price: 1200, stock: 0, minStockThreshold: 10, isActive: false, imageUrl: '', updatedAt: new Date()},
      { id: 'PRD-004', name: 'Casque Audio Sans Fil', sku: 'AUD-345', category: 'Électronique', price: 35000, stock: 18, minStockThreshold: 5, isActive: true, imageUrl: '', updatedAt: new Date()},
      { id: 'PRD-005', name: 'T-Shirt Premium B2WA', sku: 'TSH-221', category: 'Mode & Textile', price: 15000, stock: 7, minStockThreshold: 4, isActive: true, imageUrl: '', updatedAt: new Date()}, 
      { id: 'PRD-006', name: 'Lampe de Bureau LED', sku: 'DEC-119', category: 'Maison & Déco', price: 18500, stock: 1, minStockThreshold: 5, isActive: true, imageUrl: '', updatedAt: new Date()},
      { id: 'PRD-007', name: 'Crème Hydratante Visage', sku: 'BEA-772', category: 'Santé & Beauté', price: 9500, stock: 24, minStockThreshold: 6, isActive: true, imageUrl: '', updatedAt: new Date()},
      { id: 'PRD-008', name: 'Riz Parfumé 5KG', sku: 'ALI-510', category: 'Alimentation', price: 8500, stock: 0, minStockThreshold: 10, isActive: true, imageUrl: '', updatedAt: new Date()},
      { id: 'PRD-009', name: 'Table Basse Moderne', sku: 'HOM-845', category: 'Maison & Déco', price: 75000, stock: 4, minStockThreshold: 2, isActive: true, imageUrl: '', updatedAt: new Date()},
      { id: 'PRD-010', name: 'Montre Classique Élégante', sku: 'MOD-921', category: 'Mode & Textile', price: 42000, stock: 3, minStockThreshold: 5, isActive: false, imageUrl: '', updatedAt: new Date()}
    ];
  }


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


  applyFilters(): void {
    const normalizedSearch = this.searchQuery
      .trim()
      .toLowerCase();

    this.filteredProducts = this.products.filter(
      product => {
        const matchesSearch =
          !normalizedSearch ||
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.sku.toLowerCase().includes(normalizedSearch);

        const matchesCategory =
          this.selectedCategory === 'ALL' ||
          product.category === this.selectedCategory;

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
      }
    );

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

    const pages: Array<number | string> = [
      1
    ];

    if (currentPage > 4) {
      pages.push('...');
    }

    const startPage = Math.max(
      2,
      currentPage - 1
    );

    const endPage = Math.min(
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
    if (this.filteredProducts.length === 0) {
      return 0;
    }

    return (
      (this.currentPage - 1) *
      this.itemsPerPage
    ) + 1;
  }


  get paginationEnd(): number {
    return Math.min(
      this.currentPage * this.itemsPerPage,
      this.filteredProducts.length
    );
  }

  openCreateModal(): void {
    this.modalMode = 'CREATE';
    this.selectedProduct = null;

    this.productForm.reset({
      id: this.generateProductId(),
      name: '',
      sku: '',
      category: '',
      price: 0,
      stock: 0,
      minStockThreshold: 5,
      imageUrl: '',
      isActive: true
    });

    this.isProductModalOpen = true;
    this.refreshView();
  }

  openEditModal(product: Product): void {
    this.modalMode = 'EDIT';
    this.selectedProduct = product;

    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      minStockThreshold: product.minStockThreshold,
      imageUrl: product.imageUrl || '',
      isActive: product.isActive
    });

    this.isProductModalOpen = true;
    this.refreshView();
  }


  closeProductModal(): void {
    this.isProductModalOpen = false;
    this.selectedProduct = null;
    this.productForm.reset();
    this.refreshView();
  }


  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.refreshView();
      return;
    }

    const formValue = this.productForm.getRawValue();

    const normalizedProduct: Product = {
      id: String(formValue.id || this.generateProductId()),
      name: String(formValue.name).trim(),
      sku: String(formValue.sku).trim().toUpperCase(),
      category: String(formValue.category),
      price: Number(formValue.price),
      stock: Number(formValue.stock),
      minStockThreshold: Number(
        formValue.minStockThreshold
      ),
      imageUrl: String(formValue.imageUrl || '').trim(),
      isActive: Boolean(formValue.isActive),
      updatedAt: new Date()
    };

    if (this.modalMode === 'CREATE') {
      this.products = [
        normalizedProduct,
        ...this.products
      ];
    } else {
      const productIndex = this.products.findIndex(
        product => product.id === normalizedProduct.id
      );

      if (productIndex !== -1) {
        this.products[productIndex] =
          normalizedProduct;
      }
    }

    this.closeProductModal();
    this.applyFilters();
  }

  toggleStatusRequest(product: Product): void {
    const nextStatus = !product.isActive;

    const actionText = nextStatus
      ? 'activer'
      : 'désactiver';

    this.confirmTitle =
      `${actionText.toUpperCase()} LE PRODUIT`;

    this.confirmMessage = nextStatus
      ? `Êtes-vous sûr de vouloir activer "${product.name}" ? Il sera à nouveau visible dans votre catalogue.`
      : `Êtes-vous sûr de vouloir désactiver "${product.name}" ? Il ne sera plus disponible dans votre catalogue de vente.`;

    this.confirmButtonText = nextStatus
      ? 'Oui, activer'
      : 'Oui, désactiver';

    this.confirmButtonClass = nextStatus
      ? 'btn-success'
      : 'btn-danger';

    this.confirmActionType = 'TOGGLE_STATUS';

    this.confirmAction = () => {
      product.isActive = nextStatus;
      product.updatedAt = new Date();

      this.applyFilters();
    };

    this.isConfirmModalOpen = true;
    this.refreshView();
  }

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

  private generateProductId(): string {
    let newId = '';

    do {
      newId =
        'PRD-' +
        Math.floor(
          1000 + Math.random() * 9000
        );
    } while (
      this.products.some(
        product => product.id === newId
      )
    );

    return newId;
  }

  trackByProductId(
    index: number,
    product: Product
  ): string {
    return product.id;
  }


  isFieldInvalid(
    fieldName: string
  ): boolean {
    const field =
      this.productForm.get(fieldName);

    return Boolean(
      field &&
      field.invalid &&
      (
        field.dirty ||
        field.touched
      )
    );
  }

}