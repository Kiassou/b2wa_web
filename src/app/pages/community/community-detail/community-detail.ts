import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

// Modales partagées
import { CreatePostModalComponent } from '../../../shared/community/create-post-modal/create-post-modal';
import { PostSuccessModalComponent } from '../../../shared/community/create-post-modal/post-success-modal/post-success-modal';
import { CreateProductModalComponent } from '../../../shared/community/create-product-modal/create-product-modal';
import { ProductSuccessModalComponent } from '../../../shared/community/create-product-modal/product-success-modal/product-success-modal';
import { LiveSuccessModalComponent } from '../../../shared/community/schedule-live-modal/live-success-modal/live-success-modal';
import { ScheduleLiveModalComponent } from '../../../shared/community/schedule-live-modal/schedule-live-modal';

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

  // Données de la communauté
  community = {
    id: 'comm-123', // AJOUTÉ : 'id' nécessaire pour manageCommunity()
    name: 'Commerce & Import Mali',
    category: 'Commerce International',
    icon: '🛍️',
    cover: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    description: 'Réseau d\'échange et d\'affaires pour les commerçants, importateurs et fournisseurs au Mali.',
    members: 1420,
    posts: 86,
    products: 24,
    admin: 'Mamadou Diallo',
    verified: true,
    isAdmin: true,
    isMember: true,
    createdAt: '15 Janvier 2024'
  };

  // Live en cours
  liveNow = {
    id: 'live-now-1',
    title: 'Présentation du nouvel arrivage de textiles & prêt-à-porter',
    description: 'Découvrez nos nouveautés en direct et posez vos questions en temps réel.',
    viewers: 42
  };

  // Prochains lives
  upcomingLives = [
    {
      id: 'live-1',
      title: 'Opportunités d\'importation Chine-Mali 2026',
      date: '25 Février 2026',
      month: 'FEB',
      day: '25',
      time: '16:00',
      duration: '1 heure'
    },
    {
      id: 'live-2',
      title: 'Session Q&R Douane & Dédouanement',
      date: '02 Mars 2026',
      month: 'MAR',
      day: '02',
      time: '15:30',
      duration: '45 min'
    }
  ];

  // Publications du fil d'actualités
  posts = [
    {
      id: 'post-1',
      author: 'Mamadou Diallo',
      authorAvatar: '🛍️',
      isAdmin: true,
      time: 'Il y a 2 heures',
      content: 'Nous venons de recevoir un nouveau lot de tissus de qualité supérieure disponible pour la commande en gros.',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
      likes: 18,
      comments: 5,
      liked: false,
      product: null
    },
    {
      id: 'post-2',
      author: 'Mamadou Diallo',
      authorAvatar: '🛍️',
      isAdmin: true,
      time: 'Hier à 14:30',
      content: 'Nouveau produit disponible dans notre catalogue B2WA. Commandez directement en gros.',
      image: null,
      likes: 24,
      comments: 8,
      liked: true,
      product: {
        name: 'Sac artisanal en cuir',
        description: 'Sac fait main en cuir véritable par nos artisans partenaires.',
        price: '15 000 FCFA',
        stock: '25 unités',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80'
      }
    }
  ];

  // Catalogue de produits
  products = [
    {
      id: 'prod-1',
      name: 'Sac artisanal en cuir',
      category: 'Artisanat',
      description: 'Sac fait main en cuir véritable par nos artisans partenaires.',
      price: '15 000 FCFA',
      stock: '25 unités disponibles',
      status: 'En Stock',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'prod-2',
      name: 'Bazin Riche Gangnerie (3m)',
      category: 'Mode',
      description: 'Bazin de très haute qualité disponible en plusieurs coloris.',
      price: '35 000 FCFA',
      stock: '10 unités disponibles',
      status: 'En Stock',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80'
    }
  ];

  // Liste des membres
  members = [
    {
      id: 'mem-1',
      name: 'Mamadou Diallo',
      role: 'Importateur & Grossiste',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isAdmin: true
    },
    {
      id: 'mem-2',
      name: 'Aïssata Traoré',
      role: 'Commerçante',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      isAdmin: false
    },
    {
      id: 'mem-3',
      name: 'Ibrahima Koné',
      role: 'Fournisseur Local',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isAdmin: false
    }
  ];

  // CORRIGÉ : router est maintenant injecté directement dans le constructeur
  constructor(
    private cdr: ChangeDetectorRef,
    private location: Location,
    private router: Router
  ) {}

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

    // Ajout local du post créé dans la liste
    this.posts.unshift({
      id: `post-${Date.now()}`,
      author: this.community.admin,
      authorAvatar: this.community.icon,
      isAdmin: true,
      time: 'À l\'instant',
      content: postData.content,
      image: postData.image || null,
      likes: 0,
      comments: 0,
      liked: false,
      product: null
    });
    this.community.posts++;
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
      stock: `${productData.stock} unités disponibles`,
      status: 'En Stock',
      image: productData.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80'
    });
    this.community.products++;
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