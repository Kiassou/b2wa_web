import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule-live-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-live-modal.html',
  styleUrls: ['./schedule-live-modal.css']
})
export class ScheduleLiveModalComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() liveCreated = new EventEmitter<any>();

  liveForm = {
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    capacity: '',
    coverPreview: ''
  };

  constructor(private cdr: ChangeDetectorRef) {}

  get canPublishLive(): boolean {
    return (
      this.liveForm.title.trim() !== '' &&
      this.liveForm.date !== '' &&
      this.liveForm.time !== ''
    );
  }

  onLiveImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.liveForm.coverPreview = e.target.result;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  publishLive(): void {
    if (!this.canPublishLive) return;

    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newLive = {
      title: this.liveForm.title,
      description: this.liveForm.description,
      date: this.liveForm.date,
      time: this.liveForm.time,
      duration: `${this.liveForm.duration} min`,
      capacity: this.liveForm.capacity,
      cover: this.liveForm.coverPreview,
      link: `https://b2wa.com/live/${randomId}`
    };

    this.liveCreated.emit(newLive);
    this.close.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.liveForm = {
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '',
      capacity: '',
      coverPreview: ''
    };
    this.cdr.markForCheck();
  }
}