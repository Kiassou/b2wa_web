import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './splash.html',
  styleUrl: './splash.css'
})
export class SplashComponent implements OnInit, OnDestroy {
  progress = 0;
  private progressTimer?: ReturnType<typeof setInterval>;
  private navigationTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.startLoading();
  }

  private startLoading(): void {
    const duration = 3000; 
    const interval = 30;
    const step = (100 / duration) * interval;

    this.progressTimer = setInterval(() => {
      this.progress += step;

      if (this.progress >= 100) {
        this.progress = 100;
        this.stopLoading();

        this.navigationTimer = setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      }

      this.cdr.detectChanges();
    }, interval);
  }

  private stopLoading(): void {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = undefined;
    }
  }

  ngOnDestroy(): void {
    this.stopLoading();
    if (this.navigationTimer) {
      clearTimeout(this.navigationTimer);
      this.navigationTimer = undefined;
    }
  }
}