import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Notification,
  NotificationType
} from '../../models/notification.model';

import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class NotificationsComponent implements OnInit {

  // =========================================================
  // UTILISATEUR CONNECTÉ
  // =========================================================

  /**
   * Pour la simulation.
   *
   * Plus tard cette information viendra
   * directement de AuthService.
   */
  currentUserId = 'user-1';


  // =========================================================
  // DONNÉES
  // =========================================================

  notifications: Notification[] = [];

  filteredNotifications: Notification[] = [];


  // =========================================================
  // FILTRES
  // =========================================================

  activeFilter:
    | 'all'
    | 'unread'
    | 'read' = 'all';

  activeType: NotificationType | 'all' = 'all';


  // =========================================================
  // MODAL
  // =========================================================

  selectedNotification: Notification | null = null;

  showDetailsModal = false;

  showDeleteModal = false;

  notificationToDelete: Notification | null = null;


  // =========================================================
  // ÉTAT
  // =========================================================

  loading = false;

  errorMessage = '';


  // =========================================================
  // CONSTRUCTEUR
  // =========================================================

  constructor(
    private notificationService: NotificationService
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadNotifications();

  }


  // =========================================================
  // CHARGEMENT
  // =========================================================

  /**
   * Charge toutes les notifications
   * de l'utilisateur connecté.
   */
  loadNotifications(): void {

    this.loading = true;

    this.errorMessage = '';

    try {

      this.notifications =
        this.notificationService.getByUser(
          this.currentUserId
        );

      this.applyFilters();

    } catch (error) {

      console.error(
        'Erreur lors du chargement des notifications :',
        error
      );

      this.errorMessage =
        'Impossible de charger les notifications.';

    } finally {

      this.loading = false;

    }
  }


  // =========================================================
  // FILTRES
  // =========================================================

  /**
   * Change le filtre principal.
   */
  setFilter(
    filter: 'all' | 'unread' | 'read'
  ): void {

    this.activeFilter = filter;

    this.applyFilters();

  }


  /**
   * Change le filtre par type.
   */
  setTypeFilter(
    type: NotificationType | 'all'
  ): void {

    this.activeType = type;

    this.applyFilters();

  }


  /**
   * Applique tous les filtres.
   */
  applyFilters(): void {

    let result = [...this.notifications];


    // -------------------------------------------------------
    // Filtre lecture
    // -------------------------------------------------------

    if (this.activeFilter === 'unread') {

      result = result.filter(
        notification =>
          notification.status === 'unread'
      );

    }

    if (this.activeFilter === 'read') {

      result = result.filter(
        notification =>
          notification.status === 'read'
      );

    }


    // -------------------------------------------------------
    // Filtre type
    // -------------------------------------------------------

    if (this.activeType !== 'all') {

      result = result.filter(
        notification =>
          notification.type === this.activeType
      );

    }


    this.filteredNotifications = result;

  }


  // =========================================================
  // COMPTEURS
  // =========================================================

  /**
   * Nombre total de notifications.
   */
  get totalCount(): number {

    return this.notifications.length;

  }


  /**
   * Nombre de notifications non lues.
   */
  get unreadCount(): number {

    return this.notifications.filter(
      notification =>
        notification.status === 'unread'
    ).length;

  }


  /**
   * Nombre de notifications lues.
   */
  get readCount(): number {

    return this.notifications.filter(
      notification =>
        notification.status === 'read'
    ).length;

  }


  /**
   * Nombre de notifications correspondant
   * au filtre actuellement sélectionné.
   */
  get filteredCount(): number {

    return this.filteredNotifications.length;

  }


  // =========================================================
  // CLIC NOTIFICATION
  // =========================================================

  /**
   * Lorsqu'une notification est sélectionnée :
   *
   * 1. Elle devient lue.
   * 2. La liste est actualisée.
   * 3. Le modal de détail est ouvert.
   */
  openNotification(
    notification: Notification
  ): void {

    if (notification.status === 'unread') {

      const updated =
        this.notificationService.markAsRead(
          notification.id
        );

      if (updated) {

        notification.status = updated.status;
        notification.readAt = updated.readAt;

      }

    }


    this.selectedNotification = notification;

    this.showDetailsModal = true;

    this.applyFilters();

  }


  /**
   * Ferme le modal de détails.
   */
  closeDetailsModal(): void {

    this.showDetailsModal = false;

    this.selectedNotification = null;

  }


  // =========================================================
  // MARQUER COMME LU
  // =========================================================

  /**
   * Marque toutes les notifications comme lues.
   */
  markAllAsRead(): void {

    if (this.unreadCount === 0) {
      return;
    }

    this.notificationService.markAllAsRead(
      this.currentUserId
    );

    this.loadNotifications();

  }


  /**
   * Marque une notification comme non lue.
   *
   * Utile depuis le modal.
   */
  markAsUnread(
    notification: Notification
  ): void {

    const updated =
      this.notificationService.markAsUnread(
        notification.id
      );

    if (updated) {

      notification.status = updated.status;
      notification.readAt = updated.readAt;

    }

    this.loadNotifications();

  }


  // =========================================================
  // SUPPRESSION
  // =========================================================

  /**
   * Ouvre le modal de confirmation.
   */
  confirmDelete(
    notification: Notification,
    event?: Event
  ): void {

    /*
     * Empêche le clic sur la notification
     * d'ouvrir également le modal de détails.
     */
    event?.stopPropagation();

    this.notificationToDelete = notification;

    this.showDeleteModal = true;

  }


  /**
   * Annule la suppression.
   */
  cancelDelete(): void {

    this.showDeleteModal = false;

    this.notificationToDelete = null;

  }


  /**
   * Confirme et supprime la notification.
   */
  deleteNotification(): void {

    if (!this.notificationToDelete) {
      return;
    }

    const notificationId =
      this.notificationToDelete.id;

    const deleted =
      this.notificationService.delete(
        notificationId
      );

    if (deleted) {

      /*
       * Si la notification supprimée était
       * affichée dans le modal, on ferme celui-ci.
       */
      if (
        this.selectedNotification?.id ===
        notificationId
      ) {

        this.closeDetailsModal();

      }

      this.notifications =
        this.notifications.filter(
          notification =>
            notification.id !== notificationId
        );

      this.applyFilters();

    }


    this.showDeleteModal = false;

    this.notificationToDelete = null;

  }


  // =========================================================
  // SUPPRESSION DEPUIS LE MODAL
  // =========================================================

  deleteSelectedNotification(): void {

    if (!this.selectedNotification) {
      return;
    }

    this.confirmDelete(
      this.selectedNotification
    );

  }


  // =========================================================
  // TYPES
  // =========================================================

  /**
   * Retourne le nom lisible du type.
   */
  getTypeLabel(
    type: NotificationType
  ): string {

    const labels: Record<
      NotificationType,
      string
    > = {

      system: 'Système',

      community: 'Communauté',

      post: 'Publication',

      live: 'Live',

      flash_sale: 'Vente flash',

      product: 'Produit',

      order: 'Commande',

      shipment: 'Expédition',

      member: 'Membre'

    };

    return labels[type];

  }


  /**
   * Retourne l'icône correspondant au type.
   */
  getTypeIcon(
    type: NotificationType
  ): string {

    const icons: Record<
      NotificationType,
      string
    > = {

      system: 'campaign',

      community: 'groups',

      post: 'article',

      live: 'live_tv',

      flash_sale: 'local_fire_department',

      product: 'inventory_2',

      order: 'shopping_bag',

      shipment: 'local_shipping',

      member: 'person_add'

    };

    return icons[type];

  }


  // =========================================================
  // PRIORITÉ
  // =========================================================

  /**
   * Classe CSS associée à la priorité.
   */
  getPriorityClass(
    priority: Notification['priority']
  ): string {

    switch (priority) {

      case 'high':
        return 'priority-high';

      case 'low':
        return 'priority-low';

      default:
        return 'priority-normal';

    }

  }


  /**
   * Libellé de priorité.
   */
  getPriorityLabel(
    priority: Notification['priority']
  ): string {

    switch (priority) {

      case 'high':
        return 'Prioritaire';

      case 'low':
        return 'Faible';

      default:
        return 'Normale';

    }

  }


  // =========================================================
  // DATE
  // =========================================================

  /**
   * Formate l'heure d'une notification.
   */
  formatTime(date: string): string {

    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(
      new Date(date)
    );

  }


  /**
   * Formate la date complète.
   */
  formatDate(date: string): string {

    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    ).format(
      new Date(date)
    );

  }


  /**
   * Date + heure.
   */
  formatDateTime(date: string): string {

    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(
      new Date(date)
    );

  }

  getShipmentStatusLabel(status: string | undefined): string {
  const labels: Record<string, string> = {
    created: 'Expédition créée',
    accepted: 'Colis accepté',
    in_transit: 'En transit',
    arrived_at_center: 'Arrivé au centre',
    out_for_delivery: 'En cours de livraison',
    delivered: 'Livré'
  };

  return labels[status ?? ''] ?? 'Statut inconnu';
}

