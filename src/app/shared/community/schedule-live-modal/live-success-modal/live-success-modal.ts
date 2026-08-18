import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-success-modal.html',
  styleUrls: ['./live-success-modal.css']
})
export class LiveSuccessModalComponent {
  @Input() visible = false;
  @Input() live: any = null;
  @Output() close = new EventEmitter<void>();

  linkCopied = false;

  constructor(private cdr: ChangeDetectorRef) {}

  closeModal(): void {
    this.linkCopied = false;
    this.close.emit();
  }

  copyLiveLink(): void {
    if (this.live?.link) {
      navigator.clipboard.writeText(this.live.link);
      this.linkCopied = true;
      this.cdr.markForCheck();
      setTimeout(() => {
        this.linkCopied = false;
        this.cdr.markForCheck();
      }, 3000);
    }
  }
}