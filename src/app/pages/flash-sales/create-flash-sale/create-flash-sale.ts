import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  FlashSale,
  FlashSaleStoreService
} from '../../../services/flash-sale-store.service';

interface CommunityOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-create-flash-sale',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-flash-sale.html',
  styleUrl: './create-flash-sale.css'
})
export class CreateFlashSaleComponent {

  /* =====================================================
     COMMUNAUTÉS
  ====================================================== */
  communities: CommunityOption[] = [
    {
      id: 'community-1',
      name: 'Tech & Électronique Mali'
    },
    {
      id: 'community-2',
      name: 'Mode & Shopping Bamako'
    },
    {
      id: 'community-3',
      name: 'Maison & Lifestyle'
    }
  ];

  /* =====================================================
     FORMULAIRE
  ====================================================== */
  form = {
    communityId: '',
    productId: '',
    productName: '',
    productImage: '',
    originalPrice: 0,
    flashPrice: 0,
    quantity: 1,
    startDate: '',
    endDate: '',
    description: ''
  };

  /* =====================================================
     ÉTAT
  ====================================================== */
  submitting = false;
  errorMessage = '';
  showSuccessModal = false;
  imageError = false;

  /* =====================================================
     RÉSULTAT CRÉATION
  ====================================================== */
  createdSale = {
    id: 0,
    productName: '',
    flashPrice: 0,
    discount: 0
  };

  /* =====================================================
     CONSTRUCTEUR
  ====================================================== */
  constructor(
    private router: Router,
    private flashSaleStore: FlashSaleStoreService
  ) {
    this.generateProductId();
    this.initializeDates();
  }

