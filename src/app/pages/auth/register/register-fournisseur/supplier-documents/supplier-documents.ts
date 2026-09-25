import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { RegistrationService }
  from '../../../../../services/registration.service';

import { RegistrationSessionService }
  from '../../../../../services/registration-session.service';

interface SupplierDocument {
  id: string;
  title: string;
  description: string;
  icon: string;
  required: boolean;
  file: File | null;
  fileName: string;
  status: 'empty' | 'uploaded';
}

@Component({
  selector: 'app-supplier-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supplier-documents.html',
  styleUrl: './supplier-documents.css'
})
export class SupplierDocumentsComponent {

  currentYear = new Date().getFullYear();

  isSubmitting = false;
  uploadError = '';

  registration_id = '';
  registration_token = '';

  documents: SupplierDocument[] = [
    {
      id: 'identity',
      title: 'Pièce d’identité',
      description:
        'Carte d’identité, passeport ou autre document officiel permettant de vous identifier.',
      icon: 'badge',
      required: true,
      file: null,
      fileName: '',
      status: 'empty'
    },
    {
      id: 'business',
      title: 'Registre du Commerce (RCCM)',
      description:
        'Donnez nous une copie du registre de commerce (RCCM) de votre entreprise.',
      icon: 'business',
      required: true,
      file: null,
      fileName: '',
      status: 'empty'
    },
    {
      id: 'tax',
      title: 'Numéro d\'Identification Fiscale (NIF)',
      description:
        'Donnez nous une copie de votre numéro d\'identification fiscale (NIF).',
      icon: 'receipt_long',
      required: true,
      file: null,
      fileName: '',
      status: 'empty'
    }
  ];

  constructor(
    private router: Router,
    private registrationService: RegistrationService,
    private registrationSession: RegistrationSessionService
  ) {
    this.loadRegistrationData();
  }

  /**
   * Récupère le registrationId et le registrationToken
   * depuis la session d'inscription.
   *
   * La session est créée après la vérification OTP.
   */
  private loadRegistrationData(): void {

    const registrationId =
      this.registrationSession.getRegistrationId();

    const registrationToken =
      this.registrationSession.getRegistrationToken();

    if (
      registrationId &&
      registrationToken
    ) {

      this.registration_id =
        registrationId;

      this.registration_token =
        registrationToken;

      console.log(
        '🆔 Registration ID récupéré depuis la session :',
        this.registration_id
      );

      console.log(
        '🔐 Registration Token récupéré depuis la session.'
      );

      return;
    }

    /*
     * Fallback pour conserver le comportement
     * actuel avec history.state.
     */
    const navigation = this.router.getCurrentNavigation();

    const state = navigation?.extras?.state;

    if (
      state?.['registration_id'] &&
      state?.['registration_token']
    ) {

      this.registration_id =
        state['registration_id'];

      this.registration_token =
        state['registration_token'];

      /*
       * On remet également les informations
       * dans la session afin que le guard
       * puisse continuer à fonctionner.
       */
      this.registrationSession.setSession(
        this.registration_id,
        this.registration_token
      );

      console.log(
        '🆔 Registration ID reçu :',
        this.registration_id
      );

      console.log(
        '🔐 Registration Token reçu.'
      );

      return;
    }

    /*
     * Fallback lorsque la page est rechargée.
     */
    const historyState = history.state;

    if (
      historyState?.['registration_id'] &&
      historyState?.['registration_token']
    ) {

      this.registration_id =
        historyState.registration_id;

      this.registration_token =
        historyState.registration_token;

      /*
       * On remet également les informations
       * dans la session.
       */
      this.registrationSession.setSession(
        this.registration_id,
        this.registration_token
      );

      console.log(
        '🆔 Registration ID récupéré depuis history.state :',
        this.registration_id
      );

      console.log(
        '🔐 Registration Token récupéré depuis history.state.'
      );

      return;
    }

    console.error(
      '❌ Informations d’inscription introuvables.'
    );

    this.uploadError =
      'Votre session d’inscription est introuvable. Veuillez recommencer.';

    setTimeout(() => {

      this.router.navigate([
        '/auth/register-fournisseur'
      ]);

    }, 2500);
  }

  get requiredDocuments(): SupplierDocument[] {
    return this.documents.filter(
      document => document.required
    );
  }

  get uploadedRequiredDocuments(): number {
    return this.requiredDocuments.filter(
      document => document.status === 'uploaded'
    ).length;
  }

  get requiredDocumentsComplete(): boolean {
    return this.requiredDocuments.every(
      document => document.status === 'uploaded'
    );
  }

