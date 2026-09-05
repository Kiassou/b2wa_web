import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  Content,
  ContentType,
  ContentVisibility
} from '../../models/content.model';

import { ContentService } from '../../services/content.service';
import { CommunityService } from '../../services/community.service';

import {
  CreateStoryModalComponent,
  StoryFormData,
  StoryCommunity
} from '../../shared/stories/create-story-modal/create-story-modal';

import {
  CreatePublicationModalComponent,
  PublicationFormData,
  PublicationCommunity
} from '../../shared/stories/create-publication-modal/create-publication-modal';

@Component({
  selector: 'app-storie',
  standalone: true,
  imports: [
    CommonModule,
    CreateStoryModalComponent,
    CreatePublicationModalComponent
  ],
  templateUrl: './stories.html',
  styleUrl: './stories.css'
})
export class StoriesComponent implements OnInit {

  // =========================================================
  // CONTENT
  // =========================================================

  contents: Content[] = [];
  stories: Content[] = [];
  publications: Content[] = [];
  filteredContents: Content[] = [];

  // =========================================================
  // FILTERS
  // =========================================================

  activeSection:
    'all' |
    'stories' |
    'publications' = 'all';

  searchTerm = '';

  selectedVisibility:
    'all' |
    ContentVisibility = 'all';

  isLoading = false;

  // =========================================================
  // MODALS
  // =========================================================

  showStoryModal = false;
  showPublicationModal = false;
  showDeleteModal = false;

  selectedContent: Content | null = null;

  // =========================================================
  // PREMIUM
  // =========================================================

  isPremium = false;
  showPremiumModal = false;

  // =========================================================
  // COMMUNITIES
  // =========================================================

