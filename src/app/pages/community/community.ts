import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Community {
  id: number;
  name: string;
  category: string;
  description: string;
  icon: string;
  cover: string;
  admin: string;
  members: number;
  posts: number;
  products: number;
  verified: boolean;
  isMember: boolean;
  isAdmin: boolean;
  avatars: string[];
}

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './community.html',
  styleUrl: './community.css'
})
export class CommunityComponent {

  /* =========================
     SEARCH
  ========================== */

  searchTerm = '';

  selectedCategory = 'Toutes';


  /* =========================
     CATEGORIES
  ========================== */

  categories: string[] = [
    'Toutes',
    'Agriculture',
    'Électronique',
    'Mode & Textile',
    'Logistique',
    'Construction',
    'Import / Export'
  ];


  /* =========================
     COMMUNITIES
  ========================== */

  communities: Community[] = [

    {
      id: 1,
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
      isAdmin: false,
      avatars: [
        'https://i.pravatar.cc/100?img=12',
        'https://i.pravatar.cc/100?img=32',
        'https://i.pravatar.cc/100?img=47',
        'https://i.pravatar.cc/100?img=56'
      ]
    },

    {
      id: 2,
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
      ]
    },

    {
      id: 3,
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
      ]
    },

    {
      id: 4,
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
      ]
    },

    {
      id: 5,
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
      ]
    },

    {
      id: 6,
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
      ]
    }

  ];


  constructor(
    private router: Router
  ) {}


  /* =========================
     MY COMMUNITIES
  ========================== */

  get myCommunities(): Community[] {
    return this.communities.filter(
      community => community.isMember
    );
  }


  /* =========================
     FILTERED COMMUNITIES
  ========================== */

  get filteredCommunities(): Community[] {

    const search = this.searchTerm
      .trim()
      .toLowerCase();

    return this.communities.filter(community => {

      const matchesCategory =
        this.selectedCategory === 'Toutes' ||
        community.category === this.selectedCategory;

      const matchesSearch =
        !search ||
        community.name.toLowerCase().includes(search) ||
        community.description.toLowerCase().includes(search) ||
        community.category.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;

    });

  }


  /* =========================
     CATEGORY
  ========================== */

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }


  /* =========================
     SEARCH
  ========================== */

  clearSearch(): void {
    this.searchTerm = '';
  }


  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'Toutes';
  }


  /* =========================
     JOIN COMMUNITY
  ========================== */

  joinCommunity(community: Community): void {

    if (community.isMember) {
      return;
    }

    community.isMember = true;
    community.members++;

  }


  /* =========================
     LEAVE COMMUNITY
  ========================== */

  leaveCommunity(community: Community): void {

    if (!community.isMember) {
      return;
    }

    community.isMember = false;

    if (community.members > 0) {
      community.members--;
    }

  }


  /* =========================
     OPEN COMMUNITY
  ========================== */

  openCommunity(community: Community): void {
    this.router.navigate(['/dashboard/community', community.id]);
  }

  viewCommunity(community: Community): void {
    this.router.navigate(['/dashboard/community-view', community.id]);
  }


  /* =========================
     CREATE COMMUNITY
  ========================== */

createCommunity(): void {
  if (this.myCommunities.length >= 3) {
    return;
  }
  this.router.navigate(['/dashboard/create-community']);
}


  /* =========================
     MANAGE COMMUNITY
  ========================== */

  manageCommunity(community: Community): void {

    this.router.navigate([
      '/community',
      community.id,
      'manage'
    ]);

  }


  /* =========================
     NUMBER FORMAT
  ========================== */

  formatNumber(value: number): string {

    return new Intl.NumberFormat(
      'fr-FR'
    ).format(value);

  }

}