getRecipientRoleLabel(
  role: Notification['recipientRole']
): string {

  const labels: Record<
    Notification['recipientRole'],
    string
  > = {
    'admin-b2wa': 'Administrateur B2WA',
    'admin-community': 'Administrateur communauté',
    supplier: 'Fournisseur',
    merchant: 'Commerçant',
    member: 'Membre'
  };

  return labels[role];
}


  // =========================================================
  // TEMPS RELATIF
  // =========================================================

  /**
   * Exemple :
   *
   * il y a quelques secondes
   * il y a 5 minutes
   * il y a 2 heures
   * hier
   * il y a 3 jours
   */
  getRelativeTime(date: string): string {

    const now = new Date().getTime();

    const notificationDate =
      new Date(date).getTime();

    const difference =
      now - notificationDate;

    const seconds =
      Math.floor(difference / 1000);

    const minutes =
      Math.floor(seconds / 60);

    const hours =
      Math.floor(minutes / 60);

    const days =
      Math.floor(hours / 24);


    if (seconds < 30) {
      return 'À l’instant';
    }

    if (minutes < 60) {

      return `Il y a ${minutes} min`;

    }

    if (hours < 24) {

      return `Il y a ${hours} h`;

    }

    if (days === 1) {

      return 'Hier';

    }

    if (days < 7) {

      return `Il y a ${days} jours`;

    }

    return this.formatDate(date);

  }


  // =========================================================
  // TRACKBY
  // =========================================================

  trackByNotificationId(
    index: number,
    notification: Notification
  ): string {

    return notification.id;

  }


  // =========================================================
  // UTILITAIRES
  // =========================================================

  /**
   * Vérifie si la notification est non lue.
   */
  isUnread(
    notification: Notification
  ): boolean {

    return notification.status === 'unread';

  }


  /**
   * Vérifie si le modal de suppression est ouvert.
   */
  get hasDeleteConfirmation(): boolean {

    return this.showDeleteModal &&
      this.notificationToDelete !== null;

  }


  /**
   * Ferme tous les modals.
   */
  closeAllModals(): void {

    this.showDetailsModal = false;

    this.showDeleteModal = false;

    this.selectedNotification = null;

    this.notificationToDelete = null;

  }

}
