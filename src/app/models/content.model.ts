export type ContentType = 'story' | 'publication';

export type ContentVisibility = 'public' | 'community';

export type ContentStatus = 'published' | 'draft' | 'expired';

/**
 * Communauté associée à un contenu
 */
export interface ContentCommunity {
  id: string;
  name: string;
}

export interface Content {
  id: string;

  /**
   * Type de contenu
   * story       = Story / Statut
   * publication = Publication / Contenu
   */
  type: ContentType;

  title?: string;

  content: string;

  /**
   * Image ou vidéo associée au contenu
   */
  image?: string;
  video?: string;

  /**
   * Destination du contenu
   * community = contenu réservé à une ou plusieurs communautés
   * public    = contenu visible par tous (Premium)
   */
  visibility: ContentVisibility;

  /**
   * Communautés associées au contenu
   *
   * Un contenu peut être publié dans
   * plusieurs communautés.
   */
  communities?: ContentCommunity[];

  /**
   * Ancien format conservé pour compatibilité
   * avec les contenus existants.
   */
  communityId?: string;
  communityName?: string;

  /**
   * Propriétaire du contenu
   */
  authorId: string;
  authorName: string;

  /**
   * Dates
   */
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;

  /**
   * Statistiques
   */
  views: number;

  /**
   * État du contenu
   */
  status: ContentStatus;
}