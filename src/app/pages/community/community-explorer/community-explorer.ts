import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Community, CommunityService } from '../../../services/community.service';

@Component({
  selector: 'app-community-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './community-explorer.html',
  styleUrl: './community-explorer.css'
})
export class CommunityExplorerComponent implements OnInit {

  /* =========================================================
     SEARCH
  ========================================================= */
  searchTerm = '';
  selectedCategory = 'Toutes';

  /* =========================================================
     CATEGORIES
  ========================================================= */
  categories: string[] = [
    'Toutes',
    'Mode & Beauté',
    'Alimentation',
    'Électronique',
    'Agriculture',
    'Maison',
    'Artisanat',
    'Services',
    'Commerce',
    'Technologie',
    'Automobile',
    'Santé & Bien-être',
    'Autre'
  ];

  /* =========================================================
     COMMUNITIES
  ========================================================= */
  communities: Community[] = [];

  /* =========================================================
     CONSTRUCTOR
  ========================================================= */
  constructor(
    private communityService: CommunityService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  /* =========================================================
     INIT
  ========================================================= */
  ngOnInit(): void {
    this.loadCommunities();
  }

  /* =========================================================
     LOAD COMMUNITIES
  ========================================================= */
  loadCommunities(): void {
    this.communities = this.communityService.getCommunities();
    this.cdr.markForCheck();
  }

  /* =========================================================
     FILTERED COMMUNITIES
  ========================================================= */
  get filteredCommunities(): Community[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.communities.filter(community => {
      const matchesCategory =
        this.selectedCategory === 'Toutes' ||
        community.category === this.selectedCategory;

      const matchesSearch =
        !search ||
        community.name.toLowerCase().includes(search) ||
        community.description.toLowerCase().includes(search) ||
        community.category.toLowerCase().includes(search) ||
        community.admin.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }

  /* =========================================================
     CATEGORY
  ========================================================= */
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.cdr.markForCheck();
  }

  /* =========================================================
     SEARCH
  ========================================================= */
  clearSearch(): void {
    this.searchTerm = '';
  }

  /* =========================================================
     RESET
  ========================================================= */
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'Toutes';
    this.cdr.markForCheck();
  }

  /* =========================================================
     JOIN COMMUNITY
  ========================================================= */
  joinCommunity(community: Community): void {
    const joined = this.communityService.joinCommunity(community.id);
    if (joined) {
      this.loadCommunities();
    }
  }

  /* =========================================================
     LEAVE COMMUNITY
  ========================================================= */
  leaveCommunity(community: Community): void {
    const left = this.communityService.leaveCommunity(community.id);
    if (left) {
      this.loadCommunities();
    }
  }

  /* =========================================================
     VIEW COMMUNITY
  ========================================================= */
  viewCommunity(community: Community): void {
    this.router.navigate([
      '/dashboard/community-view',
      community.id
    ]);
  }

  /* =========================================================
     NUMBER FORMAT
  ========================================================= */
  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value);
  }

  /* =========================================================
     BACK
  ========================================================= */
  goBack(): void {
    this.router.navigate([
      '/dashboard/community'
    ]);
  }
}