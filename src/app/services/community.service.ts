import { Injectable } from '@angular/core';

import { Community } from '../models/community.model';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  /* =========================================================
     COMMUNAUTÉS
  ========================================================== */

  private communities: Community[] = [

    {
      id: 'comm-1',

      name: 'Produits agricoles Afrique de l’Ouest',

      category: 'Agriculture',

      description:
        'Une communauté dédiée aux producteurs, fournisseurs et acheteurs de produits agricoles en Afrique de l’Ouest.',

      icon: '🌾',

      cover:
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',

      admin: 'AgriWest Business',

      members: 1248,

      posts: 86,

      products: 42,

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

      createdAt: '2026-01-15'
    },


    {
      id: 'comm-2',

      name: 'Électronique & Smartphones Mali',

      category: 'Électronique',

      description:
        'Fournisseurs, grossistes et professionnels de l’électronique et des accessoires au Mali.',

      icon: '📱',

      cover:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',

      admin: 'Tech Distribution',

      members: 856,

      posts: 64,

      products: 73,

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

      liveCapacity: 300,

      liveDuration: 180,

      createdAt: '2026-02-10'
    },


    {
      id: 'comm-3',

      name: 'Import / Export Chine → Afrique',

      category: 'Import / Export',

      description:
        'Échangez avec des importateurs et fournisseurs autour des opérations commerciales entre la Chine et l’Afrique.',

      icon: '🌍',

      cover:
        'https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=1200&q=80',

      admin: 'West Africa Import',

      members: 2314,

      posts: 142,

      products: 91,

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

      liveCapacity: 300,

      liveDuration: 180,

      createdAt: '2026-03-05'
    },


    {
      id: 'comm-4',

      name: 'Mode & Textile Afrique',

      category: 'Mode & Textile',

      description:
        'Créateurs, grossistes, fabricants et distributeurs de mode et textile en Afrique de l’Ouest.',

      icon: '👗',

      cover:
        'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',

      admin: 'Fashion West Africa',

      members: 673,

      posts: 51,

      products: 38,

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

      liveCapacity: 300,

      liveDuration: 180,

      createdAt: '2026-04-12'
    },


    {
      id: 'comm-5',

      name: 'Logistique & Transport WA',

      category: 'Logistique',

      description:
        'Professionnels du transport, de la logistique et de la chaîne d’approvisionnement en Afrique de l’Ouest.',

      icon: '🚚',

      cover:
        'https://images.unsplash.com/photo-1586528116493-da8b7c0f5f7c?auto=format&fit=crop&w=1200&q=80',

      admin: 'West Logistics Network',

      members: 941,

      posts: 72,

      products: 19,

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

      liveCapacity: 300,

      liveDuration: 180,

      createdAt: '2026-05-20'
    },


    {
      id: 'comm-6',

      name: 'Matériaux & Construction',

      category: 'Construction',

      description:
        'Une communauté pour les fournisseurs, entrepreneurs et professionnels du secteur de la construction.',

      icon: '🏗️',

      cover:
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',

      admin: 'Build Africa',

      members: 487,

      posts: 36,

      products: 56,

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

      createdAt: '2026-06-01'
    }

  ];


  /* =========================================================
     GET ALL
  ========================================================== */

  getCommunities(): Community[] {

    return this.communities;

  }


  /* =========================================================
     GET COMMUNITY BY ID
  ========================================================== */

  getCommunityById(
    id: string
  ): Community | undefined {

    return this.communities.find(
      community => community.id === id
    );

  }


  /* =========================================================
     MY COMMUNITIES
     → UNIQUEMENT LES COMMUNAUTÉS CRÉÉES
  ========================================================== */

  getMyCommunities(): Community[] {

    return this.communities.filter(
      community => community.isAdmin
    );

  }


  /* =========================================================
     JOINED COMMUNITIES
     → COMMUNAUTÉS REJOINTES
     → PAS LES COMMUNAUTÉS ADMINISTRÉES
  ========================================================== */

  getJoinedCommunities(): Community[] {

    return this.communities.filter(
      community =>
        community.isMember &&
        !community.isAdmin
    );

  }


  /* =========================================================
     CREATED COUNT
  ========================================================== */

  getCreatedCommunitiesCount(): number {

    return this.communities.filter(
      community => community.isAdmin
    ).length;

  }


  /* =========================================================
     CAN CREATE
  ========================================================== */

  canCreateCommunity(): boolean {

    return this.getCreatedCommunitiesCount() < 3;

  }


  /* =========================================================
     JOIN
  ========================================================== */

  joinCommunity(
    communityId: string
  ): boolean {

    const community =
      this.getCommunityById(communityId);


    if (!community) {
      return false;
    }


    if (community.isMember) {
      return false;
    }


    community.isMember = true;

    community.members++;


    return true;

  }


  /* =========================================================
     LEAVE
  ========================================================== */

  leaveCommunity(
    communityId: string
  ): boolean {

    const community =
      this.getCommunityById(communityId);


    if (!community) {
      return false;
    }


    /*
     * Un administrateur ne peut pas
     * quitter sa propre communauté.
     */

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


    return true;

  }


  /* =========================================================
     CREATE
  ========================================================== */

  createCommunity(
    data: Omit<
      Community,
      'id' |
      'members' |
      'posts' |
      'products' |
      'verified' |
      'isMember' |
      'isAdmin' |
      'avatars'
    >
  ): Community | null {


    /*
     * Limite Standard :
     * 3 communautés créées maximum.
     */

    if (!this.canCreateCommunity()) {
      return null;
    }


    const newCommunity: Community = {

      ...data,

      id: `comm-${Date.now()}`,

      members: 1,

      posts: 0,

      products: 0,

      verified: false,

      /*
       * Le créateur devient automatiquement
       * administrateur et membre.
       */

      isAdmin: true,

      isMember: true,

      avatars: []

    };


    this.communities.unshift(
      newCommunity
    );


    return newCommunity;

  }

}

export type { Community };
