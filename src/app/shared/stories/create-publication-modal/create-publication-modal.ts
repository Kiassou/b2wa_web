import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Content,
  ContentCommunity,
  ContentVisibility
} from '../../../models/content.model';

import { CommunityPickerComponent } from '../../community-picker/community-picker';

export interface PublicationFormData {
  title: string;
  content: string;
  image?: string;
  video?: string;
  visibility: ContentVisibility;

  /**
   * Nouvelles communautés sélectionnées
   */
  communities: ContentCommunity[];

  /**
   * Ancien format conservé temporairement
   * pour la compatibilité avec le reste de l'application.
   */
  communityId?: string;
  communityName?: string;
}

export interface PublicationCommunity {
  id: string;
  name: string;
}

@Component({
  selector: 'app-create-publication-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CommunityPickerComponent
  ],
  templateUrl: './create-publication-modal.html',
  styleUrl: './create-publication-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePublicationModalComponent
  implements OnChanges, OnDestroy {

  @Input() visible = false;
  @Input() isPremium = false;
  @Input() content: Content | null = null;

  /**
   * Communautés disponibles.
   *
   * stories.ts lui transmettra uniquement
   * les communautés dont le commerçant est admin.
   */
  @Input() communities: PublicationCommunity[] = [];

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<PublicationFormData>();
  @Output() premiumRequired = new EventEmitter<void>();

  // =========================================================
  // FORMULAIRE
  // =========================================================

  form: PublicationFormData = {
    title: '',
    content: '',
    visibility: 'community',
    communities: []
  };

  // =========================================================
  // COMMUNAUTÉS
  // =========================================================

  /**
   * Communautés actuellement sélectionnées.
   */
  selectedCommunities: ContentCommunity[] = [];

  /**
   * Affichage du petit modal de sélection.
   */
  communityPickerVisible = false;

  // =========================================================
  // MÉDIAS
  // =========================================================

  imagePreview = '';
  videoPreview = '';
  submittedForm = false;

  private imageObjectUrl = '';
  private videoObjectUrl = '';

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  // =========================================================
  // LIFECYCLE
  // =========================================================

  ngOnChanges(changes: SimpleChanges): void {

    if (!this.visible) {
      return;
    }

    if (changes['visible'] || changes['content']) {
      this.loadForm();
    }
  }

  ngOnDestroy(): void {
    this.revokeImageUrl();
    this.revokeVideoUrl();
  }

  // =========================================================
  // INITIALISATION DU FORMULAIRE
  // =========================================================

  private loadForm(): void {

    this.submittedForm = false;
    this.communityPickerVisible = false;

    if (this.content) {

      // =====================================================
      // MODE ÉDITION
      // =====================================================

      const existingCommunities: ContentCommunity[] =
        this.content.communities?.length
          ? [...this.content.communities]
          : this.content.communityId
            ? [
                {
                  id: this.content.communityId,
                  name: this.content.communityName || ''
                }
              ]
            : [];

      this.selectedCommunities = [
        ...existingCommunities
      ];

      this.form = {
        title: this.content.title || '',
        content: this.content.content || '',
        visibility: this.content.visibility || 'community',

        communities: [
          ...existingCommunities
        ],

        /**
         * Compatibilité ancien format
         */
        communityId: this.content.communityId,
        communityName: this.content.communityName,

        image: this.content.image,
        video: this.content.video
      };

      this.imagePreview = this.content.image || '';
      this.videoPreview = this.content.video || '';

    } else {

      // =====================================================
      // MODE CRÉATION
      // =====================================================

      this.selectedCommunities = [];

      this.form = {
        title: '',
        content: '',
        visibility: 'community',
        communities: []
      };

      this.removeMedia();
    }

    this.cdr.markForCheck();
  }

  // =========================================================
  // GETTERS
  // =========================================================

  get isEditing(): boolean {
    return !!this.content;
  }

  get titleLength(): number {
    return this.form.title
      ? this.form.title.length
      : 0;
  }

  get contentLength(): number {
    return this.form.content
      ? this.form.content.length
      : 0;
  }

  /**
   * Nombre de communautés sélectionnées.
   */
  get selectedCommunitiesCount(): number {
    return this.selectedCommunities.length;
  }

  /**
   * Vérifie si la publication peut être envoyée.
   */
  get canPublish(): boolean {

    const hasTitle =
      (this.form.title || '').trim().length > 0;

    const hasContent =
      (this.form.content || '').trim().length > 0;

    if (!hasTitle || !hasContent) {
      return false;
    }

    // -------------------------------------------------------
    // PUBLIC = PREMIUM
    // -------------------------------------------------------

    if (
      this.form.visibility === 'public' &&
      !this.isPremium
    ) {
      return false;
    }

    // -------------------------------------------------------
    // COMMUNAUTÉ
    // -------------------------------------------------------

    if (
      this.form.visibility === 'community' &&
      this.selectedCommunities.length === 0
    ) {
      return false;
    }

    return true;
  }

  // =========================================================
  // COMMUNAUTÉS
  // =========================================================

  /**
   * Ouvre le sélecteur de communautés.
   */
  openCommunityPicker(): void {

    this.communityPickerVisible = true;

    this.cdr.markForCheck();
  }

  /**
   * Ferme le sélecteur sans modifier
   * la sélection actuelle.
   */
  closeCommunityPicker(): void {

    this.communityPickerVisible = false;

    this.cdr.markForCheck();
  }

  /**
   * Reçoit les communautés sélectionnées
   * depuis CommunityPickerComponent.
   */
  onCommunitiesSelected(
    communities: ContentCommunity[]
  ): void {

    this.selectedCommunities = [
      ...communities
    ];

    this.form.communities = [
      ...communities
    ];

    // -------------------------------------------------------
    // Compatibilité ancien format
    // -------------------------------------------------------

    if (communities.length > 0) {

      this.form.communityId =
        communities[0].id;

      this.form.communityName =
        communities[0].name;

    } else {

      this.form.communityId = undefined;
      this.form.communityName = undefined;
    }

    this.communityPickerVisible = false;

    this.cdr.markForCheck();
  }

  /**
   * Permet d'afficher les noms sélectionnés
   * dans le bouton du formulaire.
   */
  get selectedCommunityNames(): string {

    return this.selectedCommunities
      .map(community => community.name)
      .join(', ');
  }

  // =========================================================
  // MÉDIAS (IMAGE & VIDÉO)
  // =========================================================

  onImageSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {

      alert(
        'Veuillez sélectionner une image valide.'
      );

      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {

      alert(
        'L’image ne doit pas dépasser 5 Mo.'
      );

      input.value = '';
      return;
    }

    this.removeMedia();

    this.imageObjectUrl =
      URL.createObjectURL(file);

    this.imagePreview =
      this.imageObjectUrl;

    this.form.image =
      this.imageObjectUrl;

    input.value = '';

    this.cdr.markForCheck();
  }

  onVideoSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('video/')) {

      alert(
        'Veuillez sélectionner une vidéo valide.'
      );

      input.value = '';
      return;
    }

    if (file.size > 30 * 1024 * 1024) {

      alert(
        'La vidéo ne doit pas dépasser 30 Mo.'
      );

      input.value = '';
      return;
    }

    this.removeMedia();

    this.videoObjectUrl =
      URL.createObjectURL(file);

    this.videoPreview =
      this.videoObjectUrl;

    this.form.video =
      this.videoObjectUrl;

    input.value = '';

    this.cdr.markForCheck();
  }

  removeMedia(): void {

    this.revokeImageUrl();
    this.revokeVideoUrl();

    this.imagePreview = '';
    this.videoPreview = '';

    this.form.image = undefined;
    this.form.video = undefined;

    this.cdr.markForCheck();
  }

  private revokeImageUrl(): void {

    if (this.imageObjectUrl) {

      URL.revokeObjectURL(
        this.imageObjectUrl
      );

      this.imageObjectUrl = '';
    }
  }

  private revokeVideoUrl(): void {

    if (this.videoObjectUrl) {

      URL.revokeObjectURL(
        this.videoObjectUrl
      );

      this.videoObjectUrl = '';
    }
  }

  // =========================================================
  // ACTIONS ET GESTION DU FORMULAIRE
  // =========================================================

  closeModal(): void {

    this.communityPickerVisible = false;

    this.closed.emit();
  }

