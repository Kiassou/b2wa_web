import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

    liveCapacity: 100,
    liveDuration: 60,

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
    private router: Router
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

      else if (this.community.name.trim().length < 3) {
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

      else if (this.community.description.trim().length < 20) {
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

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        'L’image ne doit pas dépasser 5 Mo.'
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      this.community.cover =
        reader.result as string;

    };

    reader.readAsDataURL(file);
  }


  removeCover(): void {
    this.community.cover = '';
  }


  /* =========================================================
     CREATE COMMUNITY
     ========================================================= */

  createCommunity(): void {

    if (this.isSubmitting) {
      return;
    }

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


    this.isSubmitting = true;


    /*
     * Pour le moment, on simule la création.
     *
     * Plus tard :
     * this.communityService.createCommunity(...)
     *
     * sera utilisé pour envoyer les données
     * au backend B2WA.
     */

    setTimeout(() => {

      console.log(
        'Nouvelle communauté :',
        this.community
      );

      this.isSubmitting = false;

      this.router.navigate([
        '/dashboard/community'
      ]);

    }, 1000);
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
     DEFAULT COVER
     ========================================================= */

  get previewCover(): string {

    if (this.community.cover) {
      return this.community.cover;
    }

    return `
      linear-gradient(
        135deg,
        #1769e0,
        #0d47a1
      )
    `;
  }
}