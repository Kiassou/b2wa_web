import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-success-modal.html',
  styleUrls: ['./post-success-modal.css']
})
export class PostSuccessModalComponent {
  @Input() visible = false;
  @Input() post: any = null;
  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }
}