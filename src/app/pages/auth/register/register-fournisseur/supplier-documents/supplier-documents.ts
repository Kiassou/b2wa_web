import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
    },
    /*{
      id: 'address',
      title: 'Justificatif d’adresse',
      description:
        'Document permettant de confirmer l’adresse de votre activité ou de votre établissement.',
      icon: 'location_on',
      required: false,
      file: null,
      fileName: '',
      status: 'empty'
    }*/
  ];

  constructor(private router: Router) {}

  get requiredDocuments(): SupplierDocument[] {
    return this.documents.filter(document => document.required);
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
      (this.uploadedRequiredDocuments / this.requiredDocuments.length) * 100
    );
  }

  openFileSelector(input: HTMLInputElement): void {
    input.click();
  }

  onFileSelected(
    event: Event,
    documentId: string
  ): void {

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.uploadError = '';

    const maxSize = 10 * 1024 * 1024;

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

    const document = this.documents.find(
      item => item.id === documentId
    );

    if (!document) {
      return;
    }

    document.file = file;
    document.fileName = file.name;
    document.status = 'uploaded';
  }

  removeFile(documentId: string): void {

    const document = this.documents.find(
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

  formatFileSize(file: File | null): string {

    if (!file) {
      return '';
    }

    const sizeInMb = file.size / (1024 * 1024);

    if (sizeInMb < 1) {
      return `${Math.round(file.size / 1024)} Ko`;
    }

    return `${sizeInMb.toFixed(1)} Mo`;
  }

  submitDocuments(): void {

    if (!this.requiredDocumentsComplete) {

      this.uploadError =
        'Veuillez importer tous les documents obligatoires avant de continuer.';

      return;
    }

    this.isSubmitting = true;
    this.uploadError = '';

    /*
     * Simulation temporaire.
     *
     * Plus tard :
     * - envoyer les fichiers au backend Spring Boot
     * - enregistrer les documents
     * - associer les fichiers au fournisseur
     * - lancer éventuellement une vérification
     */

    setTimeout(() => {

      this.isSubmitting = false;

      this.router.navigate([
        '/auth/registration-success'
      ]);

    }, 900);
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
