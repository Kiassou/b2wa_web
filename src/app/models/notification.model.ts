/**
 * Types de notifications disponibles dans B2WA.
 */
export type NotificationType =
  | 'system'
  | 'community'
  | 'post'
  | 'live'
  | 'flash_sale'
  | 'product'
  | 'order'
  | 'shipment'
  | 'member';

/**
 * État de lecture de la notification.
 */
export type NotificationStatus =
  | 'unread'
  | 'read';

/**
 * Niveau de priorité.
 */
export type NotificationPriority =
  | 'low'
  | 'normal'
  | 'high';

/**
 * Rôles pouvant recevoir une notification.
 */
export type NotificationRecipientRole =
  | 'admin-b2wa'
  | 'admin-community'
  | 'supplier'
  | 'merchant'
  | 'member';

/**
 * Notification B2WA.
 */
export interface Notification {

  /**
   * Identifiant unique de la notification.
   */
  id: string;

  /**
   * Utilisateur qui reçoit la notification.
   */
  userId: string;

  /**
   * Rôle de l'utilisateur destinataire.
   */
  recipientRole: NotificationRecipientRole;

  /**
   * Type de notification.
   */
  type: NotificationType;

  /**
   * Titre affiché dans la liste.
   */
  title: string;

  /**
   * Petit résumé affiché dans la liste.
   */
  message: string;

  /**
   * Contenu complet affiché dans le modal.
   */
  description?: string;

  /**
   * Icône Material Symbols.
   *
   * Exemple :
   * "local_shipping"
   * "campaign"
   * "groups"
   * "shopping_bag"
   */
  icon: string;

  /**
   * Identifiant de la ressource concernée.
   *
   * Exemple :
   * communityId
   * orderId
   * shipmentId
   * productId
   */
  referenceId?: string;

  /**
   * Type de ressource concernée.
   */
  referenceType?: string;

  /**
   * Informations supplémentaires.
   *
   * Permettra plus tard de transmettre
   * des données venant des autres services.
   */
  metadata?: {
    [key: string]: any;
  };

  /**
   * Date de création.
   */
  createdAt: string;

  /**
   * Date de lecture.
   */
  readAt?: string;

  /**
   * État de lecture.
   */
  status: NotificationStatus;

  /**
   * Priorité.
   */
  priority: NotificationPriority;

  /**
   * Permet de savoir si la notification peut
   * être supprimée par l'utilisateur.
   */
  deletable?: boolean;
}
