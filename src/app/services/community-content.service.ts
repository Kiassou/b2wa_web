import { Injectable } from '@angular/core';
import { FlashSaleStoreService } from './flash-sale-store.service';

export interface Post {
  id: string;
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

  // Champs nécessaires pour ton template actuel
  liked?: boolean;
  product?: {
    name: string;
    description: string;
    price: string;
    stock: string;
    image: string;
  };

  // Champs utilisés dans community-detail.html
  authorAvatar?: string;
  isAdmin?: boolean;
  time?: string;

  // NOUVEAU : type de post (normal ou flash-sale)
  type?: 'normal' | 'flash-sale';

  // NOUVEAU : lien vers la vente flash (optionnel)
  flashSaleId?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
  badge?: string;

  // Champs nécessaires pour ton template actuel
  status?: string;
  stock?: string;
}

export interface Live {
  id: string;
  title: string;
  description: string;
  cover: string;
  date: string;
  time: string;
  reservations: number;
  capacity: number;
  isReserved: boolean;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isAdmin: boolean;
}

export interface CommunityContent {
  posts: Post[];
  products: Product[];
  lives: Live[];
  members: Member[];
}

@Injectable({
  providedIn: 'root'
})
export class CommunityContentService {
  constructor(private flashSaleStore: FlashSaleStoreService) {}

  // ============================================================
  // STOCKAGE INTERNE DES POSTS "FLASH" PAR COMMUNAUTÉ
  // ============================================================
  private flashPostsByCommunity = new Map<string, Post[]>();

  // ============================================================
  // CONTENU PAR COMMUNAUTÉ
  // ============================================================
  getContentForCommunity(communityId: string): CommunityContent {
    // 1️⃣ S'assurer que les posts flash sont synchronisés
    this.syncFlashSalesToPosts(communityId);

    // 2️⃣ Récupérer le contenu de base (posts "normaux")
    const baseContent = this.getBaseContentForCommunity(communityId);

    // 3️⃣ Ajouter les posts flash (s'ils existent) devant les posts normaux
    const flashPosts = this.flashPostsByCommunity.get(communityId) || [];

    return {
      posts: [...flashPosts, ...baseContent.posts],
      products: baseContent.products,
      lives: baseContent.lives,
      members: baseContent.members
    };
  }

  /**
   * Synchronise les ventes flash d'une communauté vers les posts.
   * Crée un post par vente flash qui n'a pas encore de post associé.
   */
  syncFlashSalesToPosts(communityId: string): void {
    const flashSales = this.flashSaleStore.getByCommunity(communityId);

    // Initialiser le tableau de posts flash si besoin
    if (!this.flashPostsByCommunity.has(communityId)) {
      this.flashPostsByCommunity.set(communityId, []);
    }

    const flashPosts = this.flashPostsByCommunity.get(communityId)!;

    // IDs des ventes flash déjà transformées en posts
    const existingFlashPostIds = new Set(
      flashPosts
        .filter(p => p.flashSaleId !== undefined)
        .map(p => p.flashSaleId!)
    );

    flashSales.forEach(sale => {
      if (existingFlashPostIds.has(sale.id)) {
        return; // post déjà créé pour cette vente
      }

      const discount = Math.round(
        (1 - sale.flashPrice / sale.originalPrice) * 100
      );

      const newPost: Post = {
        id: `post-flash-${sale.id}`,
        author: sale.communityName,
        authorInitial: sale.communityName.slice(0, 2).toUpperCase(),
        date: 'À l\'instant',
        title: '🔥 Vente Flash',
        content: `Vente flash sur ${sale.productName} : -${discount}%`,
        image: sale.productImage,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        liked: false,
        type: 'flash-sale',
        flashSaleId: sale.id,
        product: {
          name: sale.productName,
          description: sale.description,
          price: `${new Intl.NumberFormat('fr-FR').format(sale.flashPrice)} FCFA`,
          stock: `${sale.quantity} unités`,
          image: sale.productImage
        }
      };

      flashPosts.unshift(newPost);
    });
  }

  /**
   * Ajoute un post (ex: vente flash) dans une communauté.
   * À appeler quand on crée une vente flash pour qu'elle apparaisse
   * comme publication dans le fil de la communauté.
   */
  addPostToCommunity(communityId: string, post: Post): void {
    const content = this.getBaseContentForCommunity(communityId);
    content.posts.unshift(post);
    // Si un jour tu persistes le contenu (localStorage / backend),
    // c'est ici qu'il faudra sauvegarder.
  }