  /* =====================================================
     GÉNÉRATION AUTO-INCRÉMENT DE L'IDENTIFIANT PRODUIT
  ====================================================== */
  private generateProductId(): void {
    const nextId = this.flashSaleStore.getNextId();
    this.form.productId = `PROD-${String(nextId).padStart(4, '0')}`;
  }

/* =====================================================
     GESTION DE L'UPLOADER D'IMAGE
  ====================================================== */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.imageError = true;
        this.errorMessage = 'Veuillez sélectionner un fichier image valide.';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.form.productImage = reader.result as string;
        this.imageError = false; // Réinitialisation directe de l'erreur
        this.errorMessage = '';
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.form.productImage = '';
    this.imageError = false;
  }

  /* =====================================================
     DATES PAR DÉFAUT
  ====================================================== */
  private initializeDates(): void {
    const now = new Date();

    const start = new Date(
      now.getTime() + 5 * 60 * 1000
    );

    const end = new Date(
      now.getTime() + 24 * 60 * 60 * 1000
    );

    this.form.startDate = this.toDateTimeLocal(start);
    this.form.endDate = this.toDateTimeLocal(end);
  }

  /* =====================================================
     FORMAT DATETIME-LOCAL
  ====================================================== */
  private toDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /* =====================================================
     COMMUNAUTÉ SÉLECTIONNÉE
  ====================================================== */
  get selectedCommunityName(): string {
    const community = this.communities.find(
      item => item.id === this.form.communityId
    );

    return community?.name || '';
  }

  onCommunityChange(): void {
    this.errorMessage = '';
  }

  /* =====================================================
     RÉDUCTION
  ====================================================== */
  get discountPercentage(): number {
    if (Number(this.form.originalPrice) <= 0) {
      return 0;
    }

    const discount = (
      1 - (
        Number(this.form.flashPrice) /
        Number(this.form.originalPrice)
      )
    ) * 100;

    return Math.max(0, Math.round(discount));
  }

  /* =====================================================
     ÉCONOMIE
  ====================================================== */
  get savingAmount(): number {
    return Math.max(
      0,
      Number(this.form.originalPrice) - Number(this.form.flashPrice)
    );
  }

  /* =====================================================
     PÉRIODE
  ====================================================== */
  get periodStatus(): 'active' | 'scheduled' | 'invalid' {
    if (!this.form.startDate || !this.form.endDate) {
      return 'invalid';
    }

    const start = new Date(this.form.startDate);
    const end = new Date(this.form.endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return 'invalid';
    }

    return start <= new Date() ? 'active' : 'scheduled';
  }

  /* =====================================================
     APERÇU STOCK
  ====================================================== */
  get previewStockPercentage(): number {
    if (Number(this.form.quantity) <= 0) {
      return 0;
    }

    return 100;
  }

  /* =====================================================
     PÉRIODE FORMATÉE
  ====================================================== */
  get formattedPeriod(): string {
    if (!this.form.startDate || !this.form.endDate) {
      return 'Période non définie';
    }

    const start = new Date(this.form.startDate);
    const end = new Date(this.form.endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 'Période invalide';
    }

    const formatter = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${formatter.format(start)} → ${formatter.format(end)}`;
  }

  /* =====================================================
     VALIDATION
  ====================================================== */
  get canCreate(): boolean {
    const originalPrice = Number(this.form.originalPrice);
    const flashPrice = Number(this.form.flashPrice);
    const quantity = Number(this.form.quantity);

    return (
      this.form.communityId.trim().length > 0 &&
      this.form.productId.trim().length > 0 &&
      this.form.productName.trim().length > 0 &&
      originalPrice > 0 &&
      flashPrice > 0 &&
      flashPrice < originalPrice &&
      quantity >= 1 &&
      this.form.startDate.trim().length > 0 &&
      this.form.endDate.trim().length > 0 &&
      this.periodStatus !== 'invalid'
    );
  }

  /* =====================================================
     NETTOYAGE
  ====================================================== */
  private cleanText(value: string | null | undefined): string {
    return String(value || '').trim();
  }

  /* =====================================================
     CRÉER
  ====================================================== */
  createFlashSale(): void {
    this.errorMessage = '';

    if (!this.canCreate) {
      this.errorMessage =
        'Veuillez vérifier les informations de votre vente flash.';
      return;
    }

    this.submitting = true;

    try {
      const id = this.flashSaleStore.getNextId();
      const start = new Date(this.form.startDate);
      const end = new Date(this.form.endDate);
      const now = new Date();

      const status = start > now ? 'scheduled' : 'active';

      const sale: FlashSale = {
        id,
        communityId: this.cleanText(this.form.communityId),
        communityName: this.selectedCommunityName,
        productId: this.cleanText(this.form.productId),
        productName: this.cleanText(this.form.productName),
        productImage:
          this.cleanText(this.form.productImage) ||
          'assets/images/products/default-product.jpg',
        originalPrice: Number(this.form.originalPrice),
        flashPrice: Number(this.form.flashPrice),
        currency: 'FCFA',
        quantity: Number(this.form.quantity),
        soldQuantity: 0,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        status,
        description:
          this.cleanText(this.form.description) ||
          'Offre exceptionnelle réservée aux membres de la communauté.',
        createdAt: now.toISOString()
      };

      this.flashSaleStore.add(sale);

      this.createdSale = {
        id: sale.id,
        productName: sale.productName,
        flashPrice: sale.flashPrice,
        discount: this.discountPercentage
      };

      this.submitting = false;
      this.showSuccessModal = true;
    } catch (error) {
      console.error('Erreur création vente flash :', error);
      this.submitting = false;
      this.errorMessage =
        'Une erreur est survenue lors de la création de la vente flash.';
    }
  }

  /* =====================================================
     FERMER MODALE
  ====================================================== */
  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  /* =====================================================
     VOIR LES VENTES FLASH
  ====================================================== */
  viewFlashSales(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/dashboard/flash-sales']);
  }

  /* =====================================================
     RETOUR
  ====================================================== */
  goBack(): void {
    this.router.navigate(['/dashboard/flash-sales']);
  }
}