import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  CommonModule
} from '@angular/common';

interface ChatMessage {
  id: string;
  author: string;
  text: string;
  time: string;
  isAdmin?: boolean;
  avatarBg?: string;
}

interface FloatingReaction {
  id: number;
  emoji: string;
  left: number;
}

@Component({
  selector: 'app-live',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live.html',
  styleUrl: './live.css'
})
export class LiveComponent implements AfterViewInit, OnDestroy {

  @ViewChild('chatContainer')
  private chatContainer?: ElementRef<HTMLElement>;

  @ViewChild('videoContainer')
  private videoContainer?: ElementRef<HTMLElement>;

  liveId = '';

  /* =====================================================
     ÉTAT DU LIVE
  ====================================================== */
  isLive = true;
  isChatOpen = true;
  isMuted = false;
  isFullscreen = false;
  isConnected = true;

  /* =====================================================
     MODALE QUITTER LE LIVE
  ====================================================== */
  isLeaveModalOpen = false;

  /* =====================================================
     DONNÉES DU LIVE
  ====================================================== */
  liveTitle = 'Les nouveautés du commerce malien';
  liveDescription =
    'Découvrez les nouvelles opportunités, produits stratégiques et actualités marquantes du secteur commercial au Mali avec nos experts.';
  liveCategory = 'COMMERCE';
  liveSubCategory = 'B2B MALI';

  /* =====================================================
     SIMULATION VIDÉO
  ====================================================== */
  readonly simulationDurationSeconds = 5 * 60;
  elapsedSeconds = 18 * 60 + 42;
  liveDuration = '00:18:42';
  liveProgress = 100;
  autoFinishSimulation = false;

  /* =====================================================
     SPECTATEURS
  ====================================================== */
  viewerCount = 128;
  peakViewerCount = 128;

  /* =====================================================
     NOTIFICATIONS ET INTERACTIONS
  ====================================================== */
  copied = false;
  showToast = false;
  toastMessage = '';
  reactions: FloatingReaction[] = [];

  /* =====================================================
     TIMERS
  ====================================================== */
  private viewerInterval?: ReturnType<typeof setInterval>;
  private timerInterval?: ReturnType<typeof setInterval>;
  private botMessageInterval?: ReturnType<typeof setInterval>;
  private copiedTimeout?: ReturnType<typeof setTimeout>;
  private toastTimeout?: ReturnType<typeof setTimeout>;
  private reactionTimeouts: ReturnType<typeof setTimeout>[] = [];

  /* =====================================================
     MESSAGES AUTOMATIQUES
  ====================================================== */
  private readonly botMessages: ChatMessage[] = [
    {
      id: 'bot-1',
      author: 'Fatou',
      text: 'Est-ce que la livraison est disponible à Bamako ?',
      time: '',
      avatarBg: '#8b5cf6'
    },
    {
      id: 'bot-2',
      author: 'Ibrahim',
      text: 'Très belle présentation, merci pour les informations.',
      time: '',
      avatarBg: '#f97316'
    },
    {
      id: 'bot-3',
      author: 'Sira',
      text: 'Comment peut-on contacter le fournisseur ?',
      time: '',
      avatarBg: '#06b6d4'
    },
    {
      id: 'bot-4',
      author: 'Moussa',
      text: 'Les prix sont-ils négociables pour les grossistes ?',
      time: '',
      avatarBg: '#10b981'
    }
  ];

  messages: ChatMessage[] = [
    {
      id: '1',
      author: 'Moussa',
      text: 'Bonjour tout le monde 👋',
      time: '14:02',
      avatarBg: '#10b981'
    },
    {
      id: '2',
      author: 'Awa',
      text: 'Très intéressant ce produit !',
      time: '14:03',
      avatarBg: '#ec4899'
    },
    {
      id: '3',
      author: 'Admin',
      text: 'Merci à tous pour votre présence 🙌',
      time: '14:04',
      isAdmin: true,
      avatarBg: '#3b82f6'
    },
    {
      id: '4',
      author: 'Karim',
      text: 'Comment peut-on commander ?',
      time: '14:05',
      avatarBg: '#f59e0b'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  /* =====================================================
     INITIALISATION
  ====================================================== */
  ngAfterViewInit(): void {
    this.liveId = this.route.snapshot.paramMap.get('id') || '';
    this.startLiveSimulation();

    setTimeout(() => {
      this.scrollToBottom();
      this.refreshView();
    }, 0);
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private refreshView(): void {
    this.cdr.detectChanges();
  }

  /* =====================================================
     SIMULATION DU LIVE
  ====================================================== */
  private startLiveSimulation(): void {
    this.viewerInterval = setInterval(() => {
      if (!this.isLive) return;

      const variation = Math.floor(Math.random() * 7) - 3;
      this.viewerCount = Math.max(1, this.viewerCount + variation);
      this.peakViewerCount = Math.max(this.peakViewerCount, this.viewerCount);

      this.refreshView();
    }, 7000);

    this.timerInterval = setInterval(() => {
      if (!this.isLive) return;

      this.elapsedSeconds++;
      this.liveDuration = this.formatDuration(this.elapsedSeconds);

      if (this.simulationDurationSeconds > 0 && this.autoFinishSimulation) {
        this.liveProgress = Math.min(
          100,
          (this.elapsedSeconds / this.simulationDurationSeconds) * 100
        );

        if (this.elapsedSeconds >= this.simulationDurationSeconds) {
          this.finishLiveAutomatically();
        }
      }

      this.refreshView();
    }, 1000);

    this.botMessageInterval = setInterval(() => {
      if (!this.isLive || !this.isChatOpen) return;

      const message = this.botMessages[Math.floor(Math.random() * this.botMessages.length)];
      this.addMessage({
        ...message,
        id: `bot-${Date.now()}`,
        time: this.getCurrentTime()
      });

      this.refreshView();
    }, 18000);
  }

  private finishLiveAutomatically(): void {
    this.isLive = false;
    this.isChatOpen = false;
    this.liveProgress = 100;

    this.showToastMessage('Le Live est terminé. Merci pour votre participation.');
    this.clearTimers();
    this.refreshView();
  }

  private formatDuration(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:` +
      `${minutes.toString().padStart(2, '0')}:` +
      `${seconds.toString().padStart(2, '0')}`;
  }

  /* =====================================================
     NETTOYAGE DES TIMERS
  ====================================================== */
  private clearTimers(): void {
    if (this.viewerInterval) {
      clearInterval(this.viewerInterval);
      this.viewerInterval = undefined;
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
    if (this.botMessageInterval) {
      clearInterval(this.botMessageInterval);
      this.botMessageInterval = undefined;
    }
    if (this.copiedTimeout) {
      clearTimeout(this.copiedTimeout);
      this.copiedTimeout = undefined;
    }
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = undefined;
    }
    this.reactionTimeouts.forEach(timeout => clearTimeout(timeout));
    this.reactionTimeouts = [];
  }

  /* =====================================================
     HORLOGE ET CHAT
  ====================================================== */
  private getCurrentTime(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:` +
      `${now.getMinutes().toString().padStart(2, '0')}`;
  }

  private addMessage(message: ChatMessage): void {
    this.messages.push(message);
    if (this.messages.length > 80) {
      this.messages.shift();
    }
    setTimeout(() => {
      this.scrollToBottom();
      this.refreshView();
    }, 0);
  }

  private scrollToBottom(): void {
    const element = this.chatContainer?.nativeElement;
    if (!element) return;
    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'smooth'
    });
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      setTimeout(() => {
        this.scrollToBottom();
        this.refreshView();
      }, 0);
    }
    this.refreshView();
  }

