import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
export class AddProductsComponent {

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


  imageSlots = [
    1,
    2,
    3,
    4
  ];


  /* =====================================================
     UI
  ====================================================== */

  showSuccess = false;


  constructor(
    private router: Router
  ) {}


  /* =====================================================
     IMAGE COUNT
  ====================================================== */

  get imageCount(): number {

    return this.imagePreviews.filter(
      image => image !== null
    ).length;

  }


  /* =====================================================
     FORM VALIDATION
  ====================================================== */

  get canCreateProduct(): boolean {

    return (
      this.product.name.trim().length > 0 &&
      this.product.category.trim().length > 0 &&
      this.product.description.trim().length > 0 &&
      this.product.price > 0 &&
      this.product.stock >= 0 &&
      this.imageCount >= 2
    );

  }


  /* =====================================================
     IMAGE SELECTION
  ====================================================== */

  onImageSelected(
    event: Event,
    index: number
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      return;
    }

    this.imageFiles[index] = file;


    const reader = new FileReader();

    reader.onload = () => {

      this.imagePreviews[index] =
        reader.result as string;

    };

    reader.readAsDataURL(file);

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

    if (!this.canCreateProduct) {
      return;
    }


    const productData = {

      ...this.product,

      images: this.imageFiles.filter(
        image => image !== null
      ),

      createdAt: new Date()

    };


    console.log(
      'Produit créé :',
      productData
    );


    this.showSuccess = true;


    setTimeout(() => {

      this.router.navigate([
        '/dashboard/products'
      ]);

    }, 1800);

  }


  /* =====================================================
     BACK
  ====================================================== */

  goBack(): void {

    this.router.navigate([
      '/dashboard/products'
    ]);

  }

}