selectVisibility(
  visibility: ContentVisibility
): void {

  if (visibility === 'public' && !this.isPremium) {
    this.closed.emit();
    this.premiumRequired.emit();
    return;
  }

  this.form.visibility = visibility;

  if (visibility === 'public') {
    this.selectedCommunities = [];
    this.form.communities = [];
  }

  this.cdr.markForCheck();
}

  /**
   * Ancienne méthode conservée temporairement.
   *
   * Elle ne sert plus avec le CommunityPicker,
   * mais permet d'éviter une erreur si elle est
   * encore appelée quelque part.
   */
  onCommunityChange(event: Event): void {

    const select =
      event.target as HTMLSelectElement;

    const communityId =
      select.value;

    const community =
      this.communities.find(
        item => item.id === communityId
      );

    if (!community) {

      this.onCommunitiesSelected([]);

      return;
    }

    this.onCommunitiesSelected([
      {
        id: community.id,
        name: community.name
      }
    ]);
  }

  requestPremium(): void {

    this.premiumRequired.emit();
  }

  // =========================================================
  // PUBLICATION
  // =========================================================

  publishPublication(): void {

    this.submittedForm = true;

    // -------------------------------------------------------
    // PREMIUM
    // -------------------------------------------------------

    if (
      this.form.visibility === 'public' &&
      !this.isPremium
    ) {

      this.premiumRequired.emit();

      return;
    }

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!this.canPublish) {

      this.cdr.markForCheck();

      return;
    }

    // -------------------------------------------------------
    // DONNÉES
    // -------------------------------------------------------

    const data: PublicationFormData = {

      title:
        this.form.title.trim(),

      content:
        this.form.content.trim(),

      image:
        this.form.image,

      video:
        this.form.video,

      visibility:
        this.form.visibility,

      communities: [
        ...this.selectedCommunities
      ],

      /**
       * Compatibilité ancien format.
       */
      communityId:
        this.selectedCommunities[0]?.id,

      communityName:
        this.selectedCommunities[0]?.name
    };

    this.submitted.emit(data);
  }
}