  sendMessage(messageText: string): void {
    const text = messageText.trim();
    if (!text || !this.isLive) return;

    this.addMessage({
      id: Date.now().toString(),
      author: 'Vous',
      text,
      time: this.getCurrentTime(),
      avatarBg: '#6366f1'
    });

    this.refreshView();
  }

  /* =====================================================
     QUITTER LE LIVE
  ====================================================== */
  leaveLive(): void {
    if (!this.isLive) {
      this.confirmLeaveLive();
      return;
    }
    this.isLeaveModalOpen = true;
    this.refreshView();
  }

  closeLeaveModal(): void {
    this.isLeaveModalOpen = false;
    this.refreshView();
  }

  confirmLeaveLive(): void {
    this.isLeaveModalOpen = false;
    this.clearTimers();
    this.router.navigate(['/dashboard/community']);
  }

  /* =====================================================
     PARTAGE ET COPIE
  ====================================================== */
  async shareLive(): Promise<void> {
    const link = `${window.location.origin}/dashboard/live/${this.liveId}`;

    if (navigator.share && (!navigator.canShare || navigator.canShare({ url: link }))) {
      try {
        await navigator.share({
          title: 'B2WA Live',
          text: 'Rejoignez ce Live sur B2WA',
          url: link
        });
      } catch {
        // fermé
      }
      return;
    }

    await this.copyText(link);
    this.showToastMessage('Lien du Live copié dans le presse-papiers.');
  }

  async copyLiveLink(): Promise<void> {
    const link = `${window.location.origin}/dashboard/live/${this.liveId}`;
    await this.copyText(link);

    this.copied = true;
    this.showToastMessage('Lien du Live copié dans le presse-papiers.');

    if (this.copiedTimeout) clearTimeout(this.copiedTimeout);
    this.copiedTimeout = setTimeout(() => {
      this.copied = false;
      this.refreshView();
    }, 2200);
  }

  private async copyText(value: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
  }

  private showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
      this.refreshView();
    }, 2500);

    this.refreshView();
  }

  /* =====================================================
     RÉACTIONS
  ====================================================== */
  sendReaction(emoji: string): void {
    if (!this.isLive) return;

    const reaction: FloatingReaction = {
      id: Date.now(),
      emoji,
      left: 20 + Math.random() * 60
    };

    this.reactions.push(reaction);

    const timeout = setTimeout(() => {
      this.reactions = this.reactions.filter(item => item.id !== reaction.id);
      this.refreshView();
    }, 3000);

    this.reactionTimeouts.push(timeout);
    this.refreshView();
  }

  /* =====================================================
     CONTRÔLES VIDÉO
  ====================================================== */
  toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.refreshView();
  }

  async toggleFullscreen(): Promise<void> {
    const element = this.videoContainer?.nativeElement;
    if (!element) return;

    try {
      if (!document.fullscreenElement) {
        await element.requestFullscreen();
        this.isFullscreen = true;
      } else {
        await document.exitFullscreen();
        this.isFullscreen = false;
      }
    } catch {
      this.showToastMessage("Le mode plein écran n'est pas disponible.");
    }

    this.refreshView();
  }

  simulateConnectionIssue(): void {
    this.isConnected = false;
    this.refreshView();

    setTimeout(() => {
      this.isConnected = true;
      this.showToastMessage('La connexion au Live est rétablie.');
      this.refreshView();
    }, 2500);
  }

  closeLive(): void {
    this.isLive = false;
    this.isChatOpen = false;
    this.clearTimers();
    this.refreshView();
  }
}