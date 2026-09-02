import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  Content,
  ContentType,
  ContentVisibility
} from '../../models/content.model';

import { ContentService } from '../../services/content.service';

import { CreateStoryModalComponent, StoryFormData } 
  from '../../shared/stories/create-story-modal/create-story-modal';

@Component({
  selector: 'app-storie',
  standalone: true,
    imports: [CommonModule, CreateStoryModalComponent],
  templateUrl: './stories.html',
  styleUrl: './stories.css'
})
export class StoriesComponent implements OnInit {

  // ============================================================
  // DONNÉES
  // ============================================================

  contents: Content[] = [];

  stories: Content[] = [];

  publications: Content[] = [];

  filteredContents: Content[] = [];

  // ============================================================
  // ÉTAT DE LA PAGE
  // ============================================================

  activeSection: 'all' | 'stories' | 'publications' = 'all';

  searchTerm = '';

  selectedVisibility: 'all' | ContentVisibility = 'all';

  isLoading = false;

  // ============================================================
  // MODALS
  // ============================================================

  showStoryModal = false;

  showPublicationModal = false;

  showDeleteModal = false;

  selectedContent: Content | null = null;

  // ============================================================
  // PREMIUM
  // ============================================================

  /**
   * Pour le moment le compte n'est pas Premium.
   *
   * Plus tard cette valeur viendra du compte fournisseur
   * ou d'un service Premium.
   */
  isPremium = false;

  showPremiumModal = false;

  // ============================================================
  // CONSTRUCTEUR
  // ============================================================

  constructor(
    private contentService: ContentService,
    private router: Router
  ) {}

  // ============================================================
  // INITIALISATION
  // ============================================================

  ngOnInit(): void {
    this.loadContents();
  }

  // ============================================================
  // CHARGEMENT
  // ============================================================

  loadContents(): void {

    this.isLoading = true;

    this.contents = this.contentService.getAll();

    this.stories = this.contentService.getStories();

    this.publications = this.contentService.getPublications();

    this.applyFilters();

    this.isLoading = false;
  }

  // ============================================================
  // STATISTIQUES
  // ============================================================

  get activeStoriesCount(): number {
    return this.contentService.getActiveStoriesCount();
  }

  get publicationsCount(): number {
    return this.contentService.getPublicationsCount();
  }

  get totalViews(): number {
    return this.contentService.getTotalViews();
  }

  // ============================================================
  // FILTRAGE
  // ============================================================

  applyFilters(): void {

    let result = [...this.contents];

    // ----------------------------------------------------------
    // Filtre par section
    // ----------------------------------------------------------

    if (this.activeSection === 'stories') {

      result = result.filter(
        content => content.type === 'story'
      );

    } else if (this.activeSection === 'publications') {

      result = result.filter(
        content => content.type === 'publication'
      );
    }

    // ----------------------------------------------------------
    // Filtre par visibilité
    // ----------------------------------------------------------

    if (this.selectedVisibility !== 'all') {

      result = result.filter(
        content =>
          content.visibility === this.selectedVisibility
      );
    }

    // ----------------------------------------------------------
    // Recherche
    // ----------------------------------------------------------

    const search = this.searchTerm
      .trim()
      .toLowerCase();

    if (search) {

      result = result.filter(content => {

        const title =
          content.title?.toLowerCase() || '';

        const text =
          content.content.toLowerCase();

        const community =
          content.communityName?.toLowerCase() || '';

        return (
          title.includes(search) ||
          text.includes(search) ||
          community.includes(search)
        );
      });
    }

    // ----------------------------------------------------------
    // Résultat
    // ----------------------------------------------------------

    this.filteredContents = result;
  }

  // ============================================================
  // CHANGEMENT DE SECTION
  // ============================================================

  changeSection(
    section: 'all' | 'stories' | 'publications'
  ): void {

    this.activeSection = section;

    this.applyFilters();
  }

  // ============================================================
  // RECHERCHE
  // ============================================================

