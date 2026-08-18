import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-success-modal.html',
  styleUrls: ['./product-success-modal.css']
})
export class ProductSuccessModalComponent {
  @Input() visible = false;
  @Input() product: any = null;
  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }
}