  communities: StoryCommunity[] = [];

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private contentService: ContentService,
    private communityService: CommunityService,
    private router: Router
  ) {}

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.loadCommunities();
    this.loadContents();
  }

  // =========================================================
  // LOAD COMMUNITIES
  // =========================================================

  loadCommunities(): void {

    /*
     * IMPORTANT :
     * Seules les communautés dont le fournisseur est ADMIN
     * peuvent être utilisées pour publier du contenu.
     *
     * Une communauté simplement rejointe ne doit PAS apparaître
     * dans le sélecteur.
     */

    const myCommunities =
      this.communityService.getMyCommunities();

    const availableCommunities = [
      ...myCommunities
    ];

    this.communities =
      availableCommunities.map(community => ({
        id: community.id,
        name: community.name
      }));
  }

  // =========================================================
  // LOAD CONTENTS
  // =========================================================

  loadContents(): void {

    this.isLoading = true;

    this.contents =
      this.contentService.getAll();

    this.stories =
      this.contentService.getStories();

    this.publications =
      this.contentService.getPublications();

    this.applyFilters();

    this.isLoading = false;
  }

  // =========================================================
  // STATISTICS
  // =========================================================

  get activeStoriesCount(): number {
    return this.contentService
      .getActiveStoriesCount();
  }

  get publicationsCount(): number {
    return this.contentService
      .getPublicationsCount();
  }

  get totalViews(): number {
    return this.contentService
      .getTotalViews();
  }

  // =========================================================
  // FILTERS
  // =========================================================

  applyFilters(): void {

    let result =
      [...this.contents];

    // -------------------------------------------------------
    // SECTION
    // -------------------------------------------------------

    if (
      this.activeSection === 'stories'
    ) {

      result =
        result.filter(
          content =>
            content.type === 'story'
        );

    } else if (
      this.activeSection === 'publications'
    ) {

      result =
        result.filter(
          content =>
            content.type === 'publication'
        );
    }

    // -------------------------------------------------------
    // VISIBILITY
    // -------------------------------------------------------

    if (
      this.selectedVisibility !== 'all'
    ) {

      result =
        result.filter(
          content =>
            content.visibility ===
            this.selectedVisibility
        );
    }

    // -------------------------------------------------------
    // SEARCH
    // -------------------------------------------------------

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();

    if (search) {

      result =
        result.filter(content => {

          const title =
            content.title
              ?.toLowerCase() || '';

          const text =
            content.content
              .toLowerCase();

          /*
           * Ancien système :
           * communityName
           *
           * Nouveau système :
           * communities[]
           */

          const legacyCommunity =
            content.communityName
              ?.toLowerCase() || '';

          const multipleCommunities =
            content.communities
              ?.map(community => community.name)
              .join(' ')
              .toLowerCase() || '';

          return (
            title.includes(search) ||
            text.includes(search) ||
            legacyCommunity.includes(search) ||
            multipleCommunities.includes(search)
          );

        });
    }

    this.filteredContents =
      result;
  }

  // =========================================================
  // CHANGE SECTION
  // =========================================================

  changeSection(
    section:
      'all' |
      'stories' |
      'publications'
  ): void {

    this.activeSection =
      section;

    this.applyFilters();
  }

  // =========================================================
  // SEARCH
  // =========================================================

  onSearchChange(
    value: string
  ): void {

    this.searchTerm =
      value;

    this.applyFilters();
  }

  clearSearch(): void {

    this.searchTerm = '';

    this.applyFilters();
  }

  // =========================================================
  // VISIBILITY
  // =========================================================

  changeVisibility(
    visibility:
      'all' |
      ContentVisibility
  ): void {

    this.selectedVisibility =
      visibility;

    this.applyFilters();
  }

  // =========================================================
  // CREATE STORY
  // =========================================================

  openCreateStory(): void {

    this.selectedContent =
      null;

    this.showStoryModal =
      true;
  }

  closeStoryModal(): void {

    this.showStoryModal =
      false;

    this.selectedContent =
      null;
  }

  // =========================================================
  // STORY SUBMITTED
  // =========================================================

  onStorySubmitted(
    data: StoryFormData
  ): void {

    const now =
      new Date();

    const expiresAt =
      new Date(
        now.getTime() +
        24 * 60 * 60 * 1000
      );

    /*
     * Première communauté uniquement pour garder
     * la compatibilité avec l'ancien modèle.
     *
     * La vraie donnée utilisée maintenant est :
     * data.communities
     */

    const firstCommunity =
      data.communities?.[0];

    // -------------------------------------------------------
    // EDIT
    // -------------------------------------------------------

    if (this.selectedContent) {

      this.contentService.update(
        this.selectedContent.id,
        {

          content:
            data.content,

          image:
            data.image,

          video:
            data.video,

          visibility:
            data.visibility,

          // Nouveau système multi-communautés
          communities:
            [...data.communities],

          // Compatibilité ancien système
          communityId:
            firstCommunity?.id,

          communityName:
            firstCommunity?.name,

          updatedAt:
            now.toISOString(),

          expiresAt:
            expiresAt.toISOString(),

          status:
            'published'
        }
      );

    }

    // -------------------------------------------------------
    // CREATE
    // -------------------------------------------------------

    else {

this.contentService.create({
  type: 'story',

  content:
    data.content,

  image:
    data.image,

  video:
    data.video,

  visibility:
    data.visibility,

  communities:
    [...data.communities],

  // Compatibilité ancien système
  communityId:
    firstCommunity?.id,

  communityName:
    firstCommunity?.name,

  authorId:
    'supplier-001',

  authorName:
    'Mamadou Diallo',

  expiresAt:
    expiresAt.toISOString(),

  status:
    'published'
});

    }

    this.closeStoryModal();

    this.loadContents();
  }

  // =========================================================
  // CREATE PUBLICATION
  // =========================================================

  openCreatePublication(): void {

    this.selectedContent =
      null;

    this.showPublicationModal =
      true;
  }

  closePublicationModal(): void {

    this.showPublicationModal =
      false;

    this.selectedContent =
      null;
  }

  // =========================================================
  // PUBLICATION SUBMITTED
  // =========================================================

  onPublicationSubmitted(
    data: PublicationFormData
  ): void {

    // -------------------------------------------------------
    // SECURITY
    // -------------------------------------------------------

    if (
      data.visibility === 'public' &&
      !this.isPremium
    ) {

      this.showPremiumModal =
        true;

      return;
    }

    /*
     * Première communauté uniquement pour conserver
     * la compatibilité avec l'ancien modèle.
     */

    const firstCommunity =
      data.communities?.[0];

    const now =
      new Date();

    // -------------------------------------------------------
    // EDIT
    // -------------------------------------------------------

    if (this.selectedContent) {

      this.contentService.update(
        this.selectedContent.id,
        {

          title:
            data.title,

          content:
            data.content,

          image:
            data.image,

          video:
            data.video,

          visibility:
            data.visibility,

          // Nouveau système multi-communautés
          communities:
            [...data.communities],

          // Compatibilité ancien système
          communityId:
            firstCommunity?.id,

          communityName:
            firstCommunity?.name,

          updatedAt:
            now.toISOString(),

          status:
            'published'
        }
      );

    }

    // -------------------------------------------------------
    // CREATE
    // -------------------------------------------------------

    else {

this.contentService.create({

  type:
    'publication',

  title:
    data.title,

  content:
    data.content,

  image:
    data.image,

  video:
    data.video,

  visibility:
    data.visibility,

  communities:
    [...data.communities],

  // Compatibilité ancien système
  communityId:
    firstCommunity?.id,

  communityName:
    firstCommunity?.name,

  authorId:
    'supplier-001',

  authorName:
    'Mamadou Diallo',

  status:
    'published'
});

    }

    this.closePublicationModal();

    this.loadContents();
  }

  // =========================================================
  // DELETE
  // =========================================================

  askDelete(
    content: Content
  ): void {

    this.selectedContent =
      content;

    this.showDeleteModal =
      true;
  }

  cancelDelete(): void {

    this.showDeleteModal =
      false;

    this.selectedContent =
      null;
  }

  confirmDelete(): void {

    if (!this.selectedContent) {
      return;
    }

    const deleted =
      this.contentService.delete(
        this.selectedContent.id
      );

    if (deleted) {
      this.loadContents();
    }

    this.showDeleteModal =
      false;

    this.selectedContent =
      null;
  }

  // =========================================================
  // PREMIUM
  // =========================================================

  canPublishPublic(): boolean {

    return this.contentService
      .canPublishPublic(
        this.isPremium
      );
  }

  checkPublicVisibility(): boolean {

    if (this.isPremium) {
      return true;
    }

    this.showPremiumModal =
      true;

    return false;
  }

  onStoryPremiumRequired(): void {

    this.showPremiumModal =
      true;
  }

  onPublicationPremiumRequired(): void {

    this.showPremiumModal =
      true;
  }

  closePremiumModal(): void {

    this.showPremiumModal =
      false;
  }

  openPremiumPage(): void {

    this.showPremiumModal =
      false;

    this.router.navigate([
      '/dashboard/premium'
    ]);
  }

  // =========================================================
  // NAVIGATION
  // =========================================================

  goBack(): void {

    this.router.navigate([
      '/dashboard'
    ]);
  }

  // =========================================================
  // HELPERS
  // =========================================================

  getContentTypeLabel(
    type: ContentType
  ): string {

    return type === 'story'
      ? 'Story / Statut'
      : 'Publication';
  }

  getVisibilityLabel(
    visibility: ContentVisibility
  ): string {

    return visibility === 'public'
      ? 'Public'
      : 'Communauté';
  }

  getVisibilityIcon(
    visibility: ContentVisibility
  ): string {

    return visibility === 'public'
      ? 'public'
      : 'groups';
  }

  isStoryActive(
    content: Content
  ): boolean {

    if (
      content.type !== 'story'
    ) {
      return false;
    }

    if (
      content.status !== 'published'
    ) {
      return false;
    }

    if (!content.expiresAt) {
      return true;
    }

    return (
      new Date(
        content.expiresAt
      ) > new Date()
    );
  }

  formatNumber(
    value: number
  ): string {

    return new Intl.NumberFormat(
      'fr-FR'
    ).format(value);
  }

  formatDate(
    date: string
  ): string {

    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(
      new Date(date)
    );
  }
}