  onSearchChange(value: string): void {

    this.searchTerm = value;

    this.applyFilters();
  }

  clearSearch(): void {

    this.searchTerm = '';

    this.applyFilters();
  }

  // ============================================================
  // VISIBILITÉ
  // ============================================================

  changeVisibility(
    visibility: 'all' | ContentVisibility
  ): void {

    this.selectedVisibility = visibility;

    this.applyFilters();
  }

  // ============================================================
  // CRÉATION STORY / STATUT
  // ============================================================

  openCreateStory(): void {

    this.selectedContent = null;

    this.showStoryModal = true;
  }

  closeStoryModal(): void {

    this.showStoryModal = false;

    this.selectedContent = null;
  }

  // ============================================================
  // CRÉATION PUBLICATION
  // ============================================================

  openCreatePublication(): void {

    this.selectedContent = null;

    this.showPublicationModal = true;
  }

  closePublicationModal(): void {

    this.showPublicationModal = false;

    this.selectedContent = null;
  }

  // ============================================================
  // MODIFICATION
  // ============================================================

  editContent(content: Content): void {

    this.selectedContent = content;

    if (content.type === 'story') {

      this.showStoryModal = true;

    } else {

      this.showPublicationModal = true;
    }
  }

  // ============================================================
  // SUPPRESSION
  // ============================================================

  askDelete(content: Content): void {

    this.selectedContent = content;

    this.showDeleteModal = true;
  }

  cancelDelete(): void {

    this.showDeleteModal = false;

    this.selectedContent = null;
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

    this.showDeleteModal = false;

    this.selectedContent = null;
  }

  // ============================================================
  // PREMIUM
  // ============================================================

  /**
   * Vérifie si le fournisseur peut publier publiquement.
   */
  canPublishPublic(): boolean {

    return this.contentService.canPublishPublic(
      this.isPremium
    );
  }

  /**
   * Appelé lorsqu'un fournisseur choisit
   * la visibilité publique.
   */
  checkPublicVisibility(): boolean {

    if (this.isPremium) {
      return true;
    }

    this.showPremiumModal = true;

    return false;
  }

  closePremiumModal(): void {

    this.showPremiumModal = false;
  }

  openPremiumPage(): void {

    this.showPremiumModal = false;

    // Route à adapter lorsque la page Premium sera créée.
    this.router.navigate([
      '/dashboard/premium'
    ]);
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  goBack(): void {

    this.router.navigate([
      '/dashboard'
    ]);
  }

  // ============================================================
  // HELPERS
  // ============================================================

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

  isStoryActive(content: Content): boolean {

    if (content.type !== 'story') {
      return false;
    }

    if (content.status !== 'published') {
      return false;
    }

    if (!content.expiresAt) {
      return true;
    }

    return new Date(content.expiresAt) > new Date();
  }

  formatNumber(value: number): string {

    return new Intl.NumberFormat(
      'fr-FR'
    ).format(value);
  }

  formatDate(date: string): string {

    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(new Date(date));
  }
onStoryPremiumRequired(): void {
  this.showPremiumModal = true;
}
  onStorySubmitted(data: StoryFormData): void {

  const now = new Date();

  const expiresAt = new Date(
    now.getTime() + 24 * 60 * 60 * 1000
  );

  if (this.selectedContent) {

    this.contentService.update(
      this.selectedContent.id,
      {
        content: data.content,
        image: data.image,
        video: data.video,
        visibility: data.visibility,
        communityId: data.communityId,
        communityName: data.communityName,
        expiresAt: expiresAt.toISOString(),
        status: 'published'
      }
    );

  } else {

    this.contentService.create({
      type: 'story',
      content: data.content,
      image: data.image,
      video: data.video,
      visibility: data.visibility,
      communityId: data.communityId,
      communityName: data.communityName,
      authorId: 'supplier-001',
      authorName: 'Mamadou Diallo',
      expiresAt: expiresAt.toISOString(),
      status: 'published'
    });

  }

  this.closeStoryModal();
  this.loadContents();
}
}