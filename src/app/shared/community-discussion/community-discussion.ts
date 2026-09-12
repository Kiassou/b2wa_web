import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  DiscussionMessage,
  DiscussionMessageType,
  DiscussionSenderRole
} from '../../models/discussion-message.model';

import { CommunityDiscussionService } from '../../services/community-discussion.service';

@Component({
  selector: 'app-community-discussion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './community-discussion.html',
  styleUrl: './community-discussion.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityDiscussionComponent
  implements OnInit, OnDestroy {

  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLElement>;

  /* =====================================================
     COMMUNAUTÉ
  ====================================================== */

  @Input() communityId = '';

  @Input() communityName = 'Discussion';

  /* =====================================================
     UTILISATEUR CONNECTÉ
  ====================================================== */

  @Input() currentUserId = 'user-1';

  @Input() currentUserName = 'Vous';

  @Input() currentUserAvatar =
    'assets/images/users/default-avatar.png';

  @Input() currentUserRole: DiscussionSenderRole = 'member';

  /* =====================================================
     MESSAGES
  ====================================================== */

  messages: DiscussionMessage[] = [];

  private messagesSubscription?: Subscription;

  /* =====================================================
     FORMULAIRE
  ====================================================== */

  messageText = '';

  /* =====================================================
     ÉTAT
  ====================================================== */

  loading = true;

  sending = false;

  errorMessage = '';

  /* =====================================================
     RÉPONSE À UN MESSAGE
  ====================================================== */

  replyingTo: DiscussionMessage | null = null;

  /* =====================================================
     FICHIER SÉLECTIONNÉ
  ====================================================== */

  selectedFile: File | null = null;

  selectedFilePreview = '';

  selectedFileType:
    | 'image'
    | 'video'
    | 'file'
    | null = null;

  /* =====================================================
     ENREGISTREMENT VOCAL
  ====================================================== */

  isRecording = false;

  recordingSeconds = 0;

  private mediaRecorder: MediaRecorder | null = null;

  private audioChunks: Blob[] = [];

  private recordingTimer: ReturnType<typeof setInterval> | null =
    null;

  /* =====================================================
     RECHERCHE ET OPTIONS
  ====================================================== */

  showMessageSearch = false;
  showOptionsMenu = false;
  messageSearchText = '';
  notificationsEnabled = true;
  showAttachmentMenu = false;

  toggleAttachmentMenu(): void {
  this.showAttachmentMenu = !this.showAttachmentMenu;

  // Fermer les autres menus
  this.showEmojiPicker = false;
  this.showOptionsMenu = false;
}

  /* =====================================================
     EMOJIS
  ====================================================== */

  showEmojiPicker = false;

  activeEmojiCategory = 0;

  emojiCategories = [
    {
      name: 'Smileys',
      icon: 'mood',
      emojis: [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
        '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
        '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
        '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
        '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
        '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
        '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
        '😰', '😥', '😓', '🤗', '🤔', '🫣', '🤭', '🤫',
        '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦',
        '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵',
        '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'
      ]
    },
    {
      name: 'Gestes',
      icon: 'back_hand',
      emojis: [
        '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
        '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️',
        '🖖', '👋', '🤏', '💪', '👏', '🙌', '👐', '🤝',
        '🙏', '✍️', '💅', '🤳', '💯', '🔥', '❤️', '💚',
        '💙', '💜', '🖤', '🤍', '💛', '🧡', '🤎'
      ]
    },
    {
      name: 'Objets',
      icon: 'category',
      emojis: [
        '🎉', '🎊', '🎁', '🎈', '🚀', '⭐', '🌟', '✨',
        '💫', '💥', '💡', '📌', '📍', '📎', '🔗', '🔔',
        '📱', '💻', '🖥️', '⌨️', '🖱️', '📷', '🎥', '🎵',
        '🎶', '🎧', '📦', '🛒', '💰', '💵', '📈', '📊',
        '✏️', '📝', '📚', '📢', '💬', '🗨️', '❤️‍🔥'
      ]
    }
  ];

  /* =====================================================
     CONSTRUCTEUR
  ====================================================== */

  constructor(
    private discussionService: CommunityDiscussionService,
    private cdr: ChangeDetectorRef
  ) {}

  /* =====================================================
     INITIALISATION
  ====================================================== */

  ngOnInit(): void {
    this.loadMessages();
    this.markMessagesAsRead();
    this.subscribeToMessages();
  }

  private subscribeToMessages(): void {
    if (!this.communityId) {
      return;
    }

    this.messagesSubscription =
      this.discussionService
        .getByCommunity$(this.communityId)
        .subscribe(messages => {
          this.messages = messages;
          this.loading = false;
          this.cdr.markForCheck();
        });
  }

  /* =====================================================
     DESTRUCTION
  ====================================================== */

  ngOnDestroy(): void {
    this.messagesSubscription?.unsubscribe();
    this.stopRecordingTimer();
  }

  /* =====================================================
     RECHERCHE
  ====================================================== */

  toggleMessageSearch(): void {
    this.showMessageSearch = !this.showMessageSearch;

    if (!this.showMessageSearch) {
      this.messageSearchText = '';
    }

    this.showOptionsMenu = false;
    this.cdr.markForCheck();
  }

  toggleOptionsMenu(): void {
    this.showOptionsMenu = !this.showOptionsMenu;
    this.showMessageSearch = false;
    this.cdr.markForCheck();
  }

  clearMessageSearch(): void {
    this.messageSearchText = '';
    this.cdr.markForCheck();
  }

  get filteredMessages(): DiscussionMessage[] {
    if (!this.messageSearchText.trim()) {
      return this.messages;
    }

    const search = this.messageSearchText
      .toLowerCase()
      .trim();

    return this.messages.filter(message =>
      message.content?.toLowerCase().includes(search)
    );
  }

  /* =====================================================
     CHARGER LES MESSAGES
  ====================================================== */

  loadMessages(): void {
    this.loading = true;

    try {
      if (!this.communityId) {
        this.messages = [];
        this.errorMessage = 'Communauté introuvable.';
        return;
      }

      this.messages =
        this.discussionService.getByCommunity(
          this.communityId
        );

      this.errorMessage = '';
      this.cdr.markForCheck();

    } catch (error) {
      console.error(
        'Erreur chargement discussion :',
        error
      );

      this.errorMessage =
        'Impossible de charger la discussion.';

    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  /* =====================================================
     ENVOYER MESSAGE TEXTE
  ====================================================== */

  sendMessage(): void {
    const content = this.messageText.trim();

    if (!content || this.sending) {
      return;
    }

    if (!this.communityId) {
      this.errorMessage =
        'Communauté introuvable.';
      return;
    }

    this.sending = true;
    this.errorMessage = '';

    try {
      this.discussionService.addTextMessage(
        this.communityId,
        this.currentUserId,
        this.currentUserName,
        this.currentUserAvatar,
        this.currentUserRole,
        content
      );

      this.messageText = '';
      this.cancelReply();
      this.loadMessages();

    } catch (error) {
      console.error(
        'Erreur envoi message :',
        error
      );

      this.errorMessage =
        'Impossible d’envoyer le message.';

    } finally {
      this.sending = false;
      this.cdr.markForCheck();
    }
  }

  /* =====================================================
     ENVOI AVEC TOUCHE ENTER
  ====================================================== */

  onMessageKeydown(event: KeyboardEvent): void {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /* =====================================================
     SÉLECTION FICHIER
  ====================================================== */

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || !input.files.length) {
      return;
    }

    const file = input.files[0];

    this.selectedFile = file;
    this.errorMessage = '';

    if (file.type.startsWith('image/')) {
      this.selectedFileType = 'image';
      this.createFilePreview(file);
      return;
    }

    if (file.type.startsWith('video/')) {
      this.selectedFileType = 'video';
      this.createFilePreview(file);
      return;
    }

    this.selectedFileType = 'file';
    this.selectedFilePreview = '';
  }

  /* =====================================================
     APERÇU FICHIER
  ====================================================== */

  private createFilePreview(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      this.selectedFilePreview =
        reader.result as string;

      this.cdr.markForCheck();
    };

    reader.readAsDataURL(file);
  }

  /* =====================================================
     ANNULER FICHIER
  ====================================================== */

  cancelSelectedFile(): void {
    this.selectedFile = null;
    this.selectedFilePreview = '';
    this.selectedFileType = null;
    this.cdr.markForCheck();
  }

  /* =====================================================
     ENVOYER FICHIER
  ====================================================== */

  sendSelectedFile(): void {
    if (
      !this.selectedFile ||
      !this.selectedFileType ||
      this.sending
    ) {
      return;
    }

    if (!this.communityId) {
      this.errorMessage =
        'Communauté introuvable.';
      return;
    }

    this.sending = true;
    this.errorMessage = '';

    try {
      let type: 'image' | 'video' | 'file';

      if (this.selectedFileType === 'image') {
        type = 'image';
      } else if (this.selectedFileType === 'video') {
        type = 'video';
      } else {
        type = 'file';
      }

      this.discussionService.addMediaMessage(
        this.communityId,
        this.currentUserId,
        this.currentUserName,
        this.currentUserAvatar,
        this.currentUserRole,
        type,
        this.selectedFilePreview,
        {
          content: this.messageText.trim(),
          fileName: this.selectedFile.name,
          fileSize: this.selectedFile.size,
          mimeType: this.selectedFile.type,
          replyToId: this.replyingTo?.id
        }
      );

      this.messageText = '';
      this.cancelSelectedFile();
      this.cancelReply();
      this.loadMessages();

    } catch (error) {
      console.error(
        'Erreur envoi fichier :',
        error
      );

      this.errorMessage =
        'Impossible d’envoyer le fichier.';

    } finally {
      this.sending = false;
      this.cdr.markForCheck();
    }
  }

  /* =====================================================
     RÉPONDRE À UN MESSAGE
  ====================================================== */

  replyTo(message: DiscussionMessage): void {
    this.replyingTo = message;
    this.cdr.markForCheck();
  }

  cancelReply(): void {
    this.replyingTo = null;
    this.cdr.markForCheck();
  }

  /* =====================================================
     SUPPRIMER MESSAGE
  ====================================================== */

  deleteMessage(message: DiscussionMessage): void {
    const confirmed = window.confirm(
      'Voulez-vous supprimer ce message ?'
    );

    if (!confirmed) {
      return;
    }

    const success =
      this.discussionService.deleteMessage(
        message.id
      );

    if (success) {
      this.loadMessages();
    }
  }

  /* =====================================================
     RÉACTIONS
  ====================================================== */

  addReaction(
    message: DiscussionMessage,
    emoji: string
  ): void {
    this.discussionService.addReaction(
      message.id,
      emoji,
      this.currentUserId
    );

    this.loadMessages();
  }

  removeReaction(
    message: DiscussionMessage,
    emoji: string
  ): void {
    this.discussionService.removeReaction(
      message.id,
      emoji,
      this.currentUserId
    );

    this.loadMessages();
  }

  /* =====================================================
     UTILITAIRES MESSAGE
  ====================================================== */

  isMyMessage(message: DiscussionMessage): boolean {
    return message.senderId === this.currentUserId;
  }

  getReplyMessage(
    message: DiscussionMessage
  ): DiscussionMessage | undefined {
    if (!message.replyToId) {
      return undefined;
    }

    return this.discussionService.getById(
      message.replyToId
    );
  }

  getSenderLabel(message: DiscussionMessage): string {
    return message.senderRole === 'admin'
      ? 'Admin'
      : 'Membre';
  }

  trackByMessageId(
    index: number,
    message: DiscussionMessage
  ): string {
    return message.id;
  }

  /* =====================================================
     FORMAT HEURE
  ====================================================== */

  formatMessageTime(date: string): string {
    const messageDate = new Date(date);

    if (Number.isNaN(messageDate.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(messageDate);
  }

  /* =====================================================
     FORMAT DATE
  ====================================================== */

  formatMessageDate(date: string): string {
    const messageDate = new Date(date);

    if (Number.isNaN(messageDate.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    ).format(messageDate);
  }

  /* =====================================================
     TYPE DE FICHIER
  ====================================================== */

  getFileIcon(message: DiscussionMessage): string {
    switch (message.type) {
      case 'image':
        return 'image';

      case 'video':
        return 'movie';

      case 'audio':
        return 'mic';

      case 'file':
        return 'description';

      default:
        return 'insert_drive_file';
    }
  }

  /* =====================================================
     TAILLE FICHIER
  ====================================================== */

  formatFileSize(size?: number): string {
    if (!size || size <= 0) {
      return '';
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  /* =====================================================
     DURÉE AUDIO
  ====================================================== */

  formatDuration(seconds?: number): string {
    if (!seconds) {
      return '00:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`;
  }

  /* =====================================================
     ENREGISTREMENT VOCAL
  ====================================================== */

  async toggleRecording(): Promise<void> {
    if (this.isRecording) {
      this.stopRecording();
      return;
    }

    await this.startRecording();
  }

  private async startRecording(): Promise<void> {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });

      this.audioChunks = [];

      this.mediaRecorder =
        new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable =
        (event: BlobEvent) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(
          this.audioChunks,
          {
            type: 'audio/webm'
          }
        );

        this.createAudioMessage(audioBlob);

        stream
          .getTracks()
          .forEach(track => track.stop());
      };

      this.mediaRecorder.start();

      this.isRecording = true;
      this.recordingSeconds = 0;
      this.startRecordingTimer();
      this.errorMessage = '';

      this.cdr.markForCheck();

    } catch (error) {
      console.error(
        'Erreur microphone :',
        error
      );

      this.errorMessage =
        'Impossible d’accéder au microphone.';

      this.cdr.markForCheck();
    }
  }

  private stopRecording(): void {
    if (
      this.mediaRecorder &&
      this.mediaRecorder.state !== 'inactive'
    ) {
      this.mediaRecorder.stop();
    }

    this.isRecording = false;
    this.stopRecordingTimer();
    this.cdr.markForCheck();
  }

  private createAudioMessage(audioBlob: Blob): void {
    const reader = new FileReader();

    reader.onload = () => {
      const audioUrl = reader.result as string;

      this.discussionService.addMediaMessage(
        this.communityId,
        this.currentUserId,
        this.currentUserName,
        this.currentUserAvatar,
        this.currentUserRole,
        'audio',
        audioUrl,
        {
          fileName: `vocal-${Date.now()}.webm`,
          fileSize: audioBlob.size,
          mimeType: 'audio/webm',
          duration: this.recordingSeconds,
          replyToId: this.replyingTo?.id
        }
      );

      this.cancelReply();
      this.loadMessages();
      this.cdr.markForCheck();
    };

    reader.readAsDataURL(audioBlob);
  }

  /* =====================================================
     TIMER ENREGISTREMENT
  ====================================================== */

  private startRecordingTimer(): void {
    this.stopRecordingTimer();

    this.recordingTimer = setInterval(() => {
      this.recordingSeconds++;
      this.cdr.markForCheck();
    }, 1000);
  }

  private stopRecordingTimer(): void {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
  }

  /* =====================================================
     MESSAGES LUS
  ====================================================== */

  private markMessagesAsRead(): void {
    if (!this.communityId) {
      return;
    }

    this.discussionService.markCommunityAsRead(
      this.communityId,
      this.currentUserId
    );
  }

  /* =====================================================
     EMOJIS
  ====================================================== */

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
    this.cdr.markForCheck();
  }

  selectEmoji(emoji: string): void {
    const textarea = document.querySelector(
      '.message-input-wrapper textarea'
    ) as HTMLTextAreaElement | null;

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = this.messageText ?? '';

    this.messageText =
      currentText.substring(0, start) +
      emoji +
      currentText.substring(end);

    const newCursorPosition = start + emoji.length;

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        newCursorPosition,
        newCursorPosition
      );
    });

    this.showEmojiPicker = false;
    this.cdr.markForCheck();
  }

  setEmojiCategory(index: number): void {
    this.activeEmojiCategory = index;
    this.cdr.markForCheck();
  }

  /* =====================================================
     OPTIONS
  ====================================================== */

  toggleNotifications(): void {
    this.notificationsEnabled =
      !this.notificationsEnabled;

    this.showOptionsMenu = false;
    this.cdr.markForCheck();
  }

  showMediaModal = false;

mediaMessages: DiscussionMessage[] = [];

showMediaFiles(): void {
  this.showOptionsMenu = false;

  this.mediaMessages = this.messages.filter(message =>
    !message.deleted &&
    (
      message.type === 'image' ||
      message.type === 'video' ||
      message.type === 'audio' ||
      message.type === 'file'
    )
  );

  this.showMediaModal = true;
  this.cdr.markForCheck();
}

closeMediaModal(): void {
  this.showMediaModal = false;
  this.cdr.markForCheck();
}

  scrollToBottom(): void {
  this.showOptionsMenu = false;

  this.cdr.markForCheck();

  setTimeout(() => {
    const container =
      this.messagesContainer?.nativeElement;

    if (!container) {
      console.warn(
        'messagesContainer introuvable'
      );
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  }, 0);
}
}