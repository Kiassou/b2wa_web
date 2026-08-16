import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type ModalType = 'personal' | 'business' | 'avatar' | 'verification' | 'security' | 'documents' | 'danger' | null;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {

  // ÉTATS SIGNALS
  activeModal = signal<ModalType>(null);
  saving = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  avatarPreview = signal<string | null>(null);
  avatarChanged = signal<boolean>(false);
  
  showConfirmation = signal<boolean>(false);
  showDeleteConfirmation = signal<boolean>(false);

  // FORMULAIRE DE PROFIL
  profileForm: FormGroup;

  // DONNÉES STATISTIQUES DU COMMERÇANT
  merchantStats = {
    totalSales: 1280,
    rating: 4.9,
    memberSince: 'Janvier 2024',
    completionRate: 85
  };

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['Oumar', [Validators.required]],
      lastName: ['TRAORE', [Validators.required]],
      email: ['go.traore@b2wa.africa', [Validators.required, Validators.email]],
      phone: ['+223 70 00 00 00', [Validators.required]],
      storeName: ['B2WA Tech Store', [Validators.required]],
      businessType: ['Électronique & High-Tech', [Validators.required]],
      nif: ['123456789M', [Validators.required]],
      city: ['Bamako', [Validators.required]],
      country: ['Mali', [Validators.required]],
      address: ['Avenue de l\'Indépendance, Quartier du Fleuve', [Validators.required]],
      bio: ['Spécialiste du matériel informatique, des équipements réseau et accessoires High-Tech.']
    });
  }

  // CALCUL DES INITIALES POUR LE PLACEHOLDER
  getInitials(): string {
    const firstName = this.profileForm.get('firstName')?.value || '';
    const lastName = this.profileForm.get('lastName')?.value || '';
    const fInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${fInitial}${lInitial}` || 'B';
  }

  // GESTION DES MODALES
  openModal(modal: ModalType) {
    this.activeModal.set(modal);
  }

  closeModal() {
    this.activeModal.set(null);
    this.showConfirmation.set(false);
    this.showDeleteConfirmation.set(false);
  }

  // SÉLECTION D'AVATAR
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview.set(reader.result as string);
        this.avatarChanged.set(true);
      };
      reader.readAsDataURL(file);
    }
  }

  // SAUVEGARDE DE L'AVATAR
  requestAvatarSave() {
    this.avatarChanged.set(false);
    this.closeModal();
    this.successMessage.set('Votre photo de profil a été mise à jour.');
  }

  // DEMANDE DE CONFIRMATION
  requestSave() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.showConfirmation.set(true);
  }

  cancelConfirmation() {
    this.showConfirmation.set(false);
  }

  confirmSave() {
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.showConfirmation.set(false);
      this.closeModal();
      this.successMessage.set('Vos modifications ont été enregistrées avec succès.');
    }, 800);
  }

  // ACTIONS DE SUPPRESSION
  openDeleteConfirmation() {
    this.showDeleteConfirmation.set(true);
  }

  cancelDeleteConfirmation() {
    this.showDeleteConfirmation.set(false);
  }

  confirmDelete() {
    this.showDeleteConfirmation.set(false);
    this.closeModal();
    this.successMessage.set('La demande de suppression de votre compte a été prise en compte.');
  }

  // FONCTIONNALITÉ EN DÉVELOPPEMENT
  showComingSoon(feature: string) {
    alert(`La fonctionnalité "${feature}" sera disponible prochainement.`);
  }
}