  get progressPercentage(): number {

    if (!this.requiredDocuments.length) {
      return 0;
    }

    return Math.round(
      (
        this.uploadedRequiredDocuments /
        this.requiredDocuments.length
      ) * 100
    );
  }

  openFileSelector(
    input: HTMLInputElement
  ): void {

    input.click();
  }

  onFileSelected(
    event: Event,
    documentId: string
  ): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    this.uploadError = '';

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {

      this.uploadError =
        'Le fichier est trop volumineux. La taille maximale autorisée est de 10 Mo.';

      input.value = '';

      return;
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {

      this.uploadError =
        'Format non accepté. Utilisez un fichier PDF, JPG, PNG ou WEBP.';

      input.value = '';

      return;
    }

    const document =
      this.documents.find(
        item => item.id === documentId
      );

    if (!document) {
      return;
    }

    document.file = file;
    document.fileName = file.name;
    document.status = 'uploaded';
  }

  removeFile(
    documentId: string
  ): void {

    const document =
      this.documents.find(
        item => item.id === documentId
      );

    if (!document) {
      return;
    }

    document.file = null;
    document.fileName = '';
    document.status = 'empty';

    this.uploadError = '';
  }

  formatFileSize(
    file: File | null
  ): string {

    if (!file) {
      return '';
    }

    const sizeInMb =
      file.size / (1024 * 1024);

    if (sizeInMb < 1) {

      return `${Math.round(
        file.size / 1024
      )} Ko`;
    }

    return `${sizeInMb.toFixed(1)} Mo`;
  }

  /**
   * Envoie réellement les trois documents
   * au backend Spring Boot.
   */
  submitDocuments(): void {

    if (!this.requiredDocumentsComplete) {

      this.uploadError =
        'Veuillez importer tous les documents obligatoires avant de continuer.';

      return;
    }

    if (
      !this.registration_id ||
      !this.registration_token
    ) {

      this.uploadError =
        'Votre session d’inscription est invalide. Veuillez recommencer.';

      return;
    }

    if (this.isSubmitting) {
      return;
    }

    const identity =
      this.documents.find(
        document => document.id === 'identity'
      );

    const business =
      this.documents.find(
        document => document.id === 'business'
      );

    const tax =
      this.documents.find(
        document => document.id === 'tax'
      );

    if (
      !identity?.file ||
      !business?.file ||
      !tax?.file
    ) {

      this.uploadError =
        'Tous les documents obligatoires sont nécessaires.';

      return;
    }

    this.isSubmitting = true;
    this.uploadError = '';

    const files = {

      /*
       * Le backend attend :
       * identite_responsable
       */
      identiteResponsable:
        identity.file,

      /*
       * Le backend attend :
       * registre_commerce
       */
      registreCommerce:
        business.file,

      /*
       * Le backend attend :
       * nif
       */
      nif:
        tax.file
    };

    console.log(
      '📤 Envoi des documents fournisseur'
    );

    console.log(
      '🆔 Registration ID :',
      this.registration_id
    );

    console.log(
      '📄 Pièce d’identité :',
      identity.file.name
    );

    console.log(
      '📄 RCCM :',
      business.file.name
    );

    console.log(
      '📄 NIF :',
      tax.file.name
    );

    this.registrationService
      .uploadSupplierDocuments(
        this.registration_id,
        this.registration_token,
        files
      )
      .subscribe({

        next: (response) => {

          console.log(
            '✅ Documents envoyés avec succès :',
            response
          );

          this.isSubmitting = false;

          /*
           * L'inscription fournisseur est maintenant
           * terminée. On peut supprimer la session
           * temporaire.
           */
          this.registrationSession.clearSession();

          this.router.navigate(
            ['/auth/registration-success'],
            {
              state: {
                registration_id:
                  this.registration_id
              }
            }
          );
        },

        error: (error) => {

          console.error(
            '❌ Erreur envoi des documents'
          );

          console.error(
            'Status :',
            error?.status
          );

          console.error(
            'Status Text :',
            error?.statusText
          );

          console.error(
            'URL :',
            error?.url
          );

          console.error(
            'Error body :',
            error?.error
          );

          console.error(
            'Erreur complète :',
            error
          );

          this.isSubmitting = false;

          this.uploadError =
            error?.error?.message ??
            error?.error?.error ??
            error?.message ??
            'Impossible d’envoyer les documents. Veuillez réessayer.';
        }
      });
  }

  goBack(): void {

    this.router.navigate([
      '/auth/verify-account'
    ]);
  }

  goToInfo(): void {

    this.router.navigate([
      '/auth/register-info'
    ]);
  }
}