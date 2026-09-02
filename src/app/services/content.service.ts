import { Injectable } from '@angular/core';
import {
  Content,
  ContentType,
  ContentVisibility
} from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  /**
   * Contenus du fournisseur connecté.
   *
   * Pour le moment les données sont conservées
   * en mémoire. Elles seront ensuite remplacées
   * par les données du backend.
   */
  private contents: Content[] = [
    {
      id: 'story-001',
      type: 'story',
      content: 'Découvrez nos nouveaux produits disponibles sur B2WA.',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      visibility: 'community',
      communityId: 'comm-001',
      communityName: 'Commerce & Import Mali',
      authorId: 'supplier-001',
      authorName: 'Mamadou Diallo',
      createdAt: '2026-09-02T08:30:00',
      expiresAt: '2026-09-03T08:30:00',
      views: 124,
      status: 'published'
    },
    {
      id: 'story-002',
      type: 'story',
      content: 'Nouvel arrivage disponible cette semaine.',
      visibility: 'public',
      authorId: 'supplier-001',
      authorName: 'Mamadou Diallo',
      createdAt: '2026-09-01T14:20:00',
      expiresAt: '2026-09-02T14:20:00',
      views: 287,
      status: 'expired'
    },
    {
      id: 'publication-001',
      type: 'publication',
      title: 'Nouveau stock disponible',
      content:
        'Nous venons de recevoir un nouveau stock. Contactez-nous pour les commandes en gros.',
      image:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
      visibility: 'community',
      communityId: 'comm-001',
      communityName: 'Commerce & Import Mali',
      authorId: 'supplier-001',
      authorName: 'Mamadou Diallo',
      createdAt: '2026-08-30T10:00:00',
      updatedAt: '2026-08-30T10:00:00',
      views: 96,
      status: 'published'
    }
  ];

  constructor() {}

  // ============================================================
  // LECTURE
  // ============================================================

  /**
   * Retourne tous les contenus du fournisseur.
   */
  getAll(): Content[] {
    return [...this.contents];
  }

  /**
   * Retourne uniquement les Stories / Statuts.
   */
  getStories(): Content[] {
    return this.contents.filter(
      content => content.type === 'story'
    );
  }

  /**
   * Retourne uniquement les publications / contenus.
   */
  getPublications(): Content[] {
    return this.contents.filter(
      content => content.type === 'publication'
    );
  }

  /**
   * Retourne un contenu précis.
   */
  getById(id: string): Content | undefined {
    return this.contents.find(
      content => content.id === id
    );
  }

  // ============================================================
  // CREATION
  // ============================================================

  /**
   * Vérifie si une diffusion publique est autorisée.
   *
   * Pour l'instant, cette méthode retourne false
   * car nous n'avons pas encore connecté le système Premium.
   *
   * La vérification sera ensuite reliée au compte fournisseur.
   */
  canPublishPublic(isPremium: boolean): boolean {
    return isPremium;
  }

  /**
   * Crée un nouveau contenu.
   */
  create(
    data: Omit<
      Content,
      'id' | 'createdAt' | 'updatedAt' | 'views'
    >
  ): Content {

    const now = new Date().toISOString();

    const newContent: Content = {
      ...data,
      id: `${data.type}-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      views: 0
    };

    this.contents.unshift(newContent);

    return newContent;
  }

  // ============================================================
  // MODIFICATION
  // ============================================================

  /**
   * Modifie un contenu existant.
   */
  update(
    id: string,
    changes: Partial<Content>
  ): Content | undefined {

    const index = this.contents.findIndex(
      content => content.id === id
    );

    if (index === -1) {
      return undefined;
    }

    this.contents[index] = {
      ...this.contents[index],
      ...changes,
      id: this.contents[index].id,
      updatedAt: new Date().toISOString()
    };

    return this.contents[index];
  }

  // ============================================================
  // SUPPRESSION
  // ============================================================

  /**
   * Supprime un contenu.
   */
  delete(id: string): boolean {

    const index = this.contents.findIndex(
      content => content.id === id
    );

    if (index === -1) {
      return false;
    }

    this.contents.splice(index, 1);

    return true;
  }

  // ============================================================
  // STATISTIQUES
  // ============================================================

  /**
   * Nombre de Stories actives.
   */
  getActiveStoriesCount(): number {

    const now = new Date();

    return this.contents.filter(content => {

      if (content.type !== 'story') {
        return false;
      }

      if (content.status !== 'published') {
        return false;
      }

      if (!content.expiresAt) {
        return true;
      }

      return new Date(content.expiresAt) > now;

    }).length;
  }

  /**
   * Nombre total de publications.
   */
  getPublicationsCount(): number {
    return this.contents.filter(
      content => content.type === 'publication'
    ).length;
  }

  /**
   * Nombre total de vues.
   */
  getTotalViews(): number {
    return this.contents.reduce(
      (total, content) => total + content.views,
      0
    );
  }

  /**
   * Retourne les contenus les plus récents.
   */
  getRecentContents(limit = 5): Content[] {

    return [...this.contents]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  }
}