  // ============================================================
  // CONTENU DE BASE (SANS POSTS FLASH)
  // ============================================================
  private getBaseContentForCommunity(communityId: string): CommunityContent {
    switch (communityId) {
      case 'comm-1':
        return this.getAgricultureContent();
      case 'comm-2':
        return this.getElectronicsContent();
      case 'comm-3':
        return this.getImportExportContent();
      case 'comm-4':
        return this.getFashionContent();
      case 'comm-5':
        return this.getLogisticsContent();
      case 'comm-6':
        return this.getConstructionContent();
      default:
        return this.getEmptyContent();
    }
  }

  private getEmptyContent(): CommunityContent {
    return { posts: [], products: [], lives: [], members: [] };
  }

  // ... (toutes tes méthodes getAgricultureContent, getElectronicsContent, etc. restent inchangées)
  private getAgricultureContent(): CommunityContent {
    return {
      posts: [
        {
          id: 'ag-post-1',
          author: 'Moussa Diarra',
          authorInitial: 'MD',
          date: 'Il y a 3 heures',
          title: 'Arrivage de maïs jaune – qualité premium',
          content:
            'Nous venons de recevoir un nouveau lot de maïs jaune de qualité premium, disponible en sacs de 50 kg. Prix de gros intéressant pour les revendeurs.',
          image:
            'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80',
          likes: 12,
          comments: 3,
          shares: 2,
          isLiked: false,
          liked: false,
          product: null as any,
          type: 'normal'
        },
        {
          id: 'ag-post-2',
          author: 'Fatoumata Koné',
          authorInitial: 'FK',
          date: 'Hier',
          title: 'Recherche fournisseurs de riz local',
          content:
            'Je suis à la recherche de fournisseurs sérieux de riz local (variétés du Mali et du Sénégal). Merci de me contacter en MP avec vos tarifs et quantités disponibles.',
          likes: 8,
          comments: 5,
          shares: 1,
          isLiked: false,
          liked: false,
          product: null as any,
          type: 'normal'
        }
      ],
      products: [
        {
          id: 'ag-prod-1',
          name: 'Maïs jaune – sac 50 kg',
          category: 'Céréales',
          description:
            'Maïs jaune de qualité premium, idéal pour l\'alimentation animale et la transformation.',
          price: '18 000 FCFA',
          image:
            'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
          status: 'En Stock',
          stock: '50 unités disponibles'
        },
        {
          id: 'ag-prod-2',
          name: 'Riz local – sac 25 kg',
          category: 'Céréales',
          description:
            'Riz local produit au Mali, grain entier, peu de brisures. Disponible en gros.',
          price: '12 500 FCFA',
          image:
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
          status: 'En Stock',
          stock: '30 unités disponibles'
        }
      ],
      lives: [],
      members: [
        {
          id: 'ag-mem-1',
          name: 'Moussa Diarra',
          role: 'Producteur de céréales',
          avatar: 'https://i.pravatar.cc/100?img=12',
          isAdmin: true
        },
        {
          id: 'ag-mem-2',
          name: 'Fatoumata Koné',
          role: 'Négociante en produits agricoles',
          avatar: 'https://i.pravatar.cc/100?img=32',
          isAdmin: false
        },
        {
          id: 'ag-mem-3',
          name: 'Ibrahim Traoré',
          role: 'Exportateur',
          avatar: 'https://i.pravatar.cc/100?img=47',
          isAdmin: false
        }
      ]
    };
  }

