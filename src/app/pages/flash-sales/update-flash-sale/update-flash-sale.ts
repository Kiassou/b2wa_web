import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  FlashSale,
  FlashSaleStoreService
} from '../../../services/flash-sale-store.service';
import { CommunityService } from '../../../services/community.service';

interface CommunityOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-update-flash-sale',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './update-flash-sale.html',
  styleUrl: './update-flash-sale.css'
})
export class UpdateFlashSaleComponent implements OnInit {

  saleId!: number;

  /* =====================================================
     COMMUNAUTÉS (uniquement celles dont l'utilisateur est admin)
  ====================================================== */
  communities: CommunityOption[] = [];

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
    soldQuantity: 0,
    startDate: '',
    endDate: '',
    description: ''
  };

  /* =====================================================
     ÉTAT
  ====================================================== */
  submitting = false;
  loading = true;
  errorMessage = '';
  showSuccessModal = false;
  imageError = false;

  /* =====================================================
     RÉSULTAT MODIFICATION
  ====================================================== */
  updatedSale = {
    id: 0,
    productName: '',
    flashPrice: 0,
    discount: 0
  };

  /* =====================================================
     CONSTRUCTEUR
  ====================================================== */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flashSaleStore: FlashSaleStoreService,
    private communityService: CommunityService
  ) {}

  /* =====================================================
     INITIALISATION & CHARGEMENT
  ====================================================== */
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.saleId = Number(idParam);
      this.loadAdminCommunities();
      this.loadFlashSale(this.saleId);
    } else {
      this.errorMessage = 'Identifiant de vente flash introuvable.';
      this.loading = false;
    }
  }

  private loadAdminCommunities(): void {
    const allCommunities = this.communityService.getCommunities();
    const adminCommunities = allCommunities.filter(c => c.isAdmin);

    this.communities = adminCommunities.map(c => ({
      id: c.id,
      name: c.name
    }));
  }

  private loadFlashSale(id: number): void {
    const existingSale = this.flashSaleStore.getById(id);

    if (!existingSale) {
      this.errorMessage = 'La vente flash demandée n\'existe pas.';
      this.loading = false;
      return;
    }

    this.form = {
      communityId: existingSale.communityId || '',
      productId: existingSale.productId || '',
      productName: existingSale.productName || '',
      productImage: existingSale.productImage || '',
      originalPrice: existingSale.originalPrice || 0,
      flashPrice: existingSale.flashPrice || 0,
      quantity: existingSale.quantity || 1,
      soldQuantity: existingSale.soldQuantity || 0,
      startDate: this.toDateTimeLocal(new Date(existingSale.startDate)),
      endDate: this.toDateTimeLocal(new Date(existingSale.endDate)),
      description: existingSale.description || ''
    };

    this.loading = false;
  }

  /* =====================================================
     FORMAT DATETIME-LOCAL
  ====================================================== */
  private toDateTimeLocal(date: Date): string {
    if (Number.isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
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
        this.imageError = false;
        this.errorMessage = '';
      };
      reader.readAsDataURL(file);
    }
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
     RÉDUCTION & ÉCONOMIE
  ====================================================== */
  get discountPercentage(): number {
    if (Number(this.form.originalPrice) <= 0) return 0;

    const discount = (
      1 - (
        Number(this.form.flashPrice) /
        Number(this.form.originalPrice)
      )
    ) * 100;

    return Math.max(0, Math.round(discount));
  }

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
    if (!this.form.startDate || !this.form.endDate) return 'invalid';

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
     VALIDATION
  ====================================================== */
  get canUpdate(): boolean {
    const originalPrice = Number(this.form.originalPrice);
    const flashPrice = Number(this.form.flashPrice);
    const quantity = Number(this.form.quantity);

    return (
      !this.loading &&
      this.form.communityId.trim().length > 0 &&
      this.form.productId.trim().length > 0 &&
      this.form.productName.trim().length > 0 &&
      originalPrice > 0 &&
      flashPrice > 0 &&
      flashPrice < originalPrice &&
      quantity >= this.form.soldQuantity &&
      this.form.startDate.trim().length > 0 &&
      this.form.endDate.trim().length > 0 &&
      this.periodStatus !== 'invalid'
    );
  }

  private cleanText(value: string | null | undefined): string {
    return String(value || '').trim();
  }

  /* =====================================================
     METTRE À JOUR
  ====================================================== */
  updateFlashSale(): void {
    this.errorMessage = '';

    if (!this.canUpdate) {
      this.errorMessage =
        'Veuillez vérifier les informations de votre vente flash avant de valider.';
      return;
    }

    this.submitting = true;

    try {
      const start = new Date(this.form.startDate);
      const end = new Date(this.form.endDate);
      const now = new Date();

      const status = start > now ? 'scheduled' : 'active';

      const updatedSaleData: FlashSale = {
        id: this.saleId,
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
        soldQuantity: this.form.soldQuantity,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        status,
        description:
          this.cleanText(this.form.description) ||
          'Offre exceptionnelle réservée aux membres de la communauté.',
        createdAt: now.toISOString()
      };

      this.flashSaleStore.update(updatedSaleData);

      this.updatedSale = {
        id: updatedSaleData.id,
        productName: updatedSaleData.productName,
        flashPrice: updatedSaleData.flashPrice,
        discount: this.discountPercentage
      };

      this.submitting = false;
      this.showSuccessModal = true;
    } catch (error) {
      console.error('Erreur modification vente flash :', error);
      this.submitting = false;
      this.errorMessage =
        'Une erreur est survenue lors de la mise à jour de la vente flash.';
    }
  }

  /* =====================================================
     ACTIONS MODALE & NAVIGATION
  ====================================================== */
  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  viewFlashSales(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/dashboard/flash-sales']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard/flash-sales']);
  }
}