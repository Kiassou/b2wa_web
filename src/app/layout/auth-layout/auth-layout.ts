import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PromoCarouselComponent } from './promo-carousel/promo-carousel';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    PromoCarouselComponent
  ],
  templateUrl: './auth-layout.html',
  styleUrls: ['./auth-layout.css']
})
export class AuthLayoutComponent implements OnInit {
  isMobile = false;
  onboardingVisible = true;
  private readonly mobileBreakpoint = 767;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.checkScreen();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreen();
  }

  private checkScreen(): void {
    this.isMobile = window.innerWidth <= this.mobileBreakpoint;
  }

  completeOnboarding(): void {
    this.onboardingVisible = false;
    this.router.navigate(['/auth/login']);
  }
}