import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SupportFaq {
  question: string;
  answer: string;
  category: string;
  icon: string;
  open: boolean;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  categoryLabel: string;
  priority: 'low' | 'medium' | 'high';
  priorityLabel: string;
  status: 'open' | 'progress' | 'resolved';
  statusLabel: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  reference?: string;
  attachment?: string;
  response?: string;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './support.html',
  styleUrls: ['./support.css']
})
export class SupportComponent {

  /* =========================================================
     ÉTATS GÉNÉRAUX
     ========================================================= */

  searchQuery = signal('');
  selectedCategory = signal('products');

  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  isTicketModalOpen = signal(false);
  isConfirmModalOpen = signal(false);
  isTicketsModalOpen = signal(false);
  isTicketDetailModalOpen = signal(false);
  isContactModalOpen = signal(false);

  isSubmitting = signal(false);

  selectedTicket = signal<SupportTicket | null>(null);

  selectedFile = signal<File | null>(null);
  selectedFileName = signal<string | null>(null);

  /* =========================================================
     FORMULAIRE TICKET
     ========================================================= */

  ticketSubject = '';
  ticketCategory = 'tech';
  ticketPriority: 'low' | 'medium' | 'high' = 'medium';
  ticketDescription = '';
  ticketReference = '';

  /* =========================================================
     CATÉGORIES
     ========================================================= */

  readonly categories = [
    {
      id: 'all',
      label: 'Toutes',
      icon: 'apps'
    },
    {
      id: 'products',
      label: 'Produits',
      icon: 'inventory_2'
    },
    {
      id: 'payments',
      label: 'Paiements',
      icon: 'payments'
    },
    {
      id: 'account',
      label: 'Compte & Sécurité',
      icon: 'verified_user'
    },
    {
      id: 'orders',
      label: 'Commandes',
      icon: 'shopping_bag'
    },
    {
      id: 'technical',
      label: 'Technique',
      icon: 'build'
    }
  ];

  /* =========================================================
     FAQ
     ========================================================= */

  readonly faqs: SupportFaq[] = [

    {
      question: 'Comment ajouter un nouveau produit dans B2WA ?',
      answer:
        'Ouvrez le menu Produits, sélectionnez Nouveau produit, puis renseignez le nom, le prix, la catégorie, le stock et les images du produit.',
      category: 'products',
      icon: 'inventory_2',
      open: false
    },

    {
      question: 'Pourquoi mon stock ne se synchronise pas ?',
      answer:
        'Vérifiez votre connexion Internet, actualisez la page et contrôlez la date de dernière synchronisation. Si le problème continue, indiquez la référence du produit dans un ticket.',
      category: 'products',
      icon: 'sync',
      open: false
    },

    {
      question: 'Que faire en cas de paiement refusé ?',
      answer:
        'Vérifiez le montant, le moyen de paiement utilisé et le statut de la transaction. Ne partagez jamais de code secret ou de mot de passe dans un ticket.',
      category: 'payments',
      icon: 'payments',
      open: false
    },

    {
      question: 'Comment télécharger une facture ou un reçu ?',
      answer:
        'Depuis la page Commandes, ouvrez la commande concernée, puis cliquez sur Télécharger la facture ou Imprimer le reçu.',
      category: 'orders',
      icon: 'receipt_long',
      open: false
    },

    {
      question: 'Combien de temps faut-il pour recevoir une réponse ?',
      answer:
        'Les demandes urgentes liées à une caisse bloquée sont traitées en priorité. Les autres demandes sont généralement prises en charge dans un délai de 24 heures.',
      category: 'technical',
      icon: 'schedule',
      open: false
    },

    {
      question: 'Comment fonctionne l\'approvisionnement sur B2WA ?',
      answer:
        'B2WA vous permet de rechercher des fournisseurs et de consulter leurs informations commerciales avant de passer une commande. Vous pouvez comparer les offres et suivre l\'évolution de votre approvisionnement depuis votre espace commerçant.',
      category: 'orders',
      icon: 'local_shipping',
      open: false
    },

    {
      question: 'Comment faire vérifier mon compte commerçant ?',
      answer:
        'Rendez-vous dans les paramètres de votre compte et complétez votre dossier de vérification. Selon votre activité, B2WA peut demander une pièce d\'identité, un document commercial ou des informations complémentaires.',
      category: 'account',
      icon: 'verified_user',
      open: false
    },

    {
      question: 'Comment modifier les informations de ma boutique ?',
      answer:
        'Depuis votre profil commerçant, ouvrez la section Informations du commerce puis sélectionnez Modifier. Vous pourrez mettre à jour votre enseigne, votre secteur d’activité, votre adresse et votre présentation.',
      category: 'account',
      icon: 'store',
      open: false
    },

    {
      question: 'Que faire si je rencontre une erreur technique ?',
      answer:
        'Actualisez d’abord la page et vérifiez votre connexion Internet. Si l’erreur persiste, créez une demande auprès du support en indiquant le message d’erreur et, si possible, une capture d’écran.',
      category: 'technical',
      icon: 'bug_report',
      open: false
    }
  ];

