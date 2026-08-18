import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-post-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-post-modal.html',
  styleUrls: ['./create-post-modal.css']
})
export class CreatePostModalComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() postCreated = new EventEmitter<any>();

  postForm = {
    title: '',
    content: '',
    imagePreview: ''
  };

  constructor(private cdr: ChangeDetectorRef) {}

  get canPublishPost(): boolean {
    return this.postForm.title.trim() !== '' && this.postForm.content.trim() !== '';
  }

  onPostImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.postForm.imagePreview = e.target.result;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  publishPost(): void {
    if (!this.canPublishPost) return;

    const newPost = {
      title: this.postForm.title,
      content: this.postForm.content,
      image: this.postForm.imagePreview,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    this.postCreated.emit(newPost);
    this.close.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.postForm = { title: '', content: '', imagePreview: '' };
    this.cdr.markForCheck();
  }
}