import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Community } from '../../../models/community.model';
import { CommunityService } from '../../../services/community.service';

interface CommunityForm {
  name: string;
  category: string;
  description: string;
  longDescription: string;
  icon: string;
  cover: string;

  isPublic: boolean;
  allowMembers: boolean;
  allowComments: boolean;
  allowLives: boolean;

  liveCapacity: number;
  liveDuration: number;

  rules: string;
}

@Component({
  selector: 'app-create-community',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-community.html',
  styleUrl: './create-community.css'
})
export class CreateCommunityComponent {

  /* =========================================================
     FORM
  ========================================================= */

  community: CommunityForm = {
    name: '',
    category: '',
    description: '',
    longDescription: '',
    icon: '🌍',
    cover: '',

    isPublic: true,
    allowMembers: true,
    allowComments: true,
    allowLives: true,

    liveCapacity: 300,
    liveDuration: 180,

    rules: ''
  };


  /* =========================================================
     DATA
  ========================================================= */

  categories: string[] = [
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

  icons: string[] = [
    '🌍',
    '🛍️',
    '💼',
    '🚀',
    '🌱',
    '💻',
    '📱',
    '🏠',
    '👗',
    '🍎',
    '🚗',
    '🎨',
    '⚡',
    '🤝',
    '💡'
  ];


  /* =========================================================
     STATE
  ========================================================= */

  currentStep = 1;

  totalSteps = 3;

  isSubmitting = false;

  showEmojiPicker = false;

  showPremiumModal = false;

  errors: {
    name?: string;
    category?: string;
    description?: string;
    longDescription?: string;
    rules?: string;
  } = {};


  /* =========================================================
     CONSTRUCTOR
  ========================================================= */

  constructor(
    private router: Router,
    private communityService: CommunityService
  ) {}


  /* =========================================================
     NAVIGATION
  ========================================================= */

  goBack(): void {

    this.router.navigate([
      '/dashboard/community'
    ]);

  }


  /* =========================================================
     STEP NAVIGATION
  ========================================================= */

  nextStep(): void {

    if (!this.validateStep(this.currentStep)) {
      return;
    }

    if (this.currentStep < this.totalSteps) {

      this.currentStep++;

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }

  }


  previousStep(): void {

    if (this.currentStep > 1) {

      this.currentStep--;

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }

  }


  goToStep(step: number): void {

    if (step < this.currentStep) {

      this.currentStep = step;

      return;

    }


    if (step > this.currentStep) {

      if (!this.validateStep(this.currentStep)) {
        return;
      }

      this.currentStep = step;

    }

  }


  /* =========================================================
     VALIDATION
  ========================================================= */

  validateStep(step: number): boolean {

    this.errors = {};


    if (step === 1) {

      if (!this.community.name.trim()) {

        this.errors.name =
          'Le nom de la communauté est obligatoire.';

      }

      else if (
        this.community.name.trim().length < 3
      ) {

        this.errors.name =
          'Le nom doit contenir au moins 3 caractères.';

      }


      if (!this.community.category) {

        this.errors.category =
          'Sélectionnez une catégorie.';

      }


      if (!this.community.description.trim()) {

        this.errors.description =
          'Ajoutez une courte description.';

      }

      else if (
        this.community.description.trim().length < 20
      ) {

        this.errors.description =
          'La description doit contenir au moins 20 caractères.';

      }


      return Object.keys(this.errors).length === 0;

    }


    if (step === 2) {

      if (!this.community.longDescription.trim()) {

        this.errors.longDescription =
          'Présentez votre communauté plus en détail.';

      }


      return Object.keys(this.errors).length === 0;

    }


    if (step === 3) {

      if (!this.community.rules.trim()) {

        this.errors.rules =
          'Ajoutez quelques règles pour votre communauté.';

      }


      return Object.keys(this.errors).length === 0;

    }


    return true;

  }


  /* =========================================================
     ICON
  ========================================================= */

  selectIcon(icon: string): void {

    this.community.icon = icon;

    this.showEmojiPicker = false;

  }


  toggleEmojiPicker(): void {

    this.showEmojiPicker =
      !this.showEmojiPicker;

  }


  /* =========================================================
     COVER
  ========================================================= */

  onCoverSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;


    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;

    }


