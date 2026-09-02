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
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Vérification du type
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Limite : 5 Mo
    if (file.size > 5 * 1024 * 1024) {
      alert('L’image ne doit pas dépasser 5 Mo.');
      input.value = '';
      return;
    }

    // Libérer l'ancienne image
    if (
      this.postForm.imagePreview &&
      this.postForm.imagePreview.startsWith('blob:')
    ) {
      URL.revokeObjectURL(this.postForm.imagePreview);
    }

    // Création immédiate de l'aperçu
    this.postForm.imagePreview =
      URL.createObjectURL(file);
    // Permet de sélectionner à nouveau la même image
    input.value = '';
    this.cdr.markForCheck();
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