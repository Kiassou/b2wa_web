import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Community, CommunityService } from '../../../services/community.service';

@Component({
  selector: 'app-joined-communities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './joined-communities.html',
  styleUrl: './joined-communities.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JoinedCommunitiesComponent {

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
    'Agriculture',
    'Électronique',
    'Mode & Textile',
    'Logistique',
    'Construction',
    'Import / Export',
    'Commerce',
    'Technologie',
    'Automobile',
    'Alimentation',
    'Artisanat',
    'Services'
  ];

  /* =========================================================
     CONSTRUCTOR
  ========================================================= */
  constructor(
    private communityService: CommunityService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  /* =========================================================
     JOINED COMMUNITIES
  ========================================================= */
  get joinedCommunities(): Community[] {
    return this.communityService.getJoinedCommunities();
  }

  /* =========================================================
     FILTERED COMMUNITIES
  ========================================================= */
  get filteredCommunities(): Community[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.joinedCommunities.filter(community => {
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
    this.cdr.markForCheck();
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
     OPEN COMMUNITY
  ========================================================= */
  openCommunity(community: Community): void {
    this.router.navigate([
      '/dashboard/community',
      community.id
    ]);
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
     LEAVE COMMUNITY
  ========================================================= */
  leaveCommunity(community: Community): void {
    const left = this.communityService.leaveCommunity(community.id);
    if (left) {
      this.cdr.markForCheck();
    }
  }

  /**
   * Gérer le clic sur le bouton "Découvrir plus de communautés"
   */
  goToExplorer(): void {
    this.router.navigate([
      '/dashboard/community-explorer'
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