  /* =========================================================
     TICKETS DE DÉMONSTRATION
     ========================================================= */

  tickets = signal<SupportTicket[]>([
    {
      id: 'B2WA-1048',
      subject: 'Problème de synchronisation du stock',
      category: 'products',
      categoryLabel: 'Produits & Stock',
      priority: 'medium',
      priorityLabel: 'Moyenne',
      status: 'open',
      statusLabel: 'Ouvert',
      description:
        'Mon stock ne semble plus se synchroniser correctement depuis la dernière mise à jour.',
      createdAt: '16 août 2026 à 08:32',
      updatedAt: 'Il y a 1 heure',
      reference: 'PRD-2048',
      response:
        'Bonjour, votre demande a bien été reçue. Notre équipe vérifie actuellement la synchronisation de votre catalogue.'
    },

    {
      id: 'B2WA-1039',
      subject: 'Paiement refusé',
      category: 'payments',
      categoryLabel: 'Paiements',
      priority: 'high',
      priorityLabel: 'Haute',
      status: 'progress',
      statusLabel: 'En cours',
      description:
        'Une transaction a été refusée alors que le montant semblait correct.',
      createdAt: '15 août 2026 à 16:14',
      updatedAt: 'Hier',
      reference: 'TXN-88321',
      response:
        'Notre équipe financière analyse actuellement la transaction concernée.'
    },

    {
      id: 'B2WA-1021',
      subject: 'Vérification de mon compte',
      category: 'account',
      categoryLabel: 'Compte & Sécurité',
      priority: 'low',
      priorityLabel: 'Basse',
      status: 'resolved',
      statusLabel: 'Résolu',
      description:
        'Je voulais connaître l’état de vérification de mon compte commerçant.',
      createdAt: '12 août 2026 à 11:20',
      updatedAt: '12 août 2026',
      response:
        'Votre compte commerçant a été vérifié avec succès. Vous pouvez maintenant utiliser toutes les fonctionnalités disponibles.'
    }
  ]);

  /* =========================================================
     FAQ FILTRÉES
     ========================================================= */