  private getElectronicsContent(): CommunityContent {
    return {
      posts: [
        {
          id: 'el-post-1',
          author: 'Tech Distribution',
          authorInitial: 'TD',
          date: 'Il y a 2 heures',
          title: 'Nouvel arrivage : iPhone reconditionnés grade A',
          content:
            'Nous venons de recevoir un lot d\'iPhone reconditionnés grade A (batterie > 90%). Modèles : 11, 12, 13. Prix de gros disponibles sur demande.',
          image:
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
          likes: 24,
          comments: 7,
          shares: 5,
          isLiked: false,
          liked: false,
          product: null as any,
          type: 'normal'
        },
        {
          id: 'el-post-2',
          author: 'Mamadou Cissé',
          authorInitial: 'MC',
          date: 'Il y a 2 jours',
          title: 'Recherche grossistes en accessoires smartphones',
          content:
            'Je cherche des fournisseurs sérieux en coques, chargeurs et écouteurs pour smartphones. Merci de partager vos catalogues en MP.',
          likes: 11,
          comments: 9,
          shares: 2,
          isLiked: false,
          liked: false,
          product: null as any,
          type: 'normal'
        }
      ],
      products: [
        {
          id: 'el-prod-1',
          name: 'iPhone 12 reconditionné – 128 Go',
          category: 'Smartphones',
          description:
            'iPhone 12 reconditionné grade A, batterie 92%, garanti 6 mois. Disponible en noir, blanc et bleu.',
          price: '210 000 FCFA',
          image:
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
          status: 'En Stock',
          stock: '15 unités disponibles'
        },
        {
          id: 'el-prod-2',
          name: 'Lot de 50 coques iPhone 13',
          category: 'Accessoires',
          description:
            'Lot de 50 coques de protection pour iPhone 13, modèles variés (silicone, rigide, transparent).',
          price: '75 000 FCFA',
          image:
            'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=600&q=80',
          status: 'En Stock',
          stock: '5 lots disponibles'
        },
        {
          id: 'el-prod-3',
          name: 'Écouteurs sans fil TWS',
          category: 'Accessoires',
          description:
            'Écouteurs Bluetooth TWS avec boîte de charge, autonomie 4h, micro intégré. Qualité sonore correcte pour le prix.',
          price: '7 500 FCFA',
          image:
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
          status: 'En Stock',
          stock: '40 unités disponibles'
        }
      ],
      lives: [],
      members: [
        {
          id: 'el-mem-1',
          name: 'Tech Distribution',
          role: 'Grossiste en électronique',
          avatar: 'https://i.pravatar.cc/100?img=5',
          isAdmin: true
        },
        {
          id: 'el-mem-2',
          name: 'Mamadou Cissé',
          role: 'Revendeur de smartphones',
          avatar: 'https://i.pravatar.cc/100?img=18',
          isAdmin: false
        },
        {
          id: 'el-mem-3',
          name: 'Aïcha Diallo',
          role: 'Importatrice d\'accessoires',
          avatar: 'https://i.pravatar.cc/100?img=25',
          isAdmin: false
        }
      ]
    };
  }

  private getImportExportContent(): CommunityContent {
    return {
      posts: [
        {
          id: 'ie-post-1',
          author: 'West Africa Import',
          authorInitial: 'WI',
          date: 'Il y a 5 heures',
          title: 'Retour d\'expérience : commande chez Shenzhen Electronics',
          content:
            'Je viens de recevoir ma 3ème commande chez Shenzhen Electronics. Délai respecté (35 jours), qualité conforme. Je partage mes contacts en MP pour ceux qui veulent se lancer.',
          image:
            'https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=1200&q=80',
          likes: 47,
          comments: 18,
          shares: 9,
          isLiked: false,
          liked: false,
          product: null as any,
          type: 'normal'
        },
        {
          id: 'ie-post-2',
          author: 'Aminata Bâ',
          authorInitial: 'AB',
          date: 'Il y a 1 jour',
          title: 'Conseils pour éviter les arnaques sur Alibaba',
          content:
            'Après plusieurs mauvaises expériences, voici mes conseils : vérifier les avis, demander des échantillons, utiliser Alibaba Trade Assurance. N\'hésitez pas à partager vos propres tips.',
          likes: 63,
          comments: 22,
          shares: 14,
          isLiked: false,
          liked: false,
          product: null as any,
          type: 'normal'
        }
      ],
      products: [
        {
          id: 'ie-prod-1',
          name: 'Service de sourcing Chine – Afrique',
          category: 'Services',
          description:
            'Accompagnement complet pour vos achats en Chine : recherche de fournisseurs, négociation, contrôle qualité, expédition.',
          price: 'Sur devis',
          image:
            'https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=600&q=80',
          status: 'Disponible',
          stock: 'Sur demande'
        },
        {
          id: 'ie-prod-2',
          name: 'Conteneur 20 pieds – groupage',
          category: 'Logistique',
          description:
            'Places disponibles dans un conteneur 20 pieds au départ de Guangzhou vers Abidjan. Départ prévu fin du mois.',
          price: 'Sur demande',
          image:
            'https://images.unsplash.com/photo-1494412574643-35d32468817e?auto=format&fit=crop&w=600&q=80',
          status: 'Disponible',
          stock: 'Quelques places'
        }
      ],
      lives: [],
      members: [
        {
          id: 'ie-mem-1',
          name: 'West Africa Import',
          role: 'Importateur grossiste',
          avatar: 'https://i.pravatar.cc/100?img=7',
          isAdmin: true
        },
        {
          id: 'ie-mem-2',
          name: 'Aminata Bâ',
          role: 'Consultante en import-export',
          avatar: 'https://i.pravatar.cc/100?img=21',
          isAdmin: false
        },
        {
          id: 'ie-mem-3',
          name: 'Karim Sylla',
          role: 'Transitaire',
          avatar: 'https://i.pravatar.cc/100?img=35',
          isAdmin: false
        }
      ]
    };
  }