    const file =
      input.files[0];


    if (!file.type.startsWith('image/')) {

      return;

    }


    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        'L’image ne doit pas dépasser 5 Mo.'
      );

      input.value = '';

      return;

    }


    if (
      this.community.cover &&
      this.community.cover.startsWith('blob:')
    ) {

      URL.revokeObjectURL(
        this.community.cover
      );

    }


    this.community.cover =
      URL.createObjectURL(file);


    input.value = '';

  }


  removeCover(): void {

    if (
      this.community.cover &&
      this.community.cover.startsWith('blob:')
    ) {

      URL.revokeObjectURL(
        this.community.cover
      );

    }


    this.community.cover = '';

  }


  /* =========================================================
     CREATE COMMUNITY
  ========================================================= */

  createCommunity(): void {

    if (this.isSubmitting) {
      return;
    }


    /* =========================
       VALIDATION
    ========================== */

    if (!this.validateStep(1)) {

      this.currentStep = 1;

      return;

    }


    if (!this.validateStep(2)) {

      this.currentStep = 2;

      return;

    }


    if (!this.validateStep(3)) {

      this.currentStep = 3;

      return;

    }


    /* =========================
       LIMIT STANDARD
    ========================== */

    const myCommunities =
      this.communityService
        .getMyCommunities();


    if (myCommunities.length >= 3) {

      this.openPremiumModal();

      return;

    }


    /* =========================
       SUBMITTING
    ========================== */

    this.isSubmitting = true;


    /* =========================
       CREATE COMMUNITY OBJECT
    ========================== */

    const newCommunity: Community = {

      id: `comm-${Date.now()}`,

      name:
        this.community.name.trim(),

      category:
        this.community.category,

      description:
        this.community.description.trim(),

      icon:
        this.community.icon,

      cover:
        this.community.cover,

      admin:
        'Vous',

      members: 1,

      posts: 0,

      products: 0,

      verified: false,

      /*
       * IMPORTANT
       * Le créateur est automatiquement
       * membre ET administrateur.
       */

      isMember: true,

      isAdmin: true,

      avatars: []

    };


    /* =========================
       SAVE IN SERVICE
    ========================== */

    this.communityService
      .createCommunity(newCommunity);


    /* =========================
       LOG
    ========================== */

    console.log(
      'Nouvelle communauté créée :',
      newCommunity
    );


    /* =========================
       REDIRECT
    ========================== */

    setTimeout(() => {

      this.isSubmitting = false;

      this.router.navigate([
        '/dashboard/community'
      ]);

    }, 300);

  }


  /* =========================================================
     COUNTERS
  ========================================================= */

  get nameLength(): number {

    return this.community.name.length;

  }


  get descriptionLength(): number {

    return this.community.description.length;

  }


  get longDescriptionLength(): number {

    return this.community.longDescription.length;

  }


  /* =========================================================
     PREVIEW
  ========================================================= */

  get previewName(): string {

    return this.community.name.trim()
      || 'Nom de votre communauté';

  }


  get previewCategory(): string {

    return this.community.category
      || 'Catégorie';

  }


  get previewDescription(): string {

    return this.community.description.trim()
      || 'Votre description apparaîtra ici.';

  }


  /* =========================================================
     DEFAULT / PREVIEW COVER
  ========================================================= */

  get previewCover(): string {

    if (this.community.cover) {

      return `url("${this.community.cover}")`;

    }


    return `
      linear-gradient(
        135deg,
        #1769e0,
        #0d47a1
      )
    `;

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
     DESTROY
  ========================================================= */

  ngOnDestroy(): void {

    if (
      this.community.cover &&
      this.community.cover.startsWith('blob:')
    ) {

      URL.revokeObjectURL(
        this.community.cover
      );

    }

    document.body.style.overflow =
      'auto';

  }

}