import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

// Modales partagées
import { CreatePostModalComponent } from '../../../shared/community/create-post-modal/create-post-modal';
import { PostSuccessModalComponent } from '../../../shared/community/create-post-modal/post-success-modal/post-success-modal';
import { CreateProductModalComponent } from '../../../shared/community/create-product-modal/create-product-modal';
import { ProductSuccessModalComponent } from '../../../shared/community/create-product-modal/product-success-modal/product-success-modal';
import { LiveSuccessModalComponent } from '../../../shared/community/schedule-live-modal/live-success-modal/live-success-modal';
import { ScheduleLiveModalComponent } from '../../../shared/community/schedule-live-modal/schedule-live-modal';

import { Community, CommunityService } from '../../../services/community.service';
import {
  CommunityContentService,
  Post,
  Product,
  Live,
  Member
} from '../../../services/community-content.service';

@Component({
  selector: 'app-community-detail',
  standalone: true,
  imports: [
    CommonModule,
    CreatePostModalComponent,
    PostSuccessModalComponent,
    CreateProductModalComponent,
    ProductSuccessModalComponent,
    ScheduleLiveModalComponent,
    LiveSuccessModalComponent
  ],
  templateUrl: './community-detail.html',
  styleUrls: ['./community-detail.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityDetailComponent {
  // Onglet actif
  activeTab: 'home' | 'products' | 'lives' | 'members' = 'home';

  // États de visibilité des modales
  showPostModal = false;
  showPostSuccessModal = false;

  showProductModal = false;
  showProductSuccessModal = false;

  showLiveModal = false;
  showLiveSuccessModal = false;

  // Données transmises aux modales de succès
  createdPost: any = null;
  createdProduct: any = null;
  createdLive: any = null;

  // Données de la communauté (liées au service via l'ID)
  communityId = '';
  community: Community | null = null;

  // Live en cours
  liveNow = {
    id: 'live-now-1',
    title: 'Présentation du nouvel arrivage de textiles & prêt-à-porter',
    description: 'Découvrez nos nouveautés en direct et posez vos questions en temps réel.',
    viewers: 42
  };

  // Prochains lives
  upcomingLives: {
    id: string;
    title: string;
    date: string;
    month: string;
    day: string;
    time: string;
    duration: string;
  }[] = [];

  // Publications du fil d'actualités
  posts: Post[] = [];

  // Catalogue de produits
  products: Product[] = [];

  // Liste des membres
  members: Member[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private communityService: CommunityService,
    private contentService: CommunityContentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.communityId = id;
    this.community = this.communityService.getCommunityById(id) || null;

    // 1️⃣ Synchroniser d'abord les ventes flash vers les posts
    this.contentService.syncFlashSalesToPosts(id);

    // 2️⃣ Puis charger le contenu (posts déjà enrichis)
    const content = this.contentService.getContentForCommunity(id);
    this.posts = content.posts;
    this.products = content.products;

    // Pour les lives, on peut mapper vers ton format "upcomingLives"
    this.upcomingLives = content.lives.map(live => ({
      id: live.id,
      title: live.title,
      date: live.date,
      month: new Date(live.date).toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      day: new Date(live.date).getDate().toString().padStart(2, '0'),
      time: live.time,
      duration: 'À définir' // ou un champ dédié si tu l'ajoutes dans Live
    }));

    this.members = content.members;
  }

  // Navigation
  goBack(): void {
    this.location.back();
  }

  changeTab(tab: 'home' | 'products' | 'lives' | 'members'): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  formatNumber(value: number): string {
    return value.toLocaleString('fr-FR');
  }

  manageCommunity(): void {
    if (!this.community) return;
    this.router.navigate([
      '/dashboard/manage-community',
      this.community.id,
      'manage'
    ]);
  }

  // Actions Live
  joinLive(liveId: string): void {
    this.router.navigate([
      '/dashboard/live',
      liveId
    ]);
  }

  setReminder(live: any): void {
    console.log('Rappel défini pour :', live.title);
  }

  shareLive(live: any): void {
    console.log('Partage du live :', live.title);
  }

  // Actions Posts & Products
  toggleLike(post: any): void {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    this.cdr.markForCheck();
  }

  commentPost(post: any): void {
    console.log('Commenter le post :', post.id);
  }

  sharePost(post: any): void {
    console.log('Partager le post :', post.id);
  }

  viewProduct(product: any): void {
    console.log('Voir le produit :', product.name);
  }

  // --- OUVERTURE / FERMETURE MODALES PARTAGÉES ---

  // Post Modal
  openPostModal(): void {
    this.showPostModal = true;
    this.cdr.markForCheck();
  }

  closePostModal(): void {
    this.showPostModal = false;
    this.cdr.markForCheck();
  }

  onPostCreated(postData: any): void {
    this.showPostModal = false;
    this.createdPost = postData;
    this.showPostSuccessModal = true;

    this.posts.unshift({
      id: `post-${Date.now()}`,
      author: this.community?.admin || 'Admin',
      authorInitial: (this.community?.admin || 'Admin').slice(0, 2).toUpperCase(),
      date: 'À l\'instant',
      title: 'Nouvelle publication',
      content: postData.content,
      image: postData.image || undefined,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      liked: false,
      product: null as any,

      // nouveaux champs
      authorAvatar: this.community?.icon || '🌍',
      isAdmin: true,
      time: 'À l\'instant'
    });

    if (this.community) {
      this.community.posts++;
    }
    this.cdr.markForCheck();
  }

  closePostSuccessModal(): void {
    this.showPostSuccessModal = false;
    this.createdPost = null;
    this.cdr.markForCheck();
  }

  // Product Modal
  openProductModal(): void {
    this.showProductModal = true;
    this.cdr.markForCheck();
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.cdr.markForCheck();
  }

  onProductCreated(productData: any): void {
    this.showProductModal = false;
    this.createdProduct = productData;
    this.showProductSuccessModal = true;

    // Ajout local du produit créé dans le catalogue
    this.products.unshift({
      id: `prod-${Date.now()}`,
      name: productData.name,
      category: productData.category,
      description: productData.description,
      price: productData.price,
      image: productData.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80'
    });

    if (this.community) {
      this.community.products++;
      // Optionnel : mettre à jour dans le service
      // this.communityService.updateCommunity(this.community);
    }

    this.cdr.markForCheck();
  }

  closeProductSuccessModal(): void {
    this.showProductSuccessModal = false;
    this.createdProduct = null;
    this.cdr.markForCheck();
  }

  // Live Modal
  openLiveModal(): void {
    this.showLiveModal = true;
    this.cdr.markForCheck();
  }

  closeLiveModal(): void {
    this.showLiveModal = false;
    this.cdr.markForCheck();
  }

  onLiveCreated(liveData: any): void {
    this.showLiveModal = false;
    this.createdLive = liveData;
    this.showLiveSuccessModal = true;

    // Ajout du live créé dans la liste à venir
    const dateObj = new Date(liveData.date);
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = dateObj.getDate().toString().padStart(2, '0');

    this.upcomingLives.unshift({
      id: `live-${Date.now()}`,
      title: liveData.title,
      date: liveData.date,
      month: month || 'PROX',
      day: day || '01',
      time: liveData.time,
      duration: liveData.duration
    });

    this.cdr.markForCheck();
  }

  closeLiveSuccessModal(): void {
    this.showLiveSuccessModal = false;
    this.createdLive = null;
    this.cdr.markForCheck();
  }
}