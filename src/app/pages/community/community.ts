import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Community,CommunityService } from '../../services/community.service';


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
export class CommunityComponent implements OnInit {

  /* =========================================================
     SEARCH
  ========================================================= */
  searchTerm = '';
  selectedCategory = 'Toutes';

  /* =========================================================
     PREMIUM MODAL
  ========================================================= */
  showPremiumModal = false;

  /* =========================================================
     DATA
  ========================================================= */

  communities: Community[] = [];

  myCommunities: Community[] = [];

  joinedCommunities: Community[] = [];


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
    'Import / Export'
  ];


  /* =========================================================
     CONSTRUCTOR
  ========================================================= */

  constructor(
    private router: Router,
    private communityService: CommunityService
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

    this.refreshUserCommunities();

  }


  /* =========================================================
     USER COMMUNITIES
  ========================================================= */

  refreshUserCommunities(): void {

    /*
     * Mes communautés
     * ----------------
     * UNIQUEMENT les communautés créées
     * et administrées par le fournisseur.
     */

    this.myCommunities =
      this.communityService.getMyCommunities();


    /*
     * Communautés rejointes
     * ----------------------
     * Communautés dont le fournisseur
     * est membre MAIS PAS administrateur.
     */

    this.joinedCommunities =
      this.communityService.getJoinedCommunities();

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

  selectCategory(category: string): void {

    this.selectedCategory =
      category;

  }

  get recentCommunities(): Community[] {
    return this.communities.slice(0, 4);
  }

  exploreAllCommunities(): void {
    this.router.navigate([
      '/dashboard/community-explorer'
    ]);
  }

  /* =========================================================
     SEARCH
  ========================================================= */

  clearSearch(): void {

    this.searchTerm = '';

  }


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

    /*
     * Si l'utilisateur est déjà membre,
     * aucune action.
     */

    if (community.isMember) {
      return;
    }


    /*
     * On demande au service de gérer
     * l'adhésion.
     */

    const joined =
      this.communityService
        .joinCommunity(
          community.id
        );


    if (!joined) {
      return;
    }


    /*
     * Mise à jour des listes.
     *
     * IMPORTANT :
     * rejoindre une communauté ne l'ajoute
     * PAS à Mes communautés.
     */

    this.loadCommunities();

  }


  /* =========================================================
     LEAVE COMMUNITY
  ========================================================= */

  leaveCommunity(
    community: Community
  ): void {

    /*
     * Une communauté administrée ne doit
     * pas être quittée comme une communauté
     * simplement rejointe.
     */

    if (community.isAdmin) {
      return;
    }


    if (!community.isMember) {
      return;
    }


    const left =
      this.communityService
        .leaveCommunity(
          community.id
        );


    if (!left) {
      return;
    }


    this.loadCommunities();

  }


  /* =========================================================
     OPEN COMMUNITY
  ========================================================= */

  openCommunity(
    community: Community
  ): void {

    this.router.navigate([
      '/dashboard/community',
      community.id
    ]);

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
     CREATE COMMUNITY
  ========================================================= */

  createCommunity(): void {

    /*
     * La limite de 3 concerne uniquement
     * les communautés administrées.
     */

    if (
      this.myCommunities.length >= 3
    ) {
      return;
    }


    this.router.navigate([
      '/dashboard/create-community'
    ]);

  }

    /* =========================================================
     PREMIUM MODAL
  ========================================================= */

  openPremiumModal(): void {

    this.showPremiumModal = true;

    document.body.style.overflow =
      'hidden';

  }


  closePremiumModal(): void {

    this.showPremiumModal = false;

    document.body.style.overflow =
      'auto';

  }


  /* =========================================================
     MANAGE COMMUNITY
  ========================================================= */

  manageCommunity(
    community: Community
  ): void {

    /*
     * Sécurité supplémentaire :
     * seul l'administrateur peut gérer
     * sa communauté.
     */

    if (!community.isAdmin) {
      return;
    }


    this.router.navigate([
      '/dashboard/manage-community',
      community.id,
      'manage'
    ]);

  }


  /* =========================================================
     VIEW ALL JOINED
  ========================================================= */

  viewAllJoinedCommunities(): void {

    this.router.navigate([
      '/dashboard/joined-communities'
    ]);

  }


  /* =========================================================
     VIEW ALL MY COMMUNITIES
  ========================================================= */

  viewAllMyCommunities(): void {

    this.router.navigate([
      '/dashboard/community/my-communities'
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

}