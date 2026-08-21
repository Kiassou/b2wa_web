import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-products.html',
  styleUrl: './add-products.css'
})
export class AddProductsComponent implements OnInit {

  /* =====================================================
     PRODUCT
  ====================================================== */

  product = {
    name: '',
    category: '',
    sku: '',
    description: '',
    price: 0,
    stock: 0,
    active: true,
    delivery: true
  };

  /* =====================================================
     IMAGES
  ====================================================== */

  imagePreviews: (string | null)[] = [
    null,
    null,
    null,
    null,
    null
  ];

  imageFiles: (File | null)[] = [
    null,
    null,
    null,
    null,
    null
  ];

  imageSlots = [1, 2, 3, 4];

  /* =====================================================
     UI
  ====================================================== */

  showSuccess = false;
  errorMessage = '';

  /* =====================================================
     CONSTRUCTOR & INIT
  ====================================================== */

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.generateSku();
  }

  /* =====================================================
     SKU GENERATION AUTOMATIQUE
  ====================================================== */

  generateSku(): void {
    let prefix = 'PROD';

    if (this.product.category.trim().length > 0) {
      prefix = this.product.category
        .substring(0, 4)
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Supprime les accents
    }

    const existingProducts = this.productsService.getProducts();
    const nextIndex = existingProducts.length + 1;
    const randomSuffix = Math.floor(100 + Math.random() * 900); // Ex: 458

    // Format final : SKU-ELEC-0003-458
    this.product.sku = `SKU-${prefix}-${String(nextIndex).padStart(4, '0')}-${randomSuffix}`;
  }

  onCategoryChange(): void {
    this.generateSku();
  }

  /* =====================================================
     IMAGE COUNT
  ====================================================== */

  get imageCount(): number {
    return this.imagePreviews.filter(image => image !== null).length;
  }

  /* =====================================================
     VALIDATION
  ====================================================== */

  get canCreateProduct(): boolean {
    return (
      this.product.name.trim().length > 0 &&
      this.product.category.trim().length > 0 &&
      this.product.sku.trim().length > 0 &&
      this.product.description.trim().length > 0 &&
      this.product.price > 0 &&
      this.product.stock >= 0 &&
      this.imageCount >= 2
    );
  }

  /* =====================================================
     IMAGE SELECTION
  ====================================================== */

  onImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      return;
    }

    if (index < 0 || index >= this.imageFiles.length) {
      return;
    }

    this.imageFiles[index] = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreviews[index] = reader.result as string;
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
    input.value = '';
  }

  /* =====================================================
     REMOVE IMAGE
  ====================================================== */

  removeImage(index: number): void {
    this.imagePreviews[index] = null;
    this.imageFiles[index] = null;
  }

  /* =====================================================
     CREATE PRODUCT
  ====================================================== */

  createProduct(): void {
    this.errorMessage = '';

    if (!this.canCreateProduct) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires et ajouter au moins deux images.';
      return;
    }

    const images = this.imagePreviews.filter(
      (image): image is string => image !== null
    );

    this.productsService.addProduct({
      name: this.product.name.trim(),
      sku: this.product.sku.trim(),
      category: this.product.category.trim(),
      description: this.product.description.trim(),
      price: Number(this.product.price),
      stock: Number(this.product.stock),
      minStockThreshold: 5,
      isActive: this.product.active,
      images,
      imageUrl: images[0] || ''
    });

    this.showSuccess = true;

    setTimeout(() => {
      this.router.navigate(['/dashboard/products']);
    }, 1800);
  }

  /* =====================================================
     BACK
  ====================================================== */

  goBack(): void {
    this.router.navigate(['/dashboard/products']);
  }
}