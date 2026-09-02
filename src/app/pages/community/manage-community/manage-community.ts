import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Community, CommunityService } from '../../../services/community.service';
import {
  CommunityContentService,
  Post,
  Product,
  Live,
  Member
} from '../../../services/community-content.service';

@Component({
  selector: 'app-manage-community',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-community.html',
  styleUrl: './manage-community.css'
})
export class ManageCommunityComponent implements OnInit {

  /* =====================================================
     COMMUNITY
  ====================================================== */
  communityId = '';
  community: Community | null = null;

  /* =====================================================
     ACTIVE TAB
  ====================================================== */
  activeTab:
    | 'overview'
    | 'information'
    | 'members'
    | 'posts'
    | 'products'
    | 'lives'
    | 'settings' = 'overview';

  /* =====================================================
     SEARCH
  ====================================================== */
  memberSearch = '';
  postSearch = '';
  productSearch = '';

  /* =====================================================
     MEMBERS, POSTS, PRODUCTS, LIVES (via ContentService)
  ====================================================== */

  members: (Member & { joinedAt?: string })[] = [];
  posts: (Post & { status?: string })[] = [];
  products: (Product & { status?: string })[] = [];
  lives: (Live & {
    status?: string;
    link: string;
    duration: string;
  })[] = [];

  /* =====================================================
     COMMUNITY INFORMATION FORM
  ====================================================== */
  communityForm = {
    name: '',
    category: '',
    description: '',
    longDescription: ''
  };

  /* =====================================================
     SETTINGS
  ====================================================== */
  communitySettings = {
    publicCommunity: true,
    allowMembersPosts: false,
    allowMemberProducts: false,
    allowMemberLives: false
  };

  /* =====================================================
     CONFIRMATION MODAL
  ====================================================== */
  showConfirmModal = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmButtonText = 'Confirmer';
  confirmButtonClass = 'danger';
  pendingAction: (() => void) | null = null;

  /* =====================================================
     SUCCESS MODAL
  ====================================================== */
  showSuccessModal = false;
  successTitle = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private communityService: CommunityService,
    private contentService: CommunityContentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.communityId = this.route.snapshot.paramMap.get('id') ?? '';
    this.community = this.communityService.getCommunityById(this.communityId) || null;

    if (this.community) {
      this.communityForm = {
        name: this.community.name,
        category: this.community.category,
        description: this.community.description,
        longDescription: this.community.longDescription || ''
      };
    }

    // Charger le contenu de la communauté
    const content = this.contentService.getContentForCommunity(this.communityId);

    // Members
    this.members = content.members.map(m => ({
      ...m,
      joinedAt: 'Date à définir' // ou un champ dédié si tu l’ajoutes
    }));

    // Posts
    this.posts = content.posts.map(p => ({
      ...p,
      status: 'Publié'
    }));

    // Products
    this.products = content.products.map(p => ({
      ...p,
      status: p.status || 'Publié'
    }));

