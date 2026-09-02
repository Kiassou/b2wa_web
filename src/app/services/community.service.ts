import { Injectable } from '@angular/core';
import { Community } from '../models/community.model';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  private readonly STORAGE_KEY = 'b2wa_communities';

  constructor() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      this.saveCommunities(this.getDefaultCommunities());
    }
  }

  /* =========================================================
     PRIVATE HELPERS
  ========================================================== */

  private getCommunitiesFromStorage(): Community[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      return [];
    }
    try {
      return JSON.parse(data) as Community[];
    } catch {
      return [];
    }
  }

  private saveCommunities(communities: Community[]): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(communities)
    );
  }

  /* =========================================================
     COMMUNAUTÉS PAR DÉFAUT (DONNÉES RÉALISTES & VARIÉES)
  ========================================================== */

  private getDefaultCommunities(): Community[] {
    return [
      {
        // COMMUNAUTÉ QUE TU ADMINISTRES
        id: 'comm-1',
        name: 'Produits agricoles Afrique de l\'Ouest',
        category: 'Agriculture',
        description:
          'Une communauté dédiée aux producteurs, fournisseurs et acheteurs de produits agricoles en Afrique de l\'Ouest.',
        longDescription:
          'Cette communauté rassemble des acteurs de l\'agriculture ouest-africaine : producteurs de céréales, légumes, fruits, mais aussi grossistes et exportateurs. L\'objectif est de faciliter les échanges directs, le partage d\'opportunités d\'achat et de vente, et la mise en relation entre producteurs et acheteurs.',
        icon: '🌾',
        cover:
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        admin: 'vous',
        members: 18,
        posts: 3,
        products: 2,
        lives: 0,
        verified: true,
        isMember: true,
        isAdmin: true,
        avatars: [
          'https://i.pravatar.cc/100?img=12',
          'https://i.pravatar.cc/100?img=32',
          'https://i.pravatar.cc/100?img=47',
          'https://i.pravatar.cc/100?img=56'
        ],
        isPublic: true,
        allowMembers: true,
        allowComments: true,
        allowLives: true,
        liveCapacity: 300,
        liveDuration: 180,
        createdAt: '2026-01-15',
        rules:
          'Respect mutuel, pas de spam. Publications liées à l\'agriculture et aux produits agricoles uniquement (céréales, légumes, fruits, bétail, etc.). Les prix doivent être indiqués clairement.'
      },
      {
        // COMMUNAUTÉ OÙ TU ES MEMBRE (PAS ADMIN)
        id: 'comm-2',
        name: 'Électronique & Smartphones Mali',
        category: 'Électronique',
        description:
          'Fournisseurs, grossistes et professionnels de l\'électronique et des accessoires au Mali.',
        longDescription:
          'Espace d\'échange pour les professionnels de l\'électronique au Mali : smartphones neufs et reconditionnés, accessoires, matériel informatique, équipements audio et vidéo. Les membres partagent leurs arrivages, leurs prix de gros et leurs bonnes affaires.',
        icon: '📱',
        cover:
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
        admin: 'Tech Distribution',
        members: 67,
        posts: 5,
        products: 4,
        lives: 0,
        verified: true,
        isMember: true,
        isAdmin: false,
        avatars: [
          'https://i.pravatar.cc/100?img=5',
          'https://i.pravatar.cc/100?img=18',
          'https://i.pravatar.cc/100?img=25',
          'https://i.pravatar.cc/100?img=40'
        ],
        isPublic: true,
        allowMembers: true,
        allowComments: true,
        allowLives: true,
        liveCapacity: 200,
        liveDuration: 120,
        createdAt: '2026-02-10',
        rules:
          'Publications professionnelles uniquement. Pas de contrefaçon ni de produits volés. Les annonces doivent comporter une photo réelle du produit, le prix et l\'état (neuf, reconditionné, occasion).'
      },
      {
        // COMMUNAUTÉS DÉMO (tu n'es ni admin ni membre)
        id: 'comm-3',
        name: 'Import / Export Chine → Afrique',
        category: 'Import / Export',
        description:
          'Échangez avec des importateurs et fournisseurs autour des opérations commerciales entre la Chine et l\'Afrique.',
        longDescription:
          'Communauté dédiée aux professionnels de l\'import-export entre la Chine et l\'Afrique : sourcing de produits, négociation avec les usines, gestion de la logistique, douane et paiement. Les membres partagent leurs fournisseurs de confiance, leurs expériences et leurs conseils pour éviter les arnaques.',
        icon: '🌍',
        cover:
          'https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=1200&q=80',
        admin: 'West Africa Import',
        members: 3142,
        posts: 218,
        products: 127,
        lives: 0,
        verified: true,
        isMember: false,
        isAdmin: false,
        avatars: [
          'https://i.pravatar.cc/100?img=7',
          'https://i.pravatar.cc/100?img=21',
          'https://i.pravatar.cc/100?img=35',
          'https://i.pravatar.cc/100?img=49'
        ],
        isPublic: true,
        allowMembers: true,
        allowComments: true,
        allowLives: true,
        liveCapacity: 500,
        liveDuration: 240,
        createdAt: '2026-03-05',
        rules:
          'Professionnels uniquement. Pas d\'arnaques ni de faux fournisseurs. Les coordonnées complètes (nom de l\'entreprise, ville, contact) sont obligatoires dans les annonces.'
      },
      {
        id: 'comm-4',
        name: 'Mode & Textile Afrique',
        category: 'Mode & Textile',
        description:
          'Créateurs, grossistes, fabricants et distributeurs de mode et textile en Afrique de l\'Ouest.',
        longDescription:
          'Communauté pour les créateurs, grossistes et professionnels du textile et de la mode en Afrique de l\'Ouest : bazin, wax, pagnes, tissus traditionnels et modernes. Les membres partagent leurs collections, leurs tarifs de gros et leurs opportunités de collaboration.',
        icon: '👗',
        cover:
          'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
        admin: 'Fashion West Africa',
        members: 892,
        posts: 64,
        products: 47,
        lives: 0,
        verified: false,
        isMember: false,
        isAdmin: false,
        avatars: [
          'https://i.pravatar.cc/100?img=11',
          'https://i.pravatar.cc/100?img=28',
          'https://i.pravatar.cc/100?img=37',
          'https://i.pravatar.cc/100?img=53'
        ],
        isPublic: true,
        allowMembers: true,
        allowComments: true,
        allowLives: true,
        liveCapacity: 350,
        liveDuration: 150,
        createdAt: '2026-04-12',
        rules:
          'Respect de la propriété intellectuelle. Pas de contrefaçon de grandes marques. Les photos doivent être nettes et montrer les détails du tissu ou du vêtement.'
      },
      {
        id: 'comm-5',
        name: 'Logistique & Transport WA',
        category: 'Logistique',
        description:
          'Professionnels du transport, de la logistique et de la chaîne d\'approvisionnement en Afrique de l\'Ouest.',
        longDescription:
          'Réseau de professionnels du transport et de la logistique : transitaires, transporteurs routiers, compagnies maritimes, entrepositaires et gestionnaires de flotte. Les membres partagent leurs tarifs, leurs itinéraires et leurs conseils pour optimiser la chaîne d\'approvisionnement.',
        icon: '🚚',
        cover:
          'https://images.unsplash.com/photo-1586528116493-da8b7c0f5f7c?auto=format&fit=crop&w=1200&q=80',
        admin: 'West Logistics Network',
        members: 1247,
        posts: 93,
        products: 27,
        lives: 0,
        verified: true,
        isMember: false,
        isAdmin: false,
        avatars: [
          'https://i.pravatar.cc/100?img=14',
          'https://i.pravatar.cc/100?img=23',
          'https://i.pravatar.cc/100?img=41',
          'https://i.pravatar.cc/100?img=59'
        ],
        isPublic: true,
        allowMembers: true,
        allowComments: true,
        allowLives: true,
        liveCapacity: 400,
        liveDuration: 180,
        createdAt: '2026-05-20',
        rules:
          'Professionnels du secteur uniquement. Offres sérieuses avec tarifs indicatifs. Pas de spam ni de publicités hors sujet (assurance, finance, etc.).'
      },
      {
        id: 'comm-6',
        name: 'Matériaux & Construction',
        category: 'Construction',
        description:
          'Une communauté pour les fournisseurs, entrepreneurs et professionnels du secteur de la construction.',
        longDescription:
          'Communauté dédiée aux matériaux de construction, aux entrepreneurs et aux professionnels du BTP : ciment, ferraille, briques, carrelage, peinture, équipements de chantier. Les membres partagent leurs stocks, leurs prix et leurs conseils techniques.',
        icon: '🏗️',
        cover:
          'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        admin: 'Build Africa',
        members: 623,
        posts: 48,
        products: 71,
        lives: 0,
        verified: false,
        isMember: false,
        isAdmin: false,
        avatars: [
          'https://i.pravatar.cc/100?img=3',
          'https://i.pravatar.cc/100?img=16',
          'https://i.pravatar.cc/100?img=31',
          'https://i.pravatar.cc/100?img=45'
        ],
        isPublic: true,
        allowMembers: true,
        allowComments: true,
        allowLives: true,
        liveCapacity: 300,
        liveDuration: 180,
        createdAt: '2026-06-01',
        rules:
          'Offres sérieuses, pas de pratiques douteuses. Les prix doivent être indiqués par unité (sac, m², tonne, etc.). Respect des normes de sécurité dans les conseils techniques.'
      }
    ];
  }

  /* =========================================================
     PUBLIC METHODS
  ========================================================== */

  getCommunities(): Community[] {
    return this.getCommunitiesFromStorage();
  }

  getCommunityById(id: string): Community | undefined {
    const communities = this.getCommunitiesFromStorage();
    return communities.find(c => c.id === id);
  }

  getMyCommunities(): Community[] {
    const communities = this.getCommunitiesFromStorage();
    return communities.filter(c => c.isAdmin);
  }

  getJoinedCommunities(): Community[] {
    const communities = this.getCommunitiesFromStorage();
    return communities.filter(c => c.isMember && !c.isAdmin);
  }

  getCreatedCommunitiesCount(): number {
    const communities = this.getCommunitiesFromStorage();
    return communities.filter(c => c.isAdmin).length;
  }

  canCreateCommunity(): boolean {
    return this.getCreatedCommunitiesCount() < 3;
  }

  joinCommunity(communityId: string): boolean {
    const communities = this.getCommunitiesFromStorage();
    const community = communities.find(c => c.id === communityId);

    if (!community) {
      return false;
    }

    if (community.isMember) {
      return false;
    }

    community.isMember = true;
    community.members++;

    this.saveCommunities(communities);
    return true;
  }

  leaveCommunity(communityId: string): boolean {
    const communities = this.getCommunitiesFromStorage();
    const community = communities.find(c => c.id === communityId);

    if (!community) {
      return false;
    }

    if (community.isAdmin) {
      return false;
    }

    if (!community.isMember) {
      return false;
    }

    community.isMember = false;

    if (community.members > 0) {
      community.members--;
    }

    this.saveCommunities(communities);
    return true;
  }

  createCommunity(
    data: Omit<
      Community,
      'id' | 'members' | 'posts' | 'products' | 'lives' |
      'verified' | 'isMember' | 'isAdmin' | 'avatars'
    >
  ): Community | null {

    if (!this.canCreateCommunity()) {
      return null;
    }

    const communities = this.getCommunitiesFromStorage();

    const newCommunity: Community = {
      ...data,
      id: `comm-${Date.now()}`,
      members: 1,
      posts: 0,
      products: 0,
      lives: 0,
      verified: false,
      isAdmin: true,
      isMember: true,
      avatars: []
    };

    communities.unshift(newCommunity);
    this.saveCommunities(communities);

    return newCommunity;
  }

  deleteCommunity(communityId: string): boolean {
    let communities = this.getCommunitiesFromStorage();
    const community = communities.find(c => c.id === communityId);

    if (!community) {
      return false;
    }

    if (!community.isAdmin) {
      return false;
    }

    communities = communities.filter(c => c.id !== communityId);
    this.saveCommunities(communities);

    return true;
  }

  updateCommunity(updated: Community): boolean {
    const communities = this.getCommunitiesFromStorage();
    const index = communities.findIndex(c => c.id === updated.id);

    if (index === -1) {
      return false;
    }

    if (!communities[index].isAdmin) {
      return false;
    }

    communities[index] = {
      ...communities[index],
      ...updated
    };

    this.saveCommunities(communities);
    return true;
  }

  /* =========================================================
     RESET / CLEANUP (optionnel, à appeler manuellement)
  ========================================================== */

  /**
   * Réinitialise toutes les communautés avec les données par défaut.
   * Utile en dev pour repartir de zéro.
   */
  resetToDefaultCommunities(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.saveCommunities(this.getDefaultCommunities());
  }

  /**
   * Met tous les compteurs (posts, products, lives) à 0
   * pour toutes les communautés dont tu es admin.
   */
  resetMyCommunitiesCounters(): void {
    const communities = this.getCommunitiesFromStorage();

    communities.forEach(c => {
      if (c.isAdmin) {
        c.posts = 0;
        c.products = 0;
        c.lives = 0;
      }
    });

    this.saveCommunities(communities);
  }
}

export type { Community };