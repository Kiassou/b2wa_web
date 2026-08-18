import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';


interface StoryProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
}


interface StoryComment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  time: string;
}


interface Story {
  id: string;

  author: string;
  username: string;
  avatar?: string;

  media: string;
  poster?: string;
  type: 'image' | 'video';

  title: string;
  description: string;

  community?: string;
  time: string;

  createdAt: number;
  duration: number;

  progress: number;
  seen: boolean;

  liked: boolean;
  likes: number;
  comments: number;
  views: number;

  verified?: boolean;

  product?: StoryProduct;

  commentsList: StoryComment[];
}


interface SocialUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  verified: boolean;
  followers: number;
  following: number;
  publications: number;
}


@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './stories.html',
  styleUrl: './stories.css'
})
export class StoriesComponent
  implements AfterViewInit, OnDestroy {


  @ViewChildren('feedVideo')
  private feedVideos?: QueryList<
    ElementRef<HTMLVideoElement>
  >;


  @ViewChildren('viewerVideo')
  private viewerVideos?: QueryList<
    ElementRef<HTMLVideoElement>
  >;


  /* =====================================================
     UTILISATEUR CONNECTÉ
  ====================================================== */

  currentUser: SocialUser = {
    id: 'current-user',
    name: 'Mon compte',
    username: 'moncompte',
    avatar: 'https://i.pravatar.cc/150?img=68',
    bio: 'Entrepreneur et membre de la communauté B2WA.',
    verified: false,
    followers: 128,
    following: 86,
    publications: 12
  };


  /* =====================================================
     ÉTATS HEADER / PROFIL
  ====================================================== */

  isSearchOpen = false;

  isProfileOpen = false;

  isFollowing = false;


  /* =====================================================
     FEED
  ====================================================== */

  feedStories: Story[] = [];

  activeFeedStoryId = '';

  isFeedMuted = true;

  private feedObserver?: IntersectionObserver;

  private observedFeedVideos =
    new Map<string, HTMLVideoElement>();


  /* =====================================================
     MODAL STORY
  ====================================================== */

  isViewerOpen = false;

  activeStory: Story | null = null;

  activeStoryIndex = -1;

  activeProgress = 0;

  isPaused = false;

  isLoading = false;

  isMuted = true;


  /* =====================================================
     COMMENTAIRES
  ====================================================== */

  isCommentsOpen = false;

  replyText = '';


  /* =====================================================
     PUBLICATION
  ====================================================== */

  isPublicationModalOpen = false;

  isPublishing = false;

  publicationType: 'image' | 'video' = 'image';

  publicationMedia = '';

  publicationPoster = '';

  publicationTitle = '';

  publicationDescription = '';

  publicationCommunity = '';

  showPublicationProduct = false;

  publicationProductName = '';

  publicationProductPrice: number | null = null;

  publicationProductImage = '';


  /* =====================================================
     TOAST
  ====================================================== */

  showToast = false;

  toastMessage = '';

  private toastTimeout?: ReturnType<typeof setTimeout>;


  /* =====================================================
     TIMERS STORY
  ====================================================== */

  private storyProgressTimer?:
    ReturnType<typeof setInterval>;

  private nextStoryTimeout?:
    ReturnType<typeof setTimeout>;


  /* =====================================================
     DONNÉES STORIES
  ====================================================== */

  stories: Story[] = [

    {
      id: 'story-1',
      author: 'Aminata Traoré',
      username: 'aminata_traore',
      avatar: 'https://i.pravatar.cc/150?img=47',
      media:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=90',
      type: 'image',
      title: 'Les nouveautés sont arrivées',
      description:
        'Découvrez les nouveaux produits disponibles aujourd’hui sur B2WA.',
      community: 'Entrepreneurs du Mali',
      time: 'Il y a 12 min',
      createdAt: Date.now() - 12 * 60 * 1000,
      duration: 7000,
      progress: 0,
      seen: false,
      liked: false,
      likes: 42,
      comments: 8,
      views: 183,
      verified: true,
      product: {
        id: 'product-1',
        name: 'Pack commerce premium',
        price: 25000,
        currency: 'FCFA',
        image:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80'
      },
      commentsList: [
        {
          id: 'comment-1',
          author: 'Moussa',
          avatar: 'https://i.pravatar.cc/100?img=12',
          text: 'Très intéressant, comment commander ?',
          time: 'Il y a 5 min'
        },
        {
          id: 'comment-2',
          author: 'Fatou',
          avatar: 'https://i.pravatar.cc/100?img=32',
          text: 'Les produits sont disponibles à Bamako ?',
          time: 'Il y a 2 min'
        }
      ]
    },

    {
      id: 'story-2',
      author: 'Mali Business',
      username: 'mali_business',
      avatar: 'https://i.pravatar.cc/150?img=12',
      media:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=90',
      type: 'image',
      title: 'Rencontre entre entrepreneurs',
      description:
        'Une communauté forte commence par de vraies rencontres.',
      community: 'Business Network',
      time: 'Il y a 24 min',
      createdAt: Date.now() - 24 * 60 * 1000,
      duration: 7000,
      progress: 0,
      seen: false,
      liked: false,
      likes: 87,
      comments: 14,
      views: 421,
      verified: true,
      commentsList: [
        {
          id: 'comment-3',
          author: 'Ibrahim',
          avatar: 'https://i.pravatar.cc/100?img=14',
          text: 'Belle initiative !',
          time: 'Il y a 12 min'
        }
      ]
    },

    {
      id: 'story-3',
      author: 'Awa Créations',
      username: 'awa_creations',
      avatar: 'https://i.pravatar.cc/150?img=44',
      media:
        'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-laptop-39831-large.mp4',
      poster:
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=90',
      type: 'video',
      title: 'Dans les coulisses',
      description:
        'Voici comment nous préparons vos commandes chaque jour.',
      community: 'Créateurs B2WA',
      time: 'Il y a 31 min',
      createdAt: Date.now() - 31 * 60 * 1000,
      duration: 0,
      progress: 0,
      seen: false,
      liked: false,
      likes: 65,
      comments: 6,
      views: 290,
      verified: true,
      commentsList: []
    },

    {
      id: 'story-4',
      author: 'Ibrahim Commerce',
      username: 'ibrahim_commerce',
      avatar: 'https://i.pravatar.cc/150?img=13',
      media:
        'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=90',
      type: 'image',
      title: 'Une offre spéciale pour vous',
      description:
        'Profitez de cette offre exclusive réservée à la communauté B2WA.',
      community: 'Vendeurs vérifiés',
      time: 'Il y a 43 min',
      createdAt: Date.now() - 43 * 60 * 1000,
      duration: 7000,
      progress: 0,
      seen: false,
      liked: false,
      likes: 103,
      comments: 22,
      views: 710,
      commentsList: []
    },

    {
      id: 'story-5',
      author: 'Sira Fashion',
      username: 'sira_fashion',
      avatar: 'https://i.pravatar.cc/150?img=45',
      media:
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90',
      type: 'image',
      title: 'Nouvelle collection',
      description:
        'La nouvelle collection est disponible dans notre boutique.',
      community: 'Mode et beauté',
      time: 'Il y a 1 h',
      createdAt: Date.now() - 60 * 60 * 1000,
      duration: 7000,
      progress: 0,
      seen: false,
      liked: false,
      likes: 56,
      comments: 11,
      views: 340,
      verified: true,
      product: {
        id: 'product-2',
        name: 'Collection Sira',
        price: 45000,
        currency: 'FCFA',
        image:
          'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80'
      },
      commentsList: []
    }
  ];


  constructor(
    private cdr: ChangeDetectorRef
  ) {}


  /* =====================================================
     CYCLE DE VIE
  ====================================================== */

  ngAfterViewInit(): void {
    this.feedStories = [...this.stories];

    this.refreshView();

    setTimeout(() => {
      this.initializeFeedObserver();
    }, 100);
  }


  ngOnDestroy(): void {
    this.clearStoryTimers();

    this.feedObserver?.disconnect();

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }


  /* =====================================================
     HEADER
  ====================================================== */

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;

    this.refreshView();
  }


  openProfile(): void {
    this.isProfileOpen = true;

    this.pauseAllFeedVideos();

    this.refreshView();
  }


  closeProfile(): void {
    this.isProfileOpen = false;

    this.refreshView();
  }


  toggleFollow(): void {
    this.isFollowing = !this.isFollowing;

    this.currentUser.followers +=
      this.isFollowing ? 1 : -1;

    this.showToastMessage(
      this.isFollowing
        ? `Vous suivez @${this.currentUser.username}.`
        : `Vous ne suivez plus @${this.currentUser.username}.`
    );
  }


  /* =====================================================
     FEED VERTICAL
  ====================================================== */

  private initializeFeedObserver(): void {
    if (
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }

    this.feedObserver?.disconnect();

    this.observedFeedVideos.clear();

    this.feedObserver =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            const video =
              entry.target as HTMLVideoElement;

            const storyId =
              video.dataset['storyId'] || '';

            if (
              entry.isIntersecting &&
              entry.intersectionRatio >= 0.65
            ) {
              this.activeFeedStoryId = storyId;

              this.pauseAllFeedVideos(video);
              this.playFeedVideo(video);

              this.refreshView();
            } else {
              video.pause();
            }
          });
        },
        {
          threshold: [0, 0.35, 0.65, 0.9],
          rootMargin: '80px 0px'
        }
      );

    setTimeout(() => {
      const videos =
        document.querySelectorAll<HTMLVideoElement>(
          '.feed-story-video'
        );

      videos.forEach(video => {
        this.registerFeedVideo(video);
      });
    }, 100);
  }


  private registerFeedVideo(
    video: HTMLVideoElement
  ): void {
    const storyId =
      video.dataset['storyId'] || '';

    if (!storyId) {
      return;
    }

    this.observedFeedVideos.set(
      storyId,
      video
    );

    this.feedObserver?.observe(video);
  }


  private pauseAllFeedVideos(
    except?: HTMLVideoElement
  ): void {
    this.observedFeedVideos.forEach(video => {
      if (video !== except) {
        video.pause();
      }
    });
  }


  private playFeedVideo(
    video: HTMLVideoElement
  ): void {
    video.muted = this.isFeedMuted;

    video.play().catch(() => {
      video.muted = true;
      this.isFeedMuted = true;

      video.play().catch(() => {
        this.showToastMessage(
          'Touchez la vidéo pour démarrer la lecture.'
        );
      });
    });
  }


  toggleFeedVideo(
    event: Event
  ): void {
    const video =
      event.currentTarget as HTMLVideoElement;

    if (video.paused) {
      this.pauseAllFeedVideos(video);

      video.muted = this.isFeedMuted;

      video.play().catch(() => {
        this.showToastMessage(
          'La lecture automatique est bloquée.'
        );
      });
    } else {
      video.pause();
    }
  }


  toggleFeedMute(): void {
    this.isFeedMuted = !this.isFeedMuted;

    this.observedFeedVideos.forEach(video => {
      video.muted = this.isFeedMuted;
    });

    this.isMuted = this.isFeedMuted;

    this.refreshView();
  }


  onFeedVideoError(): void {
    this.showToastMessage(
      'Impossible de charger cette vidéo.'
    );
  }


  /* =====================================================
     MODAL STORIES
  ====================================================== */

  openStory(story: Story): void {
    const index =
      this.stories.findIndex(
        item => item.id === story.id
      );

    if (index === -1) {
      return;
    }

    this.pauseAllFeedVideos();

    this.activeStoryIndex = index;
    this.activeStory = this.stories[index];
    this.activeProgress = 0;
    this.isViewerOpen = true;
    this.isPaused = false;
    this.isCommentsOpen = false;
    this.isLoading = true;

    this.markStoryAsSeen(this.activeStory);

    this.clearStoryTimers();

    this.refreshView();

    setTimeout(() => {
      this.startActiveStory();
    }, 100);
  }


  closeStoryViewer(): void {
    this.clearStoryTimers();
    this.pauseActiveViewerVideo();

    this.isViewerOpen = false;
    this.activeStory = null;
    this.activeStoryIndex = -1;
    this.isCommentsOpen = false;
    this.isPaused = false;
    this.isLoading = false;

    this.refreshView();

    setTimeout(() => {
      this.initializeFeedObserver();
    }, 100);
  }


  nextStory(): void {
    if (!this.isViewerOpen) {
      return;
    }

    if (
      this.activeStoryIndex >=
      this.stories.length - 1
    ) {
      this.closeStoryViewer();
      return;
    }

    this.openStory(
      this.stories[this.activeStoryIndex + 1]
    );
  }


  previousStory(): void {
    if (!this.isViewerOpen) {
      return;
    }

    if (this.activeStoryIndex <= 0) {
      this.restartActiveStory();
      return;
    }

    this.openStory(
      this.stories[this.activeStoryIndex - 1]
    );
  }


  private markStoryAsSeen(story: Story): void {
    if (!story.seen) {
      story.seen = true;
      story.views++;
    }
  }


  /* =====================================================
     LECTURE STORY
  ====================================================== */

  private startActiveStory(): void {
    if (
      !this.activeStory ||
      this.isPaused
    ) {
      return;
    }

    this.clearStoryTimers();

    if (
      this.activeStory.type === 'video'
    ) {
      this.playActiveViewerVideo();
      return;
    }

    this.isLoading = false;

    this.startImageProgress(
      this.activeStory.duration || 7000
    );
  }


  private startImageProgress(
    duration: number
  ): void {
    this.activeProgress = 0;

    const interval = 50;

    const increment =
      100 / (duration / interval);

    this.storyProgressTimer =
      setInterval(() => {
        if (this.isPaused) {
          return;
        }

        this.activeProgress =
          Math.min(
            100,
            this.activeProgress + increment
          );

        this.refreshView();

        if (this.activeProgress >= 100) {
          this.clearStoryTimers();

          this.nextStoryTimeout =
            setTimeout(() => {
              this.nextStory();
            }, 100);
        }
      }, interval);
  }


  private getActiveViewerVideo():
    HTMLVideoElement | null {

    const videos =
      this.viewerVideos?.toArray() || [];

    return videos[0]?.nativeElement || null;
  }


  private playActiveViewerVideo(): void {
    setTimeout(() => {
      const video =
        this.getActiveViewerVideo();

      if (!video) {
        this.isLoading = false;
        this.startImageProgress(7000);
        return;
      }

      video.muted = this.isMuted;
      video.currentTime = 0;

      video.play()
        .then(() => {
          this.isLoading = false;
          this.isPaused = false;
          this.refreshView();
        })
        .catch(() => {
          video.muted = true;
          this.isMuted = true;
          this.isLoading = false;
          this.isPaused = true;

          this.showToastMessage(
            'Touchez la Story pour démarrer la vidéo.'
          );
        });
    }, 80);
  }


  private pauseActiveViewerVideo(): void {
    const video =
      this.getActiveViewerVideo();

    video?.pause();
  }


  togglePause(): void {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.pauseActiveViewerVideo();
      this.clearStoryTimers();
    } else {
      this.startActiveStory();
    }

    this.refreshView();
  }


  restartActiveStory(): void {
    if (!this.activeStory) {
      return;
    }

    this.activeProgress = 0;
    this.clearStoryTimers();

    const video =
      this.getActiveViewerVideo();

    if (
      this.activeStory.type === 'video' &&
      video
    ) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      this.startImageProgress(
        this.activeStory.duration || 7000
      );
    }

    this.refreshView();
  }


  toggleViewerMute(): void {
    this.isMuted = !this.isMuted;

    const video =
      this.getActiveViewerVideo();

    if (video) {
      video.muted = this.isMuted;
    }

    this.refreshView();
  }


  onViewerVideoLoaded(
    event: Event
  ): void {
    const video =
      event.target as HTMLVideoElement;

    this.isLoading = false;

    if (
      video.duration &&
      isFinite(video.duration) &&
      this.activeStory
    ) {
      this.activeStory.duration =
        video.duration * 1000;
    }

    this.refreshView();
  }


  onViewerVideoTimeUpdate(
    event: Event
  ): void {
    const video =
      event.target as HTMLVideoElement;

    if (
      !video.duration ||
      !isFinite(video.duration)
    ) {
      return;
    }

    this.activeProgress =
      video.currentTime / video.duration * 100;

    this.refreshView();
  }


  onViewerVideoEnded(): void {
    this.nextStory();
  }


  onViewerVideoError(): void {
    this.isLoading = false;
    this.isPaused = true;

    this.showToastMessage(
      'Impossible de charger cette Story vidéo.'
    );
  }


  /* =====================================================
     ACTIONS SOCIALES
  ====================================================== */

  toggleLike(story: Story): void {
    story.liked = !story.liked;

    story.likes += story.liked ? 1 : -1;

    if (
      this.activeStory?.id === story.id
    ) {
      this.activeStory = story;
    }

    this.refreshView();
  }


  openComments(story: Story): void {
    if (
      !this.activeStory ||
      this.activeStory.id !== story.id
    ) {
      this.openStory(story);
    }

    this.isCommentsOpen = true;
    this.isPaused = true;

    this.pauseActiveViewerVideo();
    this.clearStoryTimers();

    this.refreshView();
  }


  closeComments(): void {
    this.isCommentsOpen = false;
    this.isPaused = false;

    this.startActiveStory();

    this.refreshView();
  }


  sendReply(): void {
    const text =
      this.replyText.trim();

    if (
      !text ||
      !this.activeStory
    ) {
      return;
    }

    this.activeStory.commentsList.push({
      id: `comment-${Date.now()}`,
      author: 'Vous',
      text,
      time: 'À l’instant'
    });

    this.activeStory.comments++;
    this.replyText = '';

    this.showToastMessage(
      'Votre commentaire a été envoyé.'
    );

    this.refreshView();
  }


  shareStory(story: Story): void {
    const url =
      `${window.location.origin}/stories/${story.id}`;

    if (
      navigator.share &&
      (
        !navigator.canShare ||
        navigator.canShare({ url })
      )
    ) {
      navigator.share({
        title: story.title,
        text: story.description,
        url
      }).catch(() => {});

      return;
    }

    this.copyToClipboard(url);

    this.showToastMessage(
      'Lien de la publication copié.'
    );
  }


  openCommunity(story: Story): void {
    this.showToastMessage(
      story.community
        ? `Ouverture de ${story.community}.`
        : 'Ouverture de la communauté.'
    );
  }


  viewProduct(product: StoryProduct): void {
    this.showToastMessage(
      `Produit sélectionné : ${product.name}.`
    );
  }


  /* =====================================================
     PUBLICATION
  ====================================================== */

  openPublicationModal(): void {
    this.isPublicationModalOpen = true;

    this.publicationType = 'image';
    this.publicationMedia = '';
    this.publicationPoster = '';
    this.publicationTitle = '';
    this.publicationDescription = '';
    this.publicationCommunity = '';
    this.showPublicationProduct = false;
    this.publicationProductName = '';
    this.publicationProductPrice = null;
    this.publicationProductImage = '';

    this.pauseAllFeedVideos();

    this.refreshView();
  }


  closePublicationModal(): void {
    this.isPublicationModalOpen = false;

    this.refreshView();
  }


  onMediaSelected(
    event: Event
  ): void {
    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    this.publicationType =
      file.type.startsWith('video/')
        ? 'video'
        : 'image';

    this.publicationMedia =
      URL.createObjectURL(file);

    this.showToastMessage(
      'Fichier sélectionné. Pense à l’envoyer au backend pour le conserver.'
    );
  }


  publishContent(): void {
    if (
      !this.publicationMedia.trim()
    ) {
      this.showToastMessage(
        'Ajoutez une photo ou une vidéo.'
      );

      return;
    }

    this.isPublishing = true;

    const product =
      this.showPublicationProduct &&
      this.publicationProductName.trim()
        ? {
            id: `product-${Date.now()}`,
            name:
              this.publicationProductName.trim(),
            price:
              this.publicationProductPrice || 0,
            currency: 'FCFA',
            image:
              this.publicationProductImage.trim() ||
              this.publicationMedia.trim()
          }
        : undefined;

    const story: Story = {
      id: `story-${Date.now()}`,
      author: this.currentUser.name,
      username: this.currentUser.username,
      avatar: this.currentUser.avatar,
      media: this.publicationMedia.trim(),
      poster:
        this.publicationPoster.trim() ||
        undefined,
      type: this.publicationType,
      title:
        this.publicationTitle.trim() ||
        'Nouvelle publication',
      description:
        this.publicationDescription.trim() ||
        'Découvrez cette nouvelle publication sur B2WA.',
      community:
        this.publicationCommunity.trim() ||
        undefined,
      time: 'À l’instant',
      createdAt: Date.now(),
      duration:
        this.publicationType === 'video'
          ? 0
          : 7000,
      progress: 0,
      seen: false,
      liked: false,
      likes: 0,
      comments: 0,
      views: 0,
      verified: this.currentUser.verified,
      product,
      commentsList: []
    };

    this.stories.unshift(story);
    this.feedStories.unshift(story);
    this.currentUser.publications++;

    this.isPublishing = false;
    this.isPublicationModalOpen = false;

    this.showToastMessage(
      'Votre contenu a été publié sur B2WA.'
    );

    this.refreshView();

    setTimeout(() => {
      this.initializeFeedObserver();
    }, 150);
  }


  createStory(): void {
    this.openPublicationModal();
  }


  publishStory(): void {
    this.publishContent();
  }


  /* =====================================================
     OUTILS
  ====================================================== */

  private clearStoryTimers(): void {
    if (this.storyProgressTimer) {
      clearInterval(this.storyProgressTimer);
      this.storyProgressTimer = undefined;
    }

    if (this.nextStoryTimeout) {
      clearTimeout(this.nextStoryTimeout);
      this.nextStoryTimeout = undefined;
    }
  }


  private async copyToClipboard(
    value: string
  ): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea =
        document.createElement('textarea');

      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';

      document.body.appendChild(textarea);

      textarea.select();
      document.execCommand('copy');

      textarea.remove();
    }
  }


  private showToastMessage(
    message: string
  ): void {
    this.toastMessage = message;
    this.showToast = true;

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastTimeout =
      setTimeout(() => {
        this.showToast = false;
        this.refreshView();
      }, 2800);

    this.refreshView();
  }


  private refreshView(): void {
    this.cdr.detectChanges();
  }
}