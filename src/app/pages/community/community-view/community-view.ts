import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

type CommunityTab =
  | 'home'
  | 'posts'
  | 'products'
  | 'lives'
  | 'members';

interface Community {
  id: number;
  name: string;
  icon: string;
  cover: string;
  category: string;
  admin: string;
  description: string;
  longDescription: string;
  members: number;
  posts: number;
  products: number;
  lives: number;
  verified: boolean;
  isMember: boolean;
  createdAt: string;
}

interface Post {
  id: number;
  author: string;
  authorInitial: string;
  date: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
  badge?: string;
}

interface Live {
  id: number;
  title: string;
  description: string;
  cover: string;
  date: string;
  time: string;
  reservations: number;
  capacity: number;
  isReserved: boolean;
}

interface Member {
  id: number;
  name: string;
  role: string;
  avatar: string;
  isAdmin: boolean;
}

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

  community: Community = {
    id: 1,

    name: 'Mode & Élégance Mali',

    icon: '👗',

    cover:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',

    category: 'Mode & Beauté',

    admin: 'Aminata Traoré',

    description:
      'Une communauté dédiée à la mode, à la beauté et aux tendances africaines.',

    longDescription:
      'Mode & Élégance Mali rassemble des passionnés de mode, des créateurs, des commerçants et des amateurs de beauté autour des tendances africaines. Découvrez les nouvelles collections, échangez avec les membres et découvrez les produits proposés par l’administratrice de la communauté.',

    members: 1248,

    posts: 86,

    products: 34,

    lives: 8,

    verified: true,

    isMember: false,

    createdAt: '12 mars 2026'
  };


  // ============================================================
  // ACTIVE TAB
  // ============================================================

  activeTab: CommunityTab = 'home';


  // ============================================================
  // POSTS
  // ============================================================

  posts: Post[] = [

    {
      id: 1,

      author: 'Aminata Traoré',

      authorInitial: 'AT',

      date: 'Il y a 2 heures',

      title:
        'Nouvelle collection disponible',

      content:
        'Notre nouvelle collection inspirée du textile africain est maintenant disponible. Découvrez les nouvelles pièces et partagez vos coups de cœur avec la communauté.',

      image:
        'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=80',

      likes: 42,

      comments: 8,

      shares: 5,

      isLiked: false
    },


    {
      id: 2,

      author: 'Aminata Traoré',

      authorInitial: 'AT',

      date: 'Hier',

      title:
        'Conseils pour choisir son tissu',

      content:
        'Quelques conseils simples pour bien choisir son tissu selon le type de vêtement que vous souhaitez réaliser.',

      image:
        'https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=1200&q=80',

      likes: 67,

      comments: 14,

      shares: 9,

      isLiked: false
    },


    {
      id: 3,

      author: 'Aminata Traoré',

      authorInitial: 'AT',

      date: 'Il y a 3 jours',

      title:
        'Merci à toute la communauté',

      content:
        'Nous sommes maintenant plus de 1 200 membres. Merci à tous pour votre participation et votre confiance.',

      likes: 91,

      comments: 21,

      shares: 13,

      isLiked: false
    },


    {
      id: 4,

      author: 'Aminata Traoré',

      authorInitial: 'AT',

      date: 'Il y a 5 jours',

      title:
        'Préparation de notre prochain live',

      content:
        'Nous préparons un nouveau live consacré aux tendances mode de cette saison. Pensez à réserver votre place.',

      image:
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',

      likes: 54,

      comments: 11,

      shares: 7,

      isLiked: false
    }

  ];


  // ============================================================
  // PRODUCTS
  // ============================================================

  products: Product[] = [

    {
      id: 1,

      name: 'Robe Wax Élégance',

      category: 'Mode',

      description:
        'Robe moderne confectionnée avec un tissu wax premium.',

      price: '35 000 FCFA',

      image:
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',

      badge: 'Nouveau'
    },


    {
      id: 2,

      name: 'Ensemble Bazin Premium',

      category: 'Mode',

      description:
        'Ensemble élégant en bazin pour vos cérémonies.',

      price: '55 000 FCFA',

      image:
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',

      badge: 'Populaire'
    },


    {
      id: 3,

      name: 'Sac artisanal Mali',

      category: 'Accessoires',

      description:
        'Sac artisanal fabriqué localement avec des matériaux de qualité.',

      price: '18 500 FCFA',

      image:
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'
    }

  ];


  // ============================================================
  // LIVES
  // ============================================================

  upcomingLives: Live[] = [

    {
      id: 1,

      title:
        'Les tendances mode 2026',

      description:
        'Découvrez les nouvelles tendances et échangez avec notre communauté.',

      cover:
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',

      date:
        'Samedi 22 août 2026',

      time:
        '19:00',

      reservations:
        87,

      capacity:
        150,

      isReserved:
        false
    },


    {
      id: 2,

      title:
        'Créer sa marque de mode',

      description:
        'Une discussion avec plusieurs entrepreneurs du secteur de la mode.',

      cover:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',

      date:
        'Vendredi 28 août 2026',

      time:
        '18:30',

      reservations:
        52,

      capacity:
        120,

      isReserved:
        false
    }

  ];


  // ============================================================
  // MEMBERS
  // ============================================================

  members: Member[] = [

    {
      id: 1,

      name: 'Aminata Traoré',

      role: 'Administrateur',

      avatar:
        'https://i.pravatar.cc/150?img=47',

      isAdmin: true
    },


    {
      id: 2,

      name: 'Fatoumata Diallo',

      role: 'Membre',

      avatar:
        'https://i.pravatar.cc/150?img=32',

      isAdmin: false
    },


    {
      id: 3,

      name: 'Moussa Coulibaly',

      role: 'Membre',

      avatar:
        'https://i.pravatar.cc/150?img=12',

      isAdmin: false
    },


    {
      id: 4,

      name: 'Awa Konaté',

      role: 'Membre',

      avatar:
        'https://i.pravatar.cc/150?img=44',

      isAdmin: false
    },


    {
      id: 5,

      name: 'Ibrahim Traoré',

      role: 'Membre',

      avatar:
        'https://i.pravatar.cc/150?img=11',

      isAdmin: false
    },


    {
      id: 6,

      name: 'Mariama Sidibé',

      role: 'Membre',

      avatar:
        'https://i.pravatar.cc/150?img=45',

      isAdmin: false
    }

  ];


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.community.id =
        Number(id);

    }

  }


  // ============================================================
  // NAVIGATION
  // ============================================================

  setActiveTab(
    tab: CommunityTab
  ): void {

    this.activeTab = tab;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  goBack(): void {

    this.router.navigate([
      '/dashboard/community'
    ]);

  }


  // ============================================================
  // COMMUNITY
  // ============================================================

  joinCommunity(): void {

    if (this.community.isMember) {
      return;
    }

    this.community.isMember = true;

    this.community.members++;

    console.log(
      `Vous avez rejoint ${this.community.name}`
    );

  }


  leaveCommunity(): void {

    if (!this.community.isMember) {
      return;
    }

    this.community.isMember = false;

    this.community.members--;

    console.log(
      `Vous avez quitté ${this.community.name}`
    );

  }


  shareCommunity(): void {

    const shareData = {

      title:
        `Communauté B2WA - ${this.community.name}`,

      text:
        `Découvrez la communauté "${this.community.name}" sur B2WA.`,

      url:
        window.location.href

    };


    if (
      navigator.share
    ) {

      navigator.share(shareData)
        .catch(() => {});

      return;

    }


    navigator.clipboard
      ?.writeText(window.location.href);

    console.log(
      'Lien de la communauté copié.'
    );

  }


  // ============================================================
  // POSTS
  // ============================================================

  toggleLike(
    post: Post
  ): void {

    if (post.isLiked) {

      post.likes--;

      post.isLiked = false;

    } else {

      post.likes++;

      post.isLiked = true;

    }

  }


  openComments(
    post: Post
  ): void {

    console.log(
      'Ouverture des commentaires du post :',
      post.id
    );

    /*
      Plus tard :

      ouvrir un modal :

      - liste des commentaires
      - champ commentaire
      - bouton publier
      - réponses
      - likes commentaires
    */

  }


  sharePost(
    post: Post
  ): void {

    const shareData = {

      title:
        post.title,

      text:
        post.content,

      url:
        window.location.href

    };


    if (
      navigator.share
    ) {

      navigator.share(shareData)
        .then(() => {

          post.shares++;

        })
        .catch(() => {});

      return;

    }


    navigator.clipboard
      ?.writeText(window.location.href);

    post.shares++;

    console.log(
      'Lien de la publication copié.'
    );

  }


  // ============================================================
  // PRODUCTS
  // ============================================================

  viewProduct(
    product: Product
  ): void {

    console.log(
      'Consultation du produit :',
      product
    );

    /*
      Plus tard :

      router.navigate([
        '/dashboard/products',
        product.id
      ]);
    */

  }


  // ============================================================
  // LIVE
  // ============================================================

  reserveLive(
    live: Live
  ): void {

    if (live.isReserved) {

      live.isReserved = false;

      live.reservations--;

      return;

    }


    if (
      live.reservations >= live.capacity
    ) {

      console.log(
        'Ce live est complet.'
      );

      return;

    }


    live.isReserved = true;

    live.reservations++;

    console.log(
      `Place réservée pour : ${live.title}`
    );

  }


  // ============================================================
  // FORMAT NUMBER
  // ============================================================

  formatNumber(
    value: number
  ): string {

    return new Intl.NumberFormat(
      'fr-FR'
    ).format(value);

  }

}