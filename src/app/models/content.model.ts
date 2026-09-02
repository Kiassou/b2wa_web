export type ContentType = 'story' | 'publication';

export type ContentVisibility = 'public' | 'community';

export type ContentStatus = 'published' | 'draft' | 'expired';

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
   * community = contenu réservé à une communauté
   * public    = contenu visible par tous (Premium)
   */
  visibility: ContentVisibility;

  /**
   * Informations de la communauté
   * présentes uniquement si visibility === 'community'
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