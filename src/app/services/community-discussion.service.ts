import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  DiscussionMessage,
  DiscussionMessageType,
  DiscussionSenderRole
} from '../models/discussion-message.model';

import { CommunityService } from './community.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityDiscussionService {
  private readonly STORAGE_KEY = 'b2wa_community_discussions';

  private readonly messagesSubject =
    new BehaviorSubject<DiscussionMessage[]>(this.readFromStorage());

  readonly messages$: Observable<DiscussionMessage[]> =
    this.messagesSubject.asObservable();

  constructor(
    private communityService: CommunityService
  ) {}

  // =====================================================
  // LECTURE RÉACTIVE
  // =====================================================

  private readFromStorage(): DiscussionMessage[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const storedMessages = localStorage.getItem(this.STORAGE_KEY);

    if (!storedMessages) {
      return [];
    }

    try {
      const messages = JSON.parse(storedMessages);

      if (!Array.isArray(messages)) {
        return [];
      }

      return messages as DiscussionMessage[];
    } catch (error) {
      console.error(
        'Erreur lors de la lecture des discussions :',
        error
      );

      return [];
    }
  }

  getAll(): DiscussionMessage[] {
    return [...this.messagesSubject.value];
  }

  getByCommunity(communityId: string): DiscussionMessage[] {
    return this.getAll()
      .filter(message => message.communityId === communityId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );
  }

  getByCommunity$(communityId: string): Observable<DiscussionMessage[]> {
    return new Observable<DiscussionMessage[]>(subscriber => {
      const emitMessages = (messages: DiscussionMessage[]) => {
        subscriber.next(
          messages
            .filter(message => message.communityId === communityId)
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
        );
      };

      emitMessages(this.messagesSubject.value);

      const subscription = this.messagesSubject.subscribe(messages => {
        emitMessages(messages);
      });

      return () => subscription.unsubscribe();
    });
  }

  getById(id: string): DiscussionMessage | undefined {
    return this.getAll().find(message => message.id === id);
  }

  // =====================================================
  // VALIDATION COMMUNAUTÉ
  // =====================================================

  communityExists(communityId: string): boolean {
    return !!this.communityService.getCommunityById(communityId);
  }

  getCommunityName(communityId: string): string {
    return (
      this.communityService.getCommunityById(communityId)?.name ||
      'Communauté'
    );
  }

  private validateCommunity(communityId: string): void {
    if (!communityId.trim()) {
      throw new Error('Identifiant de communauté manquant.');
    }

    if (!this.communityExists(communityId)) {
      throw new Error(
        `La communauté "${communityId}" n'existe pas.`
      );
    }
  }

  // =====================================================
  // AJOUTER
  // =====================================================

  add(message: DiscussionMessage): DiscussionMessage {
    this.validateCommunity(message.communityId);

    const messages = this.getAll();

    messages.push(message);

    this.saveAll(messages);

    return message;
  }

  createMessage(
    communityId: string,
    senderId: string,
    senderName: string,
    senderAvatar: string,
    senderRole: DiscussionSenderRole,
    type: DiscussionMessageType,
    content = '',
    options?: {
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
      duration?: number;
      replyToId?: string;
    }
  ): DiscussionMessage {
    this.validateCommunity(communityId);

    const message: DiscussionMessage = {
      id: this.generateId(),
      communityId,
      senderId,
      senderName,
      senderAvatar,
      senderRole,
      type,
      content: content.trim(),
      fileUrl: options?.fileUrl,
      fileName: options?.fileName,
      fileSize: options?.fileSize,
      mimeType: options?.mimeType,
      duration: options?.duration,
      replyToId: options?.replyToId,
      reactions: [],
      createdAt: new Date().toISOString(),
      status: 'sent',
      deleted: false
    };

    return this.add(message);
  }

  addTextMessage(
    communityId: string,
    senderId: string,
    senderName: string,
    senderAvatar: string,
    senderRole: DiscussionSenderRole,
    content: string
  ): DiscussionMessage {
    return this.createMessage(
      communityId,
      senderId,
      senderName,
      senderAvatar,
      senderRole,
      'text',
      content
    );
  }

  addMediaMessage(
    communityId: string,
    senderId: string,
    senderName: string,
    senderAvatar: string,
    senderRole: DiscussionSenderRole,
    type: 'image' | 'video' | 'audio' | 'file',
    fileUrl: string,
    options?: {
      content?: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
      duration?: number;
      replyToId?: string;
    }
  ): DiscussionMessage {
    return this.createMessage(
      communityId,
      senderId,
      senderName,
      senderAvatar,
      senderRole,
      type,
      options?.content || '',
      {
        fileUrl,
        fileName: options?.fileName,
        fileSize: options?.fileSize,
        mimeType: options?.mimeType,
        duration: options?.duration,
        replyToId: options?.replyToId
      }
    );
  }

  // =====================================================
  // MODIFIER
  // =====================================================

  updateMessage(
    id: string,
    changes: Partial<DiscussionMessage>
  ): DiscussionMessage | undefined {
    const messages = this.getAll();

    const index = messages.findIndex(
      message => message.id === id
    );

    if (index === -1) {
      return undefined;
    }

    messages[index] = {
      ...messages[index],
      ...changes,
      id: messages[index].id,
      communityId: messages[index].communityId,
      updatedAt: new Date().toISOString()
    };

    this.saveAll(messages);

    return messages[index];
  }

  // =====================================================
  // SUPPRIMER
  // =====================================================

  deleteMessage(id: string): boolean {
    const messages = this.getAll();

    const message = messages.find(
      item => item.id === id
    );

    if (!message) {
      return false;
    }

    message.deleted = true;
    message.content = '';
    message.fileUrl = undefined;
    message.updatedAt = new Date().toISOString();

    this.saveAll(messages);

    return true;
  }

  permanentlyDeleteMessage(id: string): boolean {
    const messages = this.getAll();

    const filteredMessages = messages.filter(
      message => message.id !== id
    );

    if (filteredMessages.length === messages.length) {
      return false;
    }

    this.saveAll(filteredMessages);

    return true;
  }

  // =====================================================
  // RÉACTIONS
  // =====================================================

  addReaction(
    messageId: string,
    emoji: string,
    userId: string
  ): boolean {
    const messages = this.getAll();

    const message = messages.find(
      item => item.id === messageId
    );

    if (!message) {
      return false;
    }

    if (!message.reactions) {
      message.reactions = [];
    }

    const existingReaction = message.reactions.find(
      reaction => reaction.emoji === emoji
    );

    if (existingReaction) {
      if (!existingReaction.userIds) {
        existingReaction.userIds = [];
      }

      if (!existingReaction.userIds.includes(userId)) {
        existingReaction.userIds.push(userId);
        existingReaction.count =
          existingReaction.userIds.length;
      }
    } else {
      message.reactions.push({
        emoji,
        count: 1,
        userIds: [userId]
      });
    }

    this.saveAll(messages);

    return true;
  }

  removeReaction(
    messageId: string,
    emoji: string,
    userId: string
  ): boolean {
    const messages = this.getAll();

    const message = messages.find(
      item => item.id === messageId
    );

    if (!message || !message.reactions) {
      return false;
    }

    const reaction = message.reactions.find(
      item => item.emoji === emoji
    );

    if (!reaction || !reaction.userIds) {
      return false;
    }

    reaction.userIds = reaction.userIds.filter(
      id => id !== userId
    );

    reaction.count = reaction.userIds.length;

    message.reactions = message.reactions.filter(
      item => item.count > 0
    );

    this.saveAll(messages);

    return true;
  }

  // =====================================================
  // LECTURE
  // =====================================================

  markCommunityAsRead(
    communityId: string,
    userId: string
  ): void {
    const messages = this.getAll();

    let changed = false;

    messages.forEach(message => {
      if (
        message.communityId === communityId &&
        message.senderId !== userId &&
        message.status !== 'read'
      ) {
        message.status = 'read';
        changed = true;
      }
    });

    if (changed) {
      this.saveAll(messages);
    }
  }

  getMessageCount(communityId: string): number {
    return this.getByCommunity(communityId).length;
  }

  getUnreadCount(
    communityId: string,
    userId: string
  ): number {
    return this.getByCommunity(communityId).filter(
      message =>
        message.senderId !== userId &&
        message.status !== 'read' &&
        !message.deleted
    ).length;
  }

  clearCommunity(communityId: string): void {
    this.validateCommunity(communityId);

    const messages = this.getAll();

    const filteredMessages = messages.filter(
      message => message.communityId !== communityId
    );

    this.saveAll(filteredMessages);
  }

  // =====================================================
  // SAUVEGARDE ET NOTIFICATION
  // =====================================================

  private saveAll(messages: DiscussionMessage[]): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(messages)
    );

    this.messagesSubject.next([...messages]);
  }

  // =====================================================
  // ID
  // =====================================================

  private generateId(): string {
    return `msg-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
  }
}