import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PromoSlide {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
}

@Component({
  selector: 'app-promo-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promo-carousel.html',
  styleUrl: './promo-carousel.css'
})
export class PromoCarouselComponent implements OnInit, OnDestroy {
  @Output() onboardingCompleted = new EventEmitter<void>();

  currentSlide = 0;
  isMobile = false;

  private autoplayTimer?: ReturnType<typeof setInterval>;
  private readonly mobileBreakpoint = 991;

  slides: PromoSlide[] = [
    {
      id: 1,
      eyebrow: 'MARCHÉ B2B OUEST-AFRICAIN',
      title: 'Connectez directement grossistes et commerçants.',
      description:
        'B2WA élimine les intermédiaires informels et centralise vos approvisionnements avec transparence et fiabilité dans toute la région.',
      icon: 'storefront',
      accent: '01'
    },
    {
      id: 2,
      eyebrow: 'PAIEMENT SÉCURISÉ PAR SÉQUESTRE',
      title: 'Vos transactions protégées avec Mobile Money.',
      description:
        'Les fonds sont bloqués en séquestre lors de la commande et libérés au fournisseur uniquement après confirmation de livraison.',
      icon: 'verified_user',
      accent: '02'
    },
    {
      id: 3,
      eyebrow: 'TRANSPARENCE ET STOCKS',
      title: 'Accédez aux prix de gros en temps réel.',
      description:
        'Consultez les catalogues certifiés, suivez les disponibilités et profitez d’un historique de prix garanti dès la commande.',
      icon: 'inventory_2',
      accent: '03'
    },
    {
      id: 4,
      eyebrow: 'ACHATS GROUPÉS ET LOGISTIQUE',
      title: 'Achetez ensemble et optimisez le transport.',
      description:
        'Rejoignez des communautés d’achat pour débloquer des tarifs préférentiels et bénéficiez d’un réseau logistique fluide.',
      icon: 'local_shipping',
      accent: '04'
    }
  ];

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateScreen();
    this.startAutoplay();
  }

  @HostListener('window:resize')
  onResize(): void {
    const previousState = this.isMobile;
    this.updateScreen();

    if (!previousState && this.isMobile) {
      this.stopAutoplay();
    } else if (previousState && !this.isMobile) {
      this.startAutoplay();
    }
  }

  private updateScreen(): void {
    this.isMobile = window.innerWidth <= this.mobileBreakpoint;
  }

  next(): void {
    if (this.currentSlide === this.slides.length - 1) {
      this.complete();
      return;
    }
    this.currentSlide++;
    this.resetAutoplay();
  }

  skip(): void {
    this.complete();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetAutoplay();
  }

  private complete(): void {
    this.stopAutoplay();
    this.onboardingCompleted.emit();
  }

  private startAutoplay(): void {
    if (this.isMobile || this.autoplayTimer) return;

    this.autoplayTimer = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      this.cdr.detectChanges();
    }, 5000);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  private resetAutoplay(): void {
    if (!this.isMobile) {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }
}