  private getFashionContent(): CommunityContent {
    return {
      posts: [
        {
          id: 'fa-post-1',
          author: 'Fashion West Africa',
          authorInitial: 'FW',
          date: 'Il y a 4 heures',
          title: 'Nouvelle collection bazin riche – gros disponible',
          content:
            'Notre nouvelle collection de bazin riche est arrivée : motifs exclusifs, couleurs tendance. Disponible en gros (minimum 5 pièces par modèle).',
          image:
            'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
          likes: 38,
          comments: 12,
          shares: 7,
          isLiked: false,
          liked: false,
          product: null as any,
          type: 'normal'
        },
        {
          id: 'fa-post-2',
          author: 'Awa Touré',
          authorInitial: 'AT',
          date: 'Il y a 2 jours',
          title: 'Recherche ateliers de confection à Bamako',
          content:
            'Je cherche des ateliers de confection capables de produire en petite série (50–100 pièces) avec un bon rapport qualité/prix. Merci pour vos recommandations.',
          likes: 21,
          comments: 15,
          shares: 4,
          isLiked: false,
          liked: false,
          product: null as any,
          type: 'normal'
        }
      ],
      products: [
        {
          id: 'fa-prod-1',
          name: 'Bazin riche gangnerie – 3 m',
          category: 'Tissus',
          description:
            'Bazin de très haute qualité, motifs gangnerie, disponible en plusieurs coloris. Idéal pour tenues de luxe.',
          price: '35 000 FCFA',
          image:
            'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
          status: 'En Stock',
          stock: '20 pièces disponibles'
        },
        {
          id: 'fa-prod-2',
          name: 'Robe wax moderne',
          category: 'Vêtements',
          description:
            'Robe moderne confectionnée avec un tissu wax premium. Tailles disponibles : S, M, L, XL.',
          price: '25 000 FCFA',
          image:
            'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
          status: 'En Stock',
          stock: '12 pièces disponibles'
        }
      ],
      lives: [],
      members: [
        {
          id: 'fa-mem-1',
          name: 'Fashion West Africa',
          role: 'Grossiste en textile',
          avatar: 'https://i.pravatar.cc/100?img=11',
          isAdmin: true
        },
        {
          id: 'fa-mem-2',
          name: 'Awa Touré',
          role: 'Créatrice de mode',
          avatar: 'https://i.pravatar.cc/100?img=28',
          isAdmin: false
        },
        {
          id: 'fa-mem-3',
          name: 'Mariam Diarra',
          role: 'Revendeuse de tissus',
          avatar: 'https://i.pravatar.cc/100?img=37',
          isAdmin: false
        }
      ]
    };
  }

