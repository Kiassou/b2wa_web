import { Injectable } from '@angular/core';

import {
  Notification,
  NotificationPriority,
  NotificationRecipientRole,
  NotificationStatus,
  NotificationType
} from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly STORAGE_KEY = 'b2wa_notifications';

  constructor() {
    this.initializeNotifications();
  }

  // =========================================================
  // INITIALISATION
  // =========================================================

  /**
   * Initialise les notifications de démonstration
   * uniquement si aucune notification n'existe encore.
   */
  private initializeNotifications(): void {

    const existing = this.getAll();

    if (existing.length > 0) {
      return;
    }

    const demoNotifications: Notification[] = [

      // =====================================================
      // ADMIN B2WA
      // =====================================================

      {
        id: 'NOTIF-0001',
        userId: 'admin-b2wa-1',
        recipientRole: 'admin-b2wa',
        type: 'system',
        title: 'Nouvelle mise à jour disponible',
        message: 'Une nouvelle version de B2WA est disponible.',
        description:
          'Une nouvelle version de la plateforme B2WA vient d’être publiée. ' +
          'Cette mise à jour apporte plusieurs améliorations de performance, ' +
          'de sécurité et de gestion des communautés.',
        icon: 'campaign',
        priority: 'high',
        status: 'unread',
        createdAt: this.dateMinutesAgo(10),
        deletable: true
      },

      {
        id: 'NOTIF-0002',
        userId: 'admin-b2wa-1',
        recipientRole: 'admin-b2wa',
        type: 'system',
        title: 'Nouveau fournisseur inscrit',
        message: 'Un nouveau fournisseur vient de rejoindre B2WA.',
        description:
          'Un nouveau fournisseur vient de terminer son inscription sur la plateforme. ' +
          'Vous pouvez consulter son profil et vérifier ses informations.',
        icon: 'storefront',
        referenceId: 'SUP-0012',
        referenceType: 'supplier',
        priority: 'normal',
        status: 'unread',
        createdAt: this.dateHoursAgo(2),
        deletable: true
      },

      // =====================================================
      // ADMIN COMMUNAUTÉ
      // =====================================================

      {
        id: 'NOTIF-0003',
        userId: 'supplier-1',
        recipientRole: 'admin-community',
        type: 'member',
        title: 'Nouveau membre',
        message: 'Moussa Traoré a rejoint votre communauté.',
        description:
          'Moussa Traoré vient de rejoindre votre communauté. ' +
          'Vous pouvez maintenant consulter son profil dans la liste des membres.',
        icon: 'person_add',
        referenceId: 'MEMBER-0045',
        referenceType: 'member',
        metadata: {
          communityId: 'COMM-001',
          memberName: 'Moussa Traoré'
        },
        priority: 'normal',
        status: 'unread',
        createdAt: this.dateHoursAgo(1),
        deletable: true
      },

      {
        id: 'NOTIF-0004',
        userId: 'supplier-1',
        recipientRole: 'admin-community',
        type: 'post',
        title: 'Nouvelle publication',
        message: 'Une nouvelle publication a été publiée dans votre communauté.',
        description:
          'Une nouvelle publication vient d’être ajoutée à votre communauté. ' +
          'Les membres peuvent maintenant la consulter et interagir avec elle.',
        icon: 'article',
        referenceId: 'POST-0089',
        referenceType: 'post',
        metadata: {
          communityId: 'COMM-001',
          authorId: 'member-12'
        },
        priority: 'normal',
        status: 'unread',
        createdAt: this.dateHoursAgo(3),
        deletable: true
      },

      // =====================================================
      // MEMBRE — COMMUNAUTÉ
      // =====================================================

      {
        id: 'NOTIF-0005',
        userId: 'user-1',
        recipientRole: 'member',
        type: 'live',
        title: 'Nouveau live programmé',
        message: 'Le fournisseur de votre communauté organise un live.',
        description:
          'Un nouveau live vient d’être programmé dans votre communauté. ' +
          'Vous pourrez rejoindre le live à l’heure prévue.',
        icon: 'live_tv',
        referenceId: 'LIVE-0021',
        referenceType: 'live',
        metadata: {
          communityId: 'COMM-001',
          communityName: 'Bamako Business',
          scheduledAt: '2026-09-15T18:00:00'
        },
        priority: 'high',
        status: 'unread',
        createdAt: this.hoursFromNow(4),
        deletable: true
      },

      {
        id: 'NOTIF-0006',
        userId: 'user-1',
        recipientRole: 'member',
        type: 'post',
        title: 'Nouvelle publication',
        message: 'Une nouvelle publication est disponible dans votre communauté.',
        description:
          'Le fournisseur de votre communauté vient de publier une nouvelle information.',
        icon: 'forum',
        referenceId: 'POST-0090',
        referenceType: 'post',
        metadata: {
          communityId: 'COMM-001'
        },
        priority: 'normal',
        status: 'unread',
        createdAt: this.hoursAgo(5),
        deletable: true
      },

      // =====================================================
      // VENTE FLASH
      // =====================================================

      {
        id: 'NOTIF-0007',
        userId: 'user-1',
        recipientRole: 'member',
        type: 'flash_sale',
        title: 'Nouvelle vente flash 🔥',
        message: 'Une offre exclusive est disponible pour les membres.',
        description:
          'Une nouvelle vente flash vient d’être créée dans votre communauté. ' +
          'Cette offre est réservée aux membres de la communauté et est disponible ' +
          'pendant une durée limitée.',
        icon: 'local_fire_department',
        referenceId: 'FLASH-0015',
        referenceType: 'flash_sale',
        metadata: {
          communityId: 'COMM-001',
          productId: 'PROD-0007',
          discount: 25,
          quantity: 10
        },
        priority: 'high',
        status: 'unread',
        createdAt: this.minutesAgo(30),
        deletable: true
      },

      // =====================================================
      // FOURNISSEUR — PRODUIT
      // =====================================================

      {
        id: 'NOTIF-0008',
        userId: 'supplier-1',
        recipientRole: 'supplier',
        type: 'product',
        title: 'Produit publié',
        message: 'Votre produit a été publié avec succès.',
        description:
          'Votre produit a été ajouté au catalogue et est maintenant visible ' +
          'par les utilisateurs autorisés.',
        icon: 'inventory_2',
        referenceId: 'PROD-0008',
        referenceType: 'product',
        metadata: {
          productName: 'Sac à dos professionnel'
        },
        priority: 'normal',
        status: 'read',
        readAt: this.hoursAgo(1),
        createdAt: this.hoursAgo(2),
        deletable: true
      },

      // =====================================================
      // FOURNISSEUR — COMMANDE
      // =====================================================

      {
        id: 'NOTIF-0009',
        userId: 'supplier-1',
        recipientRole: 'supplier',
        type: 'order',
        title: 'Nouvelle commande',
        message: 'Vous avez reçu une nouvelle commande.',
        description:
          'Une nouvelle commande vient d’être passée sur l’un de vos produits. ' +
          'Consultez les détails de la commande afin de préparer son traitement.',
        icon: 'shopping_bag',
        referenceId: 'ORDER-1045',
        referenceType: 'order',
        metadata: {
          customerName: 'Ibrahim Coulibaly',
          amount: 85000,
          currency: 'FCFA'
        },
        priority: 'high',
        status: 'unread',
        createdAt: this.minutesAgo(15),
        deletable: true
      },

      // =====================================================
      // EXPÉDITION — COMMANDE
      // =====================================================

      {
        id: 'NOTIF-0010',
        userId: 'user-1',
        recipientRole: 'member',
        type: 'shipment',
        title: 'Colis accepté',
        message: 'Votre colis a été accepté par le transporteur.',
        description:
          'Le transporteur a bien reçu votre colis et a commencé le processus ' +
          'd’expédition.',
        icon: 'inventory',
        referenceId: 'SHIP-1001',
        referenceType: 'shipment',
        metadata: {
          orderId: 'ORDER-1045',
          status: 'accepted'
        },
        priority: 'normal',
        status: 'read',
        readAt: this.hoursAgo(4),
        createdAt: this.hoursAgo(5),
        deletable: true
      },

      {
        id: 'NOTIF-0011',
        userId: 'user-1',
        recipientRole: 'member',
        type: 'shipment',
        title: 'Colis en transit',
        message: 'Votre colis est actuellement en transit.',
        description:
          'Votre colis a quitté le point de départ et est actuellement en cours ' +
          'd’acheminement vers sa prochaine destination.',
        icon: 'local_shipping',
        referenceId: 'SHIP-1001',
        referenceType: 'shipment',
        metadata: {
          orderId: 'ORDER-1045',
          status: 'in_transit'
        },
        priority: 'normal',
        status: 'read',
        readAt: this.hoursAgo(3),
        createdAt: this.hoursAgo(4),
        deletable: true
      },

      {
        id: 'NOTIF-0012',
        userId: 'user-1',
        recipientRole: 'member',
        type: 'shipment',
        title: 'Colis arrivé au centre',
        message: 'Votre colis est arrivé dans un centre de traitement.',
        description:
          'Votre colis vient d’arriver dans un centre logistique. ' +
          'Il sera prochainement transféré vers sa prochaine destination.',
        icon: 'warehouse',
        referenceId: 'SHIP-1001',
        referenceType: 'shipment',
        metadata: {
          orderId: 'ORDER-1045',
          status: 'arrived_at_center'
        },
        priority: 'normal',
        status: 'unread',
        createdAt: this.hoursAgo(2),
        deletable: true
      },

      {
        id: 'NOTIF-0013',
        userId: 'user-1',
        recipientRole: 'member',
        type: 'shipment',
        title: 'Colis en cours de livraison',
        message: 'Votre colis est sorti pour être livré.',
        description:
          'Bonne nouvelle ! Votre colis est actuellement avec le livreur et ' +
          'devrait être livré prochainement.',
        icon: 'delivery_dining',
        referenceId: 'SHIP-1001',
        referenceType: 'shipment',
        metadata: {
          orderId: 'ORDER-1045',
          status: 'out_for_delivery'
        },
        priority: 'high',
        status: 'unread',
        createdAt: this.minutesAgo(20),
        deletable: true
      },

      {
        id: 'NOTIF-0014',
        userId: 'user-1',
        recipientRole: 'member',
        type: 'shipment',
        title: 'Colis livré',
        message: 'Votre colis a été livré avec succès.',
        description:
          'Votre commande a été livrée. Merci d’avoir utilisé B2WA.',
        icon: 'check_circle',
        referenceId: 'SHIP-1001',
        referenceType: 'shipment',
        metadata: {
          orderId: 'ORDER-1045',
          status: 'delivered'
        },
        priority: 'normal',
        status: 'unread',
        createdAt: this.minutesAgo(5),
        deletable: true
      },

      // =====================================================
      // TRANSPORTEUR / FOURNISSEUR
      // =====================================================

      {
        id: 'NOTIF-0015',
        userId: 'supplier-1',
        recipientRole: 'supplier',
        type: 'shipment',
        title: 'Expédition créée',
        message: 'L’expédition de la commande ORDER-1050 a été créée.',
        description:
          'L’expédition associée à cette commande a été créée avec succès. ' +
          'Vous pouvez maintenant suivre son évolution.',
        icon: 'local_shipping',
        referenceId: 'SHIP-1002',
        referenceType: 'shipment',
        metadata: {
          orderId: 'ORDER-1050',
          status: 'created'
        },
        priority: 'normal',
        status: 'unread',
        createdAt: this.hoursAgo(1),
        deletable: true
      },

      // =====================================================
      // NOTIFICATION SYSTÈME
      // =====================================================

      {
        id: 'NOTIF-0016',
        userId: 'user-1',
        recipientRole: 'member',
        type: 'system',
        title: 'Bienvenue sur B2WA',
        message: 'Bienvenue dans votre espace B2WA.',
        description:
          'Votre compte B2WA est maintenant actif. Vous pouvez rejoindre des communautés, ' +
          'consulter les produits, profiter des ventes flash et suivre vos commandes.',
        icon: 'waving_hand',
        priority: 'low',
        status: 'read',
        readAt: this.daysAgo(1),
        createdAt: this.daysAgo(1),
        deletable: true
      }
    ];

    this.saveAll(demoNotifications);
  }

  // =========================================================
  // LECTURE
  // =========================================================

  /**
   * Récupère toutes les notifications.
   */
  getAll(): Notification[] {

    const data = localStorage.getItem(this.STORAGE_KEY);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data) as Notification[];
    } catch {
      return [];
    }
  }

  /**
   * Récupère les notifications d'un utilisateur.
   */
  getByUser(userId: string): Notification[] {

    return this.getAll()
      .filter(notification => notification.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  }

  /**
   * Récupère uniquement les notifications non lues.
   */
  getUnreadByUser(userId: string): Notification[] {

    return this.getByUser(userId)
      .filter(notification => notification.status === 'unread');
  }

  /**
   * Récupère uniquement les notifications lues.
   */
  getReadByUser(userId: string): Notification[] {

    return this.getByUser(userId)
      .filter(notification => notification.status === 'read');
  }

  /**
   * Recherche une notification par son ID.
   */
  getById(notificationId: string): Notification | undefined {

    return this.getAll()
      .find(notification => notification.id === notificationId);
  }

  // =========================================================
  // LECTURE / STATUT
  // =========================================================

  /**
   * Marque une notification comme lue.
   */
  markAsRead(notificationId: string): Notification | undefined {

    const notifications = this.getAll();

    const notification = notifications.find(
      item => item.id === notificationId
    );

    if (!notification) {
      return undefined;
    }

    notification.status = 'read';
    notification.readAt = new Date().toISOString();

    this.saveAll(notifications);

    return notification;
  }

  /**
   * Marque une notification comme non lue.
   */
  markAsUnread(notificationId: string): Notification | undefined {

    const notifications = this.getAll();

    const notification = notifications.find(
      item => item.id === notificationId
    );

    if (!notification) {
      return undefined;
    }

    notification.status = 'unread';
    notification.readAt = undefined;

    this.saveAll(notifications);

    return notification;
  }

  /**
   * Marque toutes les notifications d'un utilisateur
   * comme lues.
   */
  markAllAsRead(userId: string): void {

    const notifications = this.getAll();

    const now = new Date().toISOString();

    notifications.forEach(notification => {

      if (
        notification.userId === userId &&
        notification.status === 'unread'
      ) {
        notification.status = 'read';
        notification.readAt = now;
      }

    });

    this.saveAll(notifications);
  }

  /**
   * Nombre de notifications non lues.
   */
  getUnreadCount(userId: string): number {

    return this.getUnreadByUser(userId).length;
  }

  /**
   * Nombre total de notifications.
   */
  getCount(userId: string): number {

    return this.getByUser(userId).length;
  }

  // =========================================================
  // AJOUT
  // =========================================================

  /**
   * Ajoute une notification.
   *
   * Cette méthode sera particulièrement importante plus tard :
   * les autres services pourront l'utiliser pour créer
   * automatiquement des notifications.
   */
  add(notification: Notification): Notification {

    const notifications = this.getAll();

    notifications.unshift(notification);

    this.saveAll(notifications);

    return notification;
  }

  /**
   * Création simplifiée d'une notification.
   */
  createNotification(data: {

    userId: string;

    recipientRole: NotificationRecipientRole;

    type: NotificationType;

    title: string;

    message: string;

    description?: string;

    icon: string;

    referenceId?: string;

    referenceType?: string;

    metadata?: {
      [key: string]: any;
    };

    priority?: NotificationPriority;

    deletable?: boolean;

  }): Notification {

    const notification: Notification = {

      id: this.generateId(),

      userId: data.userId,

      recipientRole: data.recipientRole,

      type: data.type,

      title: data.title,

      message: data.message,

      description: data.description,

      icon: data.icon,

      referenceId: data.referenceId,

      referenceType: data.referenceType,

      metadata: data.metadata,

      createdAt: new Date().toISOString(),

      status: 'unread',

      priority: data.priority ?? 'normal',

      deletable: data.deletable ?? true

    };

    return this.add(notification);
  }

  // =========================================================
  // SUPPRESSION
  // =========================================================

  /**
   * Supprime une notification.
   */
  delete(notificationId: string): boolean {

    const notifications = this.getAll();

    const filtered = notifications.filter(
      notification => notification.id !== notificationId
    );

    if (filtered.length === notifications.length) {
      return false;
    }

    this.saveAll(filtered);

    return true;
  }

  /**
   * Supprime toutes les notifications d'un utilisateur.
   */
  deleteAllByUser(userId: string): void {

    const notifications = this.getAll()
      .filter(notification => notification.userId !== userId);

    this.saveAll(notifications);
  }

  /**
   * Supprime uniquement les notifications lues.
   */
  deleteReadByUser(userId: string): void {

    const notifications = this.getAll()
      .filter(
        notification =>
          notification.userId !== userId ||
          notification.status !== 'read'
      );

    this.saveAll(notifications);
  }

  // =========================================================
  // FILTRES
  // =========================================================

  /**
   * Filtre par type.
   */
  getByType(
    userId: string,
    type: NotificationType
  ): Notification[] {

    return this.getByUser(userId)
      .filter(notification => notification.type === type);
  }

  /**
   * Filtre par priorité.
   */
  getByPriority(
    userId: string,
    priority: NotificationPriority
  ): Notification[] {

    return this.getByUser(userId)
      .filter(notification => notification.priority === priority);
  }

  /**
   * Filtre par référence.
   *
   * Exemple :
   * récupérer toutes les notifications
   * d'une commande.
   */
  getByReference(
    userId: string,
    referenceId: string
  ): Notification[] {

    return this.getByUser(userId)
      .filter(
        notification =>
          notification.referenceId === referenceId
      );
  }

  // =========================================================
  // RESET / TEST
  // =========================================================

  /**
   * Réinitialise toutes les notifications de démonstration.
   */
  resetDemoData(): void {

    localStorage.removeItem(this.STORAGE_KEY);

    this.initializeNotifications();
  }

  // =========================================================
  // UTILITAIRES
  // =========================================================

  private saveAll(notifications: Notification[]): void {

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(notifications)
    );
  }

  private generateId(): string {

    return `NOTIF-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
  }

  private minutesAgo(minutes: number): string {

    const date = new Date();

    date.setMinutes(date.getMinutes() - minutes);

    return date.toISOString();
  }

  private hoursAgo(hours: number): string {

    const date = new Date();

    date.setHours(date.getHours() - hours);

    return date.toISOString();
  }

  private daysAgo(days: number): string {

    const date = new Date();

    date.setDate(date.getDate() - days);

    return date.toISOString();
  }

  private dateMinutesAgo(minutes: number): string {

    return this.minutesAgo(minutes);
  }

  private dateHoursAgo(hours: number): string {

    return this.hoursAgo(hours);
  }

  private hoursFromNow(hours: number): string {

    const date = new Date();

    date.setHours(date.getHours() + hours);

    return date.toISOString();
  }
}
