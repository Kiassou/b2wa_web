import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-product-modal.html',
  styleUrls: ['./create-product-modal.css']
})
export class CreateProductModalComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() productCreated = new EventEmitter<any>();

  productForm = {
    title: '',
    category: '',
    description: '',
    price: null as number | null,
    stock: null as number | null,
    imagePreview: ''
  };

  constructor(private cdr: ChangeDetectorRef) {}

  get canPublishProduct(): boolean {
    return (
      this.productForm.title.trim() !== '' &&
      this.productForm.category !== '' &&
      this.productForm.price !== null &&
      this.productForm.price > 0
    );
  }

  onProductImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.productForm.imagePreview = e.target.result;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  publishProduct(): void {
    if (!this.canPublishProduct) return;

    const newProduct = {
      name: this.productForm.title,
      category: this.productForm.category,
      description: this.productForm.description,
      price: `${this.productForm.price} FCFA`,
      stock: this.productForm.stock || 0,
      image: this.productForm.imagePreview
    };

    this.productCreated.emit(newProduct);
    this.close.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.productForm = {
      title: '',
      category: '',
      description: '',
      price: null,
      stock: null,
      imagePreview: ''
    };
    this.cdr.markForCheck();
  }
}