  private getLogisticsContent(): CommunityContent {
    return {
      posts: [
        {
          id: 'lo-post-1',
          author: 'West Logistics Network',
          authorInitial: 'WL',
          date: 'Il y a 6 heures',
          title: 'Nouvelles lignes régulières Abidjan – Bamako',
          content:
            'Nous lançons de nouvelles lignes régulières entre Abidjan et Bamako avec des départs hebdomadaires. Tarifs compétitifs pour les professionnels.',
          image:
            'https://images.unsplash.com/photo-1586528116493-da8b7c0f5f7c?auto=format&fit=crop&w=1200&q=80',
          likes: 29,
          comments: 8,
          shares: 6,
          isLiked: false,
          liked: false,
          product: null as any,
          type: 'normal'
        },
        {
          id: 'lo-post-2',
          author: 'Oumar Fofana',
          authorInitial: 'OF',
          date: 'Il y a 3 jours',
          title: 'Conseils pour optimiser ses coûts de transport',
          content:
            'Après plusieurs années dans la logistique, voici mes conseils pour réduire les coûts : groupage, négociation des tarifs, planification des commandes. Partagez vos propres astuces.',
          likes: 42,
          comments: 17,
          shares: 11,
          isLiked: false,
          liked: false,
          product: null as any,
          type: 'normal'
        }
      ],
      products: [
        {
          id: 'lo-prod-1',
          name: 'Transport routier – palette',
          category: 'Transport',
          description:
            'Service de transport routier pour palettes standard, au départ d\'Abidjan vers toutes les grandes villes d\'Afrique de l\'Ouest.',
          price: 'Sur devis',
          image:
            'https://images.unsplash.com/photo-1586528116493-da8b7c0f5f7c?auto=format&fit=crop&w=600&q=80',
          status: 'Disponible',
          stock: 'Sur demande'
        },
        {
          id: 'lo-prod-2',
          name: 'Entreposage – m² / mois',
          category: 'Stockage',
          description:
            'Location d\'espace d\'entreposage sécurisé, avec gestion des entrées/sorties. Disponible à Abidjan et Bamako.',
          price: 'Sur demande',
          image:
            'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&q=80',
          status: 'Disponible',
          stock: 'Plusieurs espaces'
        }
      ],
      lives: [],
      members: [
        {
          id: 'lo-mem-1',
          name: 'West Logistics Network',
          role: 'Opérateur logistique',
          avatar: 'https://i.pravatar.cc/100?img=14',
          isAdmin: true
        },
        {
          id: 'lo-mem-2',
          name: 'Oumar Fofana',
          role: 'Consultant en logistique',
          avatar: 'https://i.pravatar.cc/100?img=23',
          isAdmin: false
        },
        {
          id: 'lo-mem-3',
          name: 'Aminata Koné',
          role: 'Transitaire',
          avatar: 'https://i.pravatar.cc/100?img=41',
          isAdmin: false
        }
      ]
    };
  }

  private getConstructionContent(): CommunityContent {
    return {
      posts: [
        {
          id: 'co-post-1',
          author: 'Build Africa',
          authorInitial: 'BA',
          date: 'Il y a 7 heures',
          title: 'Arrivage de ciment – prix de gros',
          content:
            'Nous venons de recevoir un nouveau lot de ciment (marques reconnues). Prix de gros intéressant pour les chantiers et les revendeurs.',
          image:
            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
          likes: 31,
          comments: 10,
          shares: 5,
          isLiked: false,
          liked: false,
          product: null as any,
          type: 'normal'
        },
        {
          id: 'co-post-2',
          author: 'Seydou Camara',
          authorInitial: 'SC',
          date: 'Il y a 2 jours',
          title: 'Recherche fournisseurs de ferraille',
          content:
            'Je cherche des fournisseurs de ferraille (ronds à béton, profilés) pour plusieurs chantiers en cours. Merci de me contacter avec vos tarifs.',
          likes: 19,
          comments: 8,
          shares: 3,
          isLiked: false,
          liked: false,
          product: null as any,
          type: 'normal'
        }
      ],
      products: [
        {
          id: 'co-prod-1',
          name: 'Ciment – sac 50 kg',
          category: 'Matériaux',
          description:
            'Ciment toutes marques, disponible en sacs de 50 kg. Prix dégressifs selon quantité.',
          price: '4 200 FCFA',
          image:
            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
          status: 'En Stock',
          stock: '100 sacs disponibles'
        },
        {
          id: 'co-prod-2',
          name: 'Carrelage grès cérame – m²',
          category: 'Finitions',
          description:
            'Carrelage grès cérame, plusieurs modèles et coloris. Idéal pour sols et murs intérieurs.',
          price: '6 500 FCFA',
          image:
            'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
          status: 'En Stock',
          stock: '200 m² disponibles'
        }
      ],
      lives: [],
      members: [
        {
          id: 'co-mem-1',
          name: 'Build Africa',
          role: 'Fournisseur de matériaux',
          avatar: 'https://i.pravatar.cc/100?img=3',
          isAdmin: true
        },
        {
          id: 'co-mem-2',
          name: 'Seydou Camara',
          role: 'Entrepreneur BTP',
          avatar: 'https://i.pravatar.cc/100?img=16',
          isAdmin: false
        },
        {
          id: 'co-mem-3',
          name: 'Fatoumata Diallo',
          role: 'Architecte',
          avatar: 'https://i.pravatar.cc/100?img=31',
          isAdmin: false
        }
      ]
    };
  }
}