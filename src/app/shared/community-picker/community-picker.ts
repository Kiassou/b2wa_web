import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ContentCommunity } from '../../models/content.model';

@Component({
  selector: 'app-community-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './community-picker.html',
  styleUrl: './community-picker.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityPickerComponent implements OnChanges {

  /**
   * Affichage du modal
   */
  @Input() visible = false;

  /**
   * Liste des communautés disponibles
   *
   * Cette liste vient de stories.ts et contient
   * uniquement les communautés dont le commerçant est admin.
   */
  @Input() communities: ContentCommunity[] = [];

  /**
   * Communautés déjà sélectionnées
   *
   * Utile notamment lors de la modification
   * d'une publication ou d'une story.
   */
  @Input() selectedCommunities: ContentCommunity[] = [];

  /**
   * Fermeture du modal sans modification
   */
  @Output() closed = new EventEmitter<void>();

  /**
   * Retourne les communautés sélectionnées
   */
  @Output() selectionConfirmed =
    new EventEmitter<ContentCommunity[]>();

  /**
   * Sélection temporaire pendant que le modal est ouvert.
   *
   * On ne modifie pas directement selectedCommunities.
   */
  temporarySelection: ContentCommunity[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCommunities']) {
      this.temporarySelection = [
        ...this.selectedCommunities
      ];
    }
  }

  /**
   * Nombre de communautés sélectionnées
   */
  get selectedCount(): number {
    return this.temporarySelection.length;
  }

  /**
   * Vérifie si une communauté est sélectionnée
   */
  isSelected(communityId: string): boolean {
    return this.temporarySelection.some(
      community => community.id === communityId
    );
  }

  /**
   * Sélection / désélection d'une communauté
   */
  toggleCommunity(community: ContentCommunity): void {

    const index = this.temporarySelection.findIndex(
      selected => selected.id === community.id
    );

    if (index >= 0) {
      this.temporarySelection.splice(index, 1);
    } else {
      this.temporarySelection.push(community);
    }

    /**
     * Force une nouvelle référence pour OnPush
     */
    this.temporarySelection = [
      ...this.temporarySelection
    ];
  }

  /**
   * Vérifie si toutes les communautés sont sélectionnées
   */
  get allSelected(): boolean {
    return (
      this.communities.length > 0 &&
      this.temporarySelection.length === this.communities.length
    );
  }

  /**
   * Sélectionner toutes les communautés
   */
  selectAll(): void {

    this.temporarySelection = [
      ...this.communities
    ];
  }

  /**
   * Désélectionner toutes les communautés
   */
  deselectAll(): void {

    this.temporarySelection = [];
  }

  /**
   * Sélectionner / désélectionner toutes
   */
  toggleSelectAll(): void {

    if (this.allSelected) {
      this.deselectAll();
    } else {
      this.selectAll();
    }
  }

  /**
   * Valider la sélection
   */
  confirmSelection(): void {

    this.selectionConfirmed.emit([
      ...this.temporarySelection
    ]);
  }

  /**
   * Fermer le modal
   */
  close(): void {
    this.closed.emit();
  }

  /**
   * Empêche le clic dans le contenu
   * de fermer le modal.
   */
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}