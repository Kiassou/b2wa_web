import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  Community,
  CommunityService
} from '../../../services/community.service';


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
    private router: Router
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

    this.communities =
      this.communityService.getCommunities();

  }


  /* =========================================================
     FILTERED COMMUNITIES
  ========================================================= */

  get filteredCommunities(): Community[] {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    return this.communities.filter(
      community => {

        const matchesCategory =
          this.selectedCategory === 'Toutes' ||
          community.category === this.selectedCategory;


        const matchesSearch =
          !search ||
          community.name
            .toLowerCase()
            .includes(search) ||

          community.description
            .toLowerCase()
            .includes(search) ||

          community.category
            .toLowerCase()
            .includes(search) ||

          community.admin
            .toLowerCase()
            .includes(search);


        return (
          matchesCategory &&
          matchesSearch
        );

      }
    );

  }


  /* =========================================================
     CATEGORY
  ========================================================= */

  selectCategory(
    category: string
  ): void {

    this.selectedCategory =
      category;

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

    this.selectedCategory =
      'Toutes';

  }


  /* =========================================================
     JOIN COMMUNITY
  ========================================================= */

  joinCommunity(
    community: Community
  ): void {

    this.communityService
      .joinCommunity(community.id);

  }


  /* =========================================================
     LEAVE COMMUNITY
  ========================================================= */

  leaveCommunity(
    community: Community
  ): void {

    this.communityService
      .leaveCommunity(community.id);

  }


  /* =========================================================
     VIEW COMMUNITY
  ========================================================= */

  viewCommunity(
    community: Community
  ): void {

    this.router.navigate([
      '/dashboard/community-view',
      community.id
    ]);

  }


  /* =========================================================
     NUMBER FORMAT
  ========================================================= */

  formatNumber(
    value: number
  ): string {

    return new Intl.NumberFormat(
      'fr-FR'
    ).format(value);

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