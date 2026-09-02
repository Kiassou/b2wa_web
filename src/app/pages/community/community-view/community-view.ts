import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Community, CommunityService } from '../../../services/community.service';
import {
  CommunityContentService,
  Post,
  Product,
  Live,
  Member
} from '../../../services/community-content.service';

type CommunityTab = 'home' | 'posts' | 'products' | 'lives' | 'members';

@Component({
  selector: 'app-community-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './community-view.html',
  styleUrl: './community-view.css'
})
export class CommunityViewComponent {
  // ============================================================
  // COMMUNITY
  // ============================================================

  communityId = '';
  community: Community | null = null;

  // ============================================================
  // ACTIVE TAB
  // ============================================================

  activeTab: CommunityTab = 'home';

  // ============================================================
  // POSTS, PRODUCTS, LIVES, MEMBERS
  // ============================================================

  posts: Post[] = [];
  products: Product[] = [];
  lives: Live[] = [];
  members: Member[] = [];

  upcomingLives: Live[] = [];

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private communityService: CommunityService,
    private contentService: CommunityContentService,
    private cdr: ChangeDetectorRef
  ) {}

  // ============================================================
  // INIT
  // ============================================================

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
    this.lives = content.lives;
    this.members = content.members;
    this.upcomingLives = content.lives; // ou un sous-ensemble si tu veux
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  setActiveTab(tab: CommunityTab): void {
    this.activeTab = tab;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.cdr.markForCheck();
  }

  goBack(): void {
    this.router.navigate(['/dashboard/community']);
  }

  // ============================================================
  // COMMUNITY
  // ============================================================

  joinCommunity(): void {
    if (!this.community) return;
    if (this.community.isMember) return;

    const joined = this.communityService.joinCommunity(this.community.id);
    if (joined) {
      this.community = this.communityService.getCommunityById(this.community.id) || null;
      this.cdr.markForCheck();
    }
  }

  leaveCommunity(): void {
    if (!this.community) return;
    if (!this.community.isMember) return;

    const left = this.communityService.leaveCommunity(this.community.id);
    if (left) {
      this.community = this.communityService.getCommunityById(this.community.id) || null;
      this.cdr.markForCheck();
    }
  }

  shareCommunity(): void {
    if (!this.community) return;

    const shareData = {
      title: `Communauté B2WA - ${this.community.name}`,
      text: `Découvrez la communauté "${this.community.name}" sur B2WA.`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
      return;
    }

    navigator.clipboard?.writeText(window.location.href);
    console.log('Lien de la communauté copié.');
  }

  // ============================================================
  // POSTS
  // ============================================================

  toggleLike(post: Post): void {
    if (post.isLiked) {
      post.likes--;
      post.isLiked = false;
    } else {
      post.likes++;
      post.isLiked = true;
    }
    this.cdr.markForCheck();
  }

  openComments(post: Post): void {
    console.log('Ouverture des commentaires du post :', post.id);
  }

  sharePost(post: Post): void {
    const shareData = {
      title: post.title,
      text: post.content,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => {
          post.shares++;
          this.cdr.markForCheck();
        })
        .catch(() => {});
      return;
    }

    navigator.clipboard?.writeText(window.location.href);
    post.shares++;
    console.log('Lien de la publication copié.');
    this.cdr.markForCheck();
  }

  // ============================================================
  // PRODUCTS
  // ============================================================

  viewProduct(product: Product): void {
    console.log('Consultation du produit :', product);
  }

  // ============================================================
  // LIVE
  // ============================================================

  reserveLive(live: Live): void {
    if (live.isReserved) {
      live.isReserved = false;
      live.reservations--;
      this.cdr.markForCheck();
      return;
    }

    if (live.reservations >= live.capacity) {
      console.log('Ce live est complet.');
      return;
    }

    live.isReserved = true;
    live.reservations++;
    console.log(`Place réservée pour : ${live.title}`);
    this.cdr.markForCheck();
  }

  // ============================================================
  // FORMAT NUMBER
  // ============================================================

  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value);
  }
}