  filteredFaqs = computed(() => {

    const query = this.searchQuery()
      .trim()
      .toLowerCase();

    const category = this.selectedCategory();

    return this.faqs.filter(faq => {

      const matchesCategory =
        category === 'all' ||
        faq.category === category;

      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  });

  /* =========================================================
     STATISTIQUES
     ========================================================= */

  openTicketsCount = computed(() =>
    this.tickets().filter(
      ticket => ticket.status !== 'resolved'
    ).length
  );

  resolvedTicketsCount = computed(() =>
    this.tickets().filter(
      ticket => ticket.status === 'resolved'
    ).length
  );

  /* =========================================================
     FAQ
     ========================================================= */

  toggleFaq(faq: SupportFaq): void {
    faq.open = !faq.open;
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  /* =========================================================
     MODAL TICKET
     ========================================================= */

  openTicketModal(): void {
    this.resetTicketForm();
    this.isTicketModalOpen.set(true);
    this.clearMessages();
  }

  closeTicketModal(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isTicketModalOpen.set(false);
  }

  /* =========================================================
     VALIDATION AVANT CONFIRMATION
     ========================================================= */

  continueTicket(): void {

    this.clearMessages();

    if (!this.ticketSubject.trim()) {
      this.errorMessage.set(
        'Veuillez renseigner le sujet de votre demande.'
      );
      return;
    }

    if (!this.ticketDescription.trim()) {
      this.errorMessage.set(
        'Veuillez décrire votre problème avant de continuer.'
      );
      return;
    }

    if (this.ticketDescription.trim().length < 15) {
      this.errorMessage.set(
        'La description doit contenir au moins 15 caractères.'
      );
      return;
    }

    this.isConfirmModalOpen.set(true);
  }

  closeConfirmModal(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isConfirmModalOpen.set(false);
  }

  /* =========================================================
     ENVOI DU TICKET
     ========================================================= */

  submitTicket(): void {

    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    setTimeout(() => {

      const newTicket: SupportTicket = {
        id: this.generateTicketId(),

        subject: this.ticketSubject.trim(),

        category: this.ticketCategory,

        categoryLabel:
          this.getCategoryLabel(this.ticketCategory),

        priority: this.ticketPriority,

        priorityLabel:
          this.getPriorityLabel(this.ticketPriority),

        status: 'open',

        statusLabel: 'Ouvert',

        description:
          this.ticketDescription.trim(),

        createdAt:
          '16 août 2026 à maintenant',

        updatedAt:
          'À l’instant',

        reference:
          this.ticketReference.trim() || undefined,

        attachment:
          this.selectedFileName() || undefined,

        response:
          'Votre demande a bien été enregistrée. Notre équipe support reviendra vers vous prochainement.'
      };

      this.tickets.update(current => [
        newTicket,
        ...current
      ]);

      this.isSubmitting.set(false);

      this.isConfirmModalOpen.set(false);
      this.isTicketModalOpen.set(false);

      this.resetTicketForm();

      this.successMessage.set(
        `Votre demande ${newTicket.id} a été envoyée avec succès.`
      );

      setTimeout(() => {
        this.successMessage.set(null);
      }, 5000);

    }, 1000);
  }

  /* =========================================================
     MES TICKETS
     ========================================================= */

  openTicketsModal(): void {
    this.isTicketsModalOpen.set(true);
    this.clearMessages();
  }

  closeTicketsModal(): void {
    this.isTicketsModalOpen.set(false);
  }

  openTicketDetail(ticket: SupportTicket): void {
    this.selectedTicket.set(ticket);

    this.isTicketsModalOpen.set(false);
    this.isTicketDetailModalOpen.set(true);
  }

  closeTicketDetail(): void {
    this.isTicketDetailModalOpen.set(false);
    this.selectedTicket.set(null);
  }

  /* =========================================================
     CONTACT
     ========================================================= */

  openContactModal(): void {
    this.isContactModalOpen.set(true);
    this.clearMessages();
  }

  closeContactModal(): void {
    this.isContactModalOpen.set(false);
  }

  /* =========================================================
     PIÈCE JOINTE
     ========================================================= */

  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {

      this.errorMessage.set(
        'La pièce jointe ne doit pas dépasser 5 Mo.'
      );

      input.value = '';

      return;
    }

    this.selectedFile.set(file);
    this.selectedFileName.set(file.name);

    this.errorMessage.set(null);
  }

  removeAttachment(): void {
    this.selectedFile.set(null);
    this.selectedFileName.set(null);
  }

  /* =========================================================
     HELPERS
     ========================================================= */

  getCategoryLabel(category: string): string {

    const labels: Record<string, string> = {
      tech: 'Problème technique',
      billing: 'Facturation & Paiements',
      account: 'Gestion du compte',
      products: 'Produits & Stock',
      orders: 'Commandes',
      other: 'Autre demande'
    };

    return labels[category] ?? 'Autre demande';
  }

  getPriorityLabel(priority: string): string {

    const labels: Record<string, string> = {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute / Urgente'
    };

    return labels[priority] ?? 'Moyenne';
  }

  getTicketStatusClass(
    status: SupportTicket['status']
  ): string {

    switch (status) {

      case 'open':
        return 'status-open';

      case 'progress':
        return 'status-progress';

      case 'resolved':
        return 'status-resolved';

      default:
        return '';
    }
  }

  getPriorityClass(
    priority: SupportTicket['priority']
  ): string {

    switch (priority) {

      case 'high':
        return 'priority-high';

      case 'medium':
        return 'priority-medium';

      case 'low':
        return 'priority-low';

      default:
        return '';
    }
  }

  private generateTicketId(): string {

    const number =
      Math.floor(
        1000 + Math.random() * 8999
      );

    return `B2WA-${number}`;
  }

  private resetTicketForm(): void {

    this.ticketSubject = '';
    this.ticketCategory = 'tech';
    this.ticketPriority = 'medium';
    this.ticketDescription = '';
    this.ticketReference = '';

    this.selectedFile.set(null);
    this.selectedFileName.set(null);

    this.clearMessages();
  }

  private clearMessages(): void {

    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}