    // Lives
    this.lives = content.lives.map((l, idx) => ({
      ...l,
      status: 'Programmé',
      link: `https://b2wa.com/live/${this.communityId}-live-${idx + 1}`,
      duration: l.time // ou un champ dédié si tu veux
    }));
  }

  goBack(): void {
    this.router.navigate(['/dashboard/community', this.communityId]);
  }

  setActiveTab(
    tab:
      | 'overview'
      | 'information'
      | 'members'
      | 'posts'
      | 'products'
      | 'lives'
      | 'settings'
  ): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  saveCommunityInformation(): void {
    if (!this.community) return;

    const updated: Community = {
      ...this.community,
      name: this.communityForm.name,
      category: this.communityForm.category,
      description: this.communityForm.description,
      longDescription: this.communityForm.longDescription
    };

    this.communityService.updateCommunity(updated);
    this.community = updated;

    this.openSuccess(
      'Informations mises à jour',
      'Les informations de votre communauté ont été enregistrées avec succès.'
    );
    this.cdr.markForCheck();
  }

  removeMember(member: any): void {
    this.openConfirmation(
      'Retirer ce membre ?',
      `Voulez-vous vraiment retirer ${member.name} de cette communauté ?`,
      'Retirer',
      'danger',
      () => {
        this.members = this.members.filter(item => item.id !== member.id);
        if (this.community) {
          this.community.members = Math.max(0, this.community.members - 1);
          this.communityService.updateCommunity(this.community);
        }
        this.openSuccess(
          'Membre retiré',
          `${member.name} a été retiré de la communauté.`
        );
        this.cdr.markForCheck();
      }
    );
  }

  deletePost(post: any): void {
    this.openConfirmation(
      'Supprimer cette publication ?',
      'Cette publication sera définitivement supprimée de votre communauté.',
      'Supprimer',
      'danger',
      () => {
        this.posts = this.posts.filter(item => item.id !== post.id);
        if (this.community) {
          this.community.posts = Math.max(0, this.community.posts - 1);
          this.communityService.updateCommunity(this.community);
        }
        this.openSuccess(
          'Publication supprimée',
          'La publication a été supprimée avec succès.'
        );
        this.cdr.markForCheck();
      }
    );
  }

  hidePost(post: any): void {
    this.openConfirmation(
      'Masquer cette publication ?',
      'La publication ne sera plus visible par les membres de votre communauté.',
      'Masquer',
      'warning',
      () => {
        post.status = 'Masqué';
        this.openSuccess(
          'Publication masquée',
          'La publication est maintenant masquée pour les membres.'
        );
        this.cdr.markForCheck();
      }
    );
  }

  deleteProduct(product: any): void {
    this.openConfirmation(
      'Supprimer ce produit ?',
      `Le produit "${product.name}" sera retiré de votre communauté.`,
      'Supprimer',
      'danger',
      () => {
        this.products = this.products.filter(item => item.id !== product.id);
        if (this.community) {
          this.community.products = Math.max(0, this.community.products - 1);
          this.communityService.updateCommunity(this.community);
        }
        this.openSuccess(
          'Produit supprimé',
          'Le produit a été supprimé de votre communauté.'
        );
        this.cdr.markForCheck();
      }
    );
  }

  hideProduct(product: any): void {
    this.openConfirmation(
      'Masquer ce produit ?',
      'Le produit ne sera plus visible dans la communauté.',
      'Masquer',
      'warning',
      () => {
        product.status = 'Masqué';
        this.openSuccess(
          'Produit masqué',
          'Le produit est maintenant masqué.'
        );
        this.cdr.markForCheck();
      }
    );
  }

  cancelLive(live: any): void {
    this.openConfirmation(
      'Annuler ce Live ?',
      `Le Live "${live.title}" sera annulé et les membres ayant réservé leur place seront informés.`,
      'Annuler le Live',
      'danger',
      () => {
        live.status = 'Annulé';
        this.openSuccess(
          'Live annulé',
          'Le Live a été annulé avec succès.'
        );
        this.cdr.markForCheck();
      }
    );
  }

  deleteLive(live: any): void {
    this.openConfirmation(
      'Supprimer ce Live ?',
      'Cet événement sera définitivement supprimé de votre communauté.',
      'Supprimer',
      'danger',
      () => {
        this.lives = this.lives.filter(item => item.id !== live.id);
        if (this.community) {
          this.community.lives = Math.max(0, this.community.lives - 1);
          this.communityService.updateCommunity(this.community);
        }
        this.openSuccess(
          'Live supprimé',
          'Le Live a été supprimé.'
        );
        this.cdr.markForCheck();
      }
    );
  }

  copyLiveLink(link: string): void {
    navigator.clipboard.writeText(link);
    this.openSuccess(
      'Lien copié',
      'Le lien B2WA Live a été copié dans votre presse-papiers.'
    );
  }

  saveSettings(): void {
    this.openSuccess(
      'Paramètres enregistrés',
      'Les paramètres de votre communauté ont été mis à jour.'
    );
  }

  deleteCommunity(): void {
    this.openConfirmation(
      'Supprimer la communauté ?',
      'Cette action est définitive. Toutes les publications, produits, lives et données associées à cette communauté seront supprimés.',
      'Supprimer définitivement',
      'danger',
      () => {
        const ok = this.communityService.deleteCommunity(this.communityId);
        if (ok) {
          this.router.navigate(['/dashboard/community']);
        }
      }
    );
  }

  openConfirmation(
    title: string,
    message: string,
    buttonText: string,
    buttonClass: string,
    action: () => void
  ): void {
    this.confirmTitle = title;
    this.confirmMessage = message;
    this.confirmButtonText = buttonText;
    this.confirmButtonClass = buttonClass;
    this.pendingAction = action;
    this.showConfirmModal = true;
    this.cdr.markForCheck();
  }

  confirmAction(): void {
    if (this.pendingAction) {
      const action = this.pendingAction;
      this.closeConfirmModal();
      action();
    }
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.pendingAction = null;
    this.cdr.markForCheck();
  }

  openSuccess(title: string, message: string): void {
    this.successTitle = title;
    this.successMessage = message;
    this.showSuccessModal = true;
    this.cdr.markForCheck();
  }

  closeSuccess(): void {
    this.showSuccessModal = false;
    this.cdr.markForCheck();
  }

  get filteredMembers(): any[] {
    const search = this.memberSearch.toLowerCase().trim();
    if (!search) return this.members;
    return this.members.filter(member =>
      member.name.toLowerCase().includes(search)
    );
  }

  get filteredPosts(): any[] {
    const search = this.postSearch.toLowerCase().trim();
    if (!search) return this.posts;
    return this.posts.filter(post =>
      post.title.toLowerCase().includes(search)
    );
  }

  get filteredProducts(): any[] {
    const search = this.productSearch.toLowerCase().trim();
    if (!search) return this.products;
    return this.products.filter(product =>
      product.name.toLowerCase().includes(search)
    );
  }
}