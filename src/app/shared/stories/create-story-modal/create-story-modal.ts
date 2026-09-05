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


export interface StoryFormData {
  content: string;
  image?: string;
  video?: string;
  visibility: ContentVisibility;

  /**
   * Communautés sélectionnées
   */
  communities: ContentCommunity[];
}


export interface StoryCommunity {
  id: string;
  name: string;
}


@Component({
  selector: 'app-create-story-modal',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    CommunityPickerComponent
  ],

  templateUrl: './create-story-modal.html',
  styleUrl: './create-story-modal.css',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateStoryModalComponent
  implements OnChanges, OnDestroy {


  @Input() visible = false;

  @Input() isPremium = false;

  @Input() content: Content | null = null;


  @Input() communities: StoryCommunity[] = [
    {
      id: 'comm-001',
      name: 'Commerce & Import Mali'
    },
    {
      id: 'comm-002',
      name: 'Produits agricoles Afrique de l’Ouest'
    },
    {
      id: 'comm-003',
      name: 'Électronique & Smartphones Mali'
    }
  ];


  @Output() closed =
    new EventEmitter<void>();

  @Output() submitted =
    new EventEmitter<StoryFormData>();

  @Output() premiumRequired =
    new EventEmitter<void>();


  // =========================================================
  // COMMUNITY PICKER
  // =========================================================

  /**
   * Communautés sélectionnées
   */
  selectedCommunities: ContentCommunity[] = [];


  /**
   * Affichage du picker
   */
  communityPickerVisible = false;


  // =========================================================
  // FORMULAIRE
  // =========================================================

  form: StoryFormData = {
    content: '',
    visibility: 'community',
    communities: []
  };


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

    if (
      changes['visible'] ||
      changes['content']
    ) {
      this.loadForm();
    }
  }


  // =========================================================
  // GETTERS
  // =========================================================

  get isEditing(): boolean {
    return !!this.content;
  }


  get contentLength(): number {
    return this.form.content.length;
  }


  get canPublish(): boolean {

    const hasText =
      this.form.content.trim().length > 0;

    const hasMedia =
      !!this.form.image ||
      !!this.form.video;


    if (!hasText && !hasMedia) {
      return false;
    }


    // =======================================================
    // PUBLIC → PREMIUM
    // =======================================================

    if (
      this.form.visibility === 'public' &&
      !this.isPremium
    ) {
      return false;
    }


    // =======================================================
    // COMMUNITY → AU MOINS UNE COMMUNAUTÉ
    // =======================================================

    if (
      this.form.visibility === 'community' &&
      this.selectedCommunities.length === 0
    ) {
      return false;
    }


    return true;
  }


  // =========================================================
  // INITIALISATION
  // =========================================================

  private loadForm(): void {

    this.clearObjectUrls();

    this.submittedForm = false;

    this.communityPickerVisible = false;


    if (this.content) {

      // =====================================================
      // MODE ÉDITION
      // =====================================================

      if (this.content.communities?.length) {

        this.selectedCommunities = [
          ...this.content.communities
        ];

      } else if (
        this.content.communityId &&
        this.content.communityName
      ) {

        /**
         * Compatibilité avec les anciennes stories
         */
        this.selectedCommunities = [
          {
            id: this.content.communityId,
            name: this.content.communityName
          }
        ];

      } else {

        this.selectedCommunities = [];
      }


      this.form = {

        content:
          this.content.content || '',

        image:
          this.content.image,

        video:
          this.content.video,

        visibility:
          this.content.visibility,

        communities: [
          ...this.selectedCommunities
        ]
      };


      this.imagePreview =
        this.content.image || '';

      this.videoPreview =
        this.content.video || '';


    } else {

      // =====================================================
      // MODE CRÉATION
      // =====================================================

      this.form = {

        content: '',

        visibility: 'community',

        communities: [],

        image: undefined,

        video: undefined
      };


      this.selectedCommunities = [];

      this.imagePreview = '';

      this.videoPreview = '';
    }


    this.cdr.markForCheck();
  }


  // =========================================================
  // COMMUNITY PICKER
  // =========================================================

  openCommunityPicker(): void {

    this.communityPickerVisible = true;

    this.cdr.markForCheck();
  }


  closeCommunityPicker(): void {

    this.communityPickerVisible = false;

    this.cdr.markForCheck();
  }


  onCommunitiesSelected(
    communities: ContentCommunity[]
  ): void {

    this.selectedCommunities = [
      ...communities
    ];

    this.form.communities = [
      ...communities
    ];

    this.communityPickerVisible = false;

    this.cdr.markForCheck();
  }


  // =========================================================
  // ACTIONS
  // =========================================================

  closeModal(): void {

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


  requestPremium(): void {
    this.premiumRequired.emit();
    this.closed.emit();
  }


  // =========================================================
  // IMAGE
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


    this.revokeImageUrl();


    this.imageObjectUrl =
      URL.createObjectURL(file);

    this.imagePreview =
      this.imageObjectUrl;

    this.form.image =
      this.imageObjectUrl;


    this.form.video = undefined;

    this.revokeVideoUrl();

    this.videoPreview = '';


    input.value = '';

    this.cdr.markForCheck();
  }


  // =========================================================
  // VIDEO
  // =========================================================

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


    this.revokeVideoUrl();


    this.videoObjectUrl =
      URL.createObjectURL(file);

    this.videoPreview =
      this.videoObjectUrl;

    this.form.video =
      this.videoObjectUrl;


    this.form.image = undefined;

    this.revokeImageUrl();

    this.imagePreview = '';


    input.value = '';

    this.cdr.markForCheck();
  }


  // =========================================================
  // MEDIA
  // =========================================================

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


  private clearObjectUrls(): void {

    this.revokeImageUrl();

    this.revokeVideoUrl();
  }


  // =========================================================
  // PUBLICATION
  // =========================================================

  publishStory(): void {

    this.submittedForm = true;


    // =======================================================
    // PREMIUM
    // =======================================================

    if (
      this.form.visibility === 'public' &&
      !this.isPremium
    ) {

      this.premiumRequired.emit();

      return;
    }


    // =======================================================
    // VALIDATION
    // =======================================================

    if (!this.canPublish) {

      this.cdr.markForCheck();

      return;
    }


    // =======================================================
    // DONNÉES
    // =======================================================

    const data: StoryFormData = {

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
      ]
    };


    this.submitted.emit(data);
  }


  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    this.clearObjectUrls();
  }
}