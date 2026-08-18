import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';


@Component({
  selector: 'app-manage-community',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './manage-community.html',
  styleUrl: './manage-community.css'
})
export class ManageCommunityComponent implements OnInit {

  /* =====================================================
     COMMUNITY
  ====================================================== */

  communityId = '';

  community = {
    id: 1,

    name: 'Commerce Mali',
    icon: '🛍️',

    category: 'Commerce',

    description:
      'Une communauté dédiée aux commerçants et entrepreneurs maliens.',

    longDescription:
      'Commerce Mali rassemble les acteurs du commerce au Mali afin de partager leurs produits, leurs actualités et leurs opportunités.',

    cover:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80',

    members: 1248,
    posts: 86,
    products: 42,
    lives: 8,

    verified: true,

    createdAt: '12 août 2026'
  };


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
     MEMBERS
  ====================================================== */

  members = [

    {
      id: 1,
      name: 'Aminata Traoré',
      avatar: 'https://i.pravatar.cc/150?img=47',
      role: 'Membre',
      joinedAt: '15 août 2026'
    },

    {
      id: 2,
      name: 'Moussa Diarra',
      avatar: 'https://i.pravatar.cc/150?img=12',
      role: 'Membre',
      joinedAt: '14 août 2026'
    },

    {
      id: 3,
      name: 'Fatoumata Coulibaly',
      avatar: 'https://i.pravatar.cc/150?img=32',
      role: 'Membre',
      joinedAt: '13 août 2026'
    },

    {
      id: 4,
      name: 'Ibrahim Konaté',
      avatar: 'https://i.pravatar.cc/150?img=11',
      role: 'Membre',
      joinedAt: '12 août 2026'
    },

    {
      id: 5,
      name: 'Oumar Keita',
      avatar: 'https://i.pravatar.cc/150?img=68',
      role: 'Membre',
      joinedAt: '11 août 2026'
    }

  ];


  /* =====================================================
     POSTS
  ====================================================== */

  posts = [

    {
      id: 1,

      title:
        'Nouvelle collection disponible',

      content:
        'Découvrez notre nouvelle sélection de produits disponibles cette semaine.',

      date:
        '17 août 2026',

      likes: 42,
      comments: 8,

      status: 'Publié'
    },

    {
      id: 2,

      title:
        'Bienvenue dans Commerce Mali',

      content:
        'Bienvenue à tous les nouveaux membres de notre communauté.',

      date:
        '15 août 2026',

      likes: 31,
      comments: 5,

      status: 'Publié'
    },

    {
      id: 3,

      title:
        'Informations importantes',

      content:
        'Retrouvez ici toutes les informations importantes concernant nos activités.',

      date:
        '13 août 2026',

      likes: 18,
      comments: 3,

      status: 'Publié'
    }

  ];


  /* =====================================================
     PRODUCTS
  ====================================================== */

  products = [

    {
      id: 1,

      name:
        'Sac artisanal malien',

      category:
        'Artisanat',

      price:
        '25 000 FCFA',

      stock:
        18,

      status:
        'Publié',

      image:
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80'
    },

    {
      id: 2,

      name:
        'Boubou traditionnel',

      category:
        'Mode',

      price:
        '45 000 FCFA',

      stock:
        7,

      status:
        'Publié',

      image:
        'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=700&q=80'
    },

    {
      id: 3,

      name:
        'Panier artisanal',

      category:
        'Artisanat',

      price:
        '12 500 FCFA',

      stock:
        25,

      status:
        'Publié',

      image:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=80'
    }

  ];


  /* =====================================================
     LIVES
  ====================================================== */

  lives = [

    {
      id: 1,

      title:
        'Les nouveautés du commerce malien',

      date:
        '22 août 2026',

      time:
        '20:00',

      duration:
        '60 minutes',

      reservations:
        42,

      capacity:
        100,

      status:
        'Programmé',

      link:
        'https://b2wa.com/live/B2WA-COMMERCE01'
    },

    {
      id: 2,

      title:
        'Rencontre avec les entrepreneurs',

      date:
        '29 août 2026',

      time:
        '18:30',

      duration:
        '90 minutes',

      reservations:
        27,

      capacity:
        80,

      status:
        'Programmé',

      link:
        'https://b2wa.com/live/B2WA-COMMERCE02'
    }

  ];


  /* =====================================================
     COMMUNITY INFORMATION FORM
  ====================================================== */

  communityForm = {

    name:
      this.community.name,

    category:
      this.community.category,

    description:
      this.community.description,

    longDescription:
      this.community.longDescription
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

  pendingAction:
    | (() => void)
    | null = null;


  /* =====================================================
     SUCCESS MODAL
  ====================================================== */

  showSuccessModal = false;

  successTitle = '';

  successMessage = '';


  /* =====================================================
     INIT
  ====================================================== */

  ngOnInit(): void {

    this.communityId =
      this.route.snapshot.paramMap.get('id') ?? '';

  }


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}


  /* =====================================================
     NAVIGATION
  ====================================================== */

