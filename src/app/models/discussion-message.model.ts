export type DiscussionMessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'file';

export type DiscussionSenderRole =
  | 'admin'
  | 'member';

export type DiscussionMessageStatus =
  | 'sending'
  | 'sent'
  | 'read';

export interface DiscussionReaction {
  emoji: string;
  count: number;
  userIds?: string[];
}

export interface DiscussionMessage {
  /**
   * Identifiant unique du message
   */
  id: string;

  /**
   * Communauté à laquelle appartient le message
   */
  communityId: string;

  /**
   * Informations sur l'expéditeur
   */
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: DiscussionSenderRole;

  /**
   * Type du message
   */
  type: DiscussionMessageType;

  /**
   * Contenu texte du message
   *
   * Pour un message texte :
   *   "Bonjour tout le monde"
   *
   * Pour un média :
   *   peut contenir une légende
   */
  content: string;

  /**
   * Informations média
   */
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;

  /**
   * Durée pour les messages audio/vocaux
   * Exemple : 17 secondes
   */
  duration?: number;

  /**
   * Réponse à un autre message
   */
  replyToId?: string;

  /**
   * Réactions
   */
  reactions?: DiscussionReaction[];

  /**
   * Date d'envoi
   */
  createdAt: string;

  /**
   * Statut du message
   */
  status: DiscussionMessageStatus;

  /**
   * Indique si le message a été supprimé
   */
  deleted?: boolean;

  /**
   * Date de modification éventuelle
   */
  updatedAt?: string;
}