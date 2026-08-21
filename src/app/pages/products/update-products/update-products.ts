import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService, Product } from '../../../services/products.service';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-products.html',
  styleUrl: './update-products.css'
})
export class UpdateProductsComponent implements OnInit {

  product: Product | null = null;
  productId: string | null = null;

  loading = true;
  errorMessage = '';

  productForm = {
    title: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    active: true,
    images: [] as string[]
  };

  // Injectez proprement ChangeDetectorRef dans le constructeur
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');

    if (!this.productId) {
      this.errorMessage = 'Identifiant du produit introuvable.';
      this.loading = false;
      return;
    }

    this.loadProduct();
  }

  loadProduct(): void {
    if (!this.productId) return;

    this.loading = true;
    const product = this.productsService.getProductById(this.productId);

    if (!product) {
      this.errorMessage = 'Ce produit n’existe pas.';
      this.loading = false;
      return;
    }

    this.product = product;
    this.productForm = {
      title: product.name,
      category: product.category,
      description: product.description,
      price: Number(product.price),
      stock: Number(product.stock),
      active: product.isActive,
      images: [...product.images]
    };

    this.loading = false;
  }

  get emptyImageSlots(): number[] {
    const remaining = 5 - this.productForm.images.length;
    return Array.from({ length: Math.max(0, remaining) }, (_, index) => index);
  }

  addImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.type.startsWith('image/') || this.productForm.images.length >= 5) {
      return;
    }

    this.readImage(file, (image: string) => {
      this.productForm.images.push(image);
      this.cdr.detectChanges(); // Forcer la mise à jour du template
    });

    input.value = '';
  }

  replaceImage(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.type.startsWith('image/')) return;
    if (index < 0 || index >= this.productForm.images.length) return;

    this.readImage(file, (image: string) => {
      this.productForm.images[index] = image;
      this.cdr.detectChanges(); // Forcer la mise à jour du template
    });

    input.value = '';
  }

  private readImage(file: File, callback: (image: string) => void): void {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
      }
    };

    reader.readAsDataURL(file);
  }

  toggleStatus(): void {
    this.productForm.active = !this.productForm.active;
  }

  get canUpdate(): boolean {
    return (
      this.productForm.title.trim().length > 0 &&
      this.productForm.category.trim().length > 0 &&
      this.productForm.description.trim().length > 0 &&
      this.productForm.price >= 0 &&
      this.productForm.stock >= 0 &&
      this.productForm.images.length >= 2
    );
  }

  updateProduct(): void {
    if (!this.productId || !this.canUpdate) return;

    const updatedProduct: Partial<Product> = {
      name: this.productForm.title.trim(),
      category: this.productForm.category.trim(),
      description: this.productForm.description.trim(),
      price: Number(this.productForm.price),
      stock: Number(this.productForm.stock),
      isActive: this.productForm.active,
      images: [...this.productForm.images],
      imageUrl: this.productForm.images[0] || ''
    };

    const result = this.productsService.updateProduct(this.productId, updatedProduct);

    if (!result) {
      this.errorMessage = 'Impossible de modifier ce produit.';
      return;
    }

    this.router.navigate(['/dashboard/products']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard/products']);
  }
}