  goBack(): void {

    this.router.navigate([
      '/dashboard/community',
      this.community.id
    ]);

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

  }


  /* =====================================================
     SAVE COMMUNITY
  ====================================================== */

  saveCommunityInformation(): void {

    this.community.name =
      this.communityForm.name;

    this.community.category =
      this.communityForm.category;

    this.community.description =
      this.communityForm.description;

    this.community.longDescription =
      this.communityForm.longDescription;


    this.openSuccess(
      'Informations mises à jour',
      'Les informations de votre communauté ont été enregistrées avec succès.'
    );

  }


  /* =====================================================
     MEMBER ACTIONS
  ====================================================== */

  removeMember(member: any): void {

    this.openConfirmation(

      'Retirer ce membre ?',

      `Voulez-vous vraiment retirer ${member.name} de cette communauté ? Cette personne ne pourra plus accéder aux contenus réservés aux membres.`,

      'Retirer',

      'danger',

      () => {

        this.members =
          this.members.filter(
            item => item.id !== member.id
          );

        this.community.members--;

        this.openSuccess(
          'Membre retiré',
          `${member.name} a été retiré de la communauté.`
        );

      }

    );

  }


  /* =====================================================
     POST ACTIONS
  ====================================================== */

  deletePost(post: any): void {

    this.openConfirmation(

      'Supprimer cette publication ?',

      'Cette publication sera définitivement supprimée de votre communauté.',

      'Supprimer',

      'danger',

      () => {

        this.posts =
          this.posts.filter(
            item => item.id !== post.id
          );

        this.community.posts--;

        this.openSuccess(
          'Publication supprimée',
          'La publication a été supprimée avec succès.'
        );

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

      }

    );

  }


  /* =====================================================
     PRODUCT ACTIONS
  ====================================================== */

  deleteProduct(product: any): void {

    this.openConfirmation(

      'Supprimer ce produit ?',

      `Le produit "${product.name}" sera retiré de votre communauté.`,

      'Supprimer',

      'danger',

      () => {

        this.products =
          this.products.filter(
            item => item.id !== product.id
          );

        this.community.products--;

        this.openSuccess(
          'Produit supprimé',
          'Le produit a été supprimé de votre communauté.'
        );

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

      }

    );

  }


  /* =====================================================
     LIVE ACTIONS
  ====================================================== */

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

        this.lives =
          this.lives.filter(
            item => item.id !== live.id
          );

        this.community.lives--;

        this.openSuccess(
          'Live supprimé',
          'Le Live a été supprimé.'
        );

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


  /* =====================================================
     SETTINGS
  ====================================================== */

  saveSettings(): void {

    this.openSuccess(
      'Paramètres enregistrés',
      'Les paramètres de votre communauté ont été mis à jour.'
    );

  }


  /* =====================================================
     DELETE COMMUNITY
  ====================================================== */

  deleteCommunity(): void {

    this.openConfirmation(

      'Supprimer la communauté ?',

      'Cette action est définitive. Toutes les publications, produits, lives et données associées à cette communauté seront supprimés.',

      'Supprimer définitivement',

      'danger',

      () => {

        this.router.navigate([
          '/dashboard/community'
        ]);

      }

    );

  }


  /* =====================================================
     CONFIRMATION
  ====================================================== */

  openConfirmation(
    title: string,
    message: string,
    buttonText: string,
    buttonClass: string,
    action: () => void
  ): void {

    this.confirmTitle =
      title;

    this.confirmMessage =
      message;

    this.confirmButtonText =
      buttonText;

    this.confirmButtonClass =
      buttonClass;

    this.pendingAction =
      action;

    this.showConfirmModal =
      true;

  }


  confirmAction(): void {

    if (this.pendingAction) {

      const action =
        this.pendingAction;

      this.closeConfirmModal();

      action();

    }

  }


  closeConfirmModal(): void {

    this.showConfirmModal =
      false;

    this.pendingAction =
      null;

  }


  /* =====================================================
     SUCCESS
  ====================================================== */

  openSuccess(
    title: string,
    message: string
  ): void {

    this.successTitle =
      title;

    this.successMessage =
      message;

    this.showSuccessModal =
      true;

  }


  closeSuccess(): void {

    this.showSuccessModal =
      false;

  }


  /* =====================================================
     HELPERS
  ====================================================== */

  get filteredMembers(): any[] {

    const search =
      this.memberSearch
        .toLowerCase()
        .trim();

    if (!search) {
      return this.members;
    }

    return this.members.filter(
      member =>
        member.name
          .toLowerCase()
          .includes(search)
    );

  }


  get filteredPosts(): any[] {

    const search =
      this.postSearch
        .toLowerCase()
        .trim();

    if (!search) {
      return this.posts;
    }

    return this.posts.filter(
      post =>
        post.title
          .toLowerCase()
          .includes(search)
    );

  }


  get filteredProducts(): any[] {

    const search =
      this.productSearch
        .toLowerCase()
        .trim();

    if (!search) {
      return this.products;
    }

    return this.products.filter(
      product =>
        product.name
          .toLowerCase()
          .